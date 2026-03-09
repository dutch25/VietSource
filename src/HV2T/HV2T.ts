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
    version: '1.0.3',
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
        console.log(`[HV2T] Fetching URL: ${url}`)
        try {
            const response = await this.requestManager.schedule(this.buildRequest(url), 0)
            const data = response.data as string
            console.log(`[HV2T] Response: status=${response.status}, length=${data.length}`)
            
            if (data.length < 1000) {
                console.log(`[HV2T] Warning: Small response, data: ${data.substring(0, 500)}`)
            }
            
            return this.cheerio.load(data)
        } catch (e) {
            console.log(`[HV2T] Error fetching: ${e}`)
            throw e
        }
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        console.log('[HV2T] getHomePageSections called')
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: BASE_URL },
        ]

        for (const section of sections) {
            console.log(`[HV2T] Processing section: ${section.id}`)
            
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))

            try {
                const $ = await this.fetchHTML(section.url)
                console.log('[HV2T] HTML fetched, parsing...')
                const items = this.parser.parseHomePage($, PROXY_URL)
                console.log(`[HV2T] Parsed ${items.length} items`)

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items,
                }))
            } catch (e) {
                console.log(`[HV2T] Error: ${e}`)
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: [],
                }))
            }
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
