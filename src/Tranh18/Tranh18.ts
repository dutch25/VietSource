import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ChapterProviding,
    CloudflareBypassRequestProviding,
    ContentRating,
    DUISection,
    HomePageSectionsProviding,
    HomeSection,
    HomeSectionType,
    MangaProviding,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types';

import type { CheerioAPI } from 'cheerio';
import { Tranh18Parser } from './Tranh18Parser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './Tranh18Setting';

export const Tranh18Info: SourceInfo = {
    version: '1.0.1',
    name: 'Tranh18',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for Tranh18.cc (Truyện tranh Manhwa 18+ tiếng Việt)',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Adult',
            type: BadgeColor.RED,
        },
        {
            text: '18+',
            type: BadgeColor.YELLOW,
        },
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.SETTINGS_UI |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};

export class Tranh18 implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding, CloudflareBypassRequestProviding {
    constructor(private cheerio: CheerioAPI) { }

    stateManager = App.createSourceStateManager();
    parser = new Tranh18Parser();

    private async getBaseUrl(): Promise<string> {
        return await getDomain(this.stateManager);
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                const baseUrl = await this.getBaseUrl();
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': `${baseUrl}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            },
        },
    });

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn Tranh18',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/comic/${mangaId}`;
    }

    CloudFlareError(status: number): void {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to home page ${Tranh18Info.name} source and press the cloud icon.`);
        }
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        const baseUrl = await this.getBaseUrl();
        return App.createRequest({
            url: baseUrl,
            method: 'GET',
            headers: {
                'referer': `${baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            },
        });
    }

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        return this.cheerio.load(response.data as string);
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/update` },
            { id: 'manhwa', title: 'Manhwa 18+', url: `${baseUrl}/tag/manhwa` },
            { id: 'completed', title: 'Truyện Hoàn Thành', url: `${baseUrl}/completed` },
        ];

        for (const item of sections) {
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }));
        }

        for (const item of sections) {
            const $ = await this.DOMHTML(item.url);
            const manga = this.parser.parseCards($, baseUrl);
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: manga,
            }));
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';

        if (homepageSectionId === 'latest') {
            url = `${baseUrl}/update?page=${page}`;
        } else if (homepageSectionId === 'manhwa') {
            url = `${baseUrl}/tag/manhwa?page=${page}`;
        } else if (homepageSectionId === 'completed') {
            url = `${baseUrl}/completed?page=${page}`;
        }

        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);

        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';

        if (query.title && query.title.trim()) {
            url = `${baseUrl}/search?keyword=${encodeURIComponent(query.title.trim())}&page=${page}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            url = `${baseUrl}/tag/${query.includedTags[0].id}?page=${page}`;
        } else {
            url = `${baseUrl}/update?page=${page}`;
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);

        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/comic/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/comic/${mangaId}`);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const $ = await this.DOMHTML(`${baseUrl}/${cleanId}`);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
