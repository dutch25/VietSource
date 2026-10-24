import {
    BadgeColor,
    Chapter,
    ChapterDetails,
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
import { EightMusesParser } from './EightMusesParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './EightMusesSetting';

export const EightMusesInfo: SourceInfo = {
    version: '1.0.0',
    name: 'EightMuses',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for 8muses (8muses.io) - Free Sex Comics, 3D Porn & Adult Cartoons',
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
        SourceIntents.SETTINGS_UI,
};

export class EightMuses extends Source {
    stateManager = App.createSourceStateManager();
    parser = new EightMusesParser();

    private async getBaseUrl(): Promise<string> {
        return await getDomain(this.stateManager);
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 25000,
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
            header: 'Cài đặt nguồn EightMuses',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/g/${mangaId}`;
    }

    private async DOMHTML(url: string): Promise<{ $: CheerioAPI; raw: string }> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        const raw = response.data as string;
        return { $: this.cheerio.load(raw), raw };
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'new', title: 'Mới Nhất (New)', url: `${baseUrl}/new` },
            { id: 'browse', title: 'Tất Cả (Browse All)', url: `${baseUrl}/browse` },
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
            try {
                const { $ } = await this.DOMHTML(item.url);
                const manga = this.parser.parseCards($, baseUrl);
                sectionCallback(App.createHomeSection({
                    id: item.id,
                    title: item.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            } catch (e) {
                sectionCallback(App.createHomeSection({
                    id: item.id,
                    title: item.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: [],
                }));
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';

        if (homepageSectionId === 'new') {
            url = page === 1 ? `${baseUrl}/new` : `${baseUrl}/new/page/${page}`;
        } else if (homepageSectionId === 'browse') {
            url = page === 1 ? `${baseUrl}/browse` : `${baseUrl}/browse/page/${page}`;
        }

        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }

        const { $ } = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLast = manga.length === 0 || this.parser.isLastPage($);

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
            const keyword = encodeURIComponent(query.title.trim());
            url = page === 1
                ? `${baseUrl}/search?q=${keyword}`
                : `${baseUrl}/search/page/${page}?q=${keyword}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            const genre = query.includedTags[0].id;
            url = page === 1 ? `${baseUrl}/${genre}` : `${baseUrl}/${genre}/page/${page}`;
        } else {
            url = page === 1 ? `${baseUrl}/browse` : `${baseUrl}/browse/page/${page}`;
        }

        const { $ } = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLast = manga.length === 0 || this.parser.isLastPage($);

        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = mangaId.replace(/^\//, '');
        const { $ } = await this.DOMHTML(`${baseUrl}/g/${cleanId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = mangaId.replace(/^\//, '');
        const { $ } = await this.DOMHTML(`${baseUrl}/g/${cleanId}`);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const { $, raw } = await this.DOMHTML(`${baseUrl}/g/${cleanId}`);
        return this.parser.parseChapterDetails(mangaId, chapterId, raw, baseUrl);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
