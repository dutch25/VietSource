import {
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

import { Parser } from './TruyenTranhPhapBiParser'

const BASE_URL = 'https://truyentranhphapbi.blogspot.com'

export const TruyenTranhPhapBiInfo: SourceInfo = {
    version: '1.0.5',
    name: 'TruyenTranhPhapBi',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyentranhphapbi.blogspot.com',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: BASE_URL,
    sourceTags: [],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
}

export class TruyenTranhPhapBi extends Source {
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
        const manga = [
            App.createPartialSourceManga({
                mangaId: '2026_09_dragon-ball-super-tap-24-ke-thua-cho_0231872861',
                title: 'Dragon Ball Super Tập 24 - Kế thừa cho tương lai',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s0/cover.jpg'
            }),
            App.createPartialSourceManga({
                mangaId: '2025_08_dragon-ball-super-tap-23-son-gohan-ai',
                title: 'Dragon Ball Super tập 23 - Son Gohan đại thức tỉnh (Preview)',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZfE7v6B_9/s0/cover.jpg'
            }),
            App.createPartialSourceManga({
                mangaId: '2021_11_dragon-ball-super-tap-1-truyen-mau',
                title: 'Dragon Ball Super tập 1 (Truyện màu) - Những chiến binh từ vũ trụ thứ 6',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZfE7v6B_9/s0/cover.jpg'
            })
        ]

        sectionCallback(App.createHomeSection({
            id: 'latest',
            title: 'Dragon Ball Super (Hardcoded)',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
            items: manga,
        }))
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        return App.createPagedResults({ results: [], metadata: undefined })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const searchQuery = encodeURIComponent(query.title ?? '')
        const url = `${BASE_URL}/search?q=${searchQuery}`

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: undefined })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 1
        )
        const $ = this.cheerio.load(response.data as string)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        const realId = mangaId.replace(/_/g, '/')
        return `${BASE_URL}/${realId}.html`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}
