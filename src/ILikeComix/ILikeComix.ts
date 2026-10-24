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
import { ILikeComixParser } from './ILikeComixParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './ILikeComixSetting';

export const ILikeComixInfo: SourceInfo = {
    version: '1.0.1',
    name: 'ILikeComix',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for ILikeComix (ilikecomix.com) - Western Porn Comics & 3D Comics',
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

export class ILikeComix extends Source {
    stateManager = App.createSourceStateManager();
    parser = new ILikeComixParser();

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
            header: 'Cài đặt nguồn ILikeComix',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        if (mangaId.includes('/')) {
            return `https://ilikecomix.com/${mangaId}/`;
        }
        return `${DEFAULT_BASE_URL}/c/${mangaId}/`;
    }

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    private getComicUrl(mangaId: string, baseUrl: string): string {
        if (mangaId.includes('/')) {
            return `https://ilikecomix.com/${mangaId.replace(/^\//, '')}/`;
        }
        return `${baseUrl}/c/${mangaId}/`;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/` },
            { id: '3d', title: '3D Comics', url: 'https://ilikecomix.com/c-book/3d-cgi-comics/' },
            { id: 'hentai', title: 'Hentai Comics', url: 'https://ilikecomix.com/c-book/simply-nhentai/' },
            { id: 'interracial', title: 'Interracial', url: 'https://ilikecomix.com/c-book/fakku-interracial/' },
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

        if (homepageSectionId === 'latest') {
            url = page === 1 ? `${baseUrl}/` : `${baseUrl}/page/${page}/`;
        } else if (homepageSectionId === '3d') {
            url = page === 1 ? 'https://ilikecomix.com/c-book/3d-cgi-comics/' : `https://ilikecomix.com/c-book/3d-cgi-comics/page/${page}/`;
        } else if (homepageSectionId === 'hentai') {
            url = page === 1 ? 'https://ilikecomix.com/c-book/simply-nhentai/' : `https://ilikecomix.com/c-book/simply-nhentai/page/${page}/`;
        } else if (homepageSectionId === 'interracial') {
            url = page === 1 ? 'https://ilikecomix.com/c-book/fakku-interracial/' : `https://ilikecomix.com/c-book/fakku-interracial/page/${page}/`;
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
                ? `${baseUrl}/?s=${cleanTitle}&post_type=wp-manga`
                : `${baseUrl}/page/${page}/?s=${cleanTitle}&post_type=wp-manga`;
        } else if (searchTag) {
            url = page === 1
                ? `https://ilikecomix.com/c-book/${searchTag.id}/`
                : `https://ilikecomix.com/c-book/${searchTag.id}/page/${page}/`;
        } else {
            url = page === 1 ? `${baseUrl}/` : `${baseUrl}/page/${page}/`;
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
        const url = this.getComicUrl(mangaId, baseUrl);
        const $ = await this.DOMHTML(url);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const url = this.getComicUrl(mangaId, baseUrl);
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        let url: string;
        if (chapterId.includes('/')) {
            url = `https://ilikecomix.com/${chapterId.replace(/^\//, '')}/`;
        } else if (chapterId.startsWith('issue-') || chapterId.startsWith('part-') || chapterId.startsWith('chapter-')) {
            url = `${baseUrl}/c/${mangaId}/${chapterId}/`;
        } else {
            url = this.getComicUrl(mangaId, baseUrl);
        }

        const $ = await this.DOMHTML(url);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }
}
