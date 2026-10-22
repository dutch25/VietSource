import { CheerioAPI } from 'cheerio';
import {
    TagSection,
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding,
    CloudflareBypassRequestProviding,
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
    DUISection,
} from '@paperback/types';

import { Parser } from './ZetTruyenParser';
import {
    DEFAULT_BASE_URL,
    getDomain,
    domainSettings,
    resetSettings,
} from './ZetTruyenSetting';

export const isLastPage = ($: CheerioAPI, currentPage: number): boolean => {
    const hasNext = $(`a[href*="page=${currentPage + 1}"]`).length > 0 || $('a[rel="next"]').length > 0;
    return !hasNext;
};

export const ZetTruyenInfo: SourceInfo = {
    version: '1.0.0',
    name: 'ZetTruyen',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/dutch25',
    description: 'Extension đọc truyện tranh Manhwa online từ ZetTruyen.',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Vietnamese',
            type: BadgeColor.BLUE
        },
        {
            text: 'Manhwa',
            type: BadgeColor.GREEN
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};

export class ZetTruyen implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding, CloudflareBypassRequestProviding {

    constructor(private cheerio: CheerioAPI) { }

    stateManager = App.createSourceStateManager();
    private currentBaseUrl = DEFAULT_BASE_URL;

    private async getBaseUrl(): Promise<string> {
        this.currentBaseUrl = await getDomain(this.stateManager);
        return this.currentBaseUrl.replace(/\/+$/, '');
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                const domain = await this.getBaseUrl();
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': `${domain}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            }
        }
    });

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        const domain = await this.getBaseUrl();
        return App.createRequest({
            url: domain,
            method: 'GET',
        });
    }

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn ZetTruyen',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${this.currentBaseUrl.replace(/\/+$/, '')}/truyen-tranh/${mangaId}`;
    }

    parser = new Parser();

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/truyen-tranh/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const domain = await this.getBaseUrl();
        const request = App.createRequest({
            url: `${domain}/api/comics/${mangaId}/chapters`,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        return this.parser.parseChapterList(data, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/truyen-tranh/${mangaId}/${chapterId}`);
        const pages = this.parser.parseChapterDetails($);
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const domain = await this.getBaseUrl();

        let url = `${domain}/tim-kiem-nang-cao?page=${page}`;
        if (query.title) {
            url = `${domain}/tim-kiem-nang-cao?q=${encodeURIComponent(query.title)}&page=${page}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            url = `${domain}/the-loai/${query.includedTags[0].id}?page=${page}`;
        }

        const $ = await this.DOMHTML(url);
        const tiles = this.parser.parseMangaList($, domain);
        const hasNext = !isLastPage($, page) && tiles.length > 0;

        return App.createPagedResults({
            results: tiles,
            metadata: hasNext ? { page: page + 1 } : undefined,
        });
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'new_updated', title: 'Truyện Mới Cập Nhật', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'hot', title: 'Truyện Hot', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];

        const domain = await this.getBaseUrl();

        for (const section of sections) {
            sectionCallback(section);
            let url: string;
            switch (section.id) {
                case 'new_updated':
                    url = `${domain}`;
                    break;
                case 'hot':
                    url = `${domain}/the-loai?status=2&sort=9`;
                    break;
                default:
                    throw new Error('Invalid homepage section ID');
            }

            const $ = await this.DOMHTML(url);
            section.items = this.parser.parseMangaList($, domain);
            sectionCallback(section);
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const domain = await this.getBaseUrl();
        let url = '';

        switch (homepageSectionId) {
            case 'new_updated':
                url = `${domain}/tim-kiem-nang-cao?page=${page}`;
                break;
            case 'hot':
                url = `${domain}/the-loai?status=2&sort=9&page=${page}`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseMangaList($, domain);
        const hasNext = !isLastPage($, page) && manga.length > 0;

        return App.createPagedResults({
            results: manga,
            metadata: hasNext ? { page: page + 1 } : undefined,
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/tim-kiem-nang-cao`);
        return this.parser.parseTags($);
    }
}
