import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    private readonly BASE_DOMAIN = 'lxmanga.space'

    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($: CheerioAPI, proxyUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        // Main grid container: .grid.grid-cols-2 or .grid.grid-cols-3 etc
        // Each manga is inside .manga-vertical
        const selectors = [
            '.manga-vertical',
            '.grid .manga-vertical',
            '.grid-cols-2 .manga-vertical',
            '.grid-cols-3 .manga-vertical',
            '.grid-cols-6 .manga-vertical'
        ]

        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const $el = $(el)

                // Find manga link - pattern: /truyen/slug
                const titleLink = $el.find('a[href^="/truyen/"]').first()
                const href = titleLink.attr('href') || ''

                // Skip if no valid href or if it's a chapter link
                if (!href || href.includes('/chap-') || href.includes('/chapter-') || href.includes('/oneshot') || href.includes('/part-')) return

                // Extract manga slug from URL pattern: /truyen/slug
                const slugMatch = href.match(/\/truyen\/([^/?#]+)/)
                if (!slugMatch) return

                const mangaId = slugMatch[1]!
                if (!mangaId) return

                // Get title
                let title = titleLink.text().trim() || ''
                if (!title) {
                    // Try to get from title attribute
                    title = titleLink.attr('title') || ''
                }
                if (!title) return

                // Get image from data-bg attribute
                let image = $el.find('.cover.lazyload').attr('data-bg') || $el.find('.cover img').attr('src') || ''
                if (!image) {
                    const bg = $el.find('.cover').attr('style')
                    if (bg) {
                        const match = bg.match(/url\(['"]?(.*?)['"]?\)/)
                        if (match) image = match[1]
                    }
                }
                if (!image) return

                // Add domain if relative URL
                if (!image.startsWith('http')) {
                    image = `https://${this.BASE_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`
                }

                // Proxy the image
                image = `${proxyUrl}?url=${encodeURIComponent(image)}`

                results.push(App.createPartialSourceManga({
                    mangaId: mangaId,
                    title,
                    image
                }))
            })

            if (results.length > 0) break
        }

        console.log(`[LxManga] parseHomePage: Found ${results.length} items`)
        return results
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl: string): SourceManga {
        // Try to get title from various selectors
        const title = 
            $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content')?.trim() ||
            $('meta[name="twitter:title"]').attr('content')?.trim() ||
            $('title').text().trim() ||
            'Unknown Title'

        // Get cover image
        let image = 
            $('meta[property="og:image"]').attr('content')?.trim() ||
            $('.cover img').attr('src') ||
            ''

        if (image && !image.startsWith('http')) {
            image = `https://${this.BASE_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`
        }
        if (image) {
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`
        }

        // Get description
        const desc = 
            $('meta[property="og:description"]').attr('content')?.trim() ||
            $('.description').text().trim() ||
            $('.summary').text().trim() ||
            ''

        // Get author
        let author = 'Unknown'
        $('a[href*="/tac-gia/"], .author a, .author').each((_: any, el: any) => {
            const text = $(el).text().trim()
            if (text && text !== 'Unknown') {
                author = text
                return false // break
            }
        })

        // Get status
        let status = 'Ongoing'
        $('.status, .tinh-trang, .badge').each((_: any, el: any) => {
            const text = $(el).text().toLowerCase()
            if (text.includes('hoàn thành') || text.includes('completed') || text.includes('full')) {
                status = 'Completed'
                return false
            }
        })

        // Get genres/tags
        const genres: Tag[] = []
        $('a[href*="/the-loai/"], a[href*="/tag/"], .genre a, .tags a').each((_: any, el: any) => {
            const href = $(el).attr('href') || ''
            const label = $(el).text().trim()
            if (label && !label.includes('Tác giả')) {
                const id = href.split('/').pop() || label.toLowerCase().replace(/\s+/g, '-')
                genres.push(App.createTag({ id, label }))
            }
        })

        const tagSections: TagSection[] = []
        if (genres.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: genres }))
        }

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: status === 'Completed' ? 'completed' : 'ongoing',
                author: author,
                desc: desc,
                tags: tagSections,
            })
        })
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters($: CheerioAPI, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []

        // Try multiple selectors for chapter list
        const selectors = [
            'a[href^="/truyen/' + mangaId + '/chap-"]',
            'a[href^="/truyen/' + mangaId + '/chapter-"]',
            'a[href^="/truyen/' + mangaId + '/oneshot"]',
            'a[href^="/truyen/' + mangaId + '/part-"]',
            '.chapter-list a',
            '.chapters a',
            'ul.chapters li a',
            '.chapter-item a'
        ]

        for (const selector of selectors) {
            $(selector).each((_: any, el: any) => {
                const href = $(el).attr('href') || ''
                const title = $(el).text().trim() || 'Chapter'

                if (!href) return

                // Extract chapter ID from URL
                // Pattern: /truyen/slug/chap-1 or /truyen/slug/oneshot
                const chapMatch = href.match(/\/truyen\/[^/]+\/(chap-\d+|chapter-\d+|oneshot|part-\d+)/)
                if (!chapMatch) return

                const chapterId = chapMatch[1]!

                // Try to extract chapter number
                const numMatch = title.match(/(?:chap|chapter)\s*(\d+)/i) || title.match(/(\d+)/)
                const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1

                chapters.push(App.createChapter({
                    id: chapterId,
                    name: title,
                    chapNum,
                    time: new Date(),
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
        const pages: string[] = []

        // Try multiple selectors for page images
        const selectors = [
            '.page-image img',
            '#page img',
            '.chapter-content img',
            '.content img',
            'img[data-src]',
            'img.lazy'
        ]

        for (const selector of selectors) {
            $(selector).each((_: number, el: any) => {
                let src = $(el).attr('data-src') || $(el).attr('src') || ''
                
                // Skip empty, data URI, or placeholder images
                if (!src || src.startsWith('data:') || src.includes('load.gif') || src.includes('placeholder')) return

                // Skip non-image files
                if (!src.match(/\.(jpg|jpeg|png|gif|webp)/i) && !src.match(/\/\d+\//)) return

                // Add domain if relative URL
                if (!src.startsWith('http')) {
                    src = `https://${this.BASE_DOMAIN}${src.startsWith('/') ? '' : '/'}${src}`
                }

                // Proxy the image
                src = `${proxyUrl}?url=${encodeURIComponent(src)}`
                
                if (!pages.includes(src)) {
                    pages.push(src)
                }
            })

            if (pages.length > 0) break
        }

        return pages
    }

    // ─── Search Tags ──────────────────────────────────────────────────────────
    getSearchTags(): TagSection[] {
        const tags: Tag[] = [
            { id: 'adult', label: 'Adult' },
            { id: 'ahegao', label: 'Ahegao' },
            { id: 'anal', label: 'Anal' },
            { id: 'big-ass', label: 'Big Ass' },
            { id: 'big-boobs', label: 'Big Boobs' },
            { id: 'blowjob', label: 'Blowjob' },
            { id: 'bondage', label: 'Bondage' },
            { id: 'cheating', label: 'Cheating' },
            { id: 'cosplay', label: 'Cosplay' },
            { id: 'doujinshi', label: 'Doujinshi' },
            { id: 'ecchi', label: 'Ecchi' },
            { id: 'femdom', label: 'Femdom' },
            { id: 'full-color', label: 'Full Color' },
            { id: 'gangbang', label: 'Gangbang' },
            { id: 'harem', label: 'Harem' },
            { id: 'incest', label: 'Incest' },
            { id: 'loli', label: 'Loli' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'milf', label: 'Milf' },
            { id: 'ntr', label: 'NTR' },
            { id: 'oneshot', label: 'Oneshot' },
            { id: 'rape', label: 'Rape' },
            { id: 'romance', label: 'Romance' },
            { id: 'schoolgirl', label: 'Schoolgirl' },
            { id: 'smut', label: 'Smut' },
            { id: 'threesome', label: 'Threesome' },
            { id: 'trap', label: 'Trap' },
            { id: 'vanilla', label: 'Vanilla' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
        ]

        const tagsList = tags.map((tag) => App.createTag({ id: tag.id, label: tag.label }))
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: tagsList })]
    }
}
