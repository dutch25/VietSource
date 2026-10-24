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
        const jsonLdTags: string[] = [];

        // 1. Extract from Book JSON-LD schema
        $('script[type="application/ld+json"]').each((_: any, s: any) => {
            try {
                const data = JSON.parse($(s).html());
                if (data && data['@type'] === 'Book') {
                    if (data.author?.name && !/dang cap nhat|đang cập nhật/i.test(data.author.name)) {
                        author = data.author.name.trim();
                    }
                    if (Array.isArray(data.genre)) {
                        for (const g of data.genre) {
                            if (g && typeof g === 'string') jsonLdTags.push(g.trim());
                        }
                    } else if (typeof data.genre === 'string') {
                        jsonLdTags.push(data.genre.trim());
                    }
                    if (typeof data.keywords === 'string') {
                        for (const kw of data.keywords.split(',')) {
                            const trimmed = kw.trim();
                            if (trimmed && !/tranh18|truyen tranh 18/i.test(trimmed)) {
                                jsonLdTags.push(trimmed);
                            }
                        }
                    }
                }
            } catch (e) {}
        });

        // 2. Check DOM Author
        if (author === 'Đang cập nhật') {
            const authorText = $('.bd-author a').first().text().replace(/\s+/g, ' ').trim() ||
                $('.bd-author').first().text().replace(/Tác giả\s*:\s*/i, '').replace(/\s+/g, ' ').trim();
            if (authorText && !/dang cap nhat|đang cập nhật/i.test(authorText)) {
                author = authorText;
            }
        }

        // 3. Check bracket author in title (e.g. [Artist Name])
        if (author === 'Đang cập nhật') {
            const bracketMatch = rawTitle.match(/^\s*\[([^\]]+)\]/) || rawTitle.match(/^\s*\(([^)]+)\)/);
            if (bracketMatch && bracketMatch[1]) {
                const candidate = bracketMatch[1].trim();
                if (!/tới chap|full|truyện|chapter|chap/i.test(candidate)) {
                    author = candidate;
                }
            }
        }

        const fullText = $.text();
        const status = fullText.includes('Hoàn thành') ? 'Hoàn thành' : 'Đang cập nhật';

        const tags: { id: string; label: string }[] = [];
        const seen = new Set<string>();
        const addTag = (id: string, label: string) => {
            const cleanId = id.trim();
            const cleanLabel = label.trim();
            if (cleanId && cleanLabel && !seen.has(cleanId.toLowerCase())) {
                seen.add(cleanId.toLowerCase());
                tags.push({ id: cleanId, label: cleanLabel });
            }
        };

        // 4. Collect tags from .bd-tags and links
        $('.bd-tags a, a[href*="/tag/"], a[href*="comics?tag="]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            let tagId = '';
            if (href.includes('/tag/')) {
                tagId = href.replace(/.*?\/tag\//, '').replace(/\/+$/, '').trim();
            } else if (href.includes('tag=')) {
                const m = href.match(/[?&]tag=([^&]+)/);
                tagId = m ? decodeURIComponent(m[1]) : '';
            }
            const label = $(el).text().trim();
            if (tagId && label && label.toLowerCase() !== 'từ khóa:') {
                addTag(tagId, label);
            }
        });

        // Collect tags from JSON-LD
        for (const g of jsonLdTags) {
            addTag(g.toLowerCase(), g);
        }

        // Collect genre from .bd-facts (e.g. Thể loại 18+)
        $('.bd-facts a, .bd-facts .bd-fact').each((_: any, el: any) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text.includes('Thể loại')) {
                const val = $(el).find('b').text().trim() || text.replace(/Thể loại\s*/i, '').trim();
                if (val && val !== 'Thể loại') {
                    addTag(val.toLowerCase(), val);
                }
            }
        });

        const tagSections: TagSection[] = [];
        if (author && author !== 'Đang cập nhật') {
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
                image: image || `${baseUrl}/static/images/favicon.ico`,
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
                    App.createTag({ id: '18+', label: '18+' }),
                    App.createTag({ id: 'adult', label: 'Adult' }),
                    App.createTag({ id: 'ahegao', label: 'Ahegao' }),
                    App.createTag({ id: 'anal', label: 'Anal' }),
                    App.createTag({ id: 'bdsm', label: 'BDSM' }),
                    App.createTag({ id: 'big-ass', label: 'Big Ass' }),
                    App.createTag({ id: 'big-boobs', label: 'Big Boobs' }),
                    App.createTag({ id: 'big-penis', label: 'Big Penis' }),
                    App.createTag({ id: 'blowjobs', label: 'BlowJobs' }),
                    App.createTag({ id: 'cheating', label: 'Cheating' }),
                    App.createTag({ id: 'choi-hai-lo', label: 'Chơi Hai Lỗ' }),
                    App.createTag({ id: 'comedy', label: 'Comedy' }),
                    App.createTag({ id: 'cosplay', label: 'Cosplay' }),
                    App.createTag({ id: 'cunnilingus', label: 'Cunnilingus' }),
                    App.createTag({ id: 'doujinshi', label: 'Doujinshi' }),
                    App.createTag({ id: 'drama', label: 'Drama' }),
                    App.createTag({ id: 'ecchi', label: 'Ecchi' }),
                    App.createTag({ id: 'elf', label: 'Elf' }),
                    App.createTag({ id: 'fantasy', label: 'Fantasy' }),
                    App.createTag({ id: 'femdom', label: 'Femdom' }),
                    App.createTag({ id: 'fingering', label: 'Fingering' }),
                    App.createTag({ id: 'footjob', label: 'Footjob' }),
                    App.createTag({ id: 'full-color', label: 'Full Color' }),
                    App.createTag({ id: 'furry', label: 'Furry' }),
                    App.createTag({ id: 'gangbang', label: 'GangBang' }),
                    App.createTag({ id: 'glasses', label: 'Glasses' }),
                    App.createTag({ id: 'group', label: 'Group' }),
                    App.createTag({ id: 'handjob', label: 'Handjob' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'hentai', label: 'Hentai' }),
                    App.createTag({ id: 'housewife', label: 'Housewife' }),
                    App.createTag({ id: 'incest', label: 'Incest' }),
                    App.createTag({ id: 'isekai', label: 'Isekai' }),
                    App.createTag({ id: 'lang-man', label: 'Lãng Mạn' }),
                    App.createTag({ id: 'manga', label: 'Manga' }),
                    App.createTag({ id: 'manhua', label: 'Manhua' }),
                    App.createTag({ id: 'masturbation', label: 'Masturbation' }),
                    App.createTag({ id: 'mature', label: 'Mature' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'mind-break', label: 'Mind Break' }),
                    App.createTag({ id: 'mind-control', label: 'Mind Control' }),
                    App.createTag({ id: 'mother', label: 'Mother' }),
                    App.createTag({ id: 'nakadashi', label: 'Nakadashi' }),
                    App.createTag({ id: 'netori', label: 'Netori' }),
                    App.createTag({ id: 'ntr', label: 'NTR' }),
                    App.createTag({ id: 'nu-sinh', label: 'Nữ Sinh' }),
                    App.createTag({ id: 'oneshot', label: 'Oneshot' }),
                    App.createTag({ id: 'paizuri', label: 'Paizuri' }),
                    App.createTag({ id: 'pantyhose', label: 'Pantyhose' }),
                    App.createTag({ id: 'pregnant', label: 'Pregnant' }),
                    App.createTag({ id: 'rape', label: 'Rape' }),
                    App.createTag({ id: 'romance', label: 'Romance' }),
                    App.createTag({ id: 'schoolgirl', label: 'SchoolGirl' }),
                    App.createTag({ id: 'sex-toys', label: 'Sex Toys' }),
                    App.createTag({ id: 'shota', label: 'Shota' }),
                    App.createTag({ id: 'sister', label: 'Sister' }),
                    App.createTag({ id: 'slave', label: 'Slave' }),
                    App.createTag({ id: 'small-boobs', label: 'Small Boobs' }),
                    App.createTag({ id: 'smut', label: 'Smut' }),
                    App.createTag({ id: 'stockings', label: 'Stockings' }),
                    App.createTag({ id: 'supernatural', label: 'Supernatural' }),
                    App.createTag({ id: 'swimsuit', label: 'Swimsuit' }),
                    App.createTag({ id: 'tentacles', label: 'Tentacles' }),
                    App.createTag({ id: 'truyen-khong-che', label: 'Truyện Không Che' }),
                    App.createTag({ id: 'truyen-mau', label: 'Truyện Màu' }),
                    App.createTag({ id: 'uncensored', label: 'Uncensored' }),
                    App.createTag({ id: 'vanilla', label: 'Vanilla' }),
                    App.createTag({ id: 'veu-to', label: 'Vếu To' }),
                    App.createTag({ id: 'virgin', label: 'Virgin' }),
                    App.createTag({ id: 'webtoon', label: 'Webtoon' }),
                    App.createTag({ id: 'x-ray', label: 'X-ray' }),
                    App.createTag({ id: 'yaoi', label: 'Yaoi' }),
                    App.createTag({ id: 'yuri', label: 'Yuri' }),
                ],
            }),
        ];
    }
}
