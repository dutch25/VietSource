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
    parseMangaDetails(json: any, mangaId: string, proxyUrl: string): SourceManga {
        const data = json?.data || json

        const title = data.title || 'Unknown Title'

        let image = data.cover_image || ''
        if (image) {
            image = this.normalizeUrl(image, this.CDN_DOMAIN)
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`
        }

        const desc = data.description || ''
        const author = data.author || data.uploader?.username || 'Unknown'

        const statusStr = (data.status || '').toLowerCase()
        const status = statusStr === 'completed' ? 'completed' : 'ongoing'

        const tags: Tag[] = []
        if (Array.isArray(data.tags)) {
            for (const tag of data.tags) {
                if (tag.slug && tag.name) {
                    tags.push(App.createTag({ id: tag.slug, label: tag.name }))
                }
            }
        }

        const tagSections: TagSection[] = []
        if (tags.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genre', label: 'Thể Loại', tags }))
        }

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: status,
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
