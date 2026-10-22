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
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
    DUISection,
} from '@paperback/types';

import { Parser } from './TopTruyenParser';
import {
    DEFAULT_BASE_URL,
    getDomain,
    domainSettings,
    resetSettings,
} from './TopTruyenSetting';

export const isLastPage = ($: CheerioAPI): boolean => {
    // try with span else a tag
    let current = $('ul.pagination li.page-item.active span').text();
    if (!current)
        current = $('ul.pagination li.page-item.active a').text();

    const lastPage = $('ul.pagination li.page-item:nth-last-child(2) a').text();

    if (current) {
        if (!lastPage) {
            const hasNextButton = $('ul.pagination a[rel="next"]').length > 0;
            return !hasNextButton;
        }
        return (+lastPage) === (+current);
    }

    return true;
};

export const TopTruyenInfo: SourceInfo = {
    version: '1.1.15',
    name: 'TopTruyen',
    icon: 'icon.png',
    author: 'AlanNois',
    authorWebsite: 'https://github.com/AlanNois/',
    description: 'Extension that pulls manga from TopTruyen.',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Recommended',
            type: BadgeColor.BLUE
        },
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
};

export class TopTruyen implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    stateManager = App.createSourceStateManager();
    private currentBaseUrl = DEFAULT_BASE_URL;

    private async getBaseUrl(): Promise<string> {
        this.currentBaseUrl = await getDomain(this.stateManager);
        return this.currentBaseUrl.replace(/\/+$/, '') + '/';
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 50000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                const domain = await this.getBaseUrl();
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': domain,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    }
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            }
        }
    });

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'main',
            header: 'Source Settings',
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
        const $ = await this.DOMHTML(`${domain}truyen-tranh/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}truyen-tranh/${mangaId}`);
        return this.parser.parseChapterList($);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}truyen-tranh/${chapterId}`);
        const pages = this.parser.parseChapterDetails($);
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1;

        const search = {
            genres: '',
        };

        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        const genres: string[] = [];
        for (const value of tags) {
            genres.push(value);
        }
        search.genres = genres.join(',');

        const domain = await this.getBaseUrl();
        const url = `${domain}tim-truyen`;
        const param = encodeURI(`?keyword=${query.title ?? ''}&genres=${search.genres}&page=${page}`);
        const $ = await this.DOMHTML(url + param);
        const tiles = this.parser.parseSection($);
        metadata = !isLastPage($) ? { page: page + 1 } : undefined;

        return App.createPagedResults({
            results: tiles,
            metadata
        });
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        console.log('TopTruyen Running...');
        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'featured', title: 'Truyện Đề Cử', containsMoreItems: false, type: HomeSectionType.featured }),
            App.createHomeSection({ id: 'viewest', title: 'Truyện Xem Nhiều Nhất', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'hot', title: 'Truyện Hot Nhất', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_updated', title: 'Truyện Mới Cập Nhật', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_added', title: 'Truyện Mới Thêm Gần Đây', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'full', title: 'Truyện Đã Hoàn Thành', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];

        const domain = await this.getBaseUrl();

        for (const section of sections) {
            sectionCallback(section);
            let url: string;
            switch (section.id) {
                case 'featured':
                    url = `${domain}`;
                    break;
                case 'viewest':
                    url = `${domain}tim-truyen?status=2&sort=9`;
                    break;
                case 'hot':
                    url = `${domain}hot`;
                    break;
                case 'new_updated':
                    url = `${domain}`;
                    break;
                case 'new_added':
                    url = `${domain}tim-truyen?status=2&sort=1`;
                    break;
                case 'full':
                    url = `${domain}tim-truyen?status=1&sort=2`;
                    break;
                default:
                    throw new Error('Invalid homepage section ID');
            }

            const $ = await this.DOMHTML(url);
            switch (section.id) {
                case 'featured':
                    section.items = this.parser.parseFeaturedSection($);
                    break;
                case 'viewest':
                    section.items = this.parser.parseSection($);
                    break;
                case 'hot':
                    section.items = this.parser.parseSection($);
                    break;
                case 'new_updated':
                    section.items = this.parser.parseSection($);
                    break;
                case 'new_added':
                    section.items = this.parser.parseSection($);
                    break;
                case 'full':
                    section.items = this.parser.parseSection($);
                    break;
            }
            sectionCallback(section);
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        let param = '';
        let url = '';

        const domain = await this.getBaseUrl();

        switch (homepageSectionId) {
            case 'viewest':
                param = `?status=2&sort=9&page=${page}`;
                url = `${domain}tim-truyen`;
                break;
            case 'hot':
                param = '';
                url = `${domain}hot?page=${page}`;
                break;
            case 'new_updated':
                param = '';
                url = `${domain}?page=${page}`;
                break;
            case 'new_added':
                param = `?status=2&sort=1&page=${page}`;
                url = `${domain}tim-truyen`;
                break;
            case 'full':
                param = `?status=1&sort=2&page=${page}`;
                url = `${domain}tim-truyen`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }

        const request = App.createRequest({
            url,
            method: 'GET',
            param,
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);

        const manga = this.parser.parseSection($);
        metadata = isLastPage($) ? undefined : { page: page + 1 };

        return App.createPagedResults({
            results: manga,
            metadata
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const domain = await this.getBaseUrl();
        const url = `${domain}tim-truyen`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseTags($);
    }
}

