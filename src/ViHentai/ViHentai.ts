import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    HomeSectionType,
    PagedResults,
    PartialSourceManga,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'
import { Parser } from './ViHentaiParser'

const DOMAIN = 'https://vi-hentai.pro'

export const isLastPage = ($: CheerioAPI): boolean => {
    const lastPage = Number($('ul.pagination > li:not(.disabled):not(.active) a').last().text().trim())
    const currentPage = Number($('ul.pagination > li.active a').text().trim())
    return currentPage >= lastPage || lastPage === 0
}

export const ViHentaiInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Vi-Hentai',
    icon: 'icon.png',
    author: 'YourName',
    authorWebsite: 'https://github.com/YourName',
    description: 'Extension for vi-hentai.pro',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Adult',
            type: BadgeColor.RED
        },
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class ViHentai extends Source {
    private readonly parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request) => {
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': `${DOMAIN}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                }
                return request
            },
            interceptResponse: async (response) => {
                return response
            }
        }
    })

    // ─── Helper: fetch a URL and return a cheerio DOM ────────────────────────
    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' })
        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        return this.cheerio.load(response.data as string)
    }

    // ─── Manga Details ────────────────────────────────────────────────────────
    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const $ = await this.DOMHTML(`${DOMAIN}/truyen/${mangaId}`)
        return this.parser.parseMangaDetails($, mangaId)
    }

    // ─── Chapter List ─────────────────────────────────────────────────────────
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const $ = await this.DOMHTML(`${DOMAIN}/truyen/${mangaId}`)
        return this.parser.parseChapterList($, mangaId)
    }

    // ─── Chapter Pages ────────────────────────────────────────────────────────
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        // First, try to get images from HTML
        const $ = await this.DOMHTML(`${DOMAIN}/truyen/${chapterId}`)
        let pages = this.parser.parseChapterDetails($)

        // If no images found in HTML, try API approach
        if (pages.length === 0) {
            pages = await this.fetchChapterImagesFromAPI(chapterId)
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages })
    }

    // ─── Fetch chapter images via API ─────────────────────────────────────────
    private async fetchChapterImagesFromAPI(chapterPath: string): Promise<string[]> {
        try {
            // Fetch chapter page to get chapter_id and csrf_token
            const chapterHtml = await this.requestManager.schedule(
                App.createRequest({ url: `${DOMAIN}/truyen/${chapterPath}`, method: 'GET' }),
                1
            )
            this.CloudFlareError(chapterHtml.status)

            const html = chapterHtml.data as string
            const $ = this.cheerio.load(html)

            // Extract chapter_id and csrf_token from script tags
            const scriptContent = $('script').html() || ''
            const chapterIdMatch = scriptContent.match(/chapter_id\s*=\s*['"]([^'"]+)['"]/)
            const csrfMatch = scriptContent.match(/csrf_token\s*=\s*['"]([^'"]+)['"]/)

            const chapterId = chapterIdMatch?.[1]
            const csrfToken = csrfMatch?.[1]

            if (!chapterId || !csrfToken) {
                console.log('Could not extract chapter_id or csrf_token')
                return []
            }

            // Try to get images via POST request
            const apiResponse = await this.requestManager.schedule(
                App.createRequest({
                    url: `${DOMAIN}/action/views`,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-csrf-token': csrfToken,
                        'x-livewire-token': csrfToken,
                        'referer': `${DOMAIN}/truyen/${chapterPath}`,
                    },
                    data: `chapter_id=${chapterId}&_token=${csrfToken}`,
                }),
                1
            )

            // The response might contain view count, not images
            // Try alternative: check if images can be constructed from seriesId
            // For now, return empty - need to find proper API endpoint
            console.log('API Response:', apiResponse.data)
            return []

        } catch (error) {
            console.log('Error fetching chapter images:', error)
            return []
        }
    }

    // ─── Search ───────────────────────────────────────────────────────────────
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let url: string

        // Tag-based browsing (genre filter)
        const tags = query.includedTags?.map(tag => tag.id) ?? []
        const genreTag = tags.find(t => t.startsWith('genre.'))
        if (genreTag) {
            const slug = genreTag.replace('genre.', '')
            url = `${DOMAIN}/the-loai/${slug}?page=${page}`
        } else {
            const q = encodeURIComponent(query.title ?? '')
            url = `${DOMAIN}/tim-kiem?q=${q}&page=${page}`
        }

        const $ = await this.DOMHTML(url)
        const manga = this.parser.parseSearchResults($)
        const hasMore = !isLastPage($)
        return App.createPagedResults({
            results: manga,
            metadata: hasMore ? { page: page + 1 } : undefined
        })
    }

    // ─── Search Tags (Genre Browsing) ─────────────────────────────────────────
    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getStaticTags()
    }

    // ─── Homepage Sections ────────────────────────────────────────────────────
    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            App.createHomeSection({
                id: 'hot',
                title: 'TRUYỆN HOT',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal
            }),
            App.createHomeSection({
                id: 'new_updated',
                title: 'MỚI CẬP NHẬT',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal
            }),
        ]

        // Signal sections exist (empty first)
        for (const section of sections) {
            sectionCallback(section)
        }

        // Fetch homepage once for both sections
        const $ = await this.DOMHTML(`${DOMAIN}/`)

        for (const section of sections) {
            switch (section.id) {
                case 'hot':
                    section.items = this.parser.parseHotSection($)
                    break
                case 'new_updated':
                    section.items = this.parser.parseNewSection($)
                    break
            }
            sectionCallback(section)
        }
    }

    // ─── View More ────────────────────────────────────────────────────────────
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let url: string

        switch (homepageSectionId) {
            case 'hot':
                url = `${DOMAIN}/the-loai/all?sort=views&page=${page}`
                break
            case 'new_updated':
                url = `${DOMAIN}/?page=${page}`
                break
            default:
                throw new Error(`Unknown section: ${homepageSectionId}`)
        }

        const $ = await this.DOMHTML(url)
        const manga = this.parser.parseSearchResults($)
        const hasMore = !isLastPage($)
        return App.createPagedResults({
            results: manga,
            metadata: hasMore ? { page: page + 1 } : undefined
        })
    }

    // ─── Share URL ────────────────────────────────────────────────────────────
    getMangaShareUrl(mangaId: string): string {
        return `${DOMAIN}/truyen/${mangaId}`
    }

    // ─── Cloudflare ───────────────────────────────────────────────────────────
    CloudFlareError(status: number): void {
        if (status === 503 || status === 403) {
            throw new Error(
                `CLOUDFLARE BYPASS ERROR:\nPlease go to the home page of Vi-Hentai source and press the cloud icon.`
            )
        }
    }

    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: DOMAIN,
            method: 'GET',
            headers: {
                'referer': `${DOMAIN}/`,
                'origin': DOMAIN,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }
}
