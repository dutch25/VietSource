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

import { Parser } from './HentaiVNParser'

const BASE_URL = 'https://hentaivn.college'
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev' // Reuse proxy if images are blocked

export const HentaiVNInfo: SourceInfo = {
    version: '1.0.1',
    name: 'HentaiVN',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for HentaiVN (hentaivn.college)',
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

export class HentaiVN extends Source {
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
            interceptResponse: async (response) => {
                return response
            },
        }
    })

    async getCloudflareBypassRequestAsync(): Promise<any> {
        return App.createRequest({ url: BASE_URL, method: 'GET' })
    }

    private buildRequest(url: string) {
        return App.createRequest({ url, method: 'GET' })
    }

    private slugFromUrl(url: string): string {
        return url.replace(/\/$/, '').split('/').pop() ?? url
    }

    private async fetchHTML(url: string) {
        const response = await this.requestManager.schedule(this.buildRequest(url), 0)
        return this.cheerio.load(response.data as string)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: BASE_URL },
            { id: 'full', title: 'Truyện Full', url: `${BASE_URL}/truyen-full` },
            { id: 'top', title: 'Top View', url: `${BASE_URL}/top-view` },
        ]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))

            const $ = await this.fetchHTML(section.url)
            const items = this.parser.parseHomePage($, PROXY_URL)

            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items,
            }))
        }
    }



    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const url = `${BASE_URL}/truyen-hentai/${mangaId}`;
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        );
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const url = `${BASE_URL}/truyen-hentai/${mangaId}`;
        const $ = await this.fetchHTML(url);
        return this.parser.parseChapters($, mangaId);
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1;
        const url = `${BASE_URL}/tim-truyen?keyword=${encodeURIComponent(query.title ?? '')}&page=${page}`;
        const $ = await this.fetchHTML(url);
        const manga = this.parser.parseHomePage($, PROXY_URL);
        const hasNextPage = $('a[rel="next"], .next, .page-next, .pagination next').length > 0;

        return App.createPagedResults({
            results: manga,
            metadata: hasNextPage ? { page: page + 1 } : undefined
        });
    }



    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags()
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${BASE_URL}/${chapterId}-doc-truyen-${mangaId}.html`;
        const $ = await this.fetchHTML(url);
        const pages = this.parser.parseChapterDetails($, chapterId, mangaId, PROXY_URL);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1;
        let url: string;

        switch (homepageSectionId) {
            case 'latest':
                url = `${BASE_URL}/trang/${page}`;
                break;
            case 'full':
                url = `${BASE_URL}/truyen-full/trang/${page}`;
                break;
            case 'top':
                url = `${BASE_URL}/top-view/trang/${page}`;
                break;
            default:
                throw new Error(`Unknown section: ${homepageSectionId}`);
        }

        const $ = await this.fetchHTML(url);
        const items = this.parser.parseHomePage($, PROXY_URL);
        const hasNextPage = $('a[rel="next"], .next, .page-next').length > 0;

        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/truyen-hentai/${mangaId}`;
    }
}
