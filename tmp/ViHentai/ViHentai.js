"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViHentai = exports.ViHentaiInfo = void 0;
const types_1 = require("@paperback/types");
const ViHentaiParser_1 = require("./ViHentaiParser");
const BASE_URL = 'https://vi-hentai.pro';
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev';
exports.ViHentaiInfo = {
    version: '1.1.32',
    name: 'Vi-Hentai',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for vi-hentai.pro',
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
class ViHentai extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new ViHentaiParser_1.Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': `${BASE_URL}/`,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                }
            }
        });
    }
    buildRequest(url) {
        return App.createRequest({
            url,
            method: 'GET',
        });
    }
    async getCloudflareBypassRequestAsync() {
        return this.buildRequest(BASE_URL);
    }
    slugFromUrl(url) {
        return url.replace(/\/$/, '').split('/').pop() ?? url;
    }
    async DOMHTML(url) {
        const response = await this.requestManager.schedule(this.buildRequest(url), 1);
        this.CloudFlareError(response.status);
        return this.cheerio.load(response.data);
    }
    CloudFlareError(status) {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the home page of Vi-Hentai source and press the cloud icon.`);
        }
    }
    async getMangaDetails(mangaId) {
        const $ = await this.DOMHTML(`${BASE_URL}/truyen/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        const mangaUrl = `${BASE_URL}/truyen/${mangaId}`;
        const mangaRes = await this.requestManager.schedule(this.buildRequest(mangaUrl), 1);
        this.CloudFlareError(mangaRes.status);
        const $manga = this.cheerio.load(mangaRes.data);
        const firstHref = $manga(`a[href*="/truyen/${mangaId}/"]`).first().attr('href') ?? '';
        if (!firstHref)
            return [];
        const readerUrl = firstHref.startsWith('http')
            ? firstHref
            : `${BASE_URL}${firstHref}`;
        const readerRes = await this.requestManager.schedule(this.buildRequest(readerUrl), 1);
        this.CloudFlareError(readerRes.status);
        const $ = this.cheerio.load(readerRes.data);
        const options = [];
        $('#chapter-selector option').each((_, el) => {
            const value = $(el).attr('value') ?? '';
            const name = $(el).text().trim();
            const chapterId = this.slugFromUrl(value);
            if (chapterId && chapterId !== mangaId) {
                options.push({ id: chapterId, name });
            }
        });
        options.reverse();
        return options.map((opt, i) => {
            const numMatch = opt.name.match(/([\d.]+)/) ?? opt.id.match(/([\d.]+)/);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);
            return App.createChapter({
                id: opt.id,
                name: opt.name,
                chapNum,
                time: new Date(),
            });
        });
    }
    async getChapterDetails(mangaId, chapterId) {
        const chapterUrl = `${BASE_URL}/truyen/${mangaId}/${chapterId}`;
        const response = await this.requestManager.schedule(this.buildRequest(chapterUrl), 1);
        this.CloudFlareError(response.status);
        const html = response.data;
        const $ = this.cheerio.load(html);
        // Both UUIDs change per chapter and are embedded in every image URL.
        // Pattern: /images/data/{uuid1}/{uuid2}/{N}.jpg
        // We just grab them from the first image we find (src or data-src).
        let uuid1 = '';
        let uuid2 = '';
        $('img.lazy-image, img[data-src*="shousetsu"], img[src*="shousetsu"]').each((_, el) => {
            if (uuid1)
                return; // already found, stop
            const src = $(el).attr('data-src') ?? $(el).attr('src') ?? '';
            const match = src.match(/\/images\/data\/([a-f0-9-]{36})\/([a-f0-9-]{36})\/\d+\.jpg/);
            if (match) {
                uuid1 = match[1];
                uuid2 = match[2];
            }
        });
        // DEBUG: show what img tags exist in the HTML
        if (!uuid1 || !uuid2) {
            const allImgs = [];
            $('img').each((_, el) => {
                const src = $(el).attr('src') ?? '';
                const dataSrc = $(el).attr('data-src') ?? '';
                const cls = $(el).attr('class') ?? '';
                allImgs.push(`[src=${src.substring(0, 60)} | data-src=${dataSrc.substring(0, 60)} | class=${cls}]`);
            });
            throw new Error(`Selectors found nothing. Total img tags: ${allImgs.length}\n` +
                allImgs.slice(0, 5).join('\n'));
        }
        // Count pages from data-index on image containers (0-based)
        let maxIndex = 0;
        $('div.image-container[data-index]').each((_, el) => {
            const idx = parseInt($(el).attr('data-index') ?? '0', 10);
            if (idx > maxIndex)
                maxIndex = idx;
        });
        // Fallback: count img elements directly
        const totalPages = maxIndex > 0
            ? maxIndex + 1
            : $('img.lazy-image, img[data-src*="shousetsu"], img[src*="shousetsu"]').length;
        if (totalPages === 0) {
            throw new Error(`Found UUIDs but could not count pages. HTML length: ${html.length}`);
        }
        // Build all page URLs through proxy
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            const imageUrl = `https://img.shousetsu.dev/images/data/${uuid1}/${uuid2}/${i}.jpg`;
            pages.push(`${PROXY_URL}?url=${encodeURIComponent(imageUrl)}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/` },
            { id: 'popular', title: 'Phổ Biến Nhất', url: `${BASE_URL}/?sort=-views` },
            { id: 'new', title: 'Truyện Mới', url: `${BASE_URL}/?sort=-created_at` },
        ];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
            const response = await this.requestManager.schedule(this.buildRequest(section.url), 1);
            const $ = this.cheerio.load(response.data);
            const items = this.parser.parseSearchResults($);
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
                items,
            }));
        }
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        const genreTag = tags.find(t => t.startsWith('genre.'));
        let url;
        if (genreTag) {
            const slug = genreTag.replace('genre.', '');
            url = `${BASE_URL}/the-loai/${slug}?page=${page}`;
        }
        else {
            const search = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/danh-sach?page=${page}&keyword=${search}`;
        }
        const response = await this.requestManager.schedule(this.buildRequest(url), 1);
        const $ = this.cheerio.load(response.data);
        const items = this.parser.parseSearchResults($);
        const hasNextPage = $('a[rel="next"], .page-next').length > 0;
        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        });
    }
    async getSearchTags() {
        return this.parser.getStaticTags();
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        let url;
        switch (homepageSectionId) {
            case 'latest':
            case 'popular':
                url = `${BASE_URL}/the-loai/all?sort=${homepageSectionId === 'popular' ? 'views' : 'created_at'}&page=${page}`;
                break;
            case 'new':
                url = `${BASE_URL}/?page=${page}`;
                break;
            default:
                throw new Error(`Unknown section: ${homepageSectionId}`);
        }
        const response = await this.requestManager.schedule(this.buildRequest(url), 1);
        const $ = this.cheerio.load(response.data);
        const items = this.parser.parseSearchResults($);
        const hasNextPage = $('a[rel="next"], .page-next').length > 0;
        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen/${mangaId}`;
    }
}
exports.ViHentai = ViHentai;
