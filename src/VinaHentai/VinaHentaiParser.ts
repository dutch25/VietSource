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
        const cards = $('a[href^="/truyen-hentai/"]')
        const imageMap = this.buildImageMap($)
        return this.parseCards($, cards, imageMap)
    }

    parseSection($: CheerioAPI, sectionTitle: string): PartialSourceManga[] {
        const header = $('h2').filter((_, el) => $(el).text().trim().toLowerCase().includes(sectionTitle.toLowerCase()))
        if (header.length === 0) return []

        const imageMap = this.buildImageMap($)

        let current = header
        for (let i = 0; i < 5; i++) {
            const next = current.next()
            if (next.length > 0) {
                const cards = next.find('a[href^="/truyen-hentai/"]')
                if (cards.length > 0) {
                    return this.parseCards($, cards, imageMap)
                }
            }

            const parentNext = current.parent().next()
            if (parentNext.length > 0) {
                const cards = parentNext.find('a[href^="/truyen-hentai/"]')
                if (cards.length > 0) {
                    return this.parseCards($, cards, imageMap)
                }
            }
            current = current.parent()
        }
        return []
    }

    parseCards($: CheerioAPI, cardsEl: any, imageMap: Map<string, string>): PartialSourceManga[] {
        const results: PartialSourceManga[] = []
        cardsEl.each((_: any, el: any) => {
            const href = $(el).attr('href')
            if (!href) return
            const parts = href.split('/').filter(Boolean)
            if (parts.length !== 2) return

            const slug = parts[1].trim()
            if (slug === 'manage') return

            let title = $(el).attr('aria-label') || $(el).attr('title') || ''
            if (!title) {
                const titleEl = $(el).find('.truncate').last()
                title = titleEl.attr('title') || titleEl.text().trim()
            }
            if (!title) {
                const titleEl = $(el).find('h2, h3, p').first()
                title = titleEl.attr('title') || titleEl.text().trim() || slug
            }

            const img = $(el).find('img').first()
            let image = img.attr('src') ?? img.attr('data-src') ?? ''

            if (!image) {
                image = imageMap.get(slug) ?? ''
            }
            
            if (!image) {
                image = 'https://via.placeholder.com/320x424.png?text=No+Image'
            }

            if (slug && title) {
                try {
                    results.push(App.createPartialSourceManga({ mangaId: slug, title, image }))
                } catch(e) {}
            }
        })
        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('h1').first().text().trim()
            || $('meta[property="og:title"]').attr('content')?.split('|')[0].trim()
            || mangaId
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        const authors: Tag[] = []
        $('a[href^="/authors/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const authorId = href.replace('/authors/', '').trim()
            const label = $(el).find('span').first().text().trim() || $(el).text().trim()
            if (authorId && label) {
                authors.push(App.createTag({ id: 'author:' + authorId, label }))
            }
        })

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
        if (authors.length > 0) {
            tagSections.push(App.createTagSection({ id: 'author', label: 'Tác Giả', tags: authors }))
        }
        if (genres.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genres', label: 'Thể Loại', tags: genres }))
        }

        const authorName = authors.length > 0 ? authors[0].label : ''

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: rawImage,
                desc,
                author: authorName,
                artist: authorName,
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

            const lowerTitle = title.toLowerCase()
            if (lowerTitle.includes('từ đầu') || lowerTitle.includes('mới nhất') || lowerTitle.includes('đọc tiếp')) {
                return
            }

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

        return chapters
    }

    parseChapterPages($: CheerioAPI): string[] {
        const html = $.html()
        const regex = /https:\/\/cdn\.vinahentai\.cloud\/manga-images\/[^\s"'\\]+\.(webp|jpg|jpeg|png|gif)/g
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

    private buildImageMap($: CheerioAPI): Map<string, string> {
        const imageMap = new Map<string, string>()
        const html = $.html()
        
        const regex = /"([^"]+)"|\\"([^"]+)\\"/g;
        const tokens: string[] = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            tokens.push(match[1] ?? match[2] ?? '');
        }
        
        for (let i = 0; i < tokens.length; i++) {
            const part = tokens[i]
            if (part && /^https:\/\/cdn\.vinahentai\.cloud\/[^\s"'\\]+\.(webp|jpg|jpeg|png)$/.test(part)) {
                for (let j = 1; j <= 20; j++) {
                    const prev = tokens[i - j]
                    if (prev && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(prev) && prev.length > 3 && prev.length < 100) {
                        imageMap.set(prev, part)
                        break
                    }
                }
            }
        }
        return imageMap
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
            ['hentai-khong-che', 'Không che'], ['kimono', 'Kimono'], ['maids', 'Maids'],
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

    deduplicate(items: PartialSourceManga[]): PartialSourceManga[] {
        const seen = new Set<string>()
        return items.filter(item => {
            if (seen.has(item.mangaId)) return false
            seen.add(item.mangaId)
            return true
        })
    }

    isLastPage($: CheerioAPI, currentPage: number = 1): boolean {
        let isLast = true;
        let hasPagination = false;

        $('a').each((_, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('page=')) {
                hasPagination = true;
            }
        });

        $('button').each((_, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'cuối' || text === 'tiếp' || text === 'sau' || text === '>') {
                hasPagination = true;
            }
            if (text === String(currentPage + 1)) {
                hasPagination = true;
            }
        });

        if (hasPagination) {
            $('a').each((_, el) => {
                const text = $(el).text().trim().toLowerCase();
                const href = $(el).attr('href') || '';
                const rel = $(el).attr('rel') || '';
                if (href.includes('page=')) {
                    if (text.includes('sau') || text.includes('next') || text.includes('»') || text.includes('>') || rel === 'next') {
                        isLast = false;
                    }
                    if (href.includes(`page=${currentPage + 1}`)) {
                        isLast = false;
                    }
                }
            });

            $('button').each((_, el) => {
                const text = $(el).text().trim().toLowerCase();
                if (text === 'cuối' || text === 'tiếp' || text === 'sau' || text === '>') {
                    isLast = false;
                }
                if (text === String(currentPage + 1)) {
                    isLast = false;
                }
            });
        } else {
            isLast = true;
        }

        return isLast;
    }

    parseGenrePage($: CheerioAPI): PartialSourceManga[] {
        const manga = this.parseHomePage($)
        const genresMap = this.extractMangaGenresMap($)
        return manga.filter(m => {
            const genres = genresMap.get(m.mangaId)
            if (genres) {
                return !genres.includes('yaoi') && !genres.includes('furry')
            }
            return true
        })
    }

    private extractMangaGenresMap($: CheerioAPI): Map<string, string[]> {
        const genresMap = new Map<string, string[]>()
        try {
            const html = $.html()
            const regex = /streamController\.enqueue\("([\s\S]*?)"\)/g
            let match
            let concatenated = ''
            while ((match = regex.exec(html)) !== null) {
                concatenated += match[1]
            }

            if (!concatenated) return genresMap

            const safeLiteral = concatenated.replace(/\r/g, '\\r').replace(/\n/g, '\\n')
            const decodedStr = JSON.parse('"' + safeLiteral + '"')
            const parsed = JSON.parse(decodedStr)

            if (!Array.isArray(parsed)) return genresMap

            const cache = new Map<number, any>()

            const resolve = (idx: any): any => {
                if (idx === null || idx === undefined) return idx
                if (typeof idx !== 'number') return idx

                if (cache.has(idx)) return cache.get(idx)
                cache.set(idx, null)

                const raw = parsed[idx]
                if (raw === null || raw === undefined || typeof raw !== 'object') {
                    cache.set(idx, raw)
                    return raw
                }

                if (Array.isArray(raw)) {
                    const resolvedArr: any[] = []
                    cache.set(idx, resolvedArr)
                    for (const item of raw) {
                        resolvedArr.push(resolve(item))
                    }
                    return resolvedArr
                }

                const keys = Object.keys(raw)
                const isRefObj = keys.every(k => k.startsWith('_'))

                if (isRefObj) {
                    const resolvedObj: any = {}
                    cache.set(idx, resolvedObj)
                    for (const k of keys) {
                        const keyIdx = parseInt(k.slice(1), 10)
                        const propName = resolve(keyIdx)
                        const valIdx = raw[k]
                        resolvedObj[propName] = resolve(valIdx)
                    }
                    return resolvedObj
                } else {
                    const resolvedObj: any = {}
                    cache.set(idx, resolvedObj)
                    for (const k of keys) {
                        resolvedObj[k] = resolve(raw[k])
                    }
                    return resolvedObj
                }
            }

            for (let i = 0; i < parsed.length; i++) {
                const resObj = resolve(i)
                if (resObj && typeof resObj === 'object' && resObj.slug && resObj.title && resObj.chapters !== undefined) {
                    if (Array.isArray(resObj.genres)) {
                        genresMap.set(resObj.slug, resObj.genres.filter((g: any) => typeof g === 'string'))
                    }
                }
            }
        } catch (e) {
            // Silence parsing errors
        }
        return genresMap
    }
}
