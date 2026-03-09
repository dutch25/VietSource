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
const PROXY_URL = ''

export const HV2TInfo: SourceInfo = {
    version: '1.0.1',
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
        console.log(`[HV2T] Fetching: ${url}`)
        const response = await this.requestManager.schedule(this.buildRequest(url), 0)
        console.log(`[HV2T] Response status: ${response.status}, data length: ${(response.data as string).length}`)
        return this.cheerio.load(response.data as string)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: BASE_URL },
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
        const url = `${BASE_URL}?page=${page}`
        
        const $ = await this.fetchHTML(url)
        const items = this.parser.parseHomePage($, PROXY_URL)
        
        return App.createPagedResults({
            results: items,
            metadata: { page: page + 1 },
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const search = encodeURIComponent(query.title ?? '')
        const url = `${BASE_URL}/?q=${search}`
        
        const $ = await this.fetchHTML(url)
        const items = this.parser.parseHomePage($, PROXY_URL)

        return App.createPagedResults({
            results: items,
        })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const url = `${BASE_URL}/comics/${mangaId}`
        const $ = await this.fetchHTML(url)
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/comics/${mangaId}`
        const $ = await this.fetchHTML(url)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${BASE_URL}/comics/${mangaId}/${chapterId}`
        const $ = await this.fetchHTML(url)
        const pages = this.parser.parseChapterDetails($, chapterId, mangaId, PROXY_URL)
        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/comics/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
