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

import { Parser } from './NHentaiClubParser'

const BASE_URL = 'https://nhentaiclub.space'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'

// Wraps a nhentaiclub.space page URL through the proxy
function proxyPage(path: string): string {
    return `${PROXY_URL}?url=${encodeURIComponent(`${BASE_URL}${path}`)}`
}

export const NHentaiClubInfo: SourceInfo = {
    version: '1.1.59',
    name: 'NHentaiClub',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for nhentaiclub.space',
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

export class NHentaiClub extends Source {
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
            { id: 'latest', title: 'Mới Cập Nhật', path: '/' },
            { id: 'all-time', title: 'Xếp Hạng Tất Cả', path: '/ranking/all-time' },
            { id: 'day', title: 'Xếp Hạng Ngày', path: '/ranking/day' },
            { id: 'week', title: 'Xếp Hạng Tuần', path: '/ranking/week' },
            { id: 'month', title: 'Xếp Hạng Tháng', path: '/ranking/month' },
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
                    App.createRequest({ url: proxyPage(section.path), method: 'GET' }), 0
                )
                if (response.status === 403 || response.status === 503) continue
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
                // Skip failed sections silently
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const pathMap: Record<string, string> = {
            'latest': `/?page=${page}`,
            'all-time': `/ranking/all-time?page=${page}`,
            'day': `/ranking/day?page=${page}`,
            'week': `/ranking/week?page=${page}`,
            'month': `/ranking/month?page=${page}`,
        }

        const path = pathMap[homepageSectionId] ?? `/genre/${homepageSectionId}?page=${page}`

        const response = await this.requestManager.schedule(
            App.createRequest({ url: proxyPage(path), method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        const manga = this.parser.parseHomePage($, PROXY_URL)

        return { results: manga, metadata: { page: page + 1 } }
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const selectedTag = query.includedTags?.[0]
        let path: string

        if (selectedTag) {
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '').replace(/ /g, '+')
                path = `/author/${authorId}?page=${page}`
            } else {
                path = `/genre/${selectedTag.id}?page=${page}`
            }
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            path = `/search?keyword=${searchQuery}&page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url: proxyPage(path), method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return { results: this.parser.parseHomePage($, PROXY_URL), metadata: { page: page + 1 } }
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: proxyPage(`/g/${mangaId}`), method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: proxyPage(`/g/${mangaId}`), method: 'GET' }), 0
        )
        return this.parser.parseChapters(response.data as string)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: proxyPage(`/g/${mangaId}`), method: 'GET' }), 1
        )
        const html = response.data as string
        const $ = this.cheerio.load(html)
        const cdnBase = this.parser.getCdnBase($)
        const pageCount = this.parser.getPageCount(html, chapterId)

        if (!pageCount) {
            throw new Error(`Page count 0 for chapter ${chapterId} in manga ${mangaId}`)
        }

        const pages: string[] = []
        for (let i = 1; i <= pageCount; i++) {
            const imgUrl = `${cdnBase}/${mangaId}/VI/${chapterId}/${i}.jpg`
            pages.push(`${PROXY_URL}?url=${encodeURIComponent(imgUrl)}`)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/g/${mangaId}`
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }
}