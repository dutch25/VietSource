import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ChapterProviding,
    ContentRating,
    DUISection,
    HomeSection,
    HomeSectionType,
    HomePageSectionsProviding,
    MangaProviding,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types';

import type { CheerioAPI } from 'cheerio';
import { Parser } from './TruyenGGParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './TruyenGGSetting';

export const TruyenGGInfo: SourceInfo = {
    version: '1.0.0',
    name: 'TruyenGG',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension that pulls manga from TruyenGG (truyenggvn.com)',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Recommended',
            type: BadgeColor.BLUE,
        },
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.SETTINGS_UI |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};

export class TruyenGG extends Source {

    stateManager = App.createSourceStateManager();
    parser = new Parser();

    private async getBaseUrl(): Promise<string> {
        return await getDomain(this.stateManager);
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 20000,
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
            header: 'Source Settings',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/truyen-tranh/${mangaId}`;
    }

    private CloudFlareError(status: number): void {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to home page ${TruyenGGInfo.name} source and press the cloud icon.`);
        }
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        const baseUrl = await this.getBaseUrl();
        return App.createRequest({
            url: baseUrl,
            method: 'GET',
            headers: {
                'referer': `${baseUrl}/`,
                'origin': `${baseUrl}/`,
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
            { id: 'hot', title: 'Truyện HOT', url: `${baseUrl}/truyen-yeu-thich.html` },
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/truyen-moi-cap-nhat.html` },
            { id: 'top_manhwa', title: 'Top Manhwa', url: `${baseUrl}/the-loai/manhwa-49.html?sort=4` },
            { id: 'top_manhua', title: 'Top Manhua', url: `${baseUrl}/the-loai/manhua-35.html?sort=4` },
            { id: 'top_manga', title: 'Top Manga', url: `${baseUrl}/the-loai/manga-469.html?sort=4` },
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
                const manga = this.parser.parseCards($);
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

        if (homepageSectionId === 'hot') {
            url = page === 1
                ? `${baseUrl}/truyen-yeu-thich.html`
                : `${baseUrl}/truyen-yeu-thich/trang-${page}.html`;
        } else if (homepageSectionId === 'latest') {
            url = page === 1
                ? `${baseUrl}/truyen-moi-cap-nhat.html`
                : `${baseUrl}/truyen-moi-cap-nhat/trang-${page}.html`;
        } else if (homepageSectionId === 'top_manhwa') {
            url = page === 1
                ? `${baseUrl}/the-loai/manhwa-49.html?sort=4`
                : `${baseUrl}/the-loai/manhwa-49/trang-${page}.html?sort=4`;
        } else if (homepageSectionId === 'top_manhua') {
            url = page === 1
                ? `${baseUrl}/the-loai/manhua-35.html?sort=4`
                : `${baseUrl}/the-loai/manhua-35/trang-${page}.html?sort=4`;
        } else if (homepageSectionId === 'top_manga') {
            url = page === 1
                ? `${baseUrl}/the-loai/manga-469.html?sort=4`
                : `${baseUrl}/the-loai/manga-469/trang-${page}.html?sort=4`;
        }

        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);

        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();

        if (query.title) {
            const postBody = `search=${encodeURIComponent(query.title)}`;
            const request = App.createRequest({
                url: `${baseUrl}/frontend/search/search`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                data: postBody,
            });
            const response = await this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data as string);
            const manga = this.parser.parseSearchAjax($);
            return App.createPagedResults({ results: manga, metadata: undefined });
        }

        const selectedTag = query.includedTags?.[0];
        if (selectedTag) {
            const url = page === 1
                ? `${baseUrl}/the-loai/${selectedTag.id}.html`
                : `${baseUrl}/the-loai/${selectedTag.id}/trang-${page}.html`;

            const $ = await this.DOMHTML(url);
            const manga = this.parser.parseCards($);
            const isLast = manga.length === 0 || this.parser.isLastPage($, page);
            return App.createPagedResults({
                results: manga,
                metadata: isLast ? undefined : { page: page + 1 },
            });
        }

        return App.createPagedResults({ results: [], metadata: undefined });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/truyen-tranh/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/truyen-tranh/${mangaId}`);
        return this.parser.parseChapterList($);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/truyen-tranh/${chapterId}`);
        const pages = this.parser.parseChapterDetails($);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(baseUrl);
        return this.parser.parseTags($);
    }
}
