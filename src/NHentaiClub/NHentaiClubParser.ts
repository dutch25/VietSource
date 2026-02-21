import {
    Chapter,
    PartialSourceManga,
    SourceManga,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($: CheerioAPI, proxyUrl: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        $('a[href^="/g/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const id = href.replace('/g/', '').replace(/\/$/, '')
            if (!id || isNaN(Number(id))) return

            const img = $(el).find('img').first()
            const title = img.attr('alt')?.trim() ?? ''
            const rawImage = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!title || title.length < 2 || !rawImage) return

            // Proxy covers so Referer header is added (fixes i1/i2/i3 thumbnails)
            const image = `${proxyUrl}?url=${encodeURIComponent(rawImage)}`
            results.push(App.createPartialSourceManga({ mangaId: id, title, image }))
        })

        return this.deduplicate(results)
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl: string): SourceManga {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h1').first().text().trim()
            || mangaId
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const image = rawImage ? `${proxyUrl}?url=${encodeURIComponent(rawImage)}` : ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({ titles: [title], image, desc, status: 'Ongoing' }),
        })
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    // Takes RAW HTML STRING — not cheerio $
    // The chapter JSON is inside a Next.js <script> tag where quotes are escaped as \"
    // So the actual bytes in response.data are:  \"data\":[{\"name\":\"2\",\"pictures\":33}]
    // We find the array, then unescape \" -> " before JSON.parse
    parseChapters(html: string): Chapter[] {
        const chapterData = this.extractDataArray(html)
        if (!chapterData || chapterData.length === 0) return []

        chapterData.reverse() // JSON is newest-first → reverse to oldest-first

        return chapterData.map((ch, i) => {
            const name = String(ch.name)
            const chapNum = parseFloat(name) || (i + 1)
            const date = ch.createdAt ? new Date(ch.createdAt) : new Date()
            return App.createChapter({
                id: name, chapNum,
                name: `Chapter ${name}`,
                time: isNaN(date.getTime()) ? new Date() : date,
            })
        })
    }

    // ─── Page count for a chapter ─────────────────────────────────────────────
    getPageCount(html: string, chapterId: string): number {
        const chapterData = this.extractDataArray(html)
        if (!chapterData) return 0
        return chapterData.find(ch => String(ch.name) === chapterId)?.pictures ?? 0
    }

    // ─── Extract the chapter data array from raw HTML ─────────────────────────
    // The HTML contains a script tag with content like:
    //   \"data\":[{\"name\":\"2\",\"pictures\":33,\"createdAt\":\"2026-01-01\"}]
    // We locate \"data\":[ then find the matching ], unescape, and parse.
    private extractDataArray(html: string): Array<{ name: string; pictures: number; createdAt?: string }> | null {
        // Find the start of the data array - handle both escaped (\") and unescaped (") quotes
        const escapedKey = '\\"data\\":[' // \" form inside script tags
        const unescapedKey = '"data":['     // " form (fallback)

        let arrStart = -1
        const escapedIdx = html.indexOf(escapedKey)
        if (escapedIdx >= 0) {
            arrStart = escapedIdx + escapedKey.length - 1 // position of [
        } else {
            const unescapedIdx = html.indexOf(unescapedKey)
            if (unescapedIdx >= 0) {
                arrStart = unescapedIdx + unescapedKey.length - 1
            }
        }

        if (arrStart < 0) return null

        // Find matching closing ] by counting brackets
        let depth = 0
        let arrEnd = -1
        for (let i = arrStart; i < html.length; i++) {
            if (html[i] === '[') depth++
            if (html[i] === ']') {
                depth--
                if (depth === 0) { arrEnd = i; break }
            }
        }

        if (arrEnd < 0) return null

        let raw = html.substring(arrStart, arrEnd + 1)

        // Unescape \" -> " if the content is in escaped form
        if (escapedIdx >= 0) {
            raw = raw.replace(/\\"/g, '"')
        }

        try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) return parsed
            return null
        } catch {
            return null
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    private deduplicate(items: PartialSourceManga[]): PartialSourceManga[] {
        const seen = new Set<string>()
        return items.filter(item => {
            if (seen.has(item.mangaId)) return false
            seen.add(item.mangaId)
            return true
        })
    }
}