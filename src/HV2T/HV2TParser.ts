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
        const data = json?.chapters || json?.data?.chapters

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
            { id: 'artist', label: 'Artist' },
            { id: 'bach-hop', label: 'Bách Hợp' },
            { id: 'chuyen-sinh', label: 'Chuyển Sinh' },
            { id: 'di-gioi', label: 'Dị Giới' },
            { id: 'drama', label: 'Drama' },
            { id: 'elf', label: 'Elf' },
            { id: 'gender-bender', label: 'Gender Bender' },
            { id: 'gia-tuong', label: 'Giả Tưởng' },
            { id: 'giang-sinh', label: 'Giáng Sinh' },
            { id: 'group', label: 'Group' },
            { id: 'harem', label: 'Harem' },
            { id: 'khong-che', label: 'Không Che' },
            { id: 'lolicon', label: 'Lolicon' },
            { id: 'manga', label: 'Manga' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'mature', label: 'Mature' },
            { id: 'ntr', label: 'NTR' },
            { id: 'old-man', label: 'Old Man' },
            { id: 'oneshot', label: 'Oneshot' },
            { id: 'quay-len', label: 'Quay Lén' },
            { id: 'rape', label: 'Rape' },
            { id: 'romance', label: 'Romance' },
            { id: 'school', label: 'School' },
            { id: 'series', label: 'Series' },
            { id: 'shool', label: 'Shool' },
            { id: 'sister', label: 'Sister' },
            { id: 'toc-tem-sieu-ngan', label: 'Tóc Tém Siêu Ngắn' },
            { id: 'tom-boy', label: 'Tom Boy' },
            { id: 'vtuber', label: 'Vtuber' }
        ]

        const tagsList = tags.map((tag) => App.createTag({ id: tag.id, label: tag.label }))
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: tagsList })]
    }
}
