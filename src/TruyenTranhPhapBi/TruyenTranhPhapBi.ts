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

const DRAGON_BALL_CHAPTERS = [
    { id: '2026_09_dragon-ball-super-tap-24-ke-thua-cho_0231872861', num: 24, name: 'Tập 24: Kế thừa cho tương lai' },
    { id: '2025_08_dragon-ball-super-tap-23-son-gohan-ai', num: 23, name: 'Tập 23: Son Gohan đại thức tỉnh' },
    { id: '2025_06_dragon-ball-super-tap-22-thay-tro-cung', num: 22, name: 'Tập 22: Thầy trò cùng xuất trận' },
    { id: '2025_03_dragon-ball-super-tap-21-truyen-mau-ai', num: 21, name: 'Tập 21: Đại chiến Dr. Hedo' },
    { id: '2025_01_dragon-ball-super-tap-20-toan-luc-chien', num: 20, name: 'Tập 20: Toàn lực chiến' },
    { id: '2024_10_dragon-ball-super-tap-19-niem-tu-hao', num: 19, name: 'Tập 19: Niềm tự hào nguồn cội' },
    { id: '2024_07_dragon-ball-super-tap-18-bardock-cha-e', num: 18, name: 'Tập 18: Bardock, cha đẻ của Goku' },
    { id: '2024_03_dragon-ball-super-tap-17-suc-manh-cua', num: 17, name: 'Tập 17: Sức mạnh của thần hủy diệt' },
    { id: '2023_10_dragon-ball-super-tap-16-chien-binh', num: 16, name: 'Tập 16: Chiến binh mạnh nhất vũ trụ' },
    { id: '2023_07_dragon-ball-super-tap-15-moro-ke-hanh', num: 15, name: 'Tập 15: Moro, kẻ ăn hành tinh' },
    { id: '2023_05_dragon-ball-super-tap-14-son-goku-chang', num: 14, name: 'Tập 14: Son Goku, chàng tuần tra viên ngân hà' },
    { id: '2022_11_dragon-ball-super-tap-13-ten-tung-chien', num: 13, name: 'Tập 13: Tên từng chiến tuyến' },
    { id: '2022_08_dragon-ball-super-tap-12-than-phan-that', num: 12, name: 'Tập 12: Thân phận thật sự của Merus' },
    { id: '2022_07_dragon-ball-super-tap-11-cuoc-ai-vuot', num: 11, name: 'Tập 11: Cuộc đại vượt ngục' },
    { id: '2022_05_dragon-ball-super-tap-10-ieu-uoc-cua', num: 10, name: 'Tập 10: Điều ước của Moro' },
    { id: '2022_04_dragon-ball-super-tap-9-tan-cuoc-preview', num: 9, name: 'Tập 9: Tàn cuộc' },
    { id: '2022_03_dragon-ball-super-tap-8-dau-hieu-thuc', num: 8, name: 'Tập 8: Dấu hiệu thức tỉnh của Goku' },
    { id: '2022_02_dragon-ball-super-tap-7-ai-hoi-sieu', num: 7, name: 'Tập 7: Đại hội siêu chiến binh bắt đầu' },
    { id: '2022_01_dragon-ball-super-tap-6-cac-chien-binh', num: 6, name: 'Tập 6: Các chiến binh siêu cấp tụ hội' },
    { id: '2020_11_dragon-ball-super-hoi-future-trunks-tap', num: 5, name: 'Tập 5: Trận chiến cuối cùng - Vĩnh biệt Trunks' },
    { id: '2020_03_dragon-ball-super-mau-tap-4', num: 4, name: 'Tập 4: Cơ hội cuối cùng cho Hope' },
    { id: '2020_01_dragon-ball-super-mau-tap-3', num: 3, name: 'Tập 3: Kế hoạch vô nhân' },
    { id: '2021_12_dragon-ball-super-tap-2-va-vu-tru-thang', num: 2, name: 'Tập 2: Và vũ trụ thắng cuộc là..' },
    { id: '2021_11_dragon-ball-super-tap-1-truyen-mau', num: 1, name: 'Tập 1: Những chiến binh từ vũ trụ thứ 6' }
]

export const TruyenTranhPhapBiInfo: SourceInfo = {
    version: '1.0.9',
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
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/?m=0` },
            { id: 'Dragon Ball Super', title: 'Dragon Ball Super', url: `${BASE_URL}/search/label/Dragon%20Ball%20Super?m=0` },
            { id: 'Asterix', title: 'Asterix', url: `${BASE_URL}/search/label/Asterix?m=0` },
            { id: 'Lucky Luke', title: 'Lucky Luke', url: `${BASE_URL}/search/label/Lucky%20Luke?m=0` },
            { id: 'Xì trum', title: 'Xì trum', url: `${BASE_URL}/search/label/X%C3%AC%20trum?m=0` },
            { id: 'Tintin', title: 'Tintin', url: `${BASE_URL}/search/label/Tintin?m=0` },
            { id: 'Doremon', title: 'Doremon', url: `${BASE_URL}/search/label/Doremon?m=0` },
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
                    App.createRequest({ url: section.url, method: 'GET' }), 0
                )
                const $ = this.cheerio.load(response.data as string)
                let items = this.parser.parseHomePage($)
                
                // Inject the aggregated manga at the top of the Dragon Ball Super section
                if (section.id === 'Dragon Ball Super') {
                    items.unshift(App.createPartialSourceManga({
                        mangaId: 'dragon-ball-super-aggregated',
                        title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s0/cover.jpg'
                    }))
                }

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: items,
                }))
            } catch (e) {
                console.log(e)
            }
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
        let items = this.parser.parseHomePage($)
        
        // Match search query
        if (query.title && query.title.toLowerCase().includes('dragon ball super')) {
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-super-aggregated',
                title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s0/cover.jpg'
            }))
        }
        
        return App.createPagedResults({ results: items, metadata: undefined })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball Super (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s0/cover.jpg',
                    status: 'ONGOING',
                    desc: 'Tổng hợp toàn bộ các tập truyện màu siêu nét của Dragon Ball Super.',
                })
            })
        }

        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html?m=0`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return DRAGON_BALL_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                mangaId: mangaId,
                langCode: 'vi'
            }))
        }

        const realId = mangaId.replace(/_/g, '/')
        const url = `${BASE_URL}/${realId}.html?m=0`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const realId = chapterId.replace(/_/g, '/')
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
