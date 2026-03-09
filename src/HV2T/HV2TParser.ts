import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    private readonly BASE_DOMAIN = 'hv2t.store'
    private readonly CDN_DOMAIN = 'cdn.hv2t.com'

    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($: CheerioAPI, proxyUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        // Try to parse JSON-LD data first (most reliable for Next.js)
        const jsonLdScripts = $('script[type="application/ld+json"]')
        
        jsonLdScripts.each((_, el) => {
            try {
                const jsonContent = $(el).html()
                if (!jsonContent) return

                const data = JSON.parse(jsonContent)
                const items = this.extractMangaItems(data)
                
                for (const item of items) {
                    if (item.url && item.name && item.image) {
                        const slug = item.url.replace('/comics/', '').replace('/', '')
                        
                        // Skip if already added
                        if (results.some(r => r.mangaId === slug)) continue

                        let image = item.image
                        // Convert webp to jpg for compatibility
                        image = image.replace('.webp', '.jpg')
                        
                        // Only add proxy if proxyUrl is not empty
                        if (proxyUrl) {
                            image = `${proxyUrl}?url=${encodeURIComponent(image)}`
                        }

                        results.push(App.createPartialSourceManga({
                            mangaId: slug,
                            title: item.name,
                            image
                        }))
                    }
                }
            } catch (e) {
                // Not valid JSON, skip
            }
        })

        // Fallback: try to parse from DOM elements
        if (results.length === 0) {
            $('a[href^="/comics/"]').each((_, el) => {
                const $el = $(el)
                const href = $el.attr('href') || ''
                const title = $el.text().trim()
                
                if (!href || href === '/comics/') return
                
                const slug = href.replace('/comics/', '').replace('/', '')
                if (!title || results.some(r => r.mangaId === slug)) return

                // Try to find associated image
                const $parent = $el.closest('[class*="manga"], [class*="comic"], [class*="card"]')
                let image = ''
                
                results.push(App.createPartialSourceManga({
                    mangaId: slug,
                    title,
                    image
                }))
            })
        }

        console.log(`[HV2T] parseHomePage: Found ${results.length} items`)
        return results
    }

    private extractMangaItems(data: any): Array<{ name: string; url: string; image: string }> {
        const items: Array<{ name: string; url: string; image: string }> = []

        if (Array.isArray(data)) {
            for (const item of data) {
                items.push(...this.extractMangaItems(item))
            }
        } else if (data && typeof data === 'object') {
            // Check if this is an ItemList
            if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
                for (const item of data.itemListElement) {
                    if (item['@type'] === 'ComicSeries' || item['@type'] === 'ListItem') {
                        const itemData = item.item || item
                        if (itemData.url && itemData.name) {
                            items.push({
                                name: itemData.name,
                                url: itemData.url,
                                image: itemData.image || ''
                            })
                        }
                    }
                }
            }
        }

        return items
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl: string): SourceManga {
        // Try to get title from various selectors
        const title = 
            $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content')?.replace(' - HV2T', '').trim() ||
            $('title').text().replace(' - HV2T', '').trim() ||
            'Unknown Title'

        // Get cover image
        let image = 
            $('meta[property="og:image"]').attr('content') ||
            $('img[class*="cover"]').attr('src') ||
            ''

        if (image) {
            image = image.replace('.webp', '.jpg')
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`
        }

        // Get description
        const desc = 
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            ''

        // Get author
        let author = 'Unknown'
        $('[class*="author"], [class*="tac-gia"], a[href*="/author/"]').each((_: any, el: any) => {
            const text = $(el).text().trim()
            if (text && text !== 'Unknown') {
                author = text
                return false
            }
        })

        // Get status
        let status = 'Ongoing'
        $('[class*="status"], [class*="tinh-trang"]').each((_: any, el: any) => {
            const text = $(el).text().toLowerCase()
            if (text.includes('hoàn thành') || text.includes('completed') || text.includes('full')) {
                status = 'Completed'
                return false
            }
        })

        // Get genres/tags
        const tags: Tag[] = []
        $('a[href*="/tags/"], a[href*="/genre/"], [class*="genre"] a, [class*="tag"] a').each((_: any, el: any) => {
            const href = $(el).attr('href') || ''
            const label = $(el).text().trim()
            if (label && !label.includes('Tác giả')) {
                const id = href.split('/').pop() || label.toLowerCase().replace(/\s+/g, '-')
                tags.push(App.createTag({ id, label }))
            }
        })

        const tagSections: TagSection[] = []
        if (tags.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genre', label: 'Thể Loại', tags }))
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
            `a[href*="/comics/${mangaId}/"]`,
            '[class*="chapter"] a',
            '.chapter-list a',
            '.chapters a',
            'ul.chapters li a'
        ]

        for (const selector of selectors) {
            $(selector).each((_: any, el: any) => {
                const href = $(el).attr('href') || ''
                const title = $(el).text().trim() || 'Chapter'

                if (!href || !href.includes(`/comics/${mangaId}/`)) return

                // Extract chapter slug
                const chapterMatch = href.match(/\/comics\/[^/]+\/(.+)/)
                if (!chapterMatch) return

                const chapterId = chapterMatch[1]!

                // Try to extract chapter number
                const numMatch = title.match(/(?:chapter|ch|chap)\s*(\d+)/i) || title.match(/(\d+)/)
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
            'img[class*="page"]',
            'img[class*="chapter"]',
            '#page img',
            '.content img',
            'img[src*="hv2t"]',
            'img[src*="cdn"]'
        ]

        for (const selector of selectors) {
            $(selector).each((_: number, el: any) => {
                let src = $(el).attr('src') || $(el).attr('data-src') || ''
                
                // Skip empty, data URI, or placeholder images
                if (!src || src.startsWith('data:') || src.includes('loading') || src.includes('placeholder')) return

                // Skip non-image files
                if (!src.match(/\.(jpg|jpeg|png|gif|webp)/i)) return

                // Convert webp to jpg
                src = src.replace('.webp', '.jpg')

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
        const tags = [
            { id: 'action', label: 'Action' },
            { id: 'adult', label: 'Adult' },
            { id: 'adventure', label: 'Adventure' },
            { id: 'comedy', label: 'Comedy' },
            { id: 'drama', label: 'Drama' },
            { id: 'ecchi', label: 'Ecchi' },
            { id: 'fantasy', label: 'Fantasy' },
            { id: 'harem', label: 'Harem' },
            { id: 'historical', label: 'Historical' },
            { id: 'horror', label: 'Horror' },
            { id: 'isekai', label: 'Isekai' },
            { id: 'josei', label: 'Josei' },
            { id: 'manga', label: 'Manga' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'martial-arts', label: 'Martial Arts' },
            { id: 'mature', label: 'Mature' },
            { id: 'mecha', label: 'Mecha' },
            { id: 'mystery', label: 'Mystery' },
            { id: 'netorare', label: 'Netorare' },
            { id: 'ntr', label: 'NTR' },
            { id: 'psychological', label: 'Psychological' },
            { id: 'romance', label: 'Romance' },
            { id: 'school-life', label: 'School Life' },
            { id: 'sci-fi', label: 'Sci-Fi' },
            { id: 'seinen', label: 'Seinen' },
            { id: 'shoujo', label: 'Shoujo' },
            { id: 'shounen', label: 'Shounen' },
            { id: 'slice-of-life', label: 'Slice of Life' },
            { id: 'smut', label: 'Smut' },
            { id: 'sports', label: 'Sports' },
            { id: 'supernatural', label: 'Supernatural' },
            { id: 'tragedy', label: 'Tragedy' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
        ]

        const tagsList = tags.map((tag) => App.createTag({ id: tag.id, label: tag.label }))
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: tagsList })]
    }
}
