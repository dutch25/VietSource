import {
    Chapter,
    PartialSourceManga,
    SourceManga,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($: CheerioAPI): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        $('a[href^="/g/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const id = href.replace('/g/', '').replace(/\/$/, '')
            if (!id || isNaN(Number(id))) return

            const img = $(el).find('img').first()
            const title = img.attr('alt')?.trim() ?? ''
            const image = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!title || title.length < 2 || !image) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image }))
        })

        return this.deduplicate(results)
    }

    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h1').first().text().trim()
            || mangaId
        const image = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({ titles: [title], image, desc, status: 'Ongoing' }),
        })
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    // Takes RAW HTML STRING — not cheerio $
    // Chapter data is embedded as JSON in the page:
    // "data":[{"name":"2","pictures":25,"createdAt":"2026-01-01"},{"name":"1",...}]
    parseChapters(html: string): Chapter[] {
        // Confirmed working regex (tested against real HTML snippet)
        const match = html.match(/"data":(\[[^\]]*\])/)
        if (!match) return []

        let chapterData: Array<{ name: string; pictures: number; createdAt?: string }>
        try {
            chapterData = JSON.parse(match[1])
        } catch {
            return []
        }

        if (!Array.isArray(chapterData) || chapterData.length === 0) return []

        // JSON is newest-first — reverse to oldest-first
        chapterData.reverse()

        return chapterData.map((ch, i) => {
            const name = String(ch.name)
            const chapNum = parseFloat(name) || (i + 1)
            const date = ch.createdAt ? new Date(ch.createdAt) : new Date()
            return App.createChapter({
                id: name,
                chapNum,
                name: `Chapter ${name}`,
                time: isNaN(date.getTime()) ? new Date() : date,
            })
        })
    }

    // ─── Page count for a chapter ─────────────────────────────────────────────
    getPageCount(html: string, chapterId: string): number {
        const match = html.match(/"data":(\[[^\]]*\])/)
        if (!match) return 0

        let chapterData: Array<{ name: string; pictures: number }>
        try {
            chapterData = JSON.parse(match[1])
        } catch {
            return 0
        }

        return chapterData.find(ch => String(ch.name) === chapterId)?.pictures ?? 0
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