import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
} from '@paperback/types';

export class Parser {
    parseMangaList($: any, baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seen = new Set<string>();

        $('a[href*="/manhwa-18/"]').each((_: number, elem: any) => {
            const href = $(elem).attr('href') || '';
            const match = href.match(/\/manhwa-18\/([^/?#]+)/i);
            if (!match) return;

            const mangaId = match[1];
            if (seen.has(mangaId)) return;

            // Find image
            let img = $(elem).find('img').first().attr('src') || $(elem).find('img').first().attr('data-src') || '';
            if (img.startsWith('data:image')) {
                img = $(elem).find('img').first().attr('data-src') || '';
            }

            // Find title: could be in alt, or adjacent text/heading
            let title = $(elem).find('img').first().attr('alt') || '';
            if (!title) {
                title = $(elem).find('h3, h2, p, .line-clamp-2, span').first().text().trim();
            }
            if (!title) {
                // Capitalize slug as fallback
                title = mangaId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
            }

            // Subtitle or latest chapter info
            const subtitle = $(elem).find('.line-clamp-1').last().text().trim() || undefined;

            if (mangaId && title) {
                seen.add(mangaId);
                mangaList.push(
                    App.createPartialSourceManga({
                        mangaId: mangaId,
                        title: title.trim(),
                        image: img || `${baseUrl}/bgc.webp`,
                        subtitle: subtitle,
                    })
                );
            }
        });

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string): SourceManga {
        const title = $('h1').first().text().trim() || mangaId.replace(/-/g, ' ');
        
        let image = $('img[src*="story-images"], img[src*="poster-"]').first().attr('src') || '';
        if (!image) {
            image = $('img[alt="' + title + '"]').first().attr('src') || '';
        }
        if (!image) {
            image = $('main img').first().attr('src') || `${baseUrl}/bgc.webp`;
        }

        // Description
        let desc = '';
        $('p, .text-txt-secondary').each((_: number, elem: any) => {
            const t = $(elem).text().trim();
            if (t.length > 50 && !desc && !t.includes('©') && !t.includes('Proton')) {
                desc = t;
            }
        });

        // Genres
        const tags: Tag[] = [];
        $('a[href*="/the-loai/"], a[href*="genre"], a[href*="theloai"]').each((_: number, elem: any) => {
            const label = $(elem).text().trim().replace(/^#/, '');
            const id = $(elem).attr('href') || label;
            if (label) {
                tags.push(App.createTag({ id: id, label: label }));
            }
        });

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                desc: desc || title,
                status: 'Đang tiến hành',
                tags: tags.length > 0 ? [
                    App.createTagSection({
                        id: 'genres',
                        label: 'Thể loại',
                        tags: tags,
                    }),
                ] : [],
            }),
        });
    }

    parseChapters($: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];
        const seen = new Set<string>();

        // Find all links to chapters e.g. /manhwa-18/mangaId/chuong-X
        $(`a[href*="/${mangaId}/chuong-"], a[href*="/chuong-"]`).each((_: number, elem: any) => {
            const href = $(elem).attr('href') || '';
            const match = href.match(/chuong-(\d+(\.\d+)?)/i);
            if (!match) return;

            const chapSlug = href.split('/').filter(Boolean).pop() || `chuong-${match[1]}`;
            if (seen.has(chapSlug)) return;
            seen.add(chapSlug);

            const chapNum = parseFloat(match[1]);
            let name = $(elem).text().trim() || `Chương ${chapNum}`;

            chapters.push(
                App.createChapter({
                    id: chapSlug,
                    chapNum: isNaN(chapNum) ? 0 : chapNum,
                    name: name,
                    langCode: '🇻🇳',
                })
            );
        });

        return chapters.sort((a, b) => b.chapNum - a.chapNum);
    }

    parseChapterDetails(html: string, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = [];

        // Direct regex for all cdn manga-images
        const regex = /https:\/\/cdn\.vietmanhwa\.org\/manga-images\/[^\s"',\\]+/g;
        let match;
        const seen = new Set<string>();

        while ((match = regex.exec(html)) !== null) {
            const url = match[0].replace(/\\/g, '');
            if (!seen.has(url)) {
                seen.add(url);
                pages.push(url);
            }
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }
}
