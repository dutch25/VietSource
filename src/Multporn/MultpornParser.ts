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

        $('.views-row, .views-view-grid td, .views-view-grid [class*="col-"]').each((_: any, el: any) => {
            // Skip video nodes if they have video preview specifically
            const hasVideoPreview = $(el).find('.views-field-field-vd-preciew img').length > 0;
            if (hasVideoPreview) return;

            const titleEl = $(el).find('.views-field-title a, h2 a, h3 a').first();
            let href = titleEl.attr('href') || $(el).find('a').attr('href') || '';
            let title = titleEl.text().replace(/\s+/g, ' ').trim() || $(el).find('.views-field-title').text().replace(/\s+/g, ' ').trim();

            if (!href || !title) return;
            const mangaId = href.replace(/^\//, '').replace(/\/+$/, '').trim();
            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

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
            $('.field-name-field-com-pages img, .juicebox-container img, .jb-image img').first().attr('src') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        const desc = $('.field-name-body, .description, .field-type-text-with-summary').first().text().trim() || 'No description available';
        const author = $('.field-name-field-author a, .field-name-field-authors-pre a, .username, .author').first().text().trim() || 'Unknown';

        const tags: { id: string; label: string }[] = [];
        $('.field-name-field-category a, .field-name-field-user-tags a, a[href*="/category/"], a[href*="/user_tags/"]').each((_: any, el: any) => {
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
        // Every comic on Multporn is a standalone comic
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

    parseJuiceboxXml(xmlString: string): string[] {
        const pages: string[] = [];
        const regex = /<(?:image)[^>]*(?:largeImageURL|imageURL|linkURL)="([^"]+)"[^>]*>/gi;
        let match;
        while ((match = regex.exec(xmlString)) !== null) {
            const pageUrl = match[1].trim();
            if (pageUrl && !pages.includes(pageUrl)) {
                pages.push(pageUrl);
            }
        }
        return pages;
    }

    parseFallbackPages($: any): string[] {
        const pages: string[] = [];
        $('.jb-image img, .field-name-field-com-pages img').each((_: any, el: any) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || '';
            src = src.trim();
            if (src && !pages.includes(src)) {
                pages.push(src);
            }
        });
        return pages;
    }

    isLastPage($: any): boolean {
        const hasNext = $('li.pager-next a, .pager__item--next a').length > 0;
        const itemCount = $('.views-row, .views-view-grid td, .views-view-grid [class*="col-"]').length;
        if (!hasNext && itemCount < 15) {
            return true;
        }
        return false;
    }

    getSearchTags(): TagSection[] {
        const tags = [
            { id: 'new?type=1', label: 'Comics' },
            { id: 'new?type=3&language=1', label: 'Hentai Manga' },
            { id: 'category/3d', label: '3D' },
            { id: 'category/milf', label: 'MILF' },
            { id: 'category/futanari', label: 'Futanari' },
            { id: 'category/incest', label: 'Incest' },
            { id: 'category/anal', label: 'Anal' },
            { id: 'category/creampie', label: 'Creampie' },
            { id: 'category/oral', label: 'Oral' },
            { id: 'category/big_tits', label: 'Big Tits' },
            { id: 'category/big_ass', label: 'Big Ass' },
            { id: 'category/lesbians', label: 'Lesbians / Yuri' },
            { id: 'category/straight', label: 'Straight' },
            { id: 'category/group_sex', label: 'Group Sex' },
            { id: 'category/cheating', label: 'Cheating' },
            { id: 'category/furry', label: 'Furry' },
        ];

        return [
            App.createTagSection({
                id: 'categories',
                label: 'Categories',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];
    }
}
