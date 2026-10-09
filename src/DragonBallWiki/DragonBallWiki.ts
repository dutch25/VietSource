import {
    Chapter,
    ChapterDetails,
    HomeSection,
    Manga,
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
    version: '1.0.0',
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
        const section = App.createHomeSection({
            id: 'dbs',
            title: 'Dragon Ball Super',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
        })
        sectionCallback(section)

        const url = `${BASE_URL}/dragon-ball-super`
        const request = App.createRequest({
            url: url,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        const items = [
            App.createPartialSourceManga({
                mangaId: 'dragon-ball-super',
                title: 'Dragon Ball Super',
                image: 'https://dragonballwiki.net/doctruyen/wp-content/uploads/2019/08/Dragon_Ball_Dragon_Ball_Super_Black_Goku_Super_Saiyan_Ros_selective_coloring_manga-1276619.jpg',
            })
        ]

        section.items = items
        sectionCallback(section)
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: ['Dragon Ball Super'],
                image: 'https://dragonballwiki.net/doctruyen/wp-content/uploads/2019/08/Dragon_Ball_Dragon_Ball_Super_Black_Goku_Super_Saiyan_Ros_selective_coloring_manga-1276619.jpg',
                status: 'ONGOING',
                desc: 'Dragon Ball Super Tiếng Việt',
            })
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/${mangaId}`
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
        return App.createPagedResults({
            results: [
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-super',
                    title: 'Dragon Ball Super',
                    image: 'https://dragonballwiki.net/doctruyen/wp-content/uploads/2019/08/Dragon_Ball_Dragon_Ball_Super_Black_Goku_Super_Saiyan_Ros_selective_coloring_manga-1276619.jpg',
                })
            ],
            metadata: undefined
        })
    }
}
