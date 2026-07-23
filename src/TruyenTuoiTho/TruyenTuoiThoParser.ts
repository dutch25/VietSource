import {
    Chapter,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

export class Parser {

    parseHomePage($: CheerioAPI, proxyUrl?: string): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        $('.page-item-detail, .manga-item, .page-listing-item, .row.c-tabs-item__content').each((_: any, el: any) => {
            const thumbLink = $('.item-thumb a, .manga-thumb a, .tab-thumb a', el).first()
            const titleLink = $('.post-title h3 a, .post-title a, .manga-title a, .h5 a, .post-title a', el).first()

            const href = thumbLink.attr('href') ?? titleLink.attr('href') ?? ''
            let title = thumbLink.attr('title') ?? titleLink.text() ?? ''
            
            // Clean title if it has "Full" or extra descriptions
            if (title.includes(' Full')) {
                title = title.split(' Full')[0]
            }
            title = title.trim()

            if (!href || !title) return

            const idMatch = href.match(/\/manga\/([^/]+)\/?$/)
            if (!idMatch) return

            const id = idMatch[1].trim()
            if (!id) return

            const img = $('.item-thumb img, .manga-thumb img, .tab-thumb img, img', el).first()
            let rawImage = img.attr('data-src') ?? img.attr('data-lazy-src') ?? img.attr('src') ?? ''

            if (!rawImage || rawImage.includes('data:image')) {
                rawImage = img.attr('data-original') ?? img.attr('data-srcset') ?? img.attr('srcset') ?? rawImage
            }

            if (!rawImage || rawImage.includes('data:image')) {
                const styleBg = $('.item-thumb, .manga-thumb, .tab-thumb', el).first().css('background-image')
                if (styleBg && styleBg !== 'none') {
                    const match = styleBg.match(/url\(["']?(.+?)["']?\)/)
                    if (match) rawImage = match[1]
                }
            }

            if (rawImage && rawImage.includes(' ')) {
                rawImage = rawImage.split(' ')[0]
            }

            if (!rawImage || rawImage.includes('data:image')) return

            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }))
        })

        return this.deduplicate(results)
    }

    parseMangaDetails($: CheerioAPI, mangaId: string, proxyUrl?: string): SourceManga {
        let title = $('.post-title h1').first().text().trim()
            || $('meta[property="og:title"]').attr('content')?.trim()
            || mangaId

        // Clean WordPress SEO title prefixes/suffixes
        if (title.startsWith('Đọc truyện ')) {
            title = title.replace('Đọc truyện ', '')
        }
        if (title.includes(' Full')) {
            title = title.split(' Full')[0]
        }
        if (title.includes(' - Truyen tuoi tho')) {
            title = title.split(' - Truyen tuoi tho')[0]
        }
        title = title.trim()

        const rawImage = $('meta[property="og:image"]').attr('content')?.trim()
            || $('.summary_image img').attr('src')
            || $('.summary_image img').attr('data-src')
            || ''

        const image = rawImage

        const desc = $('meta[property="og:description"]').attr('content')?.trim()
            || $('.description-summary').text().trim()
            || $('.summary__content').text().trim()
            || ''

        const author = $('.author-content a').text().trim() || ''
        const artist = $('.artist-content a').text().trim() || ''
        const status = $('.post-status .summary-content').text().trim() || 'Ongoing'

        const genres: Tag[] = []
        $('.genres-content a, .manga-genres a, .genres a, .genres-content a[href*="/manga-genre/"]').each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            const genreMatch = href.match(/\/manga-genre\/([^/]+)/) || href.match(/\/genre\/([^/]+)/)
            const genreId = genreMatch ? genreMatch[1].trim() : ''
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
                image,
                desc,
                author,
                artist,
                status,
                tags: tagSections
            }),
        })
    }

    parseChapters($: CheerioAPI, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        const seenUrls = new Set<string>()

        // Scoping search to actual chapter containers to prevent grabbing sidebar links
        const container = $('.listing-chapters_wrap, #manga-chapters-holder, .version-chap')
        const target = container.length > 0 ? container.find('a') : $('.wp-manga-chapter a, .chapter-item a')

        target.each((_: any, el: any) => {
            const href = $(el).attr('href') ?? ''
            if (!href || seenUrls.has(href)) return
            
            // Filter out non-chapter anchor elements
            if (href === '#' || href.includes('javascript:void(0)')) return
            
            seenUrls.add(href)
            
            const match = href.match(/\/manga\/[^/]+\/([^/]+)\/?$/)
            if (!match) return

            const chapterId = match[1]
            const title = $(el).text().trim() || chapterId

            let time = new Date()
            const parentEl = $(el).closest('li, .chapter-item, .wp-manga-chapter').first()
            if (parentEl.length) {
                const dateText = parentEl.find('.post-on, .chapter-release-date').first().text().trim()
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

        $('.reading-content img, .page-break img').each((_: any, el: any) => {
            const imgSrc = ($(el).attr('data-src') ?? $(el).attr('data-lazy-src') ?? $(el).attr('src') ?? '').trim()
            if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image')) return

            if (!pages.includes(imgSrc)) pages.push(imgSrc)
        })

        return pages
    }

    getSearchTags(): TagSection[] {
        const genres: Array<[string, string]> = [
            ['action', 'Action'],
            ['adult', 'Adult'],
            ['adventure', 'Adventure'],
            ['anime', 'Anime'],
            ['comedy', 'Comedy'],
            ['comic', 'Comic'],
            ['cooking', 'Cooking'],
            ['drama', 'Drama'],
            ['fantasy', 'Fantasy'],
            ['harem', 'Harem'],
            ['historical', 'Historical'],
            ['horror', 'Horror'],
            ['josei', 'Josei'],
            ['live-action', 'Live action'],
            ['manga', 'Manga'],
            ['manhua', 'Manhua'],
            ['manhwa', 'Manhwa'],
            ['martial-arts', 'Martial Arts'],
            ['mature', 'Mature'],
            ['mecha', 'Mecha'],
            ['mystery', 'Mystery'],
            ['one-shot', 'One shot'],
            ['psychological', 'Psychological'],
            ['romance', 'Romance'],
            ['school-life', 'School Life'],
            ['sci-fi', 'Sci-fi'],
            ['seinen', 'Seinen'],
            ['shoujo', 'Shoujo'],
            ['shounen', 'Shounen'],
            ['slice-of-life', 'Slice of Life'],
            ['sports', 'Sports'],
            ['thieu-nhi', 'Thiếu Nhi'],
            ['detective', 'Trinh thám'],
            ['truyen-giay', 'truyện giấy'],
            ['truyen-hay', 'Truyện hay'],
            ['webtoon', 'Webtoon']
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
