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

import { Parser } from './TruyenVNParser'

const BASE_URL = 'https://truyenvn.onl'

export const TruyenVNInfo: SourceInfo = {
    version: '1.1.5',
    name: 'TruyenVN',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyenvn.onl',
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

export class TruyenVN extends Source {
    private readonly parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request) => {
                const isImggo = request.url?.includes('imggo.net')
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': isImggo ? '' : `${BASE_URL}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                }
                return request
            },
            interceptResponse: async (response) => response,
        }
    })

    CloudFlareError(status: number): void {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to home page ${TruyenVNInfo.name} source and press the cloud icon.`)
        }
    }

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
        const sections: { section: HomeSection; url: string }[] = [
            {
                section: App.createHomeSection({ id: 'latest', title: 'Mới Cập Nhật', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
                url: `${BASE_URL}/truyen-tranh/`
            },
            {
                section: App.createHomeSection({ id: '18+', title: 'Truyện tranh 18+', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
                url: `${BASE_URL}/the-loai/truyen-tranh-18/?m_orderby=views`
            },
            {
                section: App.createHomeSection({ id: 'manhwa', title: 'Manhwa', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
                url: `${BASE_URL}/the-loai/manhwa/`
            },
            {
                section: App.createHomeSection({ id: 'manhua', title: 'Manhua', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
                url: `${BASE_URL}/the-loai/manhua/`
            },
        ]

        for (const item of sections) {
            sectionCallback(item.section)
            try {
                const response = await this.requestManager.schedule(
                    App.createRequest({ url: item.url, method: 'GET' }), 1
                )
                this.CloudFlareError(response.status)
                const $ = this.cheerio.load(response.data as string)
                item.section.items = this.parser.parseHomePage($)
                sectionCallback(item.section)
            } catch (e) {
                // If cloudflare error, rethrow so Paperback displays Cloudflare bypass
                if (e instanceof Error && e.message.includes('CLOUDFLARE BYPASS ERROR')) {
                    throw e
                }
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const urlMap: Record<string, string> = {
            'latest': `${BASE_URL}/truyen-tranh/page/${page}/`,
            '18+': `${BASE_URL}/the-loai/truyen-tranh-18/page/${page}/?m_orderby=views`,
            'manhwa': `${BASE_URL}/the-loai/manhwa/page/${page}/`,
            'manhua': `${BASE_URL}/the-loai/manhua/page/${page}/`,
        }

        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/the-loai/${homepageSectionId}/page/${page}/`

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
            url = `${BASE_URL}/the-loai/${selectedTag.id}/page/${page}/`
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
            App.createRequest({ url: `${BASE_URL}/truyen-tranh/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen-tranh/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/truyen-tranh/${mangaId}/${chapterId}`, method: 'GET' }), 1
        )
        const $ = this.cheerio.load(response.data as string)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen-tranh/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}