import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class Tranh18Parser {
    parseCardElements($: any, elements: any, baseUrl: string, proxyUrl?: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        elements.each((_: any, el: any) => {
            const linkEl = $(el).find('a[href*="/comic/"]');
            const href = linkEl.attr('href') || '';
            const mangaId = href.replace(/.*?\/comic\//, '').replace(/\/+$/, '').trim();

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            const title = $(el).find('.title a, h3 a, a.title, .title').first().text().trim();
            if (!title) return;

            const style = $(el).find('.mh-cover').attr('style') || '';
            const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            let image = match ? match[1] : '';
            if (!image) {
                image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            }
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }
            if (proxyUrl && image && image.startsWith('http')) {
                image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
            }

            const subtitle = $(el).find('.chapter').text().trim().substring(0, 50);

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image: image || `${baseUrl}/static/images/favicon.ico`,
                    title,
                    subtitle: subtitle || undefined,
                })
            );
        });

        return mangaList;
    }

    parseCards($: any, baseUrl: string, proxyUrl?: string): PartialSourceManga[] {
        return this.parseCardElements($, $('.mh-item'), baseUrl, proxyUrl);
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string, proxyUrl?: string): SourceManga {
        const rawTitle = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            mangaId;
        const title = rawTitle.replace(/\s*-\s*Truyện Tranh 18.*$/i, '').trim();

        let image = $('meta[property="og:image"]').attr('content') || '';
        if (!image) {
            const style = $('.mh-cover').attr('style') || '';
            const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (match) image = match[1];
        }
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        if (proxyUrl && image && image.startsWith('http')) {
            image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
        }

        const desc = $('meta[property="og:description"]').attr('content')?.trim() ||
            $('.detail-info, .desc, .content, .introduction').first().text().trim() ||
            'Không có mô tả';

        let author = 'Đang cập nhật';
        $('p, div, li').each((_: any, el: any) => {
            const text = $(el).text().trim();
            if (text.startsWith('Tác giả:')) {
                const parsedAuthor = text.replace('Tác giả:', '').trim();
                if (parsedAuthor && parsedAuthor.toLowerCase() !== 'dang cap nhat') {
                    author = parsedAuthor;
                }
            }
        });

        const fullText = $.text();
        const status = fullText.includes('Hoàn thành') ? 'Hoàn thành' : 'Đang cập nhật';

        const tags: { id: string; label: string }[] = [];
        $('a[href*="/tag/"]').each((_: any, el: any) => {
            const tagHref = $(el).attr('href') || '';
            const tagId = tagHref.replace(/.*?\/tag\//, '').replace(/\/+$/, '').trim();
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
                image: image || `${baseUrl}/static/images/favicon.ico`,
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

        $('#chapterlistload li a[href*="/chapter/"], .detail-list-select li a[href*="/chapter/"], a[href*="/chapter/"]').each((i: number, el: any) => {
            // Skip the "Đọc truyện" button at the top
            if ($(el).parent().hasClass('bottom') || $(el).text().trim() === 'Đọc truyện') {
                return;
            }

            const rawHref = $(el).attr('href') || '';
            const chapId = rawHref.replace(/^\//, '').trim();
            if (!chapId || seenIds.has(chapId)) return;
            seenIds.add(chapId);

            const name = $(el).text().trim() || $(el).attr('title')?.trim() || `Chapter ${i + 1}`;
            const numMatch = name.match(/(?:chapter|chap|chương)\s*([0-9.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);

            chapters.push(
                App.createChapter({
                    id: chapId,
                    name,
                    chapNum,
                    langCode: 'vi',
                    time: new Date(),
                })
            );
        });

        // Ensure chronological or latest-first order as provided by website
        return chapters;
    }

    parseChapterDetails($: any, mangaId: string, chapterId: string, baseUrl: string, proxyUrl?: string): ChapterDetails {
        const pages: string[] = [];

        $('.comiclist img, .comicpage img, #content img, .comic-content img').each((_: any, el: any) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || '';
            src = src.trim();
            if (!src || src.includes('loading.gif') || src.includes('header-logo') || src.includes('mrtx.gif')) {
                return;
            }

            if (src.startsWith('//')) {
                src = 'https:' + src;
            } else if (src.startsWith('/')) {
                src = `${baseUrl}${src}`;
            }

            if (proxyUrl && src && src.startsWith('http')) {
                src = `${proxyUrl}/?url=${encodeURIComponent(src)}`;
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

    isLastPage($: any, currentPage: number): boolean {
        const lastPage = parseInt($('form.pg-jump').attr('data-last') || '0', 10);
        if (lastPage > 0 && currentPage >= lastPage) {
            return true;
        }

        const hasNext = $('a[rel="next"]').length > 0 || $('li.active + li a').length > 0;
        const itemCount = $('.mh-item').length;
        if (!hasNext && itemCount < 10) {
            return true;
        }

        return false;
    }

    getSearchTags(): TagSection[] {
        return [
            App.createTagSection({
                id: 'genres',
                label: 'Thể loại',
                tags: [
                    App.createTag({ id: 'manhwa', label: 'Manhwa' }),
                    App.createTag({ id: 'furry', label: 'Furry' }),
                    App.createTag({ id: 'ntr', label: 'NTR' }),
                    App.createTag({ id: 'drama', label: 'Drama' }),
                    App.createTag({ id: 'mature', label: 'Mature' }),
                    App.createTag({ id: 'romance', label: 'Romance' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'yaoi', label: 'Yaoi' }),
                    App.createTag({ id: 'elf', label: 'Elf' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'footjob', label: 'Footjob' }),
                    App.createTag({ id: 'adult', label: 'Adult' }),
                    App.createTag({ id: 'big-boobs', label: 'Big Boobs' }),
                    App.createTag({ id: 'big-penis', label: 'Big Penis' }),
                    App.createTag({ id: 'ahegao', label: 'Ahegao' }),
                    App.createTag({ id: 'blowjobs', label: 'BlowJobs' }),
                    App.createTag({ id: 'lang-man', label: 'Lãng Mạn' }),
                    App.createTag({ id: 'big-ass', label: 'Big Ass' }),
                    App.createTag({ id: 'full-color', label: 'Full Color' }),
                    App.createTag({ id: 'fantasy', label: 'Fantasy' }),
                ],
            }),
        ];
    }
}
