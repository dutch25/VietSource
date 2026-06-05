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
    PartialSourceManga,
} from '@paperback/types'

import { Parser } from './ViHentaiParser'

const BASE_URL = 'https://vi-hentai.pro'

export const ViHentaiInfo: SourceInfo = {
    version: '1.0.0',
    name: 'ViHentai',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for ViHentai',
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

export class ViHentai extends Source {
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
        return App.createRequest({
            url: BASE_URL,
            method: 'GET',
            headers: {
                'referer': BASE_URL,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            }
        })
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'hot', title: 'Truyện HOT', url: `${BASE_URL}` },
            { id: 'latest', title: 'Truyện Hentai Mới', url: `${BASE_URL}` },
            { id: 'week', title: 'Top Tuần', url: `${BASE_URL}/leaderboard/manga?period=weekly` },
            { id: 'month', title: 'Top Tháng', url: `${BASE_URL}/leaderboard/manga?period=monthly` },
            { id: 'private', title: 'Bộ Sưu Tập Riêng', url: `${BASE_URL}/genres/anal` },
            { id: 'cosplay', title: 'Ảnh Cosplay', url: `${BASE_URL}` },
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
                let manga: PartialSourceManga[] = []
                if (section.id === 'private') {
                    let mangaAnal: PartialSourceManga[] = []
                    let mangaKhongChe: PartialSourceManga[] = []

                    try {
                        const resAnal = await this.requestManager.schedule(
                            App.createRequest({ url: `${BASE_URL}/genres/anal`, method: 'GET' }), 0
                        )
                        if (resAnal.status === 200) {
                            const $anal = this.cheerio.load(resAnal.data as string)
                            mangaAnal = this.parser.parseGenrePage($anal)
                        }
                    } catch (e) {}

                    try {
                        const resKhongChe = await this.requestManager.schedule(
                            App.createRequest({ url: `${BASE_URL}/genres/khong-che`, method: 'GET' }), 0
                        )
                        if (resKhongChe.status === 200) {
                            const $khongChe = this.cheerio.load(resKhongChe.data as string)
                            mangaKhongChe = this.parser.parseGenrePage($khongChe)
                        }
                    } catch (e) {}

                    const combined: PartialSourceManga[] = []
                    const maxLength = Math.max(mangaAnal.length, mangaKhongChe.length)
                    for (let i = 0; i < maxLength; i++) {
                        if (i < mangaAnal.length) combined.push(mangaAnal[i])
                        if (i < mangaKhongChe.length) combined.push(mangaKhongChe[i])
                    }
                    manga = this.parser.deduplicate(combined)
                    if (manga.length === 0) continue
                } else {
                    const response = await this.requestManager.schedule(
                        App.createRequest({ url: section.url, method: 'GET' }), 0
                    )
                    if (response.status === 403 || response.status === 503) continue
                    const $ = this.cheerio.load(response.data as string)

                    if (section.id === 'hot') {
                        manga = this.parser.parseSection($, 'Truyện HOT')
                    } else if (section.id === 'latest') {
                        manga = this.parser.parseSection($, 'Truyện hentai mới')
                    } else if (section.id === 'cosplay') {
                        manga = this.parser.parseSection($, 'Ảnh cosplay')
                    } else {
                        manga = this.parser.parseHomePage($)
                    }
                }

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
        let url = `${BASE_URL}/danh-sach?page=${page}`

        if (homepageSectionId === 'private') {
            let mangaAnal: PartialSourceManga[] = []
            let mangaKhongChe: PartialSourceManga[] = []

            try {
                const resAnal = await this.requestManager.schedule(
                    App.createRequest({ url: `${BASE_URL}/genres/anal?page=${page}`, method: 'GET' }), 0
                )
                if (resAnal.status === 200) {
                    const $anal = this.cheerio.load(resAnal.data as string)
                    mangaAnal = this.parser.parseGenrePage($anal)
                }
            } catch (e) {}

            try {
                const resKhongChe = await this.requestManager.schedule(
                    App.createRequest({ url: `${BASE_URL}/genres/khong-che?page=${page}`, method: 'GET' }), 0
                )
                if (resKhongChe.status === 200) {
                    const $khongChe = this.cheerio.load(resKhongChe.data as string)
                    mangaKhongChe = this.parser.parseGenrePage($khongChe)
                }
            } catch (e) {}

            const combined: PartialSourceManga[] = []
            const maxLength = Math.max(mangaAnal.length, mangaKhongChe.length)
            for (let i = 0; i < maxLength; i++) {
                if (i < mangaAnal.length) combined.push(mangaAnal[i])
                if (i < mangaKhongChe.length) combined.push(mangaKhongChe[i])
            }
            const manga = this.parser.deduplicate(combined)
            return App.createPagedResults({ results: manga, metadata: { page: page + 1 } })
        }

        if (homepageSectionId === 'cosplay') {
            url = `${BASE_URL}/genres/anh-cosplay?page=${page}`
        } else if (homepageSectionId === 'week') {
            url = `${BASE_URL}/leaderboard/manga?period=weekly&page=${page}`
        } else if (homepageSectionId === 'month') {
            url = `${BASE_URL}/leaderboard/manga?period=monthly&page=${page}`
        }

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
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '')
                url = `${BASE_URL}/authors/${authorId}?page=${page}`
            } else {
                url = `${BASE_URL}/genres/${selectedTag.id}?page=${page}`
            }
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            url = `${BASE_URL}/search?q=${searchQuery}&page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}/${chapterId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen-hentai/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
