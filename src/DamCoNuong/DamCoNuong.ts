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
    TagSection,
} from '@paperback/types'

import { Parser } from './DamCoNuongParser'

const BASE_URL = 'https://damconuong.city'

export const DamCoNuongInfo: SourceInfo = {
    version: '1.0.1',
    name: 'DamCoNuong',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for damconuong.city',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: 'Adult', type: BadgeColor.RED },
        { text: '18+', type: BadgeColor.YELLOW },
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
}

export class DamCoNuong extends Source {
    private readonly parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request) => {
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': BASE_URL,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                }
                return request
            },
            interceptResponse: async (response) => response,
        }
    })

    async getCloudflareBypassRequestAsync(): Promise<any> {
        return App.createRequest({ url: BASE_URL, method: 'GET' })
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/tim-kiem?sort=-updated_at` },
            { id: 'day', title: 'Top Ngày', url: `${BASE_URL}/tim-kiem?sort=-views_day` },
            { id: 'week', title: 'Top Tuần', url: `${BASE_URL}/tim-kiem?sort=-views_week` },
            { id: 'month', title: 'Top Tháng', url: `${BASE_URL}/tim-kiem?sort=-views` },
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
                const response = await this.requestManager.schedule(
                    App.createRequest({ url: section.url, method: 'GET' }), 0
                )
                if (response.status === 403 || response.status === 503) continue
                const $ = this.cheerio.load(response.data as string)
                const manga = this.parser.parseHomePage($)

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

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const urlMap: Record<string, string> = {
            'latest': `${BASE_URL}/tim-kiem?sort=-updated_at&page=${page}`,
            'day': `${BASE_URL}/tim-kiem?sort=-views_day&page=${page}`,
            'week': `${BASE_URL}/tim-kiem?sort=-views_week&page=${page}`,
            'month': `${BASE_URL}/tim-kiem?sort=-views&page=${page}`,
        }

        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/the-loai/${homepageSectionId}?page=${page}`

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        const manga = this.parser.parseHomePage($)

        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const selectedTag = query.includedTags?.[0]
        let url: string

        if (selectedTag) {
            url = `${BASE_URL}/the-loai/${selectedTag.id}?page=${page}`
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            url = `${BASE_URL}/tim-kiem?q=${searchQuery}&page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}/chapter-${chapterId}`, method: 'GET' }), 1
        )
        const html = response.data as string
        const $ = this.cheerio.load(html)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
