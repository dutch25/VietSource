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

    private normalizeUrl(url: string, defaultDomain: string = this.BASE_DOMAIN): string {
        if (!url) return ''
        if (url.startsWith('http')) return url
        if (url.startsWith('//')) return `https:${url}`
        if (url.startsWith('/')) return `https://${defaultDomain}${url}`
        return `https://${defaultDomain}/${url}`
    }

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
                        const isChapter = item.url.includes('/chapter-') || item.url.includes('/chuong-') ||
                            item.name.toLowerCase().includes('chương') ||
                            item.name.toLowerCase().includes('chapter')

                        if (isChapter) continue

                        const match = item.url.match(/\/truyen\/([^/]+)/)
                        const slug = match ? match[1] : ''

                        if (!slug || slug.includes('chapter-') || results.some(r => r.mangaId === slug)) continue

                        let image = this.normalizeUrl(item.image, this.CDN_DOMAIN)
                        // Remove webp to jpg conversion as it may cause 404s
                        // image = image.replace('.webp', '.jpg')

                        // Only add proxy if proxyUrl is not empty
                        if (proxyUrl && image) {
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
            // Use contains instead of starts with for absolute/relative flexibility
            $('a[href*="/truyen/"]').each((_, el) => {
                const $el = $(el)
                const href = $el.attr('href') || ''
                const title = $el.attr('title') || $el.text().trim()
                const titleLower = title.toLowerCase()

                // Skip if it's a chapter link, just the base link, or has "Chương" in title
                const isChapter = href.includes('/chapter-') || href.includes('/chuong-') ||
                    titleLower.includes('chương') || titleLower.includes('chapter')

                if (!href || isChapter || href.endsWith('/truyen/')) return

                const match = href.match(/\/truyen\/([^/]+)/)
                const slug = match ? match[1] : ''

                if (!slug || results.some(r => r.mangaId === slug)) return

                // Check if this looks like a manga card link (often has an image or is in a specific container)
                let image = this.normalizeUrl($el.find('img').attr('src') || $el.find('img').attr('data-src') || '', this.CDN_DOMAIN)

                if (!image) {
                    // Try to find image in siblings or parent container
                    const $container = $el.closest('div, article, section')
                    image = this.normalizeUrl($container.find('img').attr('src') || $container.find('img').attr('data-src') || '', this.CDN_DOMAIN)
                }

                if (image && proxyUrl) {
                    image = `${proxyUrl}?url=${encodeURIComponent(image)}`
                }

                results.push(App.createPartialSourceManga({
                    mangaId: slug,
                    title: title.replace('Truyện ', '').trim() || slug, // Fallback to slug if title is empty
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
                        const isChapter = (itemData.url ?? '').includes('/chapter-') || (itemData.url ?? '').includes('/chuong-') ||
                            (itemData.name ?? '').toLowerCase().includes('chương') ||
                            (itemData.name ?? '').toLowerCase().includes('chapter')

                        if (itemData.url && itemData.name && !isChapter) {
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
            $('img[class*="cover"]').attr('data-src') ||
            $('main img').first().attr('src') ||
            ''

        if (image) {
            image = this.normalizeUrl(image, this.CDN_DOMAIN)
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
    parseChapters(json: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        const data = json?.data?.chapters

        if (!Array.isArray(data)) {
            console.log(`[HV2T] parseChapters: No chapters found in JSON data`)
            return []
        }

        for (const item of data) {
            const chapterId = item.slug || String(item.id)
            if (!chapterId) continue

            const name = item.title || `Chương ${item.chapter_number || ''}`.trim()
            const chapNum = item.chapter_number || 0

            chapters.push(App.createChapter({
                id: chapterId,
                name: name,
                chapNum,
                time: item.published_at ? new Date(item.published_at) : new Date(),
                langCode: 'vi'
            }))
        }

        console.log(`[HV2T] parseChapters: Parsed ${chapters.length} chapters`)
        return chapters
    }

    // ─── Pages ────────────────────────────────────────────────────────────────
    parseChapterDetails(json: any, chapterId: string, mangaId: string, proxyUrl: string): string[] {
        const pages: string[] = []
        const images = json?.data?.images

        if (!Array.isArray(images)) {
            console.log(`[HV2T] parseChapterDetails: No images found in JSON data`)
            return []
        }

        for (let src of images) {
            if (!src || typeof src !== 'string') continue

            // Normalize and proxy
            src = this.normalizeUrl(src, this.CDN_DOMAIN)
            src = `${proxyUrl}?url=${encodeURIComponent(src)}`

            if (!pages.includes(src)) {
                pages.push(src)
            }
        }

        console.log(`[HV2T] parseChapterDetails: Found ${pages.length} pages`)
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
