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
import { Tranh18Parser } from './Tranh18Parser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './Tranh18Setting';

const PROXY_URL = 'https://nhentai-club-proxy.dutch25.workers.dev';

export const Tranh18Info: SourceInfo = {
    version: '1.0.4',
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

export class Tranh18 extends Source implements CloudflareBypassRequestProviding {
    stateManager = App.createSourceStateManager();
    parser = new Tranh18Parser();

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
        // 1. Try proxy worker first (bypasses ISP DPI and Cloudflare blocking)
        try {
            const proxyRequest = App.createRequest({
                url: `${PROXY_URL}/?url=${encodeURIComponent(url)}`,
                method: 'GET',
            });
            const proxyResponse = await this.requestManager.schedule(proxyRequest, 0);
            if (proxyResponse.status === 200 && proxyResponse.data) {
                const html = proxyResponse.data as string;
                if (!html.includes('challenges.cloudflare.com') && !html.includes('cf-challenge')) {
                    return this.cheerio.load(html);
                }
            }
        } catch (e) {
            // Silently fall back to direct request
        }

        // 2. Direct request fallback with retry
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
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật' },
            { id: 'manhwa', title: 'Manhwa 18+' },
            { id: 'completed', title: 'Truyện Hoàn Thành' },
        ];

        for (const item of sections) {
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }));
        }

        try {
            const $home = await this.DOMHTML(baseUrl);

            // 1. Latest section
            const latestEl = $home('.index-title').first().nextUntil('.index-title, .box-header').find('.mh-item');
            const latestItems = this.parser.parseCardElements($home, latestEl.length > 0 ? latestEl : $home('.mh-item').slice(0, 15), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'latest',
                title: 'Mới Cập Nhật',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: latestItems,
            }));

            // 2. Manhwa / Hot section
            const hotHeader = $home('h2:contains("HOT"), h2:contains("Từ khóa HOT")').first().closest('.index-title, .box-header');
            const hotEl = hotHeader.nextUntil('.box-header, .index-title, footer').find('.mh-item');
            const hotItems = this.parser.parseCardElements($home, hotEl.length > 0 ? hotEl : $home('.mh-item').slice(15, 35), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'manhwa',
                title: 'Manhwa 18+',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: hotItems,
            }));

            // 3. Completed section
            const completedHeader = $home('h2:contains("Hoàn thành")').first().closest('.box-header, .index-title');
            const completedEl = completedHeader.nextUntil('.box-header, .index-title, footer').find('.mh-item');
            const completedItems = this.parser.parseCardElements($home, completedEl.length > 0 ? completedEl : $home('.mh-item').slice(35), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'completed',
                title: 'Truyện Hoàn Thành',
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
                items: completedItems,
            }));
        } catch (e) {
            console.error('[Tranh18 error loading homepage]:', e);
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
        const manga = this.parser.parseCards($, baseUrl, PROXY_URL);
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
        const manga = this.parser.parseCards($, baseUrl, PROXY_URL);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);

        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/comic/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl, PROXY_URL);
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
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl, PROXY_URL);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
