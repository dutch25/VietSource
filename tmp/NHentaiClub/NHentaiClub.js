"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NHentaiClub = exports.NHentaiClubInfo = void 0;
const types_1 = require("@paperback/types");
const NHentaiClubParser_1 = require("./NHentaiClubParser");
const BASE_URL = 'https://nhentaiclub.site';
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev';
exports.NHentaiClubInfo = {
    version: '1.1.72',
    name: 'NHentaiClub',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for nhentaiclub.site',
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
class NHentaiClub extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new NHentaiClubParser_1.Parser();
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
        const rankingSections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/` },
            { id: 'all-time', title: 'Xếp Hạng Tất Cả', url: `${BASE_URL}/ranking/all-time` },
            { id: 'day', title: 'Xếp Hạng Ngày', url: `${BASE_URL}/ranking/day` },
            { id: 'week', title: 'Xếp Hạng Tuần', url: `${BASE_URL}/ranking/week` },
            { id: 'month', title: 'Xếp Hạng Tháng', url: `${BASE_URL}/ranking/month` },
        ];
        const genreSections = [
            { id: 'ahegao', title: 'Ahegao Most Views', url: `${BASE_URL}/genre/ahegao?sort=view` },
            { id: 'anal', title: 'Anal Most Views', url: `${BASE_URL}/genre/anal?sort=view` },
            { id: 'armpit-licking', title: 'Armpit Licking Most Views', url: `${BASE_URL}/genre/armpit-licking?sort=view` },
            { id: 'bdsm', title: 'BDSM Most Views', url: `${BASE_URL}/genre/bdsm?sort=view` },
            { id: 'big-boobs', title: 'Big Boobs Most Views', url: `${BASE_URL}/genre/big-boobs?sort=view` },
            { id: 'blowjobs', title: 'Blowjobs Most Views', url: `${BASE_URL}/genre/blowjobs?sort=view` },
            { id: 'cosplay', title: 'Cosplay Most Views', url: `${BASE_URL}/genre/cosplay?sort=view` },
            { id: 'milf', title: 'MILF Most Views', url: `${BASE_URL}/genre/milf?sort=view` },
            { id: 'netorare', title: 'NTR Most Views', url: `${BASE_URL}/genre/netorare?sort=view` },
            { id: 'rape', title: 'Rape Most Views', url: `${BASE_URL}/genre/rape?sort=view` },
            { id: 'yuri', title: 'Yuri Most Views', url: `${BASE_URL}/genre/yuri?sort=view` },
        ];
        const sections = [...rankingSections, ...genreSections];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
        }
        // Fetch each section and populate
        for (const section of sections) {
            try {
                const response = await this.requestManager.schedule(App.createRequest({ url: section.url, method: 'GET' }), 0);
                if (response.status === 403 || response.status === 503)
                    continue;
                const $ = this.cheerio.load(response.data);
                const manga = this.parser.parseHomePage($, PROXY_URL);
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            }
            catch (e) {
                // Skip failed sections silently
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const urlMap = {
            'latest': `${BASE_URL}/?page=${page}`,
            'all-time': `${BASE_URL}/ranking/all-time?page=${page}`,
            'day': `${BASE_URL}/ranking/day?page=${page}`,
            'week': `${BASE_URL}/ranking/week?page=${page}`,
            'month': `${BASE_URL}/ranking/month?page=${page}`,
        };
        const genreSectionIds = ['ahegao', 'anal', 'armpit-licking', 'bdsm', 'big-boobs', 'blowjobs', 'cosplay', 'milf', 'netorare', 'rape', 'yuri'];
        let url;
        if (urlMap[homepageSectionId]) {
            url = urlMap[homepageSectionId];
        }
        else if (genreSectionIds.includes(homepageSectionId)) {
            url = `${BASE_URL}/genre/${homepageSectionId}?sort=view&page=${page}`;
        }
        else {
            url = `${BASE_URL}/genre/${homepageSectionId}?page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($, PROXY_URL);
        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url;
        if (selectedTag) {
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '').replace(/ /g, '+');
                url = `${BASE_URL}/author/${authorId}?page=${page}`;
            }
            else {
                url = `${BASE_URL}/genre/${selectedTag.id}?page=${page}`;
            }
        }
        else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/?keyword=${searchQuery}&page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return App.createPagedResults({ results: this.parser.parseHomePage($, PROXY_URL), metadata: { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL);
    }
    async getChapters(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 0);
        return this.parser.parseChapters(response.data);
    }
    async getChapterDetails(mangaId, chapterId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/g/${mangaId}`, method: 'GET' }), 1);
        const html = response.data;
        const $ = this.cheerio.load(html);
        const cdnBase = this.parser.getCdnBase($);
        const pageCount = this.parser.getPageCount(html, chapterId);
        if (!pageCount) {
            throw new Error(`Page count 0 for chapter ${chapterId} in manga ${mangaId}`);
        }
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            const imgUrl = `${cdnBase}/${mangaId}/VI/${chapterId}/${i}.jpg`;
            pages.push(`${PROXY_URL}?url=${encodeURIComponent(imgUrl)}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/g/${mangaId}`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.NHentaiClub = NHentaiClub;
