import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    HomeSectionType,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

const BASE_URL = 'https://suicaodex.com'
const API_BASE = 'https://api.weebdex.com'

export const SuicaoDexInfo: SourceInfo = {
    version: '1.0.1',
    name: 'SuicaoDex',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for suicaodex.com (WeebDex/MangaDex frontend)',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: 'Adult', type: BadgeColor.RED },
        { text: '18+', type: BadgeColor.YELLOW },
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS,
}

export class SuicaoDex extends Source {
    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
    })

    private async fetchApi<T>(url: string): Promise<T> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        return JSON.parse(response.data as string)
    }

    private getTitle(manga: any): string {
        return manga.attributes.title.en 
            || manga.attributes.title['ja-ro'] 
            || Object.values(manga.attributes.title)[0] 
            || ''
    }

    private getCover(manga: any, mangaId: string): string {
        const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art')
        if (coverRel?.attributes?.file) {
            return `https://uploads.weebdex.com/cover/${mangaId}/${coverRel.attributes.file}.256.jpg`
        }
        return ''
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', params: 'order[latestUploadedChapter]=desc' },
            { id: 'new', title: 'Truyện Mới', params: 'order[createAt]=desc' },
            { id: 'completed', title: 'Đã Hoàn Thành', params: 'status[]=completed&order[latestUploadedChapter]=desc' },
        ]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))
        }

        for (const section of sections) {
            try {
                const url = `${API_BASE}/manga?limit=20&${section.params}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`
                const data = await this.fetchApi<any>(url)
                const manga = this.parseMangaList(data.data)
                
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: manga,
                }))
            } catch (e) {
            }
        }
    }

    private parseMangaList(data: any[]): any[] {
        const results: any[] = []
        for (const manga of data) {
            const id = manga.id
            const title = this.getTitle(manga)
            if (!id || !title) continue

            const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art')
            let image = ''
            if (coverRel?.attributes?.file) {
                image = `https://uploads.weebdex.com/cover/${id}/${coverRel.attributes.file}.256.jpg`
            }

            results.push(App.createPartialSourceManga({ mangaId: id, title, image }))
        }
        return results
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const offset = (page - 1) * 20

        const paramsMap: Record<string, string> = {
            'latest': 'order[latestUploadedChapter]=desc',
            'new': 'order[createAt]=desc',
            'completed': 'status[]=completed&order[latestUploadedChapter]=desc',
        }

        const params = paramsMap[homepageSectionId] || 'order[latestUploadedChapter]=desc'
        const url = `${API_BASE}/manga?limit=20&offset=${offset}&${params}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`

        const data = await this.fetchApi<any>(url)
        return App.createPagedResults({ results: this.parseMangaList(data.data), metadata: { page: page + 1 } })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const offset = (page - 1) * 20
        const url = `${API_BASE}/manga?limit=20&offset=${offset}&title=${encodeURIComponent(query.title ?? '')}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`

        const data = await this.fetchApi<any>(url)
        return App.createPagedResults({ results: this.parseMangaList(data.data), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const url = `${API_BASE}/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag`
        const data = await this.fetchApi<any>(url)
        const manga = data.data
        const attrs = manga.attributes

        const title = this.getTitle(manga)

        let image = ''
        const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art')
        if (coverRel?.attributes?.file) {
            image = `https://uploads.weebdex.com/cover/${mangaId}/${coverRel.attributes.file}.512.jpg`
        }

        const desc = Object.values(attrs.description || {})[0] as string || ''

        const authorRel = manga.relationships?.find((r: any) => r.type === 'author')
        const author = authorRel?.attributes?.name || ''

        const artistRel = manga.relationships?.find((r: any) => r.type === 'artist')
        const artist = artistRel?.attributes?.name || ''

        const statusMap: Record<string, string> = {
            'ongoing': 'Ongoing',
            'completed': 'Completed',
            'hiatus': 'Hiatus',
            'cancelled': 'Cancelled',
        }
        const status = statusMap[attrs.status] || attrs.status || ''

        const tags: Tag[] = []
        if (attrs.tags) {
            for (const tag of attrs.tags) {
                const label = tag.attributes.name?.en || tag.attributes.name?.['ja-ro'] || Object.values(tag.attributes.name || {})[0] || ''
                if (label) {
                    tags.push(App.createTag({
                        id: tag.id,
                        label: label,
                    }))
                }
            }
        }

        const tagSections = tags.length > 0 ? [App.createTagSection({ id: 'genres', label: 'Thể Loại', tags })] : []

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image,
                desc,
                author,
                artist,
                status,
                tags: tagSections,
            }),
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${API_BASE}/manga/${mangaId}/feed?limit=100&includes[]=scanlation_group&order[chapter]=desc`
        const data = await this.fetchApi<any>(url)
        const chapters: Chapter[] = []
        const seen = new Set<string>()

        for (const chapter of data.data) {
            const id = chapter.id
            if (seen.has(id)) continue
            seen.add(id)

            const chapNum = chapter.attributes.chapter ?? 0
            const name = chapter.attributes.title || `Chapter ${chapNum}`
            const time = new Date(chapter.attributes.publishAt)

            let groupName = 'Unknown'
            const groupRel = chapter.relationships?.find((r: any) => r.type === 'scanlation_group')
            if (groupRel?.attributes?.name) {
                groupName = groupRel.attributes.name
            }

            chapters.push(App.createChapter({
                id,
                chapNum,
                name: `${name} (${groupName})`,
                time,
            }))
        }

        return chapters
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${API_BASE}/at-home/server/${chapterId}`
        const data = await this.fetchApi<any>(url)
        
        const baseUrl = data.baseUrl
        const chapter = data.chapter

        const pages: string[] = []
        for (const page of chapter.data) {
            pages.push(`${baseUrl}/data/${chapter.hash}/${page}`)
        }

        if (pages.length === 0) {
            for (const page of chapter.dataSaver) {
                pages.push(`${baseUrl}/data-saver/${chapter.hash}/${page}`)
            }
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/manga/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        const tags: Tag[] = [
            App.createTag({ id: '4aa2b1ce-0347-4d2a-b3a7-59576dbf40f3', label: 'Action' }),
            App.createTag({ id: 'b873d54d-9d8d-458c-b3fc-4d3d34d34f3e', label: 'Adventure' }),
            App.createTag({ id: 'e64f6749-e7f3-45a2-a4e2-68d7751d4c8b', label: 'Comedy' }),
            App.createTag({ id: '0a39b5a1-4f20-4a54-9d84-5c8a78c2b1b0', label: 'Drama' }),
            App.createTag({ id: 'c8c5b547-8fb7-4e7e-a6e5-1c8d8f9c4e1a', label: 'Fantasy' }),
            App.createTag({ id: '87c8c05d-a9d7-435d-9edf-b96f0d5c8c5d', label: 'Horror' }),
            App.createTag({ id: 'fbe6d9d8-4e6a-4e1e-9c1c-8f7e3a6b5c4d', label: 'Romance' }),
            App.createTag({ id: '3e4a8d7e-5c6b-4a8e-9d2f-6e7c8b5a4d3e', label: 'Sci-Fi' }),
            App.createTag({ id: '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', label: 'Slice of Life' }),
            App.createTag({ id: '5a6b7c8d-9e0f-4a1b-2c3d-4e5f6a7b8c9d', label: 'Sports' }),
            App.createTag({ id: '9d8e7f6a-5b4c-3d2e-1f0a-9b8c7d6e5f4a', label: 'Supernatural' }),
            App.createTag({ id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', label: 'Mystery' }),
            App.createTag({ id: '6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f', label: 'Psychological' }),
            App.createTag({ id: '0f1e2d3c-4b5a-6e7f-8a9b-0c1d2e3f4a5b', label: 'Thriller' }),
        ]

        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags })]
    }
}