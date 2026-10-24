import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    TagSection,
} from '@paperback/types';

export class HentaiVNParser {
    parseCards($: any, baseUrl: string, selector = 'div.items .item, .items-slide .item, .list-items .item, .Item', proxyUrl?: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];
        const seenIds = new Set<string>();

        $(selector).each((_: any, el: any) => {
            const linkEl = $(el).find('a[href*="/truyen-hentai/"]').first();
            const href = linkEl.attr('href') || '';
            const mangaId = href.replace(/.*?\/truyen-hentai\//, '').replace(/\/+$/, '').trim();

            if (!mangaId || seenIds.has(mangaId)) return;
            seenIds.add(mangaId);

            let title = $(el).find('h3 a, figcaption h3, .title a, h3').first().text().trim();
            if (!title) {
                title = linkEl.attr('title')?.trim() || '';
            }
            if (!title) return;

            let image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }
            if (proxyUrl && image && image.startsWith('http')) {
                image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
            }

            const chapter = $(el).find('ul.comic-item li, .chapter a, .ep a, .chapter').first().text().replace(/\s+/g, ' ').trim();

            mangaList.push(
                App.createPartialSourceManga({
                    mangaId,
                    image: image || `${baseUrl}/images/logo-hentai.png`,
                    title,
                    subtitle: chapter || undefined,
                })
            );
        });

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string, proxyUrl?: string): SourceManga {
        const rawTitle = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            mangaId;
        const title = rawTitle.replace(/HentaiVn\s*-\s*/i, '').replace(/\s*\[Tới Chap.*?\]/i, '').trim();

        let image = $('.col-image img').attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        if (proxyUrl && image && image.startsWith('http')) {
            image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
        }

        const desc = $('.detail-content p, .detail-content').first().text().trim() || 'Không có mô tả';

        let author = 'Đang cập nhật';
        let status = 'Đang cập nhật';

        $('li.row, .list-info p, .detail-info li').each((_: any, el: any) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text.includes('Tác giả')) {
                const match = $(el).find('.col-xs-8').text().trim() || text.replace(/Tác giả\s*/i, '').trim();
                if (match && match.toLowerCase() !== 'đang cập nhật') {
                    author = match;
                }
            }
            if (text.includes('Tình trạng')) {
                const match = $(el).find('.col-xs-8').text().trim() || text.replace(/Tình trạng\s*/i, '').trim();
                if (match) {
                    status = match;
                }
            }
        });

        // If author is still "Đang cập nhật", check title brackets for [Artist] or (Artist)
        if (author === 'Đang cập nhật') {
            const bracketMatch = rawTitle.match(/^\s*\[([^\]]+)\]/) || rawTitle.match(/^\s*\(([^)]+)\)/);
            if (bracketMatch && bracketMatch[1]) {
                const candidate = bracketMatch[1].trim();
                if (!/tới chap|full|truyện|chapter|chap/i.test(candidate)) {
                    author = candidate;
                }
            }
        }

        const tags: { id: string; label: string }[] = [];
        $('li.kind a, .detail-info .kind a, .kind a[href*="/tim-truyen/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const tagId = href.replace(/.*?\/tim-truyen\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });

        const tagSections: TagSection[] = [];
        if (author && author.toLowerCase() !== 'đang cập nhật') {
            tagSections.push(
                App.createTagSection({
                    id: 'artist',
                    label: 'Tác giả',
                    tags: [App.createTag({ id: `artist:${author}`, label: author })],
                })
            );
        }

        if (tags.length > 0) {
            tagSections.push(
                App.createTagSection({
                    id: 'genres',
                    label: 'Thể loại',
                    tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
                })
            );
        }

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/images/logo-hentai.png`,
                desc,
                status,
                author,
                artist: author !== 'Đang cập nhật' ? author : undefined,
                tags: tagSections,
            }),
        });
    }

    parseChapters($: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];
        const seenIds = new Set<string>();

        $('.list-chapter .chapter a, .nt_listchapter .chapter a').each((i: number, el: any) => {
            const rawHref = $(el).attr('href') || '';
            const chapId = rawHref.replace(/.*?\/truyen-hentai\//, '').replace(/\/+$/, '').trim();
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

        return chapters;
    }

    parseChapterDetails($: any, mangaId: string, chapterId: string, baseUrl: string, proxyUrl?: string): ChapterDetails {
        const pages: string[] = [];

        $('.reading-detail img, .page-chapter img').each((_: any, el: any) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || '';
            src = src.trim();
            if (!src || src.includes('bn.png') || src.includes('logo')) {
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
        const hasNext = $('a[rel="next"]').length > 0 || $('li.active + li a').length > 0;
        const itemCount = $('div.items .item, .list-items .item').length;
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
                    App.createTag({ id: 'manga', label: 'Manga' }),
                    App.createTag({ id: 'doujinshi', label: 'Doujinshi' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'ntr', label: 'NTR' }),
                    App.createTag({ id: 'truyen-mau', label: 'Truyện Màu' }),
                    App.createTag({ id: 'truyen-khong-che', label: 'Không Che' }),
                    App.createTag({ id: 'uncensored', label: 'Uncensored' }),
                    App.createTag({ id: 'full-color', label: 'Full Color' }),
                    App.createTag({ id: 'loan-luan', label: 'Loạn Luân' }),
                    App.createTag({ id: 'incest', label: 'Incest' }),
                    App.createTag({ id: 'big-boobs', label: 'Big Boobs' }),
                    App.createTag({ id: 'huge-boobs', label: 'Huge Boobs' }),
                    App.createTag({ id: 'big-breasts', label: 'Big Breasts' }),
                    App.createTag({ id: 'ahegao', label: 'Ahegao' }),
                    App.createTag({ id: 'blowjob', label: 'Blowjob' }),
                    App.createTag({ id: 'cheating', label: 'Cheating' }),
                    App.createTag({ id: 'cosplay', label: 'Cosplay' }),
                    App.createTag({ id: 'gangbang', label: 'Gangbang' }),
                    App.createTag({ id: 'group', label: 'Group' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'mind-control', label: 'Mind Control' }),
                    App.createTag({ id: 'mind-break', label: 'Mind Break' }),
                    App.createTag({ id: 'mother', label: 'Mother' }),
                    App.createTag({ id: 'nakadashi', label: 'Nakadashi' }),
                    App.createTag({ id: 'nu-sinh', label: 'Nữ Sinh' }),
                    App.createTag({ id: 'oneshot', label: 'Oneshot' }),
                    App.createTag({ id: 'paizuri', label: 'Paizuri' }),
                    App.createTag({ id: 'rape', label: 'Rape' }),
                    App.createTag({ id: 'romance', label: 'Romance' }),
                    App.createTag({ id: 'schoolgirl', label: 'Schoolgirl' }),
                    App.createTag({ id: 'vanilla', label: 'Vanilla' }),
                    App.createTag({ id: 'yuri', label: 'Yuri' }),
                ],
            }),
        ];
    }
}
