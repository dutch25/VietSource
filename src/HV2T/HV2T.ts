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

import { Parser } from './HV2TParser'

const BASE_URL = 'https://hv2t.store'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'

export const HV2TInfo: SourceInfo = {
    version: '1.1.9',
    name: 'HV2T',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for HV2T',
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

export class HV2T extends Source {
    private readonly parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 60000,
        interceptor: {
            interceptRequest: async (request) => {
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': BASE_URL,
                    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'accept-language': 'en-US,en;q=0.5',
                }
                return request
            },
            interceptResponse: async (response) => {
                return response
            },
        }
    })

    async getCloudflareBypassRequestAsync(): Promise<any> {
        return App.createRequest({ url: BASE_URL, method: 'GET' })
    }

    private buildRequest(url: string) {
        return App.createRequest({ url, method: 'GET' })
    }

    private async fetchHTML(url: string) {
        console.log(`[HV2T] Fetching HTML: ${url}`)

        // Use proxy for HTML fetching to bypass Cloudflare
        const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`

        try {
            const response = await this.requestManager.schedule(this.buildRequest(proxyUrl), 0)
            const data = response.data as string
            return this.cheerio.load(data)
        } catch (e) {
            console.log(`[HV2T] Error fetching HTML: ${e}`)
            throw e
        }
    }

    private async fetchJSON(url: string) {
        console.log(`[HV2T] Fetching JSON: ${url}`)
        const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`

        try {
            const response = await this.requestManager.schedule(this.buildRequest(proxyUrl), 0)
            return JSON.parse(response.data as string)
        } catch (e) {
            console.log(`[HV2T] Error fetching JSON: ${e}`)
            throw e
        }
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/api/comics?sort=latest` },
            { id: 'most_followed', title: 'Theo Dõi Nhiều', url: `${BASE_URL}/api/comics?sort=follow` },
            { id: 'most_viewed', title: 'Lượt Xem Nhiều', url: `${BASE_URL}/api/comics?sort=view` },
            { id: 'completed', title: 'Đã Hoàn Thành', url: `${BASE_URL}/api/comics?sort=completed` },
        ]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: [],
            }))

            try {
                const json = await this.fetchJSON(section.url)
                const items = this.parser.parseHomePage(json, PROXY_URL)

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items,
                }))
            } catch (e: any) {
                // Ignore errors to allow other sections to load
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        let sort = 'latest'
        if (homepageSectionId === 'most_followed') sort = 'follow'
        if (homepageSectionId === 'most_viewed') sort = 'view'
        if (homepageSectionId === 'completed') sort = 'completed'

        const url = `${BASE_URL}/api/comics?sort=${sort}&page=${page}`

        const json = await this.fetchJSON(url)
        const items = this.parser.parseHomePage(json, PROXY_URL)

        return App.createPagedResults({
            results: items,
            metadata: items.length > 0 ? { page: page + 1 } : undefined,
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const searchUrl = `${BASE_URL}/api/comics?q=${encodeURIComponent(query.title ?? '')}&page=${page}`

        const json = await this.fetchJSON(searchUrl)
        const items = this.parser.parseHomePage(json, PROXY_URL)

        return App.createPagedResults({
            results: items,
            metadata: items.length > 0 ? { page: page + 1 } : undefined,
        })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const url = `${BASE_URL}/api/comics/${mangaId}`
        const json = await this.fetchJSON(url)
        return this.parser.parseMangaDetails(json, mangaId, PROXY_URL)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/api/comics/${mangaId}`
        const json = await this.fetchJSON(url)
        return this.parser.parseChapters(json, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${BASE_URL}/api/comics/${mangaId}/${chapterId}/view`
        const json = await this.fetchJSON(url)
        const pages = this.parser.parseChapterDetails(json, chapterId, mangaId, PROXY_URL)
        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
