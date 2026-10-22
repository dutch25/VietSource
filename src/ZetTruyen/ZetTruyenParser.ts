import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types';

import type { Cheerio, CheerioAPI } from 'cheerio';

export class Parser {

    private extractMangaFromElements(elements: Cheerio<any>, $: CheerioAPI, baseUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = [];
        const seen = new Set<string>();

        elements.each((_, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('/chuong-') || href.includes('/chapter-')) return;
            const match = href.match(/\/truyen-tranh\/([^/?#]+)$/);
            if (!match) return;
            const mangaId = match[1];
            if (seen.has(mangaId)) return;

            const img = $(el).find('img').first();
            if (img.length === 0) return;

            let image = img.attr('src') || img.attr('data-src') || '';
            if (!image.includes('zetimage.com') && !image.includes('/thumb/')) return;
            if (image.startsWith('/')) {
                image = `${baseUrl.replace(/\/+$/, '')}${image}`;
            }

            let title = $(el).find('span.line-clamp-2, h3, .text-xl, .line-clamp-1').text().trim()
                || img.attr('title')
                || img.attr('alt')
                || '';

            title = title.replace(/\s+/g, ' ').trim();
            if (!title || title.toLowerCase() === 'poster' || title.toLowerCase() === 'zettruyen') return;

            seen.add(mangaId);
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
            }));
        });

        return results;
    }

    parseMangaList($: CheerioAPI, baseUrl: string): PartialSourceManga[] {
        return this.extractMangaFromElements($('a[href*="/truyen-tranh/"]'), $, baseUrl);
    }

    parseFeaturedSection($: CheerioAPI, baseUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = [];
        const seen = new Set<string>();

        $('a.text-xl').each((_, el) => {
            const title = $(el).text().trim().replace(/\s+/g, ' ');
            const href = $(el).attr('href') || '';
            const match = href.match(/\/truyen-tranh\/([^/?#]+)$/);
            if (!match) return;
            const mangaId = match[1];
            if (seen.has(mangaId)) return;

            const container = $(el).closest('div.grid, div.relative');
            const img = container.find('img[src*="zetimage.com"], img[data-src*="zetimage.com"]').first();
            let image = img.attr('src') || img.attr('data-src') || `https://cdn1.zetimage.com/thumb/${mangaId}.jpg`;
            if (image.startsWith('/')) {
                image = `${baseUrl.replace(/\/+$/, '')}${image}`;
            }

            seen.add(mangaId);
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
            }));
        });

        return results;
    }

    parseSectionByHeading($: CheerioAPI, headingKeyword: string, baseUrl: string): PartialSourceManga[] {
        const h2 = $('h2').filter((_, el) => $(el).text().toUpperCase().includes(headingKeyword.toUpperCase())).first();
        if (h2.length === 0) return [];
        const container = h2.closest('.bg-card-section-color').parent();
        return this.extractMangaFromElements(container.find('a[href*="/truyen-tranh/"]'), $, baseUrl);
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('h1').first().text().trim()
            || $('meta[property="og:title"]').attr('content')?.trim()
            || mangaId;

        const image = $('meta[property="og:image"]').attr('content')?.trim()
            || $('img[alt="poster"]').attr('src')
            || '';

        const desc = $('meta[property="og:description"]').attr('content')?.trim()
            || $('.description, .summary').text().trim()
            || '';

        // Extract strictly from the current manga's genre container and deduplicate by tag ID
        const tags: Tag[] = [];
        const seenTagIds = new Set<string>();

        const genreContainer = $('.space-y-1, .space-y-2')
            .filter((_, el) => $(el).text().includes('Thể loại'))
            .first();

        const tagElements = genreContainer.length > 0
            ? genreContainer.find('a[href*="/the-loai/"]')
            : $('a[href*="/the-loai/"]').slice(0, 10);

        tagElements.each((_, el) => {
            const label = $(el).text().trim();
            const href = $(el).attr('href') || '';
            const match = href.match(/\/the-loai\/([^/?#]+)/);
            if (label && match) {
                const id = match[1];
                if (!seenTagIds.has(id)) {
                    seenTagIds.add(id);
                    tags.push(App.createTag({ id, label }));
                }
            }
        });

        const tagSections: TagSection[] = [];
        if (tags.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genres', label: 'Thể Loại', tags }));
        }

        const bodyText = $('body').text();
        const status = bodyText.includes('Đã hoàn thành') || bodyText.includes('Hoàn thành') ? 'COMPLETED' : 'ONGOING';

        let author = '';
        $('a[href*="/tac-gia/"]').each((_, el) => {
            const a = $(el).text().trim();
            if (a) author = a;
        });

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image,
                desc,
                author,
                status,
                tags: tagSections,
            }),
        });
    }

    parseChapterList(data: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];
        const seen = new Set<string>();
        const list = Array.isArray(data) ? data : (data?.data?.chapters || []);

        for (const ch of list) {
            const num = typeof ch.chapter_num === 'number' ? ch.chapter_num : parseFloat(ch.chapter_num) || 0;
            const id = `chuong-${num}`;
            if (seen.has(id)) continue;
            seen.add(id);

            const name = ch.chapter_name || `Chương ${num}`;
            let time = new Date();
            if (ch.updated_at) {
                const parsed = new Date(ch.updated_at);
                if (!isNaN(parsed.getTime())) time = parsed;
            }

            chapters.push(App.createChapter({
                id,
                name,
                chapNum: num,
                time,
                langCode: 'vi',
            }));
        }

        return chapters;
    }

    parseChapterDetails($: CheerioAPI): string[] {
        const pages: string[] = [];
        $('img').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || '';
            if (src && (src.includes('zetimage.com') || src.includes('/thumb/')) && !pages.includes(src)) {
                pages.push(src);
            }
        });
        return pages;
    }

    parseTags($: CheerioAPI): TagSection[] {
        const tags: Tag[] = [];
        $('a[href*="/the-loai/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const match = href.match(/\/the-loai\/([^/?#]+)/);
            const label = $(el).text().trim();
            if (match && label && !tags.some(t => t.id === match[1])) {
                tags.push(App.createTag({ id: match[1], label }));
            }
        });
        return [App.createTagSection({ id: 'genres', label: 'Thể Loại', tags })];
    }
}
