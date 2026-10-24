import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class AllPornComicParser {
    parseCards($: any, baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        $('.page-item-detail, .c-tabs-item__content, .manga-item').each((_: any, el: any) => {
            const linkEl = $(el).find('a[href*="/porncomic/"]').first();
            const href = linkEl.attr('href') || '';
            const match = href.match(/\/porncomic\/([^/?#]+)/);
            const mangaId = match ? match[1].trim() : '';

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            let title = $(el).find('.post-title a, h3 a, h4 a, h5 a').first().text().replace(/\s+/g, ' ').trim();
            if (!title) {
                title = linkEl.attr('title')?.trim() || linkEl.text().trim() || '';
            }
            if (!title) return;

            let image = $(el).find('img').attr('data-src') ||
                $(el).find('img').attr('data-lazy-src') ||
                $(el).find('img').attr('src') || '';
            if (image.includes('dflazy')) {
                image = $(el).find('img').attr('data-src') || '';
            }
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }

            const chapter = $(el).find('.chapter-item, .list-chapter .chapter, .chapter').first().text().replace(/\s+/g, ' ').trim();

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image: image || `${baseUrl}/wp-content/uploads/2020/03/cropped-favicon-192x192.png`,
                    title,
                    subtitle: chapter || undefined,
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
            '';
        if (image.includes('dflazy')) {
            image = $('.summary_image img').attr('data-src') || '';
        }
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        const desc = $('.description-summary .summary__content, .description-summary, .manga-excerpt').first().text().trim() || 'No description available';
        const author = $('.author-content a, .artist-content a').first().text().trim() || 'Unknown';
        const statusText = $('.post-status .summary-content').first().text().trim().toLowerCase();
        const status = statusText.includes('completed') ? 'Hoàn thành' : 'Đang cập nhật';

        const tags: { id: string; label: string }[] = [];
        $('.genres-content a, a[href*="/porncomic-category/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const match = href.match(/\/porncomic-category\/([^/?#]+)/);
            const tagId = match ? match[1] : href.replace(/.*?\/manga-genre\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });

        const tagSections: TagSection[] = [
            App.createTagSection({
                id: 'genres',
                label: 'Thể loại',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/wp-content/uploads/2020/03/cropped-favicon-192x192.png`,
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
            const match = rawHref.match(/\/porncomic\/[^\/]+\/([^\/]+)/);
            const chapId = match ? match[1].trim() : rawHref.replace(/.*?\/porncomic\//, '').replace(/\/+$/, '').trim();
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

        return chapters;
    }

    parseChapterDetails($: any, mangaId: string, chapterId: string, baseUrl: string): ChapterDetails {
        const pages: string[] = [];

        $('.page-break img, .reading-content img').each((_: any, el: any) => {
            let src = $(el).attr('data-src') || $(el).attr('src') || '';
            src = src.trim();
            if (!src || src.includes('dflazy') || src.includes('logo')) return;

            if (src.startsWith('//')) {
                src = 'https:' + src;
            } else if (src.startsWith('/')) {
                src = `${baseUrl}${src}`;
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
        const hasNext = $('a.next, .nav-previous a, a[rel="next"]').length > 0;
        const itemCount = $('.page-item-detail, .c-tabs-item__content, .manga-item').length;
        if (!hasNext && itemCount < 24) {
            return true;
        }
        return false;
    }

    getSearchTags(): TagSection[] {
        const tags = [
            { id: '3dd', label: '3D Comics' },
            { id: 'manhwad', label: 'Manhwa 18+' },
            { id: 'hentaib', label: 'Hentai Manga' },
            { id: 'westernh', label: 'Western Comics' },
            { id: 'big-breasts', label: 'Big Breasts' },
            { id: 'milfg', label: 'MILF' },
            { id: 'nakadashi', label: 'Nakadashi / Creampie' },
            { id: 'cheatinge', label: 'Cheating' },
            { id: 'netorarea', label: 'Netorare / Cuckold' },
            { id: 'groupb', label: 'Group' },
            { id: 'ahegao', label: 'Ahegao' },
            { id: 'analc', label: 'Anal' },
            { id: 'interracialb', label: 'Interracial' },
            { id: 'animeh', label: 'Anime' },
            { id: 'gamea', label: 'Game' },
            { id: 'cartoonc', label: 'Cartoon' },
            { id: 'furryb', label: 'Furry' },
            { id: 'yuric', label: 'Yuri / Lesbian' },
            { id: 'yaoib', label: 'Yaoi / Gay' },
            { id: 'indiane', label: 'Indian' },
            { id: 'retro', label: 'Retro' },
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
