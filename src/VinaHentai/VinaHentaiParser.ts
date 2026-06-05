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

        $('a[href^="/truyen-hentai/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const parts = href.split('/').filter(Boolean)
            // manga details: /truyen-hentai/{slug}
            // chapter: /truyen-hentai/{slug}/{chapter}
            if (parts.length !== 2) return

            const id = parts[1].trim()
            if (!id) return

            const titleEl = $(el).find('h2, h3').first()
            const title = titleEl.attr('title') || titleEl.text().trim()

            const img = $(el).find('img').first()
            const rawImage = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!title || !rawImage) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
        })

        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('h1').first().text().trim()
            || $('meta[property="og:title"]').attr('content')?.split('|')[0].trim()
            || mangaId
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        const genres: Tag[] = []
        $('a[href^="/genres/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const genreId = href.replace('/genres/', '').trim()
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
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: rawImage,
                desc,
                author: '',
                artist: '',
                status: '',
                tags: tagSections
            }),
        })
    }

    parseChapters($: CheerioAPI): Chapter[] {
        const chapters: Chapter[] = []

        $('a[href^="/truyen-hentai/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const parts = href.split('/').filter(Boolean)
            if (parts.length !== 3) return // /truyen-hentai/{slug}/{chapterSlug}

            const chapterId = parts[2]
            const title = $(el).find('.text-txt-primary').first().text().trim()
                || $(el).text().trim()
                || `Chapter ${chapterId}`

            const timeStr = $(el).find('time').first().attr('dateTime') ?? ''
            const time = timeStr ? new Date(timeStr) : new Date()

            // Try to extract chapter number
            const chapNumMatch = chapterId.match(/(?:chap|chapter)-([\d.]+)/i)
            const chapNum = chapNumMatch ? parseFloat(chapNumMatch[1]) : (chapters.length + 1)

            chapters.push(App.createChapter({
                id: chapterId,
                chapNum: chapNum,
                name: title,
                time: time,
            }))
        })

        // Paperback expects chapters to be ordered with newest first or oldest first?
        // Usually, Paperback requires chapters sorted by chapter number descending/ascending. We return them as they are parsed, or reverse depending on page layout.
        // On the page, the list is typically descending (newest / highest chapter first).
        return chapters
    }

    parseChapterPages($: CheerioAPI): string[] {
        const html = $.html()
        const regex = /https:\/\/cdn\.vinahentai\.bond\/manga-images\/[^\s"'\\]+\.(webp|jpg|jpeg|png|gif)/g
        const matches = html.match(regex) ?? []

        const pages: string[] = []
        const seen = new Set<string>()
        for (const url of matches) {
            if (!seen.has(url)) {
                seen.add(url)
                pages.push(url)
            }
        }
        return pages
    }

    getSearchTags(): TagSection[] {
        const genres: Array<[string, string]> = [
            ['3d-hentai', '3D Hentai'], ['action', 'Action'], ['adult', 'Adult'],
            ['adventure', 'Adventure'], ['ahegao', 'Ahegao'], ['anal', 'Anal'],
            ['angel', 'Angel'], ['anh-dong', 'Ảnh động'], ['animal', 'Animal'],
            ['animal-girl', 'Animal Girl'], ['ao-dai', 'Áo dài'], ['apron', 'Apron'],
            ['artist-cg', 'Artist CG'], ['based-game', 'Based Game'], ['bdsm', 'BDSM'],
            ['big-ass', 'Big Ass'], ['big-boobs', 'Big Boobs'], ['big-penis', 'Big Penis'],
            ['bikini', 'Bikini'], ['blindfold', 'Blindfold'], ['black-skin', 'Black Skin'],
            ['blackmail', 'Blackmail'], ['blowjobs', 'BlowJobs'], ['body-swap', 'Body Swap'],
            ['bodysuit', 'Bodysuit'], ['bondage', 'Bondage'], ['breastjobs', 'BreastJobs'],
            ['brocon', 'Brocon'], ['brother', 'Brother'], ['business-suit', 'Business Suit'],
            ['che-it', 'Che ít'], ['che-nhieu', 'Che nhiều'], ['cheating', 'Cheating'],
            ['chikan', 'Chikan'], ['chinese-dress', 'Chinese Dress'], ['co-che', 'Có che'],
            ['comedy', 'Comedy'], ['comic', 'Comic'], ['condom', 'Condom'],
            ['cosplay', 'Cosplay'], ['cousin', 'Cousin'], ['crotch-tattoo', 'Crotch Tattoo'],
            ['cunnilingus', 'Cunnilingus'], ['dark-skin', 'Dark Skin'], ['daughter', 'Daughter'],
            ['deepthroat', 'Deepthroat'], ['demon', 'Demon'], ['demongirl', 'DemonGirl'],
            ['devil', 'Devil'], ['devilgirl', 'DevilGirl'], ['dirty', 'Dirty'],
            ['dirtyoldman', 'DirtyOldMan'], ['double-penetration', 'Double Penetration'],
            ['doujinshi', 'Doujinshi'], ['drama', 'Drama'], ['drug', 'Drug'],
            ['ecchi', 'Ecchi'], ['elf', 'Elf'], ['fantasy', 'Fantasy'],
            ['father', 'Father'], ['femdom', 'Femdom'], ['footjob', 'Footjob'],
            ['full-color', 'Full Color'], ['furry', 'Furry'], ['futanari', 'Futanari'],
            ['gangbang', 'Gangbang'], ['ghost', 'Ghost'], ['glasses', 'Glasses'],
            ['gothic-lolita', 'Gothic Lolita'], ['guro', 'Guro'], ['handjob', 'Handjob'],
            ['harem', 'Harem'], ['horror', 'Horror'], ['housewife', 'Housewife'],
            ['idol', 'Idol'], ['incest', 'Incest'], ['isekai', 'Isekai'],
            ['khong-che', 'Không che'], ['kimono', 'Kimono'], ['maids', 'Maids'],
            ['manhua', 'Manhua'], ['manhwa', 'Manhwa'], ['milf', 'Milf'],
            ['mind-break', 'Mind Break'], ['mind-control', 'Mind Control'], ['monster', 'Monster'],
            ['mother', 'Mother'], ['nakadashi', 'Nakadashi'], ['netori', 'Netori'],
            ['ntr', 'NTR'], ['nun', 'Nun'], ['nurse', 'Nurse'],
            ['oneshot', 'Oneshot'], ['pregnant', 'Pregnant'], ['princess', 'Princess'],
            ['rape', 'Rape'], ['romance', 'Romance'], ['school-uniform', 'School uniform'],
            ['schoolgirl', 'SchoolGirl'], ['sex-toys', 'Sex Toys'], ['shota', 'Shota'],
            ['siscon', 'Siscon'], ['sister', 'Sister'], ['slave', 'Slave'],
            ['sleeping', 'Sleeping'], ['small-boobs', 'Small Boobs'], ['soft-incest', 'Soft Incest'],
            ['son', 'Son'], ['sport', 'Sport'], ['squirting', 'Squirting'],
            ['stockings', 'Stockings'], ['swimsuit', 'Swimsuit'], ['teacher', 'Teacher'],
            ['tentacles', 'Tentacles'], ['time-stop', 'Time Stop'], ['tomboy', 'Tomboy'],
            ['truyen-viet', 'Truyện Việt'], ['tsundere', 'Tsundere'], ['twins', 'Twins'],
            ['underwater', 'Underwater'], ['vanilla', 'Vanilla'], ['virgin', 'Virgin'],
            ['webtoon', 'Webtoon'], ['x-ray', 'X-ray'], ['yandere', 'Yandere'],
            ['yaoi', 'Yaoi'], ['yuri', 'Yuri'], ['beach', 'Beach'],
            ['creampie', 'Creampie'], ['fingering', 'Fingering'], ['gender-bender', 'Gender Bender'],
            ['group', 'Group'], ['lingerie', 'Lingerie'], ['masturbation', 'Masturbation'],
            ['series', 'Series'], ['short', 'Short'], ['succubus', 'Succubus'],
            ['supernatural', 'Supernatural'], ['threesome', 'Threesome'], ['insect', 'Insect'],
            ['lolicon', 'Lolicon']
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
