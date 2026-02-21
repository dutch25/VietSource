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

        $('a[href^="/g/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const id = href.replace('/g/', '').replace(/\/$/, '')
            if (!id || isNaN(Number(id))) return

            const img = $(el).find('img').first()
            const title = img.attr('alt')?.trim() ?? ''
            const rawImage = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!title || title.length < 2 || !rawImage) return

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

    // ─── Extract CDN base from og:image ───────────────────────────────────────
    getCdnBase($: CheerioAPI): string {
        const ogImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        if (!ogImage) return 'https://i1.nhentaiclub.shop'
        try {
            return new URL(ogImage).origin
        } catch {
            return 'https://i1.nhentaiclub.shop'
        }
    }

    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters(html: string): Chapter[] {
        const chapterData = this.extractDataArray(html)
        if (!chapterData || chapterData.length === 0) return []

        chapterData.reverse()

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

    // ─── Search Tags (genres) ─────────────────────────────────────────────────
    getSearchTags(): TagSection[] {
        const genres: Tag[] = [
            { id: 'ahegao', label: 'Ahegao' },
            { id: 'anal', label: 'Anal' },
            { id: 'angel', label: 'Angel' },
            { id: 'animal', label: 'Animal' },
            { id: 'bdsm', label: 'BDSM' },
            { id: 'big-ass', label: 'Big Ass' },
            { id: 'big-boobs', label: 'Big Boobs' },
            { id: 'big-penis', label: 'Big Penis' },
            { id: 'bikini', label: 'Bikini' },
            { id: 'black-mail', label: 'Blackmail' },
            { id: 'blowjobs', label: 'Blowjobs' },
            { id: 'body-swap', label: 'Body Swap' },
            { id: 'breast-sucking', label: 'Breast Sucking' },
            { id: 'bunny-girl', label: 'Bunny Girl' },
            { id: 'catgirl', label: 'Catgirl' },
            { id: 'cheating', label: 'Cheating' },
            { id: 'chikan', label: 'Chikan' },
            { id: 'collar', label: 'Collar' },
            { id: 'condom', label: 'Condom' },
            { id: 'cosplay', label: 'Cosplay' },
            { id: 'dark-skin', label: 'Dark Skin' },
            { id: 'daughter', label: 'Daughter' },
            { id: 'deep-throat', label: 'Deepthroat' },
            { id: 'defloration', label: 'Defloration' },
            { id: 'demon-girl', label: 'Demon Girl' },
            { id: 'double-penetration', label: 'Double Penetration' },
            { id: 'doujinshi', label: 'Doujinshi' },
            { id: 'drugs', label: 'Drugs' },
            { id: 'drunk', label: 'Drunk' },
            { id: 'elf', label: 'Elf' },
            { id: 'exhibitionism', label: 'Exhibitionism' },
            { id: 'father', label: 'Father' },
            { id: 'femdom', label: 'Femdom' },
            { id: 'fingering', label: 'Fingering' },
            { id: 'footjob', label: 'Footjob' },
            { id: 'fox-girl', label: 'Fox Girl' },
            { id: 'full-color', label: 'Full Color' },
            { id: 'futanari', label: 'Futanari' },
            { id: 'glasses', label: 'Glasses' },
            { id: 'group', label: 'Group' },
            { id: 'hairy', label: 'Hairy' },
            { id: 'handjob', label: 'Handjob' },
            { id: 'harem', label: 'Harem' },
            { id: 'humiliation', label: 'Humiliation' },
            { id: 'impregnation', label: 'Impregnation' },
            { id: 'incest', label: 'Incest' },
            { id: 'kimono', label: 'Kimono' },
            { id: 'kissing', label: 'Kissing' },
            { id: 'lactation', label: 'Lactation' },
            { id: 'maid', label: 'Maid' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'masturbation', label: 'Masturbation' },
            { id: 'milf', label: 'Milf' },
            { id: 'mind-break', label: 'Mind Break' },
            { id: 'mind-control', label: 'Mind Control' },
            { id: 'monster', label: 'Monster' },
            { id: 'monster-girl', label: 'Monster Girl' },
            { id: 'mother', label: 'Mother' },
            { id: 'muscle', label: 'Muscle' },
            { id: 'nakadashi', label: 'Nakadashi' },
            { id: 'netorare', label: 'NTR (Netorare)' },
            { id: 'netori', label: 'Netori' },
            { id: 'nurse', label: 'Nurse' },
            { id: 'old-man', label: 'Old Man' },
            { id: 'oneshot', label: 'Oneshot' },
            { id: 'orc', label: 'Orc' },
            { id: 'paizuri', label: 'Paizuri' },
            { id: 'pantyhose', label: 'Pantyhose' },
            { id: 'pregnant', label: 'Pregnant' },
            { id: 'rape', label: 'Rape' },
            { id: 'rimjob', label: 'Rimjob' },
            { id: 'school-girl-uniform', label: 'Schoolgirl Uniform' },
            { id: 'series', label: 'Series' },
            { id: 'sex-toys', label: 'Sex Toys' },
            { id: 'sister', label: 'Sister' },
            { id: 'slave', label: 'Slave' },
            { id: 'sleeping', label: 'Sleeping' },
            { id: 'small-boobs', label: 'Small Boobs' },
            { id: 'shotacon', label: 'Shotacon' },
            { id: 'stockings', label: 'Stockings' },
            { id: 'swimsuit', label: 'Swimsuit' },
            { id: 'teacher', label: 'Teacher' },
            { id: 'tentacles', label: 'Tentacles' },
            { id: 'three-some', label: 'Threesome' },
            { id: 'time-stop', label: 'Time Stop' },
            { id: 'tomboy', label: 'Tomboy' },
            { id: 'twins', label: 'Twins' },
            { id: 'twintails', label: 'Twintails' },
            { id: 'vampire', label: 'Vampire' },
            { id: 'virgin', label: 'Virgin' },
            { id: 'x-ray', label: 'X-ray' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
            { id: '3d', label: '3D' },
        ].map(g => App.createTag({ id: g.id, label: g.label }))

        return [
            App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: genres }),
        ]
    }

    // ─── Extract chapter data array from raw HTML ─────────────────────────────
    private extractDataArray(html: string): Array<{ name: string; pictures: number; createdAt?: string }> | null {
        const escapedKey = '\\"data\\":['
        const unescapedKey = '"data":['

        let arrStart = -1
        const escapedIdx = html.indexOf(escapedKey)
        const unescapedIdx = html.indexOf(unescapedKey)

        if (escapedIdx >= 0) {
            arrStart = escapedIdx + escapedKey.length - 1
        } else if (unescapedIdx >= 0) {
            arrStart = unescapedIdx + unescapedKey.length - 1
        }

        if (arrStart < 0) return null

        let depth = 0, arrEnd = -1
        for (let i = arrStart; i < html.length; i++) {
            if (html[i] === '[') depth++
            if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break } }
        }

        if (arrEnd < 0) return null

        let raw = html.substring(arrStart, arrEnd + 1)
        if (escapedIdx >= 0) raw = raw.replace(/\\"/g, '"')

        try {
            const parsed = JSON.parse(raw)
            return Array.isArray(parsed) ? parsed : null
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