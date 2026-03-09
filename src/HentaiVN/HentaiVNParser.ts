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

        // Try multiple selectors for manga items - sites vary in structure
        const selectors = [
            '.manga-vertical .item',
            '.manga-item',
            '.story-item',
            '.comic-item',
            '.post-item',
            '.item',
            '.card-item',
            'div[data-manga]'
        ]

        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const $el = $(el)
                
                // Try to find title link
                const titleLink = $el.find('a[href*="truyen"], a[href*="/hentai"], a[href*="-doc-"]').first()
                const href = titleLink.attr('href') || $el.find('a').first().attr('href') || ''

                // Skip if no valid href or if it's a chapter link
                if (!href || href.includes('/chapter') || href.includes('-xem-')) return

                // Extract manga ID from URL
                // Pattern: /12345-doc-truyen-name.html or /truyen-hentai/name
                let id = ''
                const docMatch = href.match(/\/(\d+)-doc-truyen/)
                const truyenMatch = href.match(/\/truyen[/-]?hentai?\/(.+?)(?:\.html|$|\?)/)
                
                if (docMatch) {
                    id = docMatch[1]
                } else if (truyenMatch) {
                    id = truyenMatch[1]
                } else {
                    // Use the path as ID
                    id = href.replace(/https?:\/\/hentaivn\.college/, '').replace(/^\//, '').replace(/\.html$/, '')
                }

                if (!id) return

                // Get title
                let title = titleLink.attr('title') || titleLink.text().trim() || $el.find('img').attr('alt') || ''
                if (!title) title = $el.find('h3, h4, .title, .name').text().trim()
                if (!title) return

                // Get image
                let image = $el.find('img').attr('src') || $el.find('img').attr('data-src') || $el.find('img').attr('data-lazy-src') || ''
                
                // Try background image
                if (!image) {
                    const bg = $el.find('[style*="background"]').attr('style')
                    if (bg) {
                        const match = bg.match(/url\(['"]?(.*?)['"]?\)/)
                        if (match) image = match[1]
                    }
                }

                if (!image) return

                // Proxy the image
                image = `${proxyUrl}?url=${encodeURIComponent(image)}`

                results.push(App.createPartialSourceManga({
                    mangaId: id,
                    title,
                    image
                }))
            })

            if (results.length > 0) break
        }

        console.log(`[HentaiVN] ParseHomePage: Found ${results.length} manga items`)
        return results
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl: string): SourceManga {
        // Try multiple selectors for title
        const title = 
            $('.page-info h1').text().trim() ||
            $('.manga-title').text().trim() ||
            $('h1.title').text().trim() ||
            $('meta[property="og:title"]').attr('content')?.trim() ||
            $('.itemcrumb.active span').text().trim() ||
            'Unknown Title'

        // Try multiple selectors for image
        let image = 
            $('.col-image img').attr('src') ||
            $('.image-manga img').attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            $('.cover img').attr('src') ||
            $('.manga-cover img').attr('src') ||
            ''

        if (image && !image.startsWith('http')) {
            image = `https://hentaivn.college${image.startsWith('/') ? '' : '/'}${image}`
        }
        if (image) {
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`
        }

        let author = 'Unknown'
        let status = 'Ongoing'

        // Try multiple selectors for author and status
        $('p, .info-item, .detail-info li').each((_: any, el: any) => {
            const text = $(el).text()
            if (text.includes('Tác giả') || text.includes('Author')) {
                author = $(el).find('a').text().trim() || text.replace(/Tác giả|Author|:/g, '').trim()
                if (!author || author === 'Unknown') author = 'Unknown'
            }
            if (text.includes('Tình trạng') || text.includes('Status')) {
                const statusText = $(el).find('span').text().trim() || text.replace(/Tình trạng|Status|:/g, '').trim()
                if (statusText.toLowerCase().includes('đã hoàn thành') || statusText.toLowerCase().includes('completed') || statusText.toLowerCase().includes('full')) {
                    status = 'Completed'
                }
            }
        })

        const tags: Tag[] = []
        // Try multiple selectors for genres/tags
        const tagSelectors = [
            'a[href*="tim-truyen/"]',
            'a[href*="/the-loai/"]',
            'a[href*="/genre/"]',
            '.genre a',
            '.tags a',
            '.taxonomy a'
        ]

        for (const selector of tagSelectors) {
            $(selector).each((_: any, el: any) => {
                const href = $(el).attr('href') || ''
                const label = $(el).text().trim()
                if (label && !label.includes('Tác giả') && !label.includes('Tình trạng')) {
                    const id = href.split('/').pop()?.replace(/\?.*$/, '') || label.toLowerCase().replace(/\s+/g, '-')
                    tags.push(App.createTag({ id, label }))
                }
            })
            if (tags.length > 0) break
        }

        const desc = 
            $('.detail-content').text().trim() ||
            $('.summary').text().trim() ||
            $('.description').text().trim() ||
            $('meta[property="og:description"]').attr('content')?.trim() ||
            ''

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
        })
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters($: CheerioAPI, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []

        // Try multiple selectors for chapter list
        const selectors = [
            '.list-chapter a',
            'a[href*="-doc-truyen-"]',
            'a[href*="-xem-truyen-"]',
            '.chapter-list a',
            '.chapters a',
            '.episode-list a',
            'ul.chapters li a',
            '.chapter-item a'
        ]

        for (const selector of selectors) {
            $(selector).each((_: any, el: any) => {
                const href = $(el).attr('href') || ''
                const title = $(el).text().trim() || 'Chapter'

                // Skip if no href
                if (!href) return

                // Extract chapter ID from URL
                // Pattern: /12345-60558-xem-truyen-name.html or /manga-id/chapter-id
                let id = ''
                
                // Match: 12345-60558-xem-truyen -> chapter ID is 60558
                const xemMatch = href.match(/-(\d+)-xem-truyen/)
                // Match: /12345-doc-truyen -> manga ID from doc (but we need chapter)
                const docMatch = href.match(/\/(\d+)-doc-truyen/)
                
                if (xemMatch) {
                    id = xemMatch[1]
                } else if (docMatch) {
                    // Use the full path minus domain as ID
                    id = href.replace(/https?:\/\/hentaivn\.college/, '').replace(/^\//, '').replace(/\.html$/, '')
                } else {
                    // Use the path as is
                    id = href.replace(/https?:\/\/hentaivn\.college/, '').replace(/^\//, '').replace(/\.html$/, '')
                }

                if (!id) return

                // Try to extract chapter number
                const numMatch = title.match(/chapter\s*(\d+)/i) || title.match(/ch\.?\s*(\d+)/i) || title.match(/(\d+)/)
                const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1

                // Try to get date
                let time = new Date()
                const dateText = $(el).parent().find('.time, .date, .chapter-date').text().trim()
                if (dateText) {
                    const parsed = new Date(dateText)
                    if (!isNaN(parsed.getTime())) time = parsed
                }

                chapters.push(App.createChapter({
                    id: id,
                    name: title,
                    chapNum,
                    time,
                    langCode: 'vi'
                }))
            })

            if (chapters.length > 0) break
        }

        // Reverse to show newest first
        return chapters.reverse()
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
