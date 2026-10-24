import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class EightMusesParser {
    parseCards($: any, baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        $('a[href^="/g/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const mangaId = href.replace(/^\/g\//, '').replace(/\/+$/, '').trim();

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            let title = $(el).find('strong').first().text().trim();
            if (!title) {
                title = $(el).find('img').attr('alt') || $(el).text().replace(/\s+/g, ' ').trim();
            }
            if (!title) return;

            let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }

            if (!image) return;

            const badge = $(el).find('.cover__mark, .cover__label').text().trim();

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image,
                    title,
                    subtitle: badge || undefined,
                })
            );
        });

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string): SourceManga {
        const title = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().replace(/· 8Muse.*$/i, '').trim() ||
            mangaId;

        let image = $('meta[property="og:image"]').attr('content') ||
            $('img').first().attr('src') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        const desc = $('.description, .summary').first().text().trim() || 'No description available';
        const author = $('a[href*="/artists/"]').first().text().trim() || 'Unknown';

        const tags: { id: string; label: string }[] = [];
        $('a[href*="/genres/"], a[href*="/collections/"]').each((_: any, el: any) => {
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
                label: 'Genres',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/icon-192.png`,
                desc,
                status: 'Hoàn thành',
                author,
                tags: tagSections,
            }),
        });
    }

    parseChapters($: any, mangaId: string): Chapter[] {
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

    parseChapterDetails(mangaId: string, chapterId: string, rawHtml: string, baseUrl: string): ChapterDetails {
        const match = rawHtml.match(/([0-9]+)\s*pages/i);
        const totalPages = match ? parseInt(match[1], 10) : 1;

        const pages: string[] = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`${baseUrl}/api/legacy-media/${chapterId}/${i}`);
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }

    isLastPage($: any): boolean {
        const hasNext = $('.catalog-pagination a:contains("Next")').length > 0;
        const itemCount = $('a[href^="/g/"]').length;
        if (!hasNext && itemCount < 10) {
            return true;
        }
        return false;
    }

    getSearchTags(): TagSection[] {
        return [
            App.createTagSection({
                id: 'collections',
                label: 'Collections',
                tags: [
                    App.createTag({ id: 'collection/hentai-and-manga-english-42635', label: 'Hentai and Manga English' }),
                    App.createTag({ id: 'collection/fakku-comics-32996', label: 'Fakku Comics' }),
                    App.createTag({ id: 'collection/affect3d-comics-146084', label: 'Affect3D Comics' }),
                    App.createTag({ id: 'collection/renderotica-comics-87107', label: 'Renderotica Comics' }),
                    App.createTag({ id: 'collection/fansadox-comics-333415', label: 'Fansadox Comics' }),
                    App.createTag({ id: 'collection/various-authors-1', label: 'Various Authors' }),
                ],
            }),
            App.createTagSection({
                id: 'genres',
                label: 'Tags & Genres',
                tags: [
                    App.createTag({ id: 'uncensored', label: 'Uncensored' }),
                    App.createTag({ id: '3d', label: '3D' }),
                    App.createTag({ id: 'big-tits', label: 'Big Tits' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'incest', label: 'Incest' }),
                    App.createTag({ id: 'cheating', label: 'Cheating' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'anal', label: 'Anal' }),
                    App.createTag({ id: 'blowjob', label: 'Blowjob' }),
                    App.createTag({ id: 'creampie', label: 'Creampie' }),
                ],
            }),
        ];
    }
}
