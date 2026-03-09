"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamCoNuong = exports.DamCoNuongInfo = void 0;
const types_1 = require("@paperback/types");
const DamCoNuongParser_1 = require("./DamCoNuongParser");
const BASE_URL = 'https://damconuong.city';
exports.DamCoNuongInfo = {
    version: '1.0.6',
    name: 'DamCoNuong',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for damconuong.city',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: 'Adult', type: types_1.BadgeColor.RED },
        { text: '18+', type: types_1.BadgeColor.YELLOW },
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS |
        types_1.SourceIntents.HOMEPAGE_SECTIONS |
        types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};
class DamCoNuong extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new DamCoNuongParser_1.Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': BASE_URL,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    };
                    return request;
                },
                interceptResponse: async (response) => response,
            }
        });
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({ url: BASE_URL, method: 'GET' });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/tim-kiem?sort=-updated_at` },
            { id: 'day', title: 'Top Ngày', url: `${BASE_URL}/tim-kiem?sort=-views_day` },
            { id: 'week', title: 'Top Tuần', url: `${BASE_URL}/tim-kiem?sort=-views_week` },
            { id: 'month', title: 'Top Tháng', url: `${BASE_URL}/tim-kiem?sort=-views` },
        ];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
        }
        for (const section of sections) {
            try {
                const response = await this.requestManager.schedule(App.createRequest({ url: section.url, method: 'GET' }), 0);
                if (response.status === 403 || response.status === 503)
                    continue;
                const $ = this.cheerio.load(response.data);
                const manga = this.parser.parseHomePage($);
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            }
            catch (e) {
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const urlMap = {
            'latest': `${BASE_URL}/tim-kiem?sort=-updated_at&page=${page}`,
            'day': `${BASE_URL}/tim-kiem?sort=-views_day&page=${page}`,
            'week': `${BASE_URL}/tim-kiem?sort=-views_week&page=${page}`,
            'month': `${BASE_URL}/tim-kiem?sort=-views&page=${page}`,
        };
        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/the-loai/${homepageSectionId}?page=${page}`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($);
        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url;
        if (selectedTag) {
            url = `${BASE_URL}/the-loai/${selectedTag.id}?page=${page}`;
        }
        else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/tim-kiem?q=${searchQuery}&page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapters($);
    }
    async getChapterDetails(mangaId, chapterId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}/chapter-${chapterId}`, method: 'GET' }), 1);
        const html = response.data;
        const $ = this.cheerio.load(html);
        const pages = this.parser.parseChapterPages($);
        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen/${mangaId}`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.DamCoNuong = DamCoNuong;
