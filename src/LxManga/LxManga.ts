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

import { Parser } from './LxMangaParser'

const BASE_URL = 'https://lxmanga.space'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'

export const LxMangaInfo: SourceInfo = {
    version: '1.0.3',
    name: 'LxManga',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for LxManga',
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

export class LxManga extends Source {
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
        const response = await this.requestManager.schedule(this.buildRequest(url), 0)
        return this.cheerio.load(response.data as string)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: BASE_URL },
            { id: 'top', title: 'Top View', url: `${BASE_URL}/top` },
        ]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))

            const $ = await this.fetchHTML(section.url)
            const items = this.parser.parseHomePage($, PROXY_URL)

            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items,
            }))
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        let url: string

        switch (homepageSectionId) {
            case 'latest':
                url = `${BASE_URL}?page=${page}`
                break
            case 'top':
                url = `${BASE_URL}/top?page=${page}`
                break
            default:
                throw new Error(`Unknown section: ${homepageSectionId}`)
        }

        const $ = await this.fetchHTML(url)
        const items = this.parser.parseHomePage($, PROXY_URL)
        const hasNextPage = $('a[rel="next"], .next, .page-next, .pagination .page-item:last-child').length > 0

        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const search = encodeURIComponent(query.title ?? '')
        const url = `${BASE_URL}/tim-kiem?q=${search}&page=${page}`
        
        const $ = await this.fetchHTML(url)
        const items = this.parser.parseHomePage($, PROXY_URL)
        const hasNextPage = $('a[rel="next"], .next, .page-next, .pagination .page-item:last-child').length > 0

        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const url = `${BASE_URL}/truyen/${mangaId}`
        const $ = await this.fetchHTML(url)
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/truyen/${mangaId}`
        const $ = await this.fetchHTML(url)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${BASE_URL}/truyen/${mangaId}/${chapterId}`
        const $ = await this.fetchHTML(url)
        const pages = this.parser.parseChapterDetails($, chapterId, mangaId, PROXY_URL)
        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
