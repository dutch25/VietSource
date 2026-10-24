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
    version: '1.0.1',
    name: 'EightMuses',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for EightMuses (8muses.io) - Free Adult Comics, 3D Cartoons & Manga',
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

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'popular', title: 'Xem Nhiều (Popular)', url: `${baseUrl}/popular` },
            { id: 'new', title: 'Mới Nhất (New Uploads)', url: `${baseUrl}/new` },
            { id: 'uncensored', title: 'Uncensored Manga', url: `${baseUrl}/tag/uncensored` },
            { id: 'hentai_en', title: 'Hentai & Manga English', url: `${baseUrl}/collection/hentai-and-manga-english-42635` },
            { id: 'fakku', title: 'Fakku Comics', url: `${baseUrl}/collection/fakku-comics-32996` },
            { id: 'anal', title: 'Top Anal', url: `${baseUrl}/search?tag=anal&sort=popular` },
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
                const $ = await this.DOMHTML(item.url);
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

        if (homepageSectionId === 'popular') {
            url = page === 1 ? `${baseUrl}/popular` : `${baseUrl}/popular/page/${page}`;
        } else if (homepageSectionId === 'new') {
            url = page === 1 ? `${baseUrl}/new` : `${baseUrl}/new/page/${page}`;
        } else if (homepageSectionId === 'uncensored') {
            url = page === 1 ? `${baseUrl}/tag/uncensored` : `${baseUrl}/tag/uncensored/page/${page}`;
        } else if (homepageSectionId === 'hentai_en') {
            url = page === 1 ? `${baseUrl}/collection/hentai-and-manga-english-42635` : `${baseUrl}/collection/hentai-and-manga-english-42635/page/${page}`;
        } else if (homepageSectionId === 'fakku') {
            url = page === 1 ? `${baseUrl}/collection/fakku-comics-32996` : `${baseUrl}/collection/fakku-comics-32996/page/${page}`;
        } else if (homepageSectionId === 'anal') {
            url = page === 1 ? `${baseUrl}/search?tag=anal&sort=popular` : `${baseUrl}/search/page/${page}?tag=anal&sort=popular`;
        }

        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLastPage = this.parser.isLastPage($);

        return App.createPagedResults({
            results: manga,
            metadata: isLastPage ? undefined : { page: page + 1 },
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';

        const searchTag = query.includedTags?.find(tag => tag.id);

        if (query.title) {
            const cleanTitle = encodeURIComponent(query.title.trim());
            url = page === 1
                ? `${baseUrl}/search?q=${cleanTitle}`
                : `${baseUrl}/search/page/${page}?q=${cleanTitle}`;
        } else if (searchTag) {
            if (searchTag.id.startsWith('collection/')) {
                url = page === 1
                    ? `${baseUrl}/${searchTag.id}`
                    : `${baseUrl}/${searchTag.id}/page/${page}`;
            } else {
                url = page === 1
                    ? `${baseUrl}/tag/${searchTag.id}`
                    : `${baseUrl}/tag/${searchTag.id}/page/${page}`;
            }
        } else {
            url = page === 1 ? `${baseUrl}/popular` : `${baseUrl}/popular/page/${page}`;
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLastPage = this.parser.isLastPage($);

        return App.createPagedResults({
            results: manga,
            metadata: isLastPage ? undefined : { page: page + 1 },
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        const rawHtml = response.data as string;
        return this.parser.parseChapterDetails(mangaId, chapterId, rawHtml, baseUrl);
    }
}
