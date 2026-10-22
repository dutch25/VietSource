import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types';

import type { CheerioAPI } from 'cheerio';

export class Parser {

    parseMangaList($: CheerioAPI, baseUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = [];
        const seen = new Set<string>();

        $('a[href*="/truyen-tranh/"]').each((_, el) => {
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

            let title = $(el).find('span.line-clamp-2').text().trim()
                || img.attr('title')
                || $(el).find('a.text-xl, .text-xl').text().trim()
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

        const tags: Tag[] = [];
        $('a[href*="/the-loai/"]').each((_, el) => {
            const label = $(el).text().trim();
            const href = $(el).attr('href') || '';
            const match = href.match(/\/the-loai\/([^/?#]+)/);
            if (label && match) {
                tags.push(App.createTag({ id: match[1], label }));
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

    parseChapterList(jsonData: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];
        const list = jsonData?.data?.chapters || [];

        for (const ch of list) {
            const num = typeof ch.chapter_num === 'number' ? ch.chapter_num : parseFloat(ch.chapter_num) || 0;
            const id = `chuong-${num}`;
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
