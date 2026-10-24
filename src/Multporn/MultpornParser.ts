import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class MultpornParser {
    parseCards($: any, baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        $('.views-row').each((_: any, el: any) => {
            const linkEl = $(el).find('a').first();
            const href = linkEl.attr('href') || '';
            const mangaId = href.replace(/^\//, '').trim();

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            let title = $(el).find('.views-field-title a, .views-field-title, h2 a, h3 a, a').first().text().replace(/\s+/g, ' ').trim();
            if (!title) return;

            let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }

            if (!image) return;

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image,
                    title,
                })
            );
        });

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string): SourceManga {
        const rawTitle = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().replace(/Porn comic\s*-\s*Multporn/i, '').trim() ||
            mangaId;
        const title = rawTitle.replace(/\s*-\s*Multporn.*$/i, '').trim();

        let image = $('meta[property="og:image"]').attr('content') ||
            $('.field-name-field-com-pages img, .juicebox-container img').first().attr('src') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        const desc = $('.field-name-body, .description, .field-type-text-with-summary').first().text().trim() || 'No description available';
        const author = $('.username, .field-name-field-author, .author').first().text().trim() || 'Unknown';

        const tags: { id: string; label: string }[] = [];
        $('a[href*="/tags/"], a[href*="/comics/"], a[href*="/characters/"], a[href*="/categories/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const tagId = href.replace(/^\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });

        const tagSections: TagSection[] = [
            App.createTagSection({
                id: 'genres',
                label: 'Categories & Tags',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/favicon.png`,
                desc,
                status: 'Hoàn thành',
                author,
                tags: tagSections,
            }),
        });
    }

    parseChapters($: any, mangaId: string, rawHtml: string): Chapter[] {
        // Case 1: Standalone comic with embedded Juicebox gallery
        if (rawHtml.includes('juicebox/xml') || rawHtml.includes('field_com_pages')) {
            return [
                App.createChapter({
                    id: mangaId,
                    name: 'Full Comic',
                    chapNum: 1,
                    langCode: 'en',
                    time: new Date(),
                }),
            ];
        }

        // Case 2: Series / category page containing child comic links
        const chapters: Chapter[] = [];
        const seenIds = new Set<string>();

        $('.views-row a, .view-content a, .item-list a').each((i: number, el: any) => {
            const href = $(el).attr('href') || '';
            const childId = href.replace(/^\//, '').replace(/\/+$/, '').trim();
            const text = $(el).text().trim();

            if (!childId || childId === mangaId || seenIds.has(childId)) return;
            if (!href.startsWith('/comics/') && !href.startsWith('/hentai_manga/') && !href.startsWith('/mp')) return;
            seenIds.add(childId);

            const numMatch = text.match(/(?:chapter|part|chap|chương)\s*([0-9.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);

            chapters.push(
                App.createChapter({
                    id: childId,
                    name: text || `Part ${i + 1}`,
                    chapNum,
                    langCode: 'en',
                    time: new Date(),
                })
            );
        });

        if (chapters.length === 0) {
            return [
                App.createChapter({
                    id: mangaId,
                    name: 'Full Comic',
                    chapNum: 1,
                    langCode: 'en',
                    time: new Date(),
                }),
            ];
        }

        return chapters;
    }

    parseJuiceboxXml(xmlString: string): string[] {
        const pages: string[] = [];
        const regex = /<(?:image)[^>]*(?:largeImageURL|imageURL|linkURL)="([^"]+)"[^>]*>/gi;
        let match;

        while ((match = regex.exec(xmlString)) !== null) {
            let url = match[1].trim();
            if (url && !pages.includes(url)) {
                pages.push(url);
            }
        }

        return pages;
    }

    isLastPage($: any): boolean {
        const hasNext = $('a[title="Go to next page"], li.pager-next a, a[rel="next"]').length > 0;
        const itemCount = $('.views-row').length;
        if (!hasNext && itemCount < 10) {
            return true;
        }
        return false;
    }

    getSearchTags(): TagSection[] {
        return [
            App.createTagSection({
                id: 'categories',
                label: 'Categories',
                tags: [
                    App.createTag({ id: 'comics', label: 'Comics' }),
                    App.createTag({ id: 'hentai_manga', label: 'Hentai Manga' }),
                    App.createTag({ id: 'rule_34_comics', label: 'Rule 34 Comics' }),
                    App.createTag({ id: '3d_porn_comics', label: '3D Porn Comics' }),
                    App.createTag({ id: 'gay_porn_comics', label: 'Gay Porn Comics' }),
                ],
            }),
        ];
    }
}
