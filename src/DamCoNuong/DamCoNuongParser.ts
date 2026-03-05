import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    parseHomePage($: CheerioAPI): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        $('.cover-frame, [class*="manga"]').closest('a[href^="/truyen/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const idMatch = href.match(/\/truyen\/(\d+)/)
            if (!idMatch) return
            const id = idMatch[1]
            if (!id) return

            const img = $(el).find('img').first()
            const title = img.attr('alt')?.trim() ?? ''
            const rawImage = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!title || title.length < 2 || !rawImage) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
        })

        if (results.length === 0) {
            $('a[href^="/truyen/"]').each((_: any, el: any) => {
                const href = $(el).attr('href') ?? ''
                const idMatch = href.match(/\/truyen\/([^?#]+)/)
                if (!idMatch) return
                const id = idMatch[1].trim()
                if (!id || results.some(r => r.mangaId === id)) return

                const img = $(el).find('img').first()
                const title = img.attr('alt')?.trim() ?? $(el).text().trim() ?? ''
                const rawImage = img.attr('src') ?? img.attr('data-src') ?? ''

                if (!title || title.length < 2) return

                results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
            })
        }

        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h1').first().text().trim()
            || mangaId
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        const genres: Tag[] = []
        $('.genre a, .the-loai a').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const genreId = href.replace('/the-loai/', '').trim()
            const label = $(el).text().trim()
            if (genreId && label) {
                genres.push(App.createTag({ id: genreId, label }))
            }
        })

        const tagSections: TagSection[] = []
        if (genres.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genres', label: 'Thể Loại', tags: genres }))
        }

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({ titles: [title], image: rawImage, desc, author: '', artist: '', status: '', tags: tagSections }),
        })
    }

    parseChapters($: CheerioAPI): Chapter[] {
        const chapters: Chapter[] = []

        $('a[href*="/chapter-"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const match = href.match(/\/chapter-(\d+)/)
            if (!match) return

            const chapterId = match[1]
            const title = $(el).text().trim() || `Chapter ${chapterId}`

            chapters.push(App.createChapter({
                id: chapterId,
                chapNum: parseFloat(chapterId) || chapters.length + 1,
                name: title,
                time: new Date(),
            }))
        })

        return chapters.reverse()
    }

    parseChapterPages($: CheerioAPI): string[] {
        const pages: string[] = []

        $('img[data-original-src], img[ data-original-src]').each((_: any, el: any) => {
            const imgSrc = $(el).attr('data-original-src') ?? $(el).attr('src') ?? ''
            if (imgSrc && imgSrc.includes('/images/') && imgSrc.endsWith('.jpg')) {
                pages.push(imgSrc)
            }
        })

        if (pages.length === 0) {
            $('img').each((_: any, el: any) => {
                const imgSrc = $(el).attr('src') ?? ''
                if (imgSrc && imgSrc.includes('/chapters/') && imgSrc.endsWith('.jpg')) {
                    if (!pages.includes(imgSrc)) {
                        pages.push(imgSrc)
                    }
                }
            })
        }

        return pages
    }

    getSearchTags(): TagSection[] {
        const genres: Array<[string, string]> = [
            ['18', '18+'], ['19', '19+'], ['3d-hentai', '3D Hentai'], ['3p', '3P'],
            ['ahegao', 'Ahegao'], ['anal', 'Anal'], ['bdsm', 'BDSM'], ['big-ass', 'Big Ass'],
            ['big-boobs', 'Big Boobs'], ['blowjobs', 'Blowjobs'], ['body-swap', 'Body Swap'],
            ['bondage', 'Bondage'], ['cheating', 'Cheating'], ['cosplay', 'Cosplay'],
            ['dark-skin', 'Dark Skin'], ['daughter', 'Daughter'], ['deepthroat', 'Deepthroat'],
            ['doujinshi', 'Doujinshi'], ['ecchi', 'Ecchi'], ['elf', 'Elf'],
            ['exhibitionism', 'Exhibitionism'], ['femdom', 'Femdom'], ['fingering', 'Fingering'],
            ['footjob', 'Footjob'], ['full-color', 'Full Color'], ['futanari', 'Futanari'],
            ['group', 'Group'], ['harem', 'Harem'], ['incest', 'Incest'],
            ['lactation', 'Lactation'], ['maid', 'Maid'], ['milf', 'Milf'],
            ['mind-break', 'Mind Break'], ['mind-control', 'Mind Control'], ['monster', 'Monster'],
            ['ntr', 'NTR'], ['nurse', 'Nurse'], ['oral', 'Oral'], ['orgy', 'Orgy'],
            ['paizuri', 'Paizuri'], ['pregnant', 'Pregnant'], ['rape', 'Rape'],
            ['schoolgirl', 'Schoolgirl'], ['sex-toys', 'Sex Toys'], ['sister', 'Sister'],
            ['small-boobs', 'Small Boobs'], ['stockings', 'Stockings'], ['swimsuit', 'Swimsuit'],
            ['tentacles', 'Tentacles'], ['threesome', 'Threesome'], ['virgin', 'Virgin'],
            ['yaoi', 'Yaoi'], ['yuri', 'Yuri'],
        ]

        const tags = genres.map(([id, label]) => App.createTag({ id, label }))
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags })]
    }

    private deduplicate(items: PartialSourceManga[]): PartialSourceManga[] {
        const seen = new Set<string>()
        return items.filter(item => {
            if (seen.has(item.mangaId)) return false
            seen.add(item.mangaId)
            return true
        })
    }
}
