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
    version: '1.0.6',
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
        const section = App.createHomeSection({
            id: 'latest',
            title: 'Mới Cập Nhật',
            containsMoreItems: true,
            type: HomeSectionType.singleRowNormal,
            items: [],
        })
        sectionCallback(section)

        try {
            const response = await this.requestManager.schedule(
                App.createRequest({ url: BASE_URL + '/?m=0', method: 'GET' }), 0
            )
            const $ = this.cheerio.load(response.data as string)
            const manga = this.parser.parseHomePage($)


            sectionCallback(App.createHomeSection({
                id: 'latest',
                title: 'Mới Cập Nhật',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: manga,
            }))
        } catch (e) {
            console.log(e)
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        return App.createPagedResults({ results: [], metadata: undefined })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const searchQuery = encodeURIComponent(query.title ?? '')
        const url = `${BASE_URL}/search?q=${searchQuery}&m=0`

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: undefined })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html?m=0`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html?m=0`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html?m=0`
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
