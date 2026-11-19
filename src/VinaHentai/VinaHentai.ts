import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    DUISection,
    HomeSection,
    HomeSectionType,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
    PartialSourceManga,
} from '@paperback/types';

import { Parser } from './VinaHentaiParser';
import {
    DEFAULT_BASE_URL,
    domainSettings,
    getDomain,
    resetSettings,
} from './VinaHentaiSetting';

function safeEncodeUrl(url: string): string {
    if (/[^\x00-\x7F]/.test(url)) {
        return encodeURI(url);
    }
    return url;
}

export const VinaHentaiInfo: SourceInfo = {
    version: '1.1.28',
    name: 'VinaHentai',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for VinaHentai',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DEFAULT_BASE_URL,
    sourceTags: [
        { text: 'Adult', type: BadgeColor.RED },
        { text: '18+', type: BadgeColor.YELLOW },
    ],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS |
        SourceIntents.SETTINGS_UI |
        SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};

export class VinaHentai extends Source {
    private readonly parser = new Parser();
    stateManager = App.createSourceStateManager();

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 30000,
        interceptor: {
            interceptRequest: async (request) => {
                const baseUrl = await getDomain(this.stateManager);
                request.url = safeEncodeUrl(request.url);
                request.headers = {
                    ...(request.headers ?? {}),
                    'referer': `${baseUrl}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent(),
                };
                return request;
            },
            interceptResponse: async (response) => response,
        },
    });

    override async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn',
            isHidden: false,
            rows: async () => [
                domainSettings(this.stateManager),
                resetSettings(this.stateManager),
            ],
        });
    }

    async getCloudflareBypassRequestAsync(): Promise<any> {
        const baseUrl = await getDomain(this.stateManager);
        return App.createRequest({
            url: baseUrl,
            method: 'GET',
            headers: {
                'referer': `${baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            },
        });
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await getDomain(this.stateManager);
        const sections = [
            { id: 'hot', title: 'Truyện HOT', url: `${baseUrl}` },
            { id: 'latest', title: 'Truyện Hentai Mới', url: `${baseUrl}` },
            { id: 'week', title: 'Top Tuần', url: `${baseUrl}/bang-xep-hang/truyen?period=weekly` },
            { id: 'month', title: 'Top Tháng', url: `${baseUrl}/bang-xep-hang/truyen?period=monthly` },
            { id: 'private', title: 'Bộ Sưu Tập Riêng', url: `${baseUrl}/tim-kiem/nang-cao?apply=1&excludeGenres=yaoi,trap,futanari,furry&includeGenres=anal,khong-che&page=1` },
            { id: 'private2', title: 'Bộ Sưu Tập Riêng 2', url: `${baseUrl}/tim-kiem/nang-cao?apply=1&excludeGenres=yaoi,trap,futanari,furry&includeGenres=anal,khong-che&page=1&sort=viewNumber` },
            { id: 'private3', title: 'Bộ Sưu Tập Riêng 3', url: `${baseUrl}/tim-kiem/nang-cao?apply=1&excludeGenres=yaoi,trap,futanari,furry&includeGenres=anal,khong-che&page=1&sort=likeNumber` },
        ];

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }));
        }

        for (const section of sections) {
            try {
                let manga: PartialSourceManga[] = [];
                const response = await this.requestManager.schedule(
                    App.createRequest({ url: section.url, method: 'GET' }), 1
                );
                if (response.status === 200) {
                    const $ = this.cheerio.load(response.data as string);
                    if (section.id === 'hot') {
                        manga = this.parser.parseSection($, 'hot');
                    } else if (section.id === 'latest') {
                        manga = this.parser.parseSection($, 'mới');
                    } else {
                        manga = this.parser.parseHomePage($);
                    }
                }

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            } catch (e) {
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: [],
                }));
            }
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const baseUrl = await getDomain(this.stateManager);
        const page = metadata?.page ?? 1;
        let url = `${baseUrl}/danh-sach?page=${page}`;

        if (homepageSectionId === 'private' || homepageSectionId === 'private2' || homepageSectionId === 'private3') {
            const sortParam = homepageSectionId === 'private2' ? '&sort=viewNumber' : homepageSectionId === 'private3' ? '&sort=likeNumber' : '';
            url = `${baseUrl}/tim-kiem/nang-cao?apply=1&excludeGenres=yaoi,trap,futanari,furry&includeGenres=anal,khong-che&page=${page}${sortParam}`;
        } else if (homepageSectionId === 'week') {
            url = `${baseUrl}/bang-xep-hang/truyen?period=weekly&page=${page}`;
        } else if (homepageSectionId === 'month') {
            url = `${baseUrl}/bang-xep-hang/truyen?period=monthly&page=${page}`;
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 1
        );
        const $ = this.cheerio.load(response.data as string);
        const manga = this.parser.parseHomePage($);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);

        return App.createPagedResults({ results: manga, metadata: isLast ? undefined : { page: page + 1 } });
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const baseUrl = await getDomain(this.stateManager);
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url: string;

        if (selectedTag) {
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '');
                url = `${baseUrl}/tac-gia/${authorId}?page=${page}`;
            } else {
                url = `${baseUrl}/the-loai/${selectedTag.id}?page=${page}`;
            }
        } else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${baseUrl}/tim-kiem?q=${searchQuery}&page=${page}`;
        }

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        );
        const $ = this.cheerio.load(response.data as string);
        const manga = this.parser.parseHomePage($);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);
        return App.createPagedResults({ results: manga, metadata: isLast ? undefined : { page: page + 1 } });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await getDomain(this.stateManager);
        const response = await this.requestManager.schedule(
            App.createRequest({ url: safeEncodeUrl(`${baseUrl}/truyen-hentai/${mangaId}`), method: 'GET' }), 0
        );
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await getDomain(this.stateManager);
        const response = await this.requestManager.schedule(
            App.createRequest({ url: safeEncodeUrl(`${baseUrl}/truyen-hentai/${mangaId}`), method: 'GET' }), 0
        );
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await getDomain(this.stateManager);
        const response = await this.requestManager.schedule(
            App.createRequest({ url: safeEncodeUrl(`${baseUrl}/truyen-hentai/${mangaId}/${chapterId}`), method: 'GET' }), 0
        );
        const $ = this.cheerio.load(response.data as string);
        const pages = this.parser.parseChapterPages($);

        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }

        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }

    override getMangaShareUrl(mangaId: string): string {
        return safeEncodeUrl(`${DEFAULT_BASE_URL}/truyen-hentai/${mangaId}`);
    }

    async getSearchTags(): Promise<TagSection[]> {
        return this.parser.getSearchTags();
    }
}
