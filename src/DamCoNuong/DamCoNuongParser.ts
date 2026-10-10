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

        $('.manga-vertical').each((_: any, el: any) => {
            const titleLink = $('h3 a', el).first()
            const title = titleLink.text().trim()
            const href = titleLink.attr('href') ?? ''

            // Strictly ignore chapter links or empty hrefs
            if (!href || href.includes('/chapter-')) return

            // Extract the clean manga ID. Pattern: /truyen/manga-slug
            // We want to ensure we don't accidentally capture chapter paths
            const idMatch = href.match(/\/truyen\/([^/?#]+)$/)
            if (!idMatch) return

            const id = idMatch[1].trim()
            if (!id || id.includes('/')) return // Double check for sub-paths

            const img = $('.cover-frame img', el).first()
            let rawImage = img.attr('src') ?? img.attr('data-src') ?? ''
            // Prepend base URL if relative
            if (rawImage && rawImage.startsWith('/')) {
                rawImage = `https://damconuong.pet${rawImage}`
            }

            if (!title || !rawImage) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
        })

        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        let title = $('h1.md-title, h1.text-xl').text().trim()
            || $('h1').not('.text-sm').first().text().trim()

        if (!title || title.includes('Tên Miền Chính Thức') || title.includes('Dâm Cô Nương')) {
            const ogTitle = $('meta[property="og:title"]').attr('content')?.trim()
            if (ogTitle && !ogTitle.startsWith('Truyện Tranh 18+')) {
                title = ogTitle.replace(/\s*-\s*Dâm Cô Nương$/i, '').trim()
            } else {
                title = $('h1').last().text().trim() || mangaId
            }
        }

        let rawImage = $('.md-cover img, .cover-frame img').first().attr('src')
            ?? $('meta[property="og:image"]').attr('content')?.trim()
            ?? ''

        if (rawImage && rawImage.startsWith('/')) {
            rawImage = `https://damconuong.pet${rawImage}`
        }

        const desc = $('.md-synopsis').text().trim()
            || $('.summary-content, .description, .manga-content, #synopsis, .mt-4.text-sm, .prose').text().trim()
            || $('meta[property="og:description"]').attr('content')?.trim()
            || ''

        const genres: Tag[] = []
        $('.md-rail-genres a, .genre a, .the-loai a').each((_: any, el: any) => {
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
        const seen = new Set<string>()

        // Target the dedicated chapter list first, fallback to general truyen links
        const listItems = $('#md-chapter-list li a, .md-ch')
        const elements = listItems.length > 0 ? listItems : $('a[href*="/truyen/"]')

        elements.each((_: any, el: any) => {
            const href = ($(el).attr('href') ?? '').trim()
            // Match /truyen/{mangaId}/{chapterId}
            const match = href.match(/\/truyen\/[^/?#]+\/([^/?#]+)\/?$/i)
            if (!match) return

            const rawChapter = match[1]
            // Skip non-chapter navigation paths
            if (['danh-sach', 'tim-kiem', 'the-loai'].includes(rawChapter.toLowerCase())) return
            if (seen.has(rawChapter)) return
            seen.add(rawChapter)

            const titleEl = $(el).find('.md-ch-title, .text-ellipsis').first()
            const title = titleEl.text().trim()
                || $(el).text().trim().split('\n')[0].trim()
                || rawChapter

            const numMatch = rawChapter.match(/[\d.]+/)
            const chapNum = numMatch ? parseFloat(numMatch[0]) : chapters.length + 1

            chapters.push(App.createChapter({
                id: rawChapter,
                chapNum: isNaN(chapNum) ? chapters.length + 1 : chapNum,
                name: title,
                time: new Date(),
            }))
        })

        return chapters
    }

    parseChapterPages($: CheerioAPI): string[] {
        const pages: string[] = []

        $('img[data-original-src], img[data-src], img.chapter-img').each((_: any, el: any) => {
            let imgSrc = ($(el).attr('data-original-src') ?? $(el).attr('data-src') ?? $(el).attr('src') ?? '').trim()
            if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image')) return

            // Prepend base URL if relative or protocol‑relative
            if (imgSrc.startsWith('/') || imgSrc.startsWith('//')) {
                const prefix = imgSrc.startsWith('//') ? 'https:' : 'https://damconuong.pet'
                imgSrc = `${prefix}${imgSrc}`
            }

            const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(imgSrc)
            const isChapterFolder = /\/(chapters|images|truyen)\//i.test(imgSrc)

            if (imgSrc && (isImage || isChapterFolder)) {
                if (!pages.includes(imgSrc)) pages.push(imgSrc)
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
