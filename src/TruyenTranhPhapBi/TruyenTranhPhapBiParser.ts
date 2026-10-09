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

        $('.post').each((_: any, el: any) => {
            const titleLink = $(el).find('.post-title a').first()
            if (titleLink.length === 0) return

            const title = titleLink.text().trim()
            const href = titleLink.attr('href') ?? ''

            if (!href || !title) return

            const match = href.match(/\/(\d{4}\/\d{2}\/[^/]+)\.html/);
            if (!match) return;
            const id = match[1].replace(/\//g, '_');

            let image = 'https://truyentranhphapbi.blogspot.com/favicon.ico'
            const htmlContent = $(el).html() || ''
            const imgMatch = htmlContent.match(/snips_image_creator\("([^"]+)"/)
            if (imgMatch) {
                image = imgMatch[1].replace(/\/s\d+[a-z-]*\//, '/s0/')
            } else {
                const fallbackImg = $(el).find('img').first().attr('src')
                if (fallbackImg && !fallbackImg.includes('icon18_edit')) {
                    image = fallbackImg
                }
            }

            results.push(App.createPartialSourceManga({ mangaId: id, title, image }))
        })

        return results
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h3.post-title').first().text().trim()
            || mangaId

        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? ''
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? ''

        const genres: Tag[] = []
        $('.post-labels a').each((_: any, el: any) => {
            const label = $(el).text().trim()
            if (label) {
                genres.push(App.createTag({ id: label, label }))
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
        const title = $('h3.post-title').first().text().trim() || 'Chương 1'
        const timeText = $('.date-header span').first().text().trim()
        
        let time = new Date()
        if (timeText) {
             const parsed = new Date(timeText)
             if (!isNaN(parsed.getTime())) {
                 time = parsed
             }
        }

        chapters.push(App.createChapter({
            id: mangaId,
            chapNum: 1,
            name: title,
            time: time,
        }))

        return chapters
    }

    parseChapterPages($: CheerioAPI): string[] {
        const pages: string[] = []

        $('.post-body img').each((_: any, el: any) => {
            let imgSrc = ($(el).attr('src') ?? '').trim()
            if (!imgSrc) return

            const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(imgSrc) || imgSrc.includes('blogger.googleusercontent.com') || imgSrc.includes('bp.blogspot.com')

            if (imgSrc && isImage) {
                imgSrc = imgSrc.replace(/=s\d+[^/]*$/, '=s0')
                if (!pages.includes(imgSrc)) pages.push(imgSrc)
            }
        })

        return pages
    }

    getSearchTags(): TagSection[] {
        return []
    }
}
