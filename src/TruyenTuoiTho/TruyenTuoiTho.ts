import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    HomeSectionType,
    PagedResults,
    Response,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types'

import { Parser } from './TruyenTuoiThoParser'

const BASE_URL = 'https://truyentuoitho.com'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'

export const TruyenTuoiThoInfo: SourceInfo = {
    version: '1.1.3',
    name: 'TruyenTuoiTho',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyentuoitho.com (Madara Theme with Proxy Support)',
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
                    'referer': `${BASE_URL}/`,
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
                'referer': `${BASE_URL}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            }
        })
    }

    private async fetchHTML(url: string, method: string = 'GET', data?: any): Promise<Response> {
        // 1. Try fetching via proxy worker first
        try {
            const proxyRequestUrl = `${PROXY_URL}/?url=${encodeURIComponent(url)}`
            const response = await this.requestManager.schedule(
                App.createRequest({
                    url: proxyRequestUrl,
                    method,
                    headers: {
                        'content-type': method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined
                    },
                    data
                }), 0
            )
            if (response.status === 200) {
                const html = response.data as string
                if (
                    !html.includes('challenges.cloudflare.com') &&
                    !html.includes('cf-challenge') &&
                    !html.includes('<title>Just a moment...</title>') &&
                    !html.includes('id="challenge-error-title"')
                ) {
                    return response
                }
            }
        } catch (e) {
            // Silently fall back to direct request on error
        }

        // 2. Direct request fallback
        const response = await this.requestManager.schedule(
            App.createRequest({
                url,
                method,
                headers: {
                    'content-type': method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined
                },
                data
            }), 0
        )
        this.checkCloudflare(response)
        return response
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
                const response = await this.fetchHTML(section.url)
                const $ = this.cheerio.load(response.data as string)
                const manga = this.parser.parseHomePage($, PROXY_URL)

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: manga,
                }))
            } catch (e) {
                // Silently ignore individual section failures to avoid breaking others
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

        const response = await this.fetchHTML(url)
        const $ = this.cheerio.load(response.data as string)
        const manga = this.parser.parseHomePage($, PROXY_URL)

        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const selectedTag = query.includedTags?.[0]
        let url: string

        if (selectedTag) {
            url = `${BASE_URL}/manga-genre/${selectedTag.id}/page/${page}/`
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            url = `${BASE_URL}/page/${page}/?s=${searchQuery}&post_type=wp-manga`
        }

        const response = await this.fetchHTML(url)
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($, PROXY_URL), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/`)
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/`)
        const html = response.data as string
        const $ = this.cheerio.load(html)

        // Try extracting postId for AJAX chapter list loading
        const dataId = $('#manga-chapters-holder').attr('data-id')
        const postIdMatch = html.match(/wpMangaPostId\s*=\s*['"]?(\d+)/i)
            || html.match(/post_id\s*=\s*['"]?(\d+)/i)
            || html.match(/manga\s*:\s*['"]?(\d+)/i)
        const postId = dataId || (postIdMatch ? postIdMatch[1] : null)

        if (postId) {
            try {
                const ajaxResponse = await this.fetchHTML(
                    `${BASE_URL}/wp-admin/admin-ajax.php`,
                    'POST',
                    `action=ajax_list_chapter&manga=${postId}`
                )
                const ajaxHtml = ajaxResponse.data as string
                const $ajax = this.cheerio.load(ajaxHtml)
                const chapters = this.parser.parseChapters($ajax, mangaId)
                if (chapters.length > 0) {
                    return chapters
                }
            } catch (e) {
            }
        }

        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/${chapterId}/`)
        const $ = this.cheerio.load(response.data as string)
        const pages = this.parser.parseChapterPages($)

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`)
        }

        // Apply proxy to all page image URLs
        const proxiedPages = pages.map(page => `${PROXY_URL}/?url=${encodeURIComponent(page)}`)

        return App.createChapterDetails({ id: chapterId, mangaId, pages: proxiedPages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/manga/${mangaId}/`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }

    private checkCloudflare(response: Response): void {
        const status = response.status
        const html = response.data as string
        if (
            status === 403 ||
            status === 503 ||
            html.includes('challenges.cloudflare.com') ||
            html.includes('cf-challenge') ||
            html.includes('<title>Just a moment...</title>') ||
            html.includes('id="challenge-error-title"')
        ) {
            throw new Error('CLOUDFLARE_BYPASS_REQUIRED')
        }
    }
}
