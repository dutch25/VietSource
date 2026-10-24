import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    CloudflareBypassRequestProviding,
    ContentRating,
    DUISection,
    HomeSection,
    HomeSectionType,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types';

import type { CheerioAPI } from 'cheerio';
import { HentaiVNParser } from './HentaiVNParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './HentaiVNSetting';

export const HentaiVNInfo: SourceInfo = {
    version: '1.0.3',
    name: 'HentaiVN',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for HentaiVN (hentaivnx.com) - Manga, Doujinshi & Manhwa 18+',
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

export class HentaiVN extends Source implements CloudflareBypassRequestProviding {
    stateManager = App.createSourceStateManager();
    parser = new HentaiVNParser();

    private async getBaseUrl(): Promise<string> {
        return await getDomain(this.stateManager);
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 2,
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
            header: 'Cài đặt nguồn HentaiVN',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/truyen-hentai/${mangaId}`;
    }

    CloudFlareError(status: number): void {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to home page ${HentaiVNInfo.name} source and press the cloud icon.`);
        }
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        const baseUrl = await this.getBaseUrl();
        return App.createRequest({
            url: baseUrl,
            method: 'GET',
        });
    }

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        let lastError: any;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const request = App.createRequest({ url, method: 'GET' });
                const response = await this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                return this.cheerio.load(response.data as string);
            } catch (err: any) {
                lastError = err;
                if (attempt < 2) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const initialSections = [
            { id: 'de_cu', title: 'Truyện Đề Cử' },
            { id: 'latest', title: 'Mới Cập Nhật' },
            { id: 'manhwa', title: 'Manhwa 18+' },
            { id: 'doujinshi', title: 'Doujinshi' },
            { id: 'truyen_mau', title: 'Truyện Màu' },
        ];

        for (const item of initialSections) {
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }));
        }

        // 1. Fetch homepage once for 'de_cu' and 'latest'
        try {
            const $home = await this.DOMHTML(baseUrl);

            const deCu = this.parser.parseCards($home, baseUrl, '.items-slide .item');
            sectionCallback(App.createHomeSection({
                id: 'de_cu',
                title: 'Truyện Đề Cử',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: deCu,
            }));

            const latest = this.parser.parseCards($home, baseUrl, 'div.items .item, .Item');
            sectionCallback(App.createHomeSection({
                id: 'latest',
                title: 'Mới Cập Nhật',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: latest,
            }));
        } catch (e) {
            console.error('[HentaiVN error loading homepage]:', e);
        }

        // 2. Fetch category sections
        const categorySections = [
            { id: 'manhwa', title: 'Manhwa 18+', url: `${baseUrl}/tim-truyen/manhwa` },
            { id: 'doujinshi', title: 'Doujinshi', url: `${baseUrl}/tim-truyen/doujinshi` },
            { id: 'truyen_mau', title: 'Truyện Màu', url: `${baseUrl}/tim-truyen/truyen-mau` },
        ];

        for (const item of categorySections) {
            try {
                const $cat = await this.DOMHTML(item.url);
                const manga = this.parser.parseCards($cat, baseUrl, 'div.items .item, .Item');
                sectionCallback(App.createHomeSection({
                    id: item.id,
                    title: item.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            } catch (e) {
                // Section remains created with empty list if category fetch fails
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';

        if (homepageSectionId === 'de_cu') {
            url = `${baseUrl}/?page=${page}`;
        } else if (homepageSectionId === 'latest') {
            url = `${baseUrl}/?page=${page}`;
        } else if (homepageSectionId === 'manhwa') {
            url = `${baseUrl}/tim-truyen/manhwa?page=${page}`;
        } else if (homepageSectionId === 'doujinshi') {
            url = `${baseUrl}/tim-truyen/doujinshi?page=${page}`;
        } else if (homepageSectionId === 'truyen_mau') {
            url = `${baseUrl}/tim-truyen/truyen-mau?page=${page}`;
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
            url = `${baseUrl}/tim-truyen?keyword=${encodeURIComponent(query.title.trim())}&page=${page}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            url = `${baseUrl}/tim-truyen/${query.includedTags[0].id}?page=${page}`;
        } else {
            url = `${baseUrl}/?page=${page}`;
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
        const $ = await this.DOMHTML(`${baseUrl}/truyen-hentai/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/truyen-hentai/${mangaId}`);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const $ = await this.DOMHTML(`${baseUrl}/truyen-hentai/${cleanId}`);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
