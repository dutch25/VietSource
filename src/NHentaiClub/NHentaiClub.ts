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

const BASE_URL = 'https://nhentaiclub.site'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'

export const NHentaiClubInfo: SourceInfo = {
    version: '1.1.70',
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
        return App.createRequest({ url: BASE_URL, method: 'GET' })
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
            { id: '3d', title: '3D Most Views', url: `${BASE_URL}/genre/3d?sort=view` },
            { id: 'ahegao', title: 'Ahegao Most Views', url: `${BASE_URL}/genre/ahegao?sort=view` },
            { id: 'anal', title: 'Anal Most Views', url: `${BASE_URL}/genre/anal?sort=view` },
            { id: 'bdsm', title: 'BDSM Most Views', url: `${BASE_URL}/genre/bdsm?sort=view` },
            { id: 'big-ass', title: 'Big Ass Most Views', url: `${BASE_URL}/genre/big-ass?sort=view` },
            { id: 'big-boobs', title: 'Big Boobs Most Views', url: `${BASE_URL}/genre/big-boobs?sort=view` },
            { id: 'big-penis', title: 'Big Penis Most Views', url: `${BASE_URL}/genre/big-penis?sort=view` },
            { id: 'bikini', title: 'Bikini Most Views', url: `${BASE_URL}/genre/bikini?sort=view` },
            { id: 'black-mail', title: 'Blackmail Most Views', url: `${BASE_URL}/genre/black-mail?sort=view` },
            { id: 'blowjobs', title: 'Blowjobs Most Views', url: `${BASE_URL}/genre/blowjobs?sort=view` },
            { id: 'body-swap', title: 'Body Swap Most Views', url: `${BASE_URL}/genre/body-swap?sort=view` },
            { id: 'breast-sucking', title: 'Breast Sucking Most Views', url: `${BASE_URL}/genre/breast-sucking?sort=view` },
            { id: 'bunny-girl', title: 'Bunny Girl Most Views', url: `${BASE_URL}/genre/bunny-girl?sort=view` },
            { id: 'catgirl', title: 'Catgirl Most Views', url: `${BASE_URL}/genre/catgirl?sort=view` },
            { id: 'cheating', title: 'Cheating Most Views', url: `${BASE_URL}/genre/cheating?sort=view` },
            { id: 'chikan', title: 'Chikan Most Views', url: `${BASE_URL}/genre/chikan?sort=view` },
            { id: 'collar', title: 'Collar Most Views', url: `${BASE_URL}/genre/collar?sort=view` },
            { id: 'condom', title: 'Condom Most Views', url: `${BASE_URL}/genre/condom?sort=view` },
            { id: 'cosplay', title: 'Cosplay Most Views', url: `${BASE_URL}/genre/cosplay?sort=view` },
            { id: 'dark-skin', title: 'Dark Skin Most Views', url: `${BASE_URL}/genre/dark-skin?sort=view` },
            { id: 'daughter', title: 'Daughter Most Views', url: `${BASE_URL}/genre/daughter?sort=view` },
            { id: 'deep-throat', title: 'Deepthroat Most Views', url: `${BASE_URL}/genre/deep-throat?sort=view` },
            { id: 'defloration', title: 'Defloration Most Views', url: `${BASE_URL}/genre/defloration?sort=view` },
            { id: 'demon-girl', title: 'Demon Girl Most Views', url: `${BASE_URL}/genre/demon-girl?sort=view` },
            { id: 'double-penetration', title: 'Double Penetration Most Views', url: `${BASE_URL}/genre/double-penetration?sort=view` },
            { id: 'doujinshi', title: 'Doujinshi Most Views', url: `${BASE_URL}/genre/doujinshi?sort=view` },
            { id: 'drugs', title: 'Drugs Most Views', url: `${BASE_URL}/genre/drugs?sort=view` },
            { id: 'drunk', title: 'Drunk Most Views', url: `${BASE_URL}/genre/drunk?sort=view` },
            { id: 'elf', title: 'Elf Most Views', url: `${BASE_URL}/genre/elf?sort=view` },
            { id: 'exhibitionism', title: 'Exhibitionism Most Views', url: `${BASE_URL}/genre/exhibitionism?sort=view` },
            { id: 'father', title: 'Father Most Views', url: `${BASE_URL}/genre/father?sort=view` },
            { id: 'femdom', title: 'Femdom Most Views', url: `${BASE_URL}/genre/femdom?sort=view` },
            { id: 'fingering', title: 'Fingering Most Views', url: `${BASE_URL}/genre/fingering?sort=view` },
            { id: 'footjob', title: 'Footjob Most Views', url: `${BASE_URL}/genre/footjob?sort=view` },
            { id: 'fox-girl', title: 'Fox Girl Most Views', url: `${BASE_URL}/genre/fox-girl?sort=view` },
            { id: 'full-color', title: 'Full Color Most Views', url: `${BASE_URL}/genre/full-color?sort=view` },
            { id: 'futanari', title: 'Futanari Most Views', url: `${BASE_URL}/genre/futanari?sort=view` },
            { id: 'glasses', title: 'Glasses Most Views', url: `${BASE_URL}/genre/glasses?sort=view` },
            { id: 'group', title: 'Group Most Views', url: `${BASE_URL}/genre/group?sort=view` },
            { id: 'hairy', title: 'Hairy Most Views', url: `${BASE_URL}/genre/hairy?sort=view` },
            { id: 'handjob', title: 'Handjob Most Views', url: `${BASE_URL}/genre/handjob?sort=view` },
            { id: 'harem', title: 'Harem Most Views', url: `${BASE_URL}/genre/harem?sort=view` },
            { id: 'humiliation', title: 'Humiliation Most Views', url: `${BASE_URL}/genre/humiliation?sort=view` },
            { id: 'impregnation', title: 'Impregnation Most Views', url: `${BASE_URL}/genre/impregnation?sort=view` },
            { id: 'incest', title: 'Incest Most Views', url: `${BASE_URL}/genre/incest?sort=view` },
            { id: 'kimono', title: 'Kimono Most Views', url: `${BASE_URL}/genre/kimono?sort=view` },
            { id: 'kissing', title: 'Kissing Most Views', url: `${BASE_URL}/genre/kissing?sort=view` },
            { id: 'lactation', title: 'Lactation Most Views', url: `${BASE_URL}/genre/lactation?sort=view` },
            { id: 'maid', title: 'Maid Most Views', url: `${BASE_URL}/genre/maid?sort=view` },
            { id: 'manhwa', title: 'Manhwa Most Views', url: `${BASE_URL}/genre/manhwa?sort=view` },
            { id: 'masturbation', title: 'Masturbation Most Views', url: `${BASE_URL}/genre/masturbation?sort=view` },
            { id: 'milf', title: 'MILF Most Views', url: `${BASE_URL}/genre/milf?sort=view` },
            { id: 'mind-break', title: 'Mind Break Most Views', url: `${BASE_URL}/genre/mind-break?sort=view` },
            { id: 'mind-control', title: 'Mind Control Most Views', url: `${BASE_URL}/genre/mind-control?sort=view` },
            { id: 'monster', title: 'Monster Most Views', url: `${BASE_URL}/genre/monster?sort=view` },
            { id: 'monster-girl', title: 'Monster Girl Most Views', url: `${BASE_URL}/genre/monster-girl?sort=view` },
            { id: 'mother', title: 'Mother Most Views', url: `${BASE_URL}/genre/mother?sort=view` },
            { id: 'muscle', title: 'Muscle Most Views', url: `${BASE_URL}/genre/muscle?sort=view` },
            { id: 'nakadashi', title: 'Nakadashi Most Views', url: `${BASE_URL}/genre/nakadashi?sort=view` },
            { id: 'netorare', title: 'NTR Most Views', url: `${BASE_URL}/genre/netorare?sort=view` },
            { id: 'netori', title: 'Netori Most Views', url: `${BASE_URL}/genre/netori?sort=view` },
            { id: 'nurse', title: 'Nurse Most Views', url: `${BASE_URL}/genre/nurse?sort=view` },
            { id: 'old-man', title: 'Old Man Most Views', url: `${BASE_URL}/genre/old-man?sort=view` },
            { id: 'oneshot', title: 'Oneshot Most Views', url: `${BASE_URL}/genre/oneshot?sort=view` },
            { id: 'orc', title: 'Orc Most Views', url: `${BASE_URL}/genre/orc?sort=view` },
            { id: 'paizuri', title: 'Paizuri Most Views', url: `${BASE_URL}/genre/paizuri?sort=view` },
            { id: 'pantyhose', title: 'Pantyhose Most Views', url: `${BASE_URL}/genre/pantyhose?sort=view` },
            { id: 'pregnant', title: 'Pregnant Most Views', url: `${BASE_URL}/genre/pregnant?sort=view` },
            { id: 'rape', title: 'Rape Most Views', url: `${BASE_URL}/genre/rape?sort=view` },
            { id: 'rimjob', title: 'Rimjob Most Views', url: `${BASE_URL}/genre/rimjob?sort=view` },
            { id: 'school-girl-uniform', title: 'Schoolgirl Uniform Most Views', url: `${BASE_URL}/genre/school-girl-uniform?sort=view` },
            { id: 'series', title: 'Series Most Views', url: `${BASE_URL}/genre/series?sort=view` },
            { id: 'sex-toys', title: 'Sex Toys Most Views', url: `${BASE_URL}/genre/sex-toys?sort=view` },
            { id: 'sister', title: 'Sister Most Views', url: `${BASE_URL}/genre/sister?sort=view` },
            { id: 'slave', title: 'Slave Most Views', url: `${BASE_URL}/genre/slave?sort=view` },
            { id: 'sleeping', title: 'Sleeping Most Views', url: `${BASE_URL}/genre/sleeping?sort=view` },
            { id: 'small-boobs', title: 'Small Boobs Most Views', url: `${BASE_URL}/genre/small-boobs?sort=view` },
            { id: 'shotacon', title: 'Shotacon Most Views', url: `${BASE_URL}/genre/shotacon?sort=view` },
            { id: 'stockings', title: 'Stockings Most Views', url: `${BASE_URL}/genre/stockings?sort=view` },
            { id: 'swimsuit', title: 'Swimsuit Most Views', url: `${BASE_URL}/genre/swimsuit?sort=view` },
            { id: 'teacher', title: 'Teacher Most Views', url: `${BASE_URL}/genre/teacher?sort=view` },
            { id: 'tentacles', title: 'Tentacles Most Views', url: `${BASE_URL}/genre/tentacles?sort=view` },
            { id: 'three-some', title: 'Threesome Most Views', url: `${BASE_URL}/genre/three-some?sort=view` },
            { id: 'time-stop', title: 'Time Stop Most Views', url: `${BASE_URL}/genre/time-stop?sort=view` },
            { id: 'tomboy', title: 'Tomboy Most Views', url: `${BASE_URL}/genre/tomboy?sort=view` },
            { id: 'twins', title: 'Twins Most Views', url: `${BASE_URL}/genre/twins?sort=view` },
            { id: 'twintails', title: 'Twintails Most Views', url: `${BASE_URL}/genre/twintails?sort=view` },
            { id: 'vampire', title: 'Vampire Most Views', url: `${BASE_URL}/genre/vampire?sort=view` },
            { id: 'virgin', title: 'Virgin Most Views', url: `${BASE_URL}/genre/virgin?sort=view` },
            { id: 'x-ray', title: 'X-ray Most Views', url: `${BASE_URL}/genre/x-ray?sort=view` },
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

        const genreSectionIds = ['3d', 'ahegao', 'anal', 'bdsm', 'big-ass', 'big-boobs', 'big-penis', 'bikini', 'black-mail', 'blowjobs', 'body-swap', 'breast-sucking', 'bunny-girl', 'catgirl', 'cheating', 'chikan', 'collar', 'condom', 'cosplay', 'dark-skin', 'daughter', 'deep-throat', 'defloration', 'demon-girl', 'double-penetration', 'doujinshi', 'drugs', 'drunk', 'elf', 'exhibitionism', 'father', 'femdom', 'fingering', 'footjob', 'fox-girl', 'full-color', 'futanari', 'glasses', 'group', 'hairy', 'handjob', 'harem', 'humiliation', 'impregnation', 'incest', 'kimono', 'kissing', 'lactation', 'maid', 'manhwa', 'masturbation', 'milf', 'mind-break', 'mind-control', 'monster', 'monster-girl', 'mother', 'muscle', 'nakadashi', 'netorare', 'netori', 'nurse', 'old-man', 'oneshot', 'orc', 'paizuri', 'pantyhose', 'pregnant', 'rape', 'rimjob', 'school-girl-uniform', 'series', 'sex-toys', 'sister', 'slave', 'sleeping', 'small-boobs', 'shotacon', 'stockings', 'swimsuit', 'teacher', 'tentacles', 'three-some', 'time-stop', 'tomboy', 'twins', 'twintails', 'vampire', 'virgin', 'x-ray', 'yuri']
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
