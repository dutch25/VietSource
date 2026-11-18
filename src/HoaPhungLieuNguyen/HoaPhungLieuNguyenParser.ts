import {
    Chapter,
    ChapterDetails,
    SourceManga,
    PartialSourceManga,
} from '@paperback/types';

export class Parser {
    parseTapsList(taps: any[], baseUrl: string): PartialSourceManga[] {
        const mangaList: PartialSourceManga[] = [];

        // 1. Single entry for reading all chapters
        mangaList.push(
            App.createPartialSourceManga({
                mangaId: 'hoa-phung-lieu-nguyen-full',
                title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
                image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                subtitle: 'Hơn 637+ Hồi Full',
            })
        );

        // Sort taps numerically if possible: 'tap-1', 'tap-2' ...
        const sortedTaps = [...taps].sort((a, b) => {
            const numA = parseInt((a.slug || '').replace(/\D+/g, ''), 10) || 0;
            const numB = parseInt((b.slug || '').replace(/\D+/g, ''), 10) || 0;
            return numA - numB;
        });

        for (const tap of sortedTaps) {
            const tapNum = (tap.slug || '').replace(/\D+/g, '') || tap.name;
            mangaList.push(
                App.createPartialSourceManga({
                    mangaId: tap.slug,
                    title: tap.name || `Tập ${tapNum}`,
                    image: `${baseUrl}/wp-content/uploads/2026/09/Tap-${tapNum}-bia-768x1135.jpg`,
                    subtitle: `${tap.count || 0} Hồi`,
                })
            );
        }

        return mangaList;
    }

    parseMangaDetails($: any, mangaId: string, baseUrl: string): SourceManga {
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Hỏa Phụng Liêu Nguyên', 'The Ravages of Time', '火鳳燎原'],
                    image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                    desc: 'Hỏa Phụng Liêu Nguyên (The Ravages of Time) là tác phẩm truyện tranh dã sử kinh điển của tác giả Trần Mưu. Lấy bối cảnh thời Tam Quốc đầy biến động, xoay quanh mưu trí tuyệt đỉnh của Bát Kỳ cùng những trận chiến hào hùng của Liệu Nguyên Hỏa và Tư Mã Ý.',
                    author: 'Trần Mưu (Chan Mou)',
                    artist: 'Trần Mưu (Chan Mou)',
                    status: 'Đang tiến hành',
                    tags: [
                        App.createTagSection({
                            id: 'genres',
                            label: 'Thể loại',
                            tags: [
                                App.createTag({ id: 'action', label: 'Action' }),
                                App.createTag({ id: 'historical', label: 'Historical' }),
                                App.createTag({ id: 'martial-arts', label: 'Martial Arts' }),
                                App.createTag({ id: 'seinen', label: 'Seinen' }),
                                App.createTag({ id: 'strategy', label: 'Chiến thuật' }),
                            ],
                        }),
                    ],
                }),
            });
        }

        // It is a specific Tap (e.g. tap-1)
        const title = $('h1').first().text().trim() || mangaId;
        const desc = $('.tap-description, .entry-content, p').first().text().trim() || 'Hỏa Phụng Liêu Nguyên';
        
        let coverImg = $('img[src*="Tap-"], img[src*="tap-"]').first().attr('src') || '';
        if (!coverImg) {
            coverImg = `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`;
        }

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title, 'Hỏa Phụng Liêu Nguyên'],
                image: coverImg,
                desc: desc,
                author: 'Trần Mưu (Chan Mou)',
                artist: 'Trần Mưu (Chan Mou)',
                status: 'Đang tiến hành',
                tags: [
                    App.createTagSection({
                        id: 'genres',
                        label: 'Thể loại',
                        tags: [
                            App.createTag({ id: 'action', label: 'Action' }),
                            App.createTag({ id: 'historical', label: 'Historical' }),
                            App.createTag({ id: 'martial-arts', label: 'Martial Arts' }),
                        ],
                    }),
                ],
            }),
        });
    }

    parseChaptersFromHtml($: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];

        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            // Parse from select reader dropdown (<select class="reader-chapter-select">)
            $('select option').each((_: number, elem: any) => {
                const url = $(elem).attr('value');
                const title = $(elem).text().trim();
                if (!url || !url.includes('/hoi-')) return;

                // Extract chapter number
                const numMatch = title.match(/Hồi\s*(\d+(\.\d+)?)/i) || url.match(/hoi-(\d+(\.\d+)?)/i);
                const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;

                chapters.push(
                    App.createChapter({
                        id: url,
                        chapNum: chapNum,
                        name: title,
                        langCode: '🇻🇳',
                    })
                );
            });

            // Sort descending: newest on top
            return chapters.sort((a, b) => b.chapNum - a.chapNum);
        }

        // Single tap page: list of chapters
        $('a[href*="/hoi-"]').each((_: number, elem: any) => {
            const url = $(elem).attr('href');
            let name = $(elem).find('.chuong-list-title').text().trim();
            if (!name) name = $(elem).text().trim();
            if (!url || !url.includes('/hoi-')) return;

            const numMatch = name.match(/Hồi\s*(\d+(\.\d+)?)/i) || url.match(/hoi-(\d+(\.\d+)?)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;

            chapters.push(
                App.createChapter({
                    id: url,
                    chapNum: chapNum,
                    name: name,
                    langCode: '🇻🇳',
                })
            );
        });

        // Filter duplicates by id
        const seen = new Set<string>();
        const unique = chapters.filter(c => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
        });

        return unique.sort((a, b) => b.chapNum - a.chapNum);
    }

    parseChapterDetails($: any, chapterId: string): ChapterDetails {
        const pages: string[] = [];

        // In reader: <img class="hpln-page" data-src="..." src="..." ...>
        $('img.hpln-page, .reader-content img, .entry-content img, article img').each((_: number, elem: any) => {
            let src = $(elem).attr('data-src') || $(elem).attr('data-lazy-src') || $(elem).attr('src') || '';
            src = src.trim();
            if (src && !src.startsWith('data:image') && (src.includes('.webp') || src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg'))) {
                pages.push(src);
            }
        });

        // Remove duplicates while preserving order
        const uniquePages = [...new Set(pages)];

        return App.createChapterDetails({
            id: chapterId,
            mangaId: 'hoa-phung-lieu-nguyen',
            pages: uniquePages,
        });
    }
}
