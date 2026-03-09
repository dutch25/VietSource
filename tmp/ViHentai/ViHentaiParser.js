"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev';
class Parser {
    applyProxy(url) {
        if (url && (url.includes('shousetsu.dev') || url.includes('vi-hentai.pro'))) {
            return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
        }
        return url;
    }
    // ─── Time helpers ─────────────────────────────────────────────────────────
    convertTime(timeStr) {
        const parsed = new Date(timeStr);
        if (!isNaN(parsed.getTime()))
            return parsed;
        // Vietnamese relative time strings
        let time;
        const n = Number((/\d*/.exec(timeStr) ?? [])[0]) || 1;
        if (timeStr.includes('giây'))
            time = new Date(Date.now() - n * 1000);
        else if (timeStr.includes('phút'))
            time = new Date(Date.now() - n * 60000);
        else if (timeStr.includes('giờ'))
            time = new Date(Date.now() - n * 3600000);
        else if (timeStr.includes('ngày'))
            time = new Date(Date.now() - n * 86400000);
        else if (timeStr.includes('tuần'))
            time = new Date(Date.now() - n * 604800000);
        else if (timeStr.includes('tháng'))
            time = new Date(Date.now() - n * 2592000000);
        else if (timeStr.includes('năm'))
            time = new Date(Date.now() - n * 31536000000);
        else {
            // Try dd/mm/yyyy
            const parts = timeStr.split('/');
            if (parts.length === 3) {
                time = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            else {
                time = new Date();
            }
        }
        return time;
    }
    // ─── Manga Details ────────────────────────────────────────────────────────
    parseMangaDetails($, mangaId) {
        const tags = [];
        $('.bg-gray-500 a[href*="/the-loai/"]').each((_, el) => {
            const href = $(el).attr('href') ?? '';
            const label = $(el).text().trim();
            const id = 'genre.' + (href.split('/the-loai/').pop() ?? label);
            if (label)
                tags.push(App.createTag({ label, id }));
        });
        const title = $('h1.series-name, h1.manga-title, h1.title, .series-title h1').first().text().trim()
            || $('h1').first().text().trim();
        const coverEl = $('.cover-frame').first();
        let image = '';
        const style = coverEl.attr('style') ?? '';
        const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
        if (match)
            image = match[1];
        if (image.startsWith('//'))
            image = 'https:' + image;
        const author = $('.text-gray-500:contains("Tác giả")').next('a').text().trim()
            || $('a[href*="/tac-gia/"]').first().text().trim();
        const statusEl = $('.text-gray-500:contains("Tình trạng")').next('a').first();
        const status = statusEl.text().trim();
        const desc = $('.line-clamp-6, .series-description, .summary-content').first().text().trim();
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image,
                author,
                artist: author,
                status,
                desc,
                tags: tags.length > 0
                    ? [App.createTagSection({ id: '0', label: 'Thể Loại', tags })]
                    : []
            })
        });
    }
    // ─── Chapter List ─────────────────────────────────────────────────────────
    parseChapterList($, mangaId) {
        const chapters = [];
        $('.overflow-y-auto a[href*="/truyen/"]').each((_, el) => {
            const href = $(el).attr('href') ?? '';
            const hrefParts = href.split('/truyen/').pop() ?? '';
            if (!hrefParts)
                return;
            const chapterName = $('span.text-ellipsis', el).text().trim()
                || $(el).text().trim();
            const numMatch = chapterName.match(/(\d+(?:\.\d+)?)/);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;
            const timeEl = $('.timeago', el);
            const timeStr = timeEl.attr('datetime') ?? timeEl.text().trim();
            const time = this.convertTime(timeStr);
            chapters.push(App.createChapter({
                id: hrefParts,
                chapNum,
                name: chapterName,
                langCode: '🇻🇳',
                time,
            }));
        });
        return chapters;
    }
    // ─── Chapter Details (images) ─────────────────────────────────────────────
    parseChapterDetails($) {
        const pages = [];
        // Try multiple selectors to find images
        const selectors = ['img.lazy-image', 'img[data-src]', 'div.image-container img', 'img[src*="shousetsu"]'];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                let src = $(el).attr('data-src') ?? $(el).attr('src') ?? '';
                src = src.trim();
                if (!src || src.includes('data:image'))
                    return;
                if (src.startsWith('//'))
                    src = 'https:' + src;
                if (src.includes('emoji') || src.includes('avatar') || src.includes('storage/images/default'))
                    return;
                if (!src.includes('shousetsu.dev'))
                    return;
                if (!pages.includes(src))
                    pages.push(src);
            });
            if (pages.length > 0)
                break;
        }
        return pages;
    }
    // ─── Search Results ───────────────────────────────────────────────────────
    parseSearchResults($) {
        const results = [];
        $('.manga-vertical').each((_, el) => {
            const mangaLink = $('a[href*="/truyen/"]', el).first();
            const href = mangaLink.attr('href') ?? '';
            const mangaId = href.split('/truyen/').pop()?.replace(/\/$/, '') ?? '';
            if (!mangaId)
                return;
            const title = $('.text-ellipsis', el).last().text().trim();
            if (!title)
                return;
            const imgEl = $('.cover', el);
            let image = '';
            const style = imgEl.attr('style') ?? '';
            const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match)
                image = match[1];
            if (image.startsWith('//'))
                image = 'https:' + image;
            image = this.applyProxy(image);
            const subtitleEl = $('.latest-chapter a', el).first();
            const subtitle = subtitleEl.text().trim();
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
                subtitle: subtitle || undefined,
            }));
        });
        return results;
    }
    // ─── Homepage: Hot section ────────────────────────────────────────────────
    parseHotSection($) {
        return this.parseSearchResults($);
    }
    // ─── Homepage: New section ───────────────────────────────────────────────
    parseNewSection($) {
        return this.parseSearchResults($);
    }
    // ─── Static Genre Tags ────────────────────────────────────────────────────
    // Built from the site's genre list (extracted from homepage nav)
    getStaticTags() {
        const genres = [
            { id: 'genre.3d-hentai', label: '3D Hentai' },
            { id: 'genre.action', label: 'Action' },
            { id: 'genre.adult', label: 'Adult' },
            { id: 'genre.ahegao', label: 'Ahegao' },
            { id: 'genre.anal', label: 'Anal' },
            { id: 'genre.big-boobs', label: 'Big Boobs' },
            { id: 'genre.bdsm', label: 'BDSM' },
            { id: 'genre.blowjobs', label: 'BlowJobs' },
            { id: 'genre.cheating', label: 'Cheating' },
            { id: 'genre.comedy', label: 'Comedy' },
            { id: 'genre.creampie', label: 'Creampie' },
            { id: 'genre.doujinshi', label: 'Doujinshi' },
            { id: 'genre.ecchi', label: 'Ecchi' },
            { id: 'genre.elf', label: 'Elf' },
            { id: 'genre.fantasy', label: 'Fantasy' },
            { id: 'genre.femdom', label: 'Femdom' },
            { id: 'genre.full-color', label: 'Full Color' },
            { id: 'genre.futanari', label: 'Futanari' },
            { id: 'genre.gangbang', label: 'GangBang' },
            { id: 'genre.group', label: 'Group' },
            { id: 'genre.harem', label: 'Harem' },
            { id: 'genre.housewife', label: 'Housewife' },
            { id: 'genre.incest', label: 'Incest' },
            { id: 'genre.khong-che', label: 'Không che' },
            { id: 'genre.co-che', label: 'Có che' },
            { id: 'genre.lolicon', label: 'Lolicon' },
            { id: 'genre.maids', label: 'Maids' },
            { id: 'genre.manhua', label: 'Manhua' },
            { id: 'genre.manhwa', label: 'Manhwa' },
            { id: 'genre.milf', label: 'Milf' },
            { id: 'genre.mind-control', label: 'Mind Control' },
            { id: 'genre.monster', label: 'Monster' },
            { id: 'genre.nakadashi', label: 'Nakadashi' },
            { id: 'genre.ntr', label: 'NTR' },
            { id: 'genre.nurse', label: 'Nurse' },
            { id: 'genre.oral', label: 'Oral' },
            { id: 'genre.paizuri', label: 'Paizuri' },
            { id: 'genre.rape', label: 'Rape' },
            { id: 'genre.romance', label: 'Romance' },
            { id: 'genre.school-uniform', label: 'School Uniform' },
            { id: 'genre.schoolgirl', label: 'SchoolGirl' },
            { id: 'genre.series', label: 'Series' },
            { id: 'genre.shota', label: 'Shota' },
            { id: 'genre.sister', label: 'Sister' },
            { id: 'genre.stockings', label: 'Stockings' },
            { id: 'genre.tentacles', label: 'Tentacles' },
            { id: 'genre.vanilla', label: 'Vanilla' },
            { id: 'genre.virgin', label: 'Virgin' },
            { id: 'genre.webtoon', label: 'Webtoon' },
            { id: 'genre.yaoi', label: 'Yaoi' },
            { id: 'genre.yuri', label: 'Yuri' },
        ];
        return [
            App.createTagSection({
                id: '0',
                label: 'Thể Loại',
                tags: genres.map(g => App.createTag(g))
            })
        ];
    }
}
exports.Parser = Parser;
