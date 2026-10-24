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
import { AllPornComicParser } from './AllPornComicParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './AllPornComicSetting';

export const AllPornComicInfo: SourceInfo = {
    version: '1.0.0',
    name: 'AllPornComic',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for AllPornComic (allporncomic.com) - Adult Comics, 3D, Hentai & Manhwa',
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

export class AllPornComic extends Source {
    stateManager = App.createSourceStateManager();
    parser = new AllPornComicParser();

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
            header: 'Cài đặt nguồn AllPornComic',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/porncomic/${mangaId}/`;
    }

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/porncomic/?m_orderby=latest` },
            { id: 'trending', title: 'Xem Nhiều (Trending)', url: `${baseUrl}/porncomic/?m_orderby=views` },
            { id: 'rating', title: 'Đánh Giá Cao', url: `${baseUrl}/porncomic/?m_orderby=rating` },
            { id: '3d', title: '3D Comics', url: `${baseUrl}/porncomic-category/3dd/` },
            { id: 'manhwa', title: 'Manhwa 18+', url: `${baseUrl}/porncomic-category/manhwad/` },
            { id: 'hentai', title: 'Hentai Manga', url: `${baseUrl}/porncomic-category/hentaib/` },
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
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=latest` : `${baseUrl}/porncomic/page/${page}/?m_orderby=latest`;
        } else if (homepageSectionId === 'trending') {
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=views` : `${baseUrl}/porncomic/page/${page}/?m_orderby=views`;
        } else if (homepageSectionId === 'rating') {
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=rating` : `${baseUrl}/porncomic/page/${page}/?m_orderby=rating`;
        } else if (homepageSectionId === '3d') {
            url = page === 1 ? `${baseUrl}/porncomic-category/3dd/` : `${baseUrl}/porncomic-category/3dd/page/${page}/`;
        } else if (homepageSectionId === 'manhwa') {
            url = page === 1 ? `${baseUrl}/porncomic-category/manhwad/` : `${baseUrl}/porncomic-category/manhwad/page/${page}/`;
        } else if (homepageSectionId === 'hentai') {
            url = page === 1 ? `${baseUrl}/porncomic-category/hentaib/` : `${baseUrl}/porncomic-category/hentaib/page/${page}/`;
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
                ? `${baseUrl}/porncomic-category/${searchTag.id}/`
                : `${baseUrl}/porncomic-category/${searchTag.id}/page/${page}/`;
        } else {
            url = page === 1
                ? `${baseUrl}/porncomic/?m_orderby=latest`
                : `${baseUrl}/porncomic/page/${page}/?m_orderby=latest`;
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
        const url = `${baseUrl}/porncomic/${mangaId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/porncomic/${mangaId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/porncomic/${mangaId}/${chapterId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }
}
