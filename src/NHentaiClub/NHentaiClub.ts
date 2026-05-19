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

export const NHentaiClubInfo: SourceInfo = {
    version: '1.1.74',
    name: 'NHentaiClub',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for nhentaiclub.site',
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
        const rankingSections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/` },
            { id: 'all-time', title: 'Xếp Hạng Tất Cả', url: `${BASE_URL}/ranking/all-time` },
            { id: 'day', title: 'Xếp Hạng Ngày', url: `${BASE_URL}/ranking/day` },
            { id: 'week', title: 'Xếp Hạng Tuần', url: `${BASE_URL}/ranking/week` },
            { id: 'month', title: 'Xếp Hạng Tháng', url: `${BASE_URL}/ranking/month` },
        ]

        const genreSections = [
            { id: 'ahegao', title: 'Ahegao Most Views', url: `${BASE_URL}/genre/ahegao?sort=view` },
            { id: 'anal', title: 'Anal Most Views', url: `${BASE_URL}/genre/anal?sort=view` },
            { id: 'armpit-licking', title: 'Armpit Licking Most Views', url: `${BASE_URL}/genre/armpit-licking?sort=view` },
            { id: 'bdsm', title: 'BDSM Most Views', url: `${BASE_URL}/genre/bdsm?sort=view` },
            { id: 'big-boobs', title: 'Big Boobs Most Views', url: `${BASE_URL}/genre/big-boobs?sort=view` },
            { id: 'blowjobs', title: 'Blowjobs Most Views', url: `${BASE_URL}/genre/blowjobs?sort=view` },
            { id: 'cosplay', title: 'Cosplay Most Views', url: `${BASE_URL}/genre/cosplay?sort=view` },
            { id: 'milf', title: 'MILF Most Views', url: `${BASE_URL}/genre/milf?sort=view` },
            { id: 'netorare', title: 'NTR Most Views', url: `${BASE_URL}/genre/netorare?sort=view` },
            { id: 'rape', title: 'Rape Most Views', url: `${BASE_URL}/genre/rape?sort=view` },
            { id: 'yuri', title: 'Yuri Most Views', url: `${BASE_URL}/genre/yuri?sort=view` },
        ]

        const sections = [...rankingSections, ...genreSections]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))
        }

        // Fetch each section and populate
        for (const section of sections) {
            try {
                const response = await this.requestManager.schedule(
                    App.createRequest({ url: section.url, method: 'GET' }), 0
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

        const urlMap: Record<string, string> = {
            'latest': `${BASE_URL}/?page=${page}`,
            'all-time': `${BASE_URL}/ranking/all-time?page=${page}`,
            'day': `${BASE_URL}/ranking/day?page=${page}`,
            'week': `${BASE_URL}/ranking/week?page=${page}`,
            'month': `${BASE_URL}/ranking/month?page=${page}`,
        }

        const genreSectionIds = ['ahegao', 'anal', 'armpit-licking', 'bdsm', 'big-boobs', 'blowjobs', 'cosplay', 'milf', 'netorare', 'rape', 'yuri']
        let url: string

        if (urlMap[homepageSectionId]) {
            url = urlMap[homepageSectionId]
        } else if (genreSectionIds.includes(homepageSectionId)) {
            url = `${BASE_URL}/genre/${homepageSectionId}?sort=view&page=${page}`
        } else {
            url = `${BASE_URL}/genre/${homepageSectionId}?page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        const manga = this.parser.parseHomePage($, PROXY_URL)

        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const selectedTag = query.includedTags?.[0]
        let url: string

        if (selectedTag) {
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '').replace(/ /g, '+')
                url = `${BASE_URL}/author/${authorId}?page=${page}`
            } else {
                url = `${BASE_URL}/genre/${selectedTag.id}?page=${page}`
            }
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '')
            url = `${BASE_URL}/?keyword=${searchQuery}&page=${page}`
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return App.createPagedResults({ results: this.parser.parseHomePage($, PROXY_URL), metadata: { page: page + 1 } })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 0
        )
        return this.parser.parseChapters(response.data as string)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 1
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
