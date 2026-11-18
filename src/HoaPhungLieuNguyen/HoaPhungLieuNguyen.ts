import {
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

import { Parser } from './HoaPhungLieuNguyenParser';
import { domainSettings, getDomain, resetSettings, DEFAULT_BASE_URL } from './HoaPhungLieuNguyenSetting';

export const HoaPhungLieuNguyenInfo: SourceInfo = {
    version: '1.0.0',
    name: 'HoaPhungLieuNguyen',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension đọc Hỏa Phụng Liêu Nguyên full HD, cập nhật liên tục từ hoaphunglieunguyen.com',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: 'https://hoaphunglieunguyen.com',
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
};

export class HoaPhungLieuNguyen extends Source {
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
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return `${DEFAULT_BASE_URL}/`;
        }
        return `${DEFAULT_BASE_URL}/tap/${mangaId}/`;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const baseUrl = await getDomain(this.stateManager);

        const sectionFull = App.createHomeSection({
            id: 'hpln_full',
            title: 'Hỏa Phụng Liêu Nguyên - Trọn Bộ',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
        });

        const sectionTaps = App.createHomeSection({
            id: 'hpln_taps',
            title: 'Danh Sách Theo Tập (Tập 1 - 82+)',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
        });

        sectionCallback(sectionFull);
        sectionCallback(sectionTaps);

        // Fetch tap taxonomy list from WordPress REST API
        try {
            const request = App.createRequest({
                url: `${baseUrl}/wp-json/wp/v2/tap?per_page=100`,
                method: 'GET',
            });
            const response = await this.requestManager.schedule(request, 1);
            const taps = JSON.parse(response.data as string);

            const allManga = this.parser.parseTapsList(taps, baseUrl);
            sectionFull.items = allManga.slice(0, 1);
            sectionTaps.items = allManga.slice(1);
        } catch (e) {
            // Fallback: at least show full entry
            sectionFull.items = [
                App.createPartialSourceManga({
                    mangaId: 'hoa-phung-lieu-nguyen-full',
                    title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
                    image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                    subtitle: 'Full 637+ Hồi',
                }),
            ];
        }

        sectionCallback(sectionFull);
        sectionCallback(sectionTaps);
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const baseUrl = await getDomain(this.stateManager);

        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return this.parser.parseMangaDetails(null, mangaId, baseUrl);
        }

        const url = `${baseUrl}/tap/${mangaId}/`;
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

        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            // Read from any chapter page dropdown which contains ALL 640+ chapters
            const request = App.createRequest({
                url: `${baseUrl}/tap/tap-1/hoi-1/`,
                method: 'GET',
            });
            const response = await this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data as string);
            return this.parser.parseChaptersFromHtml($, mangaId);
        }

        // Single tap page
        const url = `${baseUrl}/tap/${mangaId}/`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseChaptersFromHtml($, mangaId);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        let url = chapterId;
        if (!url.startsWith('http')) {
            const baseUrl = await getDomain(this.stateManager);
            url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        }

        const request = App.createRequest({
            url: url,
            method: 'GET',
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        return this.parser.parseChapterDetails($, chapterId);
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const baseUrl = await getDomain(this.stateManager);
        const title = (query.title || '').trim().toLowerCase();

        // Single manga source: match if searched query matches
        const matches = 'hỏa phụng liêu nguyên hoa phung lieu nguyen ravages of time'.includes(title) || title === '';

        const results = [];
        if (matches) {
            results.push(
                App.createPartialSourceManga({
                    mangaId: 'hoa-phung-lieu-nguyen-full',
                    title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
                    image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                    subtitle: 'Hơn 637+ Hồi Full',
                })
            );
        }

        return App.createPagedResults({
            results: results,
        });
    }
}
