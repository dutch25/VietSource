import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class ILikeComixParser {
    parseCards($: any, baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        // 1. Try Madara style items (.page-item-detail, .c-tabs-item__content, .manga-item)
        $('.page-item-detail, .c-tabs-item__content, .manga-item').each((_: any, el: any) => {
            const linkEl = $(el).find('a[href*="/c/"]').first();
            const href = linkEl.attr('href') || '';
            const mangaId = href.replace(/.*?\/manga\/c\//, '').replace(/.*?\/c\//, '').replace(/\/+$/, '').trim();

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            let title = $(el).find('h3 a, h4 a, .post-title a').first().text().replace(/\s+/g, ' ').trim();
            if (!title) {
                title = linkEl.attr('title')?.trim() || '';
            }
            if (!title) return;

            let image = $(el).find('img').attr('data-src') || $(el).find('img').attr('data-lazy-src') || $(el).find('img').attr('src') || '';
            if (image.includes('dflazy')) {
                image = $(el).find('img').attr('data-src') || '';
            }
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }

            const chapter = $(el).find('.chapter-item, .list-chapter .chapter').first().text().replace(/\s+/g, ' ').trim();

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image: image || `${baseUrl}/wp-content/uploads/2024/08/cropped-Ilikemanga-Favicon-192x192.png`,
                    title,
                    subtitle: chapter || undefined,
                })
            );
        });

        // 2. Try C-book / post style items (.loops-wrapper .post, article.post, .post)
        $('.loops-wrapper .post, article.post, .post').each((_: any, el: any) => {
            const linkEl = $(el).find('.post-image a, a[href*="ilikecomix.com/"]').first();
            const href = linkEl.attr('href') || '';
            if (!href || href.includes('/c-book/') || href.includes('/author/') || href.includes('/tag/')) return;

            const match = href.match(/ilikecomix\.com\/(?:manga\/c\/)?([^\/]+(?:\/[^\/]+)?)\/?$/);
            const mangaId = match ? match[1].replace(/\/+$/, '') : '';
            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            const imgEl = $(el).find('img').first();
            let title = imgEl.attr('title') || imgEl.attr('alt') || $(el).find('.post-title a, h2 a, h3 a').first().text().trim();
            if (!title) return;

            let image = imgEl.attr('src') || imgEl.attr('data-src') || '';
            if (image && !image.startsWith('http')) {
                image = `https://ilikecomix.com${image.startsWith('/') ? '' : '/'}${image}`;
            }

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image: image || `${baseUrl}/wp-content/uploads/2024/08/cropped-Ilikemanga-Favicon-192x192.png`,
                    title,
                })
            );
        });

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string): SourceManga {
        const title = $('.post-title h1, h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            mangaId;

        let image = $('.summary_image img').attr('data-src') ||
            $('.summary_image img').attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            $('.post-image img').first().attr('src') ||
            '';
        if (image.includes('dflazy')) {
            image = $('.summary_image img').attr('data-src') || '';
        }
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        const desc = $('.description-summary, .manga-excerpt, .summary__content, .post-content p').first().text().trim() || 'No description available';
        const author = $('.author-content a, a[rel="author"]').first().text().trim() || 'Unknown';
        const status = $('.post-status .summary-content').first().text().trim() || 'Hoàn thành';

        const tags: { id: string; label: string }[] = [];
        $('.genres-content a, a[href*="/manga-genre/"], .post-category a, a[rel="category tag"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const tagId = href.replace(/.*?\/manga-genre\//, '').replace(/.*?\/category\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });

        const tagSections: TagSection[] = [
            App.createTagSection({
                id: 'genres',
                label: 'Genres',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/wp-content/uploads/2024/08/cropped-Ilikemanga-Favicon-192x192.png`,
                desc,
                status,
                author,
                tags: tagSections,
            }),
        });
    }

    parseChapters($: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];
        const seenIds = new Set<string>();

        $('.wp-manga-chapter a').each((i: number, el: any) => {
            const rawHref = $(el).attr('href') || '';
            const chapId = rawHref.replace(/.*?\/manga\/c\//, '').replace(/\/+$/, '').trim();
            if (!chapId || seenIds.has(chapId)) return;
            seenIds.add(chapId);

            const name = $(el).text().trim() || `Chapter ${i + 1}`;
            const numMatch = name.match(/(?:issue|chapter|chap|part|chương)\s*([0-9.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);

            chapters.push(
                App.createChapter({
                    id: chapId,
                    name,
                    chapNum,
                    langCode: 'en',
                    time: new Date(),
                })
            );
        });

        // Standalone comic without chapter list
        if (chapters.length === 0) {
            chapters.push(
                App.createChapter({
                    id: mangaId,
                    name: 'Full Comic',
                    chapNum: 1,
                    langCode: 'en',
                    time: new Date(),
                })
            );
        }

        return chapters;
    }

    parseChapterDetails($: any, mangaId: string, chapterId: string, baseUrl: string): ChapterDetails {
        const pages: string[] = [];

        $('.page-break img, .reading-content img, .post-content img, #post-content img, .entry-content img').each((_: any, el: any) => {
            let src = $(el).attr('data-src') || $(el).attr('src') || '';
            src = src.trim();
            if (!src || src.includes('dflazy') || src.includes('logo') || src.includes('banner')) return;

            if (src.startsWith('//')) {
                src = 'https:' + src;
            } else if (src.startsWith('/')) {
                src = `https://ilikecomix.com${src}`;
            }

            if (!pages.includes(src)) {
                pages.push(src);
            }
        });

        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }

    isLastPage($: any): boolean {
        const hasNext = $('a.next, .nav-previous a, a[rel="next"], .pagination-next').length > 0;
        const itemCount = $('.page-item-detail, .c-tabs-item__content, .loops-wrapper .post, article.post').length;
        if (!hasNext && itemCount < 18) {
            return true;
        }
        return false;
    }

    getSearchTags(): TagSection[] {
        const tags = [
            { id: '3d-cgi-comics', label: '3D Comics' },
            { id: 'simply-nhentai', label: 'Hentai Comics' },
            { id: 'fakku-interracial', label: 'Interracial' },
            { id: 'milf', label: 'MILF' },
            { id: 'incest', label: 'Incest' },
            { id: 'cheating', label: 'Cheating' },
            { id: 'parody', label: 'Parody' },
            { id: 'superhero', label: 'Superhero' },
            { id: 'big-boobs', label: 'Big Boobs' },
            { id: 'anal', label: 'Anal' },
        ];

        return [
            App.createTagSection({
                id: 'categories',
                label: 'Thể loại',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];
    }
}
