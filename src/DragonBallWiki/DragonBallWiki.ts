import {
    Chapter,
    ChapterDetails,
    HomeSection,
    SourceManga,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    ContentRating,
    HomeSectionType,
    MangaUpdates,
} from '@paperback/types'

import { Parser } from './DragonBallWikiParser'

const BASE_URL = 'https://dragonballwiki.net/doctruyen'

export const DragonBallWikiInfo: SourceInfo = {
    version: '1.0.1',
    name: 'DragonBallWiki',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for dragonballwiki.net/doctruyen',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: BASE_URL,
    sourceTags: [],
}

export class DragonBallWiki extends Source {
    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 15000,
    })

    parser = new Parser()

    override getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/${mangaId}`
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'truyen-dang-hot', title: 'Truyện Đang Hot' },
            { id: 'truyen-moi-cap-nhat', title: 'Truyện Mới Cập Nhật' },
            { id: 'truyen-da-hoan-thanh', title: 'Truyện Đã Hoàn Thành' },
        ];

        for (const sec of sections) {
            const section = App.createHomeSection({
                id: sec.id,
                title: sec.title,
                containsMoreItems: false,
                type: HomeSectionType.singleRowNormal,
            })
            sectionCallback(section)

            const url = `${BASE_URL}/${sec.id}/`
            const request = App.createRequest({
                url: url,
                method: 'GET',
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data as string)
            section.items = this.parser.parseMangaList($)
            sectionCallback(section)
        }
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${BASE_URL}/${mangaId}/`,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/${mangaId}/`
        const request = App.createRequest({
            url: url,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        
        return this.parser.parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: chapterId,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: this.parser.parsePages($),
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const url = `${BASE_URL}/?s=${encodeURIComponent(query.title ?? '')}`
        const request = App.createRequest({
            url: url,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        const results = this.parser.parseMangaList($)

        return App.createPagedResults({
            results,
            metadata: undefined
        })
    }
}
