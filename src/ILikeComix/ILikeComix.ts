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
    version: '1.0.0',
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
        return `${DEFAULT_BASE_URL}/c/${mangaId}/`;
    }

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/?m_orderby=latest` },
            { id: 'trending', title: 'Xem Nhiều (Trending)', url: `${baseUrl}/?m_orderby=trending` },
            { id: 'rating', title: 'Đánh Giá Cao', url: `${baseUrl}/?m_orderby=rating` },
            { id: '3d', title: '3D Comics', url: `${baseUrl}/manga-genre/3d-comics/` },
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
            url = page === 1 ? `${baseUrl}/?m_orderby=latest` : `${baseUrl}/page/${page}/?m_orderby=latest`;
        } else if (homepageSectionId === 'trending') {
            url = page === 1 ? `${baseUrl}/?m_orderby=trending` : `${baseUrl}/page/${page}/?m_orderby=trending`;
        } else if (homepageSectionId === 'rating') {
            url = page === 1 ? `${baseUrl}/?m_orderby=rating` : `${baseUrl}/page/${page}/?m_orderby=rating`;
        } else if (homepageSectionId === '3d') {
            url = page === 1 ? `${baseUrl}/manga-genre/3d-comics/` : `${baseUrl}/manga-genre/3d-comics/page/${page}/`;
        }

        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }

        const $ = await this.DOMHTML(url);
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
                ? `${baseUrl}/?s=${keyword}&post_type=wp-manga`
                : `${baseUrl}/page/${page}/?s=${keyword}&post_type=wp-manga`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            const genre = query.includedTags[0].id;
            url = page === 1
                ? `${baseUrl}/manga-genre/${genre}/`
                : `${baseUrl}/manga-genre/${genre}/page/${page}/`;
        } else {
            url = page === 1 ? `${baseUrl}/` : `${baseUrl}/page/${page}/`;
        }

        const $ = await this.DOMHTML(url);
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
        const $ = await this.DOMHTML(`${baseUrl}/c/${cleanId}/`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = mangaId.replace(/^\//, '');
        const $ = await this.DOMHTML(`${baseUrl}/c/${cleanId}/`);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const $ = await this.DOMHTML(`${baseUrl}/c/${cleanId}/`);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
