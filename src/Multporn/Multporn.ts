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
import { MultpornParser } from './MultpornParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './MultpornSetting';

export const MultpornInfo: SourceInfo = {
    version: '1.0.1',
    name: 'Multporn',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for Multporn (multporn.net) - Porn Comics, Hentai Manga & 3D',
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

export class Multporn extends Source {
    stateManager = App.createSourceStateManager();
    parser = new MultpornParser();

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
            header: 'Cài đặt nguồn Multporn',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/${mangaId.replace(/^\//, '')}`;
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
            { id: 'new_comics', title: 'Comics Mới Nhất', url: `${baseUrl}/new?type=1` },
            { id: 'hentai_manga', title: 'Hentai Manga Mới Nhất', url: `${baseUrl}/new?type=3&language=1` },
            { id: 'updated_comics', title: 'Comics Cập Nhật', url: `${baseUrl}/updated_comics` },
            { id: 'updated_manga', title: 'Manga Cập Nhật', url: `${baseUrl}/updated_manga` },
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
        const page: number = metadata?.page ?? 0; // Drupal uses 0-based paging in query
        const baseUrl = await this.getBaseUrl();
        let url = '';

        if (homepageSectionId === 'new_comics') {
            url = page === 0 ? `${baseUrl}/new?type=1` : `${baseUrl}/new?type=1&page=${page}`;
        } else if (homepageSectionId === 'hentai_manga') {
            url = page === 0 ? `${baseUrl}/new?type=3&language=1` : `${baseUrl}/new?type=3&language=1&page=${page}`;
        } else if (homepageSectionId === 'updated_comics') {
            url = page === 0 ? `${baseUrl}/updated_comics` : `${baseUrl}/updated_comics?page=${page}`;
        } else if (homepageSectionId === 'updated_manga') {
            url = page === 0 ? `${baseUrl}/updated_manga` : `${baseUrl}/updated_manga?page=${page}`;
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
        const page: number = metadata?.page ?? 0;
        const baseUrl = await this.getBaseUrl();

        let url = '';
        if (query.title && query.title.trim()) {
            const keyword = encodeURIComponent(query.title.trim());
            url = page === 0
                ? `${baseUrl}/search?search_api_views_fulltext=${keyword}`
                : `${baseUrl}/search?search_api_views_fulltext=${keyword}&page=${page}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            const cat = query.includedTags[0].id;
            url = page === 0 ? `${baseUrl}/${cat}` : `${baseUrl}/${cat}${cat.includes('?') ? '&' : '?'}page=${page}`;
        } else {
            url = page === 0 ? `${baseUrl}/new?type=1` : `${baseUrl}/new?type=1&page=${page}`;
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
        const { $ } = await this.DOMHTML(`${baseUrl}/${cleanId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = mangaId.replace(/^\//, '');
        const { $, raw } = await this.DOMHTML(`${baseUrl}/${cleanId}`);
        return this.parser.parseChapters($, mangaId, raw);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const { $, raw } = await this.DOMHTML(`${baseUrl}/${cleanId}`);

        let pages: string[] = [];
        const match = raw.match(/"configUrl":\s*"([^"]+)"/);
        if (match) {
            try {
                const configUrl = match[1].replace(/\\/g, '');
                const request = App.createRequest({
                    url: configUrl.startsWith('http') ? configUrl : `${baseUrl}${configUrl}`,
                    method: 'GET',
                });
                const response = await this.requestManager.schedule(request, 1);
                pages = this.parser.parseJuiceboxXml(response.data as string);
            } catch (e) {
                // fallback
            }
        }

        if (pages.length === 0) {
            pages = this.parser.parseFallbackPages($);
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
