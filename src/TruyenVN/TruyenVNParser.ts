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

        $('.page-listing-item').each((_: any, el: any) => {
            const titleLink = $('.post-title h3 a', el).first()
            const title = titleLink.text().trim()
            const href = titleLink.attr('href') ?? ''

            if (!href || !title) return

            const idMatch = href.match(/\/truyen-tranh\/([^/]+)\/?$/)
            if (!idMatch) return

            const id = idMatch[1].trim()
            if (!id) return

            const img = $('.item-thumb img', el).first()
            let rawImage = img.attr('src') ?? img.attr('data-src') ?? img.attr('data-lazy-src') ?? ''
            
            if (!rawImage || rawImage.includes('data:image')) {
                const styleBg = $('.item-thumb', el).css('background-image')
                if (styleBg && styleBg !== 'none') {
                    const match = styleBg.match(/url\(["']?(.+?)["']?\)/)
                    if (match) rawImage = match[1]
                }
            }

            if (!rawImage || rawImage.includes('data:image')) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
        })

        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h1').first().text().trim()
            || mangaId
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        const genres: Tag[] = []
        $('.genres-content a, .manga-genres a').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const genreId = href.replace('/the-loai/', '').replace(/\/$/, '').trim()
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

    parseChapters($: CheerioAPI, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        const seenUrls = new Set<string>()

        $('a[href*="/chapter-"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            if (!href || seenUrls.has(href)) return
            seenUrls.add(href)
            
            const match = href.match(/\/truyen-tranh\/[^/]+\/([^/]+)\/?$/)
            if (!match) return

            const chapterId = match[1]
            let title = $(el).find('.chapter-title').first().text().trim()
            if (!title) title = $(el).text().trim()
            if (!title) title = chapterId

            let time = new Date()
            const parentEl = $(el).parents('.chapter-item, li, .wp-manga-chapter').first()
            if (parentEl.length) {
                const dateText = parentEl.find('.chapter-release-date, .post-on').first().text().trim()
                if (dateText) {
                    const parsed = new Date(dateText)
                    if (!isNaN(parsed.getTime())) {
                        time = parsed
                    }
                }
            }

            chapters.push(App.createChapter({
                id: chapterId,
                chapNum: this.extractChapterNumber(chapterId),
                name: title,
                time: time,
            }))
        })

        return chapters.reverse()
    }

    private extractChapterNumber(chapterId: string): number {
        const numMatch = chapterId.match(/(\d+)/)
        if (numMatch) {
            return parseFloat(numMatch[1])
        }
        return 0
    }

    parseChapterPages($: CheerioAPI): string[] {
        const pages: string[] = []

        $('.reading-content img').each((_: any, el: any) => {
            let imgSrc = ($(el).attr('src') ?? $(el).attr('data-src') ?? $(el).attr('data-original-src') ?? '').trim()
            if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image')) return

            const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(imgSrc)

            if (imgSrc && isImage) {
                if (!pages.includes(imgSrc)) pages.push(imgSrc)
            }
        })

        if (pages.length === 0) {
            $('img').each((_: any, el: any) => {
                let imgSrc = ($(el).attr('src') ?? '').trim()
                if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image')) return
                if (imgSrc.includes('wp-content/uploads')) {
                    if (!pages.includes(imgSrc)) pages.push(imgSrc)
                }
            })
        }

        return pages
    }

    getSearchTags(): TagSection[] {
        const genres: Array<[string, string]> = [
            ['action', 'Action'], ['adult', 'Adult'], ['adventure', 'Adventure'], ['anime', 'Anime'],
            ['comedy', 'Comedy'], ['comic', 'Comic'], ['doujinshi', 'Doujinshi'], ['drama', 'Drama'],
            ['ecchi', 'Ecchi'], ['erotic', 'Erotic'], ['fantasy', 'Fantasy'], ['harem', 'Harem'],
            ['historical', 'Historical'], ['horror', 'Horror'], ['huyen-huyen', 'Huyền Huyễn'],
            ['isekai', 'Isekai'], ['manhua', 'Manhua'], ['manhwa', 'Manhwa'], ['martial-arts', 'Martial Arts'],
            ['mature', 'Mature'], ['ngon-tinh', 'Ngôn Tình'], ['psychological', 'Psychological'],
            ['romance', 'Romance'], ['school-life', 'School Life'], ['seinen', 'Seinen'], ['shoujo', 'Shoujo'],
            ['slice-of-life', 'Slice of Life'], ['smut', 'Smut'], ['sports', 'Sports'],
            ['supernatural', 'Supernatural'], ['thieu-nhi', 'Thiếu Nhi'], ['thriller', 'Thriller'],
            ['truyen-mau', 'Truyện Màu'], ['truyen-tranh-18', 'Truyện tranh 18+'], ['vampire', 'Vampire'],
            ['webtoon', 'Webtoon'], ['xuyen-khong', 'Xuyên Không'], ['yaoi', 'Yaoi'], ['yuri', 'Yuri'],
            ['boylove', 'BoyLove'], ['dam-my', 'Đam Mỹ'],
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