import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    HomeSection,
    SourceManga,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    ContentRating,
    HomeSectionType,
    SourceIntents,
    DUISection,
} from '@paperback/types';

import { Parser } from './VietManhwaParser';
import { domainSettings, getDomain, resetSettings, DEFAULT_BASE_URL } from './VietManhwaSetting';

export const VietManhwaInfo: SourceInfo = {
    version: '1.0.0',
    name: 'VietManhwa',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension đọc Manhwa 18+ Vietsub KHÔNG QUẢNG CÁO từ vietmanhwa.org',
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
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
};

export class VietManhwa extends Source {
    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 20000,
    });

    parser = new Parser();

    stateManager = App.createSourceStateManager();

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

    override getMangaShareUrl(mangaId: string): string {
        return `${DEFAULT_BASE_URL}/manhwa-18/${mangaId}`;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await getDomain(this.stateManager);

        const sections = [
            {
                id: 'vietmanhwa_popular',
                title: 'Truyện Nổi Bật',
                type: HomeSectionType.singleRowNormal,
                url: `${baseUrl}/`,
            },
            {
                id: 'vietmanhwa_latest',
                title: 'Danh Sách Mới Nhất',
                type: HomeSectionType.singleRowNormal,
                url: `${baseUrl}/danh-sach`,
            },
        ];

        for (const sec of sections) {
            const section = App.createHomeSection({
                id: sec.id,
                title: sec.title,
                containsMoreItems: true,
                type: sec.type,
            });
            sectionCallback(section);

            try {
                const request = App.createRequest({
                    url: sec.url,
                    method: 'GET',
                });
                const response = await this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data as string);
                section.items = this.parser.parseMangaList($, baseUrl);
            } catch (e) {
                // handle error
            }

            sectionCallback(section);
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const baseUrl = await getDomain(this.stateManager);
        const page: number = metadata?.page ?? 1;

        const url = `${baseUrl}/danh-sach?trang=${page}`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        const items = this.parser.parseMangaList($, baseUrl);

        return App.createPagedResults({
            results: items,
            metadata: items.length > 0 ? { page: page + 1 } : undefined,
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await getDomain(this.stateManager);
        const url = `${baseUrl}/manhwa-18/${mangaId}`;

        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const baseUrl = await getDomain(this.stateManager);
        const url = `${baseUrl}/manhwa-18/${mangaId}`;

        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseChapters($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const baseUrl = await getDomain(this.stateManager);
        const url = `${baseUrl}/manhwa-18/${mangaId}/${chapterId}`;

        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        return this.parser.parseChapterDetails(response.data as string, mangaId, chapterId);
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const baseUrl = await getDomain(this.stateManager);
        const page: number = metadata?.page ?? 1;
        const searchTitle = encodeURIComponent((query.title || '').trim());

        const url = `${baseUrl}/danh-sach?keyword=${searchTitle}&trang=${page}`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        const items = this.parser.parseMangaList($, baseUrl);

        return App.createPagedResults({
            results: items,
            metadata: items.length > 0 ? { page: page + 1 } : undefined,
        });
    }
}
