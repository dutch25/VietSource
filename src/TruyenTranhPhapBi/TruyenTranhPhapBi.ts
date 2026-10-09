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

const DRAGON_BALL_SUPER_CHAPTERS = [
    { id: '2021_11_dragon-ball-super-tap-1-truyen-mau', num: 1, name: 'Dragon Ball Super tập 1 (Truyện màu) - Những chiến binh từ vũ trụ thứ 6' },
    { id: '2021_12_dragon-ball-super-tap-2-va-vu-tru-thang', num: 2, name: 'Dragon Ball Super Tập 2 - Và Vũ trụ thắng cuộc là.. (Preview)' },
    { id: '2020_01_dragon-ball-super-mau-tap-3', num: 3, name: 'Dragon Ball Super Tập 3 - Kế hoạch Vô nhân' },
    { id: '2020_03_dragon-ball-super-mau-tap-4', num: 4, name: 'DRAGON BALL SUPER (TRUYỆN MÀU) TẬP 4 - CƠ HỘI CUỐI CÙNG CHO HOPE' },
    { id: '2020_11_dragon-ball-super-hoi-future-trunks-tap', num: 5, name: 'Dragon Ball Super Tập 5 - Trận chiến cuối cùng - Vĩnh biệt Trunks' },
    { id: '2022_01_dragon-ball-super-tap-6-cac-chien-binh', num: 6, name: 'Dragon Ball Super Tập 6 - Các chiến binh siêu cấp tụ hội (Preview)' },
    { id: '2022_02_dragon-ball-super-tap-7-ai-hoi-sieu', num: 7, name: 'Dragon Ball Super Tập 7 - Đại hội Siêu chiến binh Bắt đầu' },
    { id: '2022_03_dragon-ball-super-tap-8-dau-hieu-thuc', num: 8, name: 'Dragon Ball Super tập 8 (truyện màu) - Dấu hiệu thức tỉnh của Goku' },
    { id: '2022_04_dragon-ball-super-tap-9-tan-cuoc-preview', num: 9, name: 'Dragon Ball Super Tập 9 - Tàn Cuộc (Preview)' },
    { id: '2022_05_dragon-ball-super-tap-10-ieu-uoc-cua', num: 10, name: 'Dragon Ball Super Tập 10 - Điều ước của Moro (Preview)' },
    { id: '2022_07_dragon-ball-super-tap-11-cuoc-ai-vuot', num: 11, name: 'Dragon Ball Super Tập 11 - Cuộc đại vượt ngục' },
    { id: '2022_08_dragon-ball-super-tap-12-than-phan-that', num: 12, name: 'Dragon Ball Super Tập 12 - Thân phận thật sự của Merus' },
    { id: '2022_11_dragon-ball-super-tap-13-ten-tung-chien', num: 13, name: 'Dragon Ball Super Tập 13 - Trên từng chiến tuyến (Preview)' },
    { id: '2023_05_dragon-ball-super-tap-14-son-goku-chang', num: 14, name: 'Dragon Ball Super - Tập 14 - Son Goku, chàng tuần tra viên ngân hà' },
    { id: '2023_07_dragon-ball-super-tap-15-moro-ke-hanh', num: 15, name: 'Dragon Ball Super Tập 15 - Moro, kẻ ăn hành tinh (Preview)' },
    { id: '2023_10_dragon-ball-super-tap-16-chien-binh', num: 16, name: 'Dragon Ball Super Tập 16 - Chiến binh mạnh nhất vũ trụ' },
    { id: '2024_03_dragon-ball-super-tap-17-suc-manh-cua', num: 17, name: 'Dragon Ball Super tập 17 - Sức mạnh của thần hủy diệt (Preview)' },
    { id: '2024_07_dragon-ball-super-tap-18-bardock-cha-e', num: 18, name: 'Dragon Ball Super Tập 18 - Bardock, cha đẻ của Goku' },
    { id: '2024_10_dragon-ball-super-tap-19-niem-tu-hao', num: 19, name: 'Dragon Ball Super Tập 19 - Niềm tự hào nguồn cội (Preview)' },
    { id: '2025_01_dragon-ball-super-tap-20-toan-luc-chien', num: 20, name: 'Dragon Ball Super tập 20 - Toàn lực chiến (Preview)' },
    { id: '2025_03_dragon-ball-super-tap-21-truyen-mau-ai', num: 21, name: 'Dragon Ball Super Tập 21 (truyện màu) Đại chiến Dr.Hedo' },
    { id: '2025_06_dragon-ball-super-tap-22-thay-tro-cung', num: 22, name: 'Dragon Ball Super Tập 22 (Truyện màu) - Thầy trò cùng xuất trận (Preview)' },
    { id: '2025_08_dragon-ball-super-tap-23-son-gohan-ai', num: 23, name: 'Dragon Ball Super tập 23 - Son Gohan đại thức tỉnh (Preview)' },
    { id: '2026_09_dragon-ball-super-tap-24-ke-thua-cho_0231872861', num: 24, name: 'Dragon Ball Super Tập 24 - Kế thừa cho tương lai' }
];

const DRAGON_BALL_CHAPTERS = [
    { id: '2020_05_dragon-ball-truyen-mau-tap-1', num: 1, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU FULL COLOR) TẬP 1' },
    { id: '2020_07_dragon-ball-hoi-tuoi-tho-truyen-mau-tap', num: 2, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 2' },
    { id: '2020_07_dragon-ball-hoi-tuoi-tho-truyen-mau-tap_23', num: 3, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 3 (PREVIEW)' },
    { id: '2020_08_dragon-ball-hoi-tuoi-tho-truyen-mau-tap', num: 4, name: 'DRAGON BALL- HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 4 (Preview)' },
    { id: '2020_10_dragon-ball-hoi-tuoi-tho-tap-5', num: 5, name: 'Dragon Ball - Hồi Tuổi thơ - tập 5' },
    { id: '2020_12_dragon-ball-hoi-tuoi-tho-tap-6', num: 6, name: 'Dragon Ball hồi Tuổi thơ - Tập 6' },
    { id: '2021_01_dragon-ball-hoi-tuoi-tho-tap-7-preview', num: 7, name: 'Dragon Ball hồi Tuổi thơ - Tập 7 (Preview)' },
    { id: '2021_02_dragon-ball-hoi-tuoi-tho-tap-8-preview', num: 8, name: 'Dragon Ball hồi Tuổi thơ - Tập 8 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-tuoi-tho-tap-9', num: 9, name: 'Dragon Ball hồi Tuổi Thơ - Tập 9' },
    { id: '2021_05_dragon-ball-hoi-piccolo-tap-1', num: 10, name: 'Dragon Ball Hồi Piccolo - Tập 1' },
    { id: '2021_06_dragon-ball-hoi-piccolo-tap-2-preview', num: 11, name: 'Dragon Ball hồi Piccolo - Tập 2 (Preview)' },
    { id: '2021_07_dragon-ball-hoi-piccolo-tap-3-preview', num: 12, name: 'Dragon Ball hồi Piccolo - Tập 3 (Preview)' },
    { id: '2021_07_dragon-ball-hoi-piccolo-tap-4', num: 13, name: 'Dragon Ball hồi Piccolo - Tập 4' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-5', num: 14, name: 'Dragon Ball hồi Piccolo - Tập 5' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-6-preview', num: 15, name: 'Dragon Ball hồi Piccolo - Tập 6 (Preview)' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-cuoi', num: 16, name: 'Dragon Ball hồi Piccolo - Tập cuối' },
    { id: '2019_08_bay-vien-ngoc-rong-ban-mau-hoi-saiyan', num: 17, name: 'Dragon Ball (Truyện màu Full Color) - Hồi Saiyan - Tập 1' },
    { id: '2019_09_bay-vien-ngoc-rong-truyen-mau-hoi', num: 18, name: 'BẢY VIÊN NGỌC RỒNG (TRUYỆN MÀU) - HỒI SAIYAN - TẬP 2' },
    { id: '2019_10_bay-vien-ngoc-rong-truyen-mau-hoi', num: 19, name: 'BẢY VIÊN NGỌC RỒNG MÀU - HỒI SAIYAN - Tập 3 (PREVIEW)' },
    { id: '2025_02_dragon-ball-truyen-mau-hoi-siayan-tap-4', num: 20, name: 'Dragon Ball Truyện màu - Hồi Siayan - Tập 4 (Preview)' },
    { id: '2019_11_bay-vien-ngoc-rong-ban-mau-hoi-frieza', num: 21, name: 'BẢY VIÊN NGỌC RỒNG (MÀU) - HỒI FRIEZA -TẬP 1' },
    { id: '2019_12_bay-vien-ngoc-rong-mau-hoi-frieza-tap-2', num: 22, name: 'BẢY VIÊN NGỌC RỒNG (MÀU) - HỒI FRIEZA - TẬP 2' },
    { id: '2020_03_7-vien-ngoc-rong-truyen-mau-hoi-frieza', num: 23, name: '7 VIÊN NGỌC RỒNG (TRUYỆN  MÀU) HỒI FRIEZA - TẬP 3' },
    { id: '2020_04_7-vien-ngoc-rong-hoi-frieza-mau-tap-4', num: 24, name: '7 VIÊN NGỌC RỒNG (HỒI FRIEZA) MÀU - TẬP 4' },
    { id: '2020_04_bay-vien-ngoc-rong-hoi-frieza-tap-cuoi', num: 25, name: 'BẢY VIÊN NGỌC RỒNG - HỒI FRIEZA - TẬP CUỐI' },
    { id: '2020_09_dragon-ball-hoi-cellandroid-tap-1', num: 26, name: 'DRAGON BALL HỒI CELL/ANDROID - TẬP 1  (Preview)' },
    { id: '2020_10_dragon-ball-hoi-cellandroid-tap-2', num: 27, name: 'Dragon Ball hồi Cell/Android - tập 2 (Preview)' },
    { id: '2020_10_dragon-ball-hoi-cellandroid-tap-3', num: 28, name: 'Dragon Ball hồi Cell/Android - Tập 3' },
    { id: '2020_11_dragon-ball-hoi-cellandroid-tap-4', num: 29, name: 'Dragon Ball hồi Cell/Android - Tập 4' },
    { id: '2020_11_dragon-ball-hoi-cellandroid-tap-5', num: 30, name: 'Dragon Ball hồi Cell/Android - Tập 5 (Preview)' },
    { id: '2020_12_dragon-ball-hoi-cellandroid-tap-6', num: 31, name: 'Dragon Ball hồi Cell/Android - Tập 6' },
    { id: '2020_12_dragon-ball-hoi-cellandroid-tap-7', num: 32, name: 'Dragon Ball hồi Cell/Android - Tập 7' },
    { id: '2021_01_dragon-ball-hoi-cellandroid-tap-cuoi', num: 33, name: 'Dragon Ball hồi Cell/Android - Tập cuối (Preview)' },
    { id: '2021_01_dragon-ball-hoi-mabu-tap-1', num: 34, name: 'Dragon Ball hồi Mabu - Tập 1' },
    { id: '2021_01_dragon-ball-hoi-mabu-tap-2', num: 35, name: 'Dragon Ball - Hồi Mabu - Tập 2' },
    { id: '2021_02_dragon-ball-hoi-mabu-tap-3-preview', num: 36, name: 'Dragon Ball - hồi Mabu - Tập 3 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-mabu-tap-4-preview', num: 37, name: 'Dragon Ball hồi Mabu - Tập 4 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-mabu-tap-5', num: 38, name: 'Dragon Ball hồi Mabu - Tập 5' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-6', num: 39, name: 'Dragon Ball hồi Mabu - Tập 6' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-7', num: 40, name: 'Dragon Ball hồi Mabu - Tập 7 (Preview)' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-cuoi', num: 41, name: 'Dragon Ball hồi Mabu - Tập cuối' }
];


export const TruyenTranhPhapBiInfo: SourceInfo = {
    version: '1.1.1',
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
        sectionCallback(App.createHomeSection({
            id: 'Dragon Ball',
            title: 'Dragon Ball',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
            items: [
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-super-aggregated',
                    title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
                }),
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-aggregated',
                    title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
                })
            ]
        }))

        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/?m=0` },
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
                
                // Filter out individual Dragon Ball posts
                items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'))

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
        
        items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'))
        
        if (query.title && query.title.toLowerCase().includes('dragon ball')) {
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-aggregated',
                title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
            }))
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-super-aggregated',
                title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
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
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg',
                    status: 'ONGOING',
                    desc: 'Tổng hợp toàn bộ các tập truyện màu siêu nét của Dragon Ball Super.',
                })
            })
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg',
                    status: 'COMPLETED',
                    desc: 'Tổng hợp toàn bộ các tập truyện Dragon Ball Hồi Tuổi Thơ, Piccolo, Saiyan, Frieza, Cell, Mabu.',
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
            return DRAGON_BALL_SUPER_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                langCode: 'vi'
            }))
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return DRAGON_BALL_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
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
