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

import { Parser } from './TruyenTuoiThoParser'

const BASE_URL = 'https://truyentuoitho.com'

export const TruyenTuoiThoInfo: SourceInfo = {
    version: '1.0.2',
    name: 'TruyenTuoiTho',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyentuoitho.com',
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

export class TruyenTuoiTho extends Source {
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
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/manga/?m_orderby=latest` },
            { id: 'views', title: 'Phổ Biến', url: `${BASE_URL}/manga/?m_orderby=views` },
            { id: 'new', title: 'Truyện Mới', url: `${BASE_URL}/manga/?m_orderby=new-manga` },
            { id: 'trending', title: 'Trending', url: `${BASE_URL}/manga/?m_orderby=trending` },
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
            'latest': `${BASE_URL}/manga/?m_orderby=latest&page=${page}`,
            'views': `${BASE_URL}/manga/?m_orderby=views&page=${page}`,
            'new': `${BASE_URL}/manga/?m_orderby=new-manga&page=${page}`,
            'trending': `${BASE_URL}/manga/?m_orderby=trending&page=${page}`,
        }

        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/manga-genre/${homepageSectionId}?page=${page}`

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
            url = `${BASE_URL}/manga-genre/${selectedTag.id}?page=${page}`
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            url = `${BASE_URL}/?s=${searchQuery}&post_type=wp-manga&page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/manga/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        try {
            const ajaxResponse = await this.requestManager.schedule(
                App.createRequest({
                    url: `${BASE_URL}/wp-admin/admin-ajax.php`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: `action=wp_manga_get_chapters&manga_id=${mangaId}`
                }), 0
            )
            const ajaxData = JSON.parse(ajaxResponse.data as string)
            if (ajaxData && ajaxData.html) {
                const $ = this.cheerio.load(ajaxData.html)
                return this.parser.parseChaptersFromAjax($)
            }
        } catch (e) {
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/manga/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/manga/${mangaId}/${chapterId}`, method: 'GET' }), 1
        )
        const $ = this.cheerio.load(response.data as string)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/manga/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
