import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($: CheerioAPI, proxyUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        $('.item').each((_, el) => {
            const aObj = $(el).find('a').first()
            const href = aObj.attr('href') || ''

            // Expected: /truyen-hentai/kakutou-jk-wakara-sex-53488.html
            // Or /12345-doc-truyen-name.html
            // The cleanest ID is just the URL path excluding the domain to avoid regex headaches
            let id = href.replace('https://hentaivn.college', '').replace('https://www.hentaivn.college', '')
            if (!id || id === '/') return

            const imgObj = $(el).find('img').first()
            const title = imgObj.attr('alt') || aObj.attr('title') || aObj.text().trim()
            let image = imgObj.attr('data-src') || imgObj.attr('src') || ''

            if (!image) {
                const style = $(el).find('.b-cover').attr('style')
                if (style) {
                    const match = style.match(/url\(['"]?(.*?)['"]?\)/)
                    if (match) image = match[1]
                }
            }

            if (!title || !image) return

            // Proxy the image to bypass restrictions
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`

            results.push(App.createPartialSourceManga({
                mangaId: id,
                title,
                image
            }))
        })

        return results
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl: string): SourceManga {
        const title = $('.page-info h1').text().trim() || $('.itemcrumb.active span').text().trim() || 'Unknown Title';

        let image = $('.col-image img').attr('src') || $('.image-manga img').attr('src') || '';
        image = image.startsWith('http') ? image : `https://hentaivn.college${image}`;
        image = `${proxyUrl}?url=${encodeURIComponent(image)}&source=hentaivn.college`;

        let author = 'Unknown';
        let status = 'Ongoing';

        $('p').each((_: any, el: any) => {
            const text = $(el).text();
            if (text.includes('Tác giả')) {
                author = $(el).find('a').text().trim() || text.replace('Tác giả', '').replace(':', '').trim() || 'Unknown';
            }
            if (text.includes('Tình trạng')) {
                const statusText = $(el).find('span').text().trim() || text.replace('Tình trạng', '').replace(':', '').trim();
                if (statusText.toLowerCase().includes('đã hoàn thành') || statusText.toLowerCase().includes('completed')) {
                    status = 'Completed';
                }
            }
        });

        const tags: Tag[] = [];
        $('a[href*="tim-truyen/"]').each((_: any, el: any) => {
            tags.push(App.createTag({
                id: $(el).attr('href')?.split('/').pop() || $(el).attr('href') || '',
                label: $(el).text().trim()
            }));
        });

        const desc = $('.detail-content').text().trim() || $('.summary').text().trim() || '';

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: status === 'Completed' ? 'completed' : 'ongoing',
                author: author,
                desc: desc,
                tags: [App.createTagSection({ id: '0', label: 'genres', tags: tags })],
            })
        });
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters($: CheerioAPI, mangaId: string): Chapter[] {
        const chapters: Chapter[] = [];

        $('.list-chapter a, a[href*="-doc-truyen-"], a[href*="-xem-truyen-"]').each((_: any, el: any) => {
            const href = $(el).attr('href') || '';
            const title = $(el).text().trim() || 'Chapter';

            let idMatch = href.match(/(\d+)-doc-truyen/);
            if (!idMatch) idMatch = href.match(/(\d+)-xem-truyen/);

            let id = idMatch ? idMatch[1] : href.replace('https://hentaivn.college', '').replace('https://www.hentaivn.college', '');
            if (id.startsWith('/')) id = id.substring(1);

            const dateStr = $(el).closest('tr').find('td').last().text().trim() || $(el).parent().find('.time').text().trim();

            if (id && id !== '/') {
                chapters.push(App.createChapter({
                    id: id,
                    name: title,
                    chapNum: chapters.length + 1,
                    time: new Date(),
                    langCode: 'vi'
                }));
            }
        });

        return chapters.reverse();
    }

    // ─── Pages ────────────────────────────────────────────────────────────────
    parseChapterDetails($: CheerioAPI, chapterId: string, mangaId: string, proxyUrl: string): string[] {
        const pages: string[] = [];

        // HentaiVN typically has images in .page-image img or similar selectors
        // Common patterns: .page-image img, #page img, .content img
        const selectors = [
            '.page-image img',
            '#page img',
            '.content img',
            '.chapter-content img',
            'div[data-index] img',
            'img[src*="hentaivn"]',
            'img.chapter-img'
        ];

        for (const selector of selectors) {
            $(selector).each((_: number, el: any) => {
                let src = $(el).attr('data-src') || $(el).attr('src') || '';
                if (src && !src.startsWith('data:') && src.includes('.')) {
                    src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
                    if (!pages.includes(src)) {
                        pages.push(src);
                    }
                }
            });
            if (pages.length > 0) break;
        }

        // Fallback: try to find all images with numeric src patterns
        if (pages.length === 0) {
            $('img').each((_: number, el: any) => {
                let src = $(el).attr('data-src') || $(el).attr('src') || '';
                if (src && !src.startsWith('data:') && (src.match(/\.(jpg|jpeg|png|gif|webp)/i) || src.match(/\/\d+\//))) {
                    src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
                    if (!pages.includes(src)) {
                        pages.push(src);
                    }
                }
            });
        }

        return pages;
    }

    // ─── Search Tags ──────────────────────────────────────────────────────────
    getSearchTags(): TagSection[] {
        const tags: Tag[] = [
            { id: 'action', label: 'Hành Động' },
            { id: 'adventure', label: 'Phiêu Lưu' },
            { id: 'comedy', label: 'Hài Hước' },
            { id: 'doujinshi', label: 'Doujinshi' },
            { id: 'drama', label: 'Drama' },
            { id: 'ecchi', label: 'Ecchi' },
            { id: 'fantasy', label: 'Fantasy' },
            { id: 'gender-bender', label: 'Gender Bender' },
            { id: 'harem', label: 'Harem' },
            { id: 'historical', label: 'Lịch Sử' },
            { id: 'horror', label: 'Kinh Dị' },
            { id: 'joshi', label: 'Joshi' },
            { id: 'lolicon', label: 'Lolicon' },
            { id: 'manga', label: 'Manga' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'martial-arts', label: 'Võ Thuật' },
            { id: 'mature', label: 'Mature' },
            { id: 'mecha', label: 'Mecha' },
            { id: 'mystery', label: ' Bí Ẩn' },
            { id: 'netorare', label: 'Netorare' },
            { id: 'ntr', label: 'NTR' },
            { id: 'psychological', label: 'Tâm Lý' },
            { id: 'romance', label: 'Lãng Mạn' },
            { id: 'school-life', label: 'School Life' },
            { id: 'sci-fi', label: 'Khoa Học' },
            { id: 'seinen', label: 'Seinen' },
            { id: 'shoujo', label: 'Shoujo' },
            { id: 'shounen', label: 'Shounen' },
            { id: 'slice-of-life', label: 'Đời Thường' },
            { id: 'smut', label: 'Smut' },
            { id: 'sports', label: 'Thể Thao' },
            { id: 'supernatural', label: 'Siêu Nhiên' },
            { id: 'tragedy', label: 'Bi Kịch' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
        ];

        return [App.createTagSection({ id: '0', label: 'Thể Loại', tags })];
    }
}
