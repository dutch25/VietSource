import { CheerioAPI } from 'cheerio';
import {
    TagSection,
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding,
    CloudflareBypassRequestProviding,
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
    DUISection,
} from '@paperback/types';

import { Parser } from './ZetTruyenParser';
import {
    DEFAULT_BASE_URL,
    getDomain,
    domainSettings,
    resetSettings,
} from './ZetTruyenSetting';

export const isLastPage = ($: CheerioAPI, currentPage: number): boolean => {
    const hasNext = $(`a[href*="page=${currentPage + 1}"]`).length > 0 || $('a[rel="next"]').length > 0;
    return !hasNext;
};

export const ZetTruyenInfo: SourceInfo = {
    version: '1.0.2',
    name: 'ZetTruyen',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/dutch25',
    description: 'Extension đọc truyện tranh Manhwa online từ ZetTruyen.',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Vietnamese',
            type: BadgeColor.BLUE
        },
        {
            text: 'Manhwa',
            type: BadgeColor.GREEN
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};

export class ZetTruyen implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding, CloudflareBypassRequestProviding {

    constructor(private cheerio: CheerioAPI) { }

    stateManager = App.createSourceStateManager();
    private currentBaseUrl = DEFAULT_BASE_URL;

    private async getBaseUrl(): Promise<string> {
        this.currentBaseUrl = await getDomain(this.stateManager);
        return this.currentBaseUrl.replace(/\/+$/, '');
    }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                const domain = await this.getBaseUrl();
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': `${domain}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            }
        }
    });

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        const domain = await this.getBaseUrl();
        return App.createRequest({
            url: domain,
            method: 'GET',
        });
    }

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn ZetTruyen',
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
            isHidden: false,
        });
    }

    getMangaShareUrl(mangaId: string): string {
        return `${this.currentBaseUrl.replace(/\/+$/, '')}/truyen-tranh/${mangaId}`;
    }

    parser = new Parser();

    private async DOMHTML(url: string): Promise<CheerioAPI> {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/truyen-tranh/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const domain = await this.getBaseUrl();
        const firstRequest = App.createRequest({
            url: `${domain}/api/comics/${mangaId}/chapters?page=1&per_page=100`,
            method: 'GET',
        });
        const firstResponse = await this.requestManager.schedule(firstRequest, 1);
        const firstData = typeof firstResponse.data === 'string' ? JSON.parse(firstResponse.data) : firstResponse.data;

        const allRawChapters: any[] = [...(firstData?.data?.chapters || [])];
        const lastPage = firstData?.data?.last_page || 1;

        if (lastPage > 1) {
            const pageRequests = [];
            for (let p = 2; p <= lastPage; p++) {
                const req = App.createRequest({
                    url: `${domain}/api/comics/${mangaId}/chapters?page=${p}&per_page=100`,
                    method: 'GET',
                });
                pageRequests.push(
                    this.requestManager.schedule(req, 1).then(res => {
                        const d = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                        return d?.data?.chapters || [];
                    }).catch(err => {
                        console.error(`Error fetching chapters page ${p} for ${mangaId}:`, err);
                        return [];
                    })
                );
            }

            const remainingResults = await Promise.all(pageRequests);
            for (const chList of remainingResults) {
                allRawChapters.push(...chList);
            }
        }

        return this.parser.parseChapterList(allRawChapters, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/truyen-tranh/${mangaId}/${chapterId}`);
        const pages = this.parser.parseChapterDetails($);
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const domain = await this.getBaseUrl();

        let url = `${domain}/tim-kiem-nang-cao?page=${page}`;
        if (query.title) {
            url = `${domain}/tim-kiem-nang-cao?q=${encodeURIComponent(query.title)}&page=${page}`;
        } else if (query.includedTags && query.includedTags.length > 0) {
            url = `${domain}/the-loai/${query.includedTags[0].id}?page=${page}`;
        }

        const $ = await this.DOMHTML(url);
        const tiles = this.parser.parseMangaList($, domain);
        const hasNext = !isLastPage($, page) && tiles.length > 0;

        return App.createPagedResults({
            results: tiles,
            metadata: hasNext ? { page: page + 1 } : undefined,
        });
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'featured', title: 'Truyện Đề Cử', containsMoreItems: false, type: HomeSectionType.featured }),
            App.createHomeSection({ id: 'trending', title: 'Đang Thịnh Hành', containsMoreItems: false, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_updated', title: 'Mới Cập Nhật', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'popular', title: 'Truyện Phổ Biến', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'manhwa', title: 'Manhwa Tuyển Chọn', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'chuyen_sinh', title: 'Chuyển Sinh - Xuyên Không', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'action', title: 'Hành Động - Kịch Tính', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'romance', title: 'Ngôn Tình - Lãng Mạn', containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];

        for (const section of sections) {
            sectionCallback(section);
        }

        const domain = await this.getBaseUrl();

        try {
            // 1. Fetch homepage once for featured, trending, new_updated, popular
            const $home = await this.DOMHTML(domain);

            const featuredSec = sections.find(s => s.id === 'featured');
            if (featuredSec) {
                featuredSec.items = this.parser.parseFeaturedSection($home, domain);
                sectionCallback(featuredSec);
            }

            const trendingSec = sections.find(s => s.id === 'trending');
            if (trendingSec) {
                trendingSec.items = this.parser.parseSectionByHeading($home, 'THỊNH HÀNH', domain);
                sectionCallback(trendingSec);
            }

            const newUpdatedSec = sections.find(s => s.id === 'new_updated');
            if (newUpdatedSec) {
                newUpdatedSec.items = this.parser.parseSectionByHeading($home, 'MỚI CẬP NHẬT', domain);
                sectionCallback(newUpdatedSec);
            }

            const popularSec = sections.find(s => s.id === 'popular');
            if (popularSec) {
                popularSec.items = this.parser.parseSectionByHeading($home, 'PHỔ BIẾN', domain);
                sectionCallback(popularSec);
            }
        } catch (e) {
            console.error('Error fetching ZetTruyen homepage:', e);
        }

        // 2. Fetch category sections
        const categoryMap: { [id: string]: string } = {
            'manhwa': `${domain}/the-loai/manhwa`,
            'chuyen_sinh': `${domain}/the-loai/chuyen-sinh`,
            'action': `${domain}/the-loai/action`,
            'romance': `${domain}/the-loai/ngon-tinh`,
        };

        for (const [id, url] of Object.entries(categoryMap)) {
            const sec = sections.find(s => s.id === id);
            if (sec) {
                try {
                    const $cat = await this.DOMHTML(url);
                    sec.items = this.parser.parseMangaList($cat, domain);
                    sectionCallback(sec);
                } catch (e) {
                    console.error(`Error loading section ${id}:`, e);
                }
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1;
        const domain = await this.getBaseUrl();
        let url = '';

        switch (homepageSectionId) {
            case 'new_updated':
            case 'popular':
                url = `${domain}/tim-kiem-nang-cao?page=${page}`;
                break;
            case 'manhwa':
                url = `${domain}/the-loai/manhwa?page=${page}`;
                break;
            case 'chuyen_sinh':
                url = `${domain}/the-loai/chuyen-sinh?page=${page}`;
                break;
            case 'action':
                url = `${domain}/the-loai/action?page=${page}`;
                break;
            case 'romance':
                url = `${domain}/the-loai/ngon-tinh?page=${page}`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }

        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseMangaList($, domain);
        const hasNext = !isLastPage($, page) && manga.length > 0;

        return App.createPagedResults({
            results: manga,
            metadata: hasNext ? { page: page + 1 } : undefined,
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const domain = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${domain}/tim-kiem-nang-cao`);
        return this.parser.parseTags($);
    }
}
