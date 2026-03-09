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

    // ─── Home Page / Search ────────────────────────────────────────────────────
    parseHomePage(json: any, proxyUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []
        const data = json?.data

        if (!Array.isArray(data)) {
            console.log(`[HV2T] parseHomePage: No items found in JSON data`)
            return []
        }

        for (const item of data) {
            const slug = item.slug || String(item.id)
            if (!slug) continue

            const title = item.title || item.other_names || slug

            let image = this.normalizeUrl(item.cover_image, this.CDN_DOMAIN)
            if (proxyUrl && image) {
                image = `${proxyUrl}?url=${encodeURIComponent(image)}`
            }

            results.push(App.createPartialSourceManga({
                mangaId: slug,
                title: title,
                image: image,
            }))
        }

        console.log(`[HV2T] parseHomePage: Found ${results.length} items`)
        return results
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
            src = this.normalizeUrl(src, this.BASE_DOMAIN)
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
