import { Chapter, SourceManga, PartialSourceManga } from '@paperback/types'

export class Parser {
    parseMangaList($: any): PartialSourceManga[] {
        const manga: PartialSourceManga[] = []
        $('.comic-item, .hot-comic, .full-comic, .item').each((_: any, el: any) => {
            const a = $(el).find('a').first()
            const href = a.attr('href')
            if (href && href.includes('/doctruyen/')) {
                const title = a.attr('title') || $(el).find('.name').text().trim() || a.text().trim()
                let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || ''
                if (image && image.includes('timthumb.php?src=')) {
                    image = image.split('timthumb.php?src=')[1]?.split('&')[0] || image
                }
                const mangaId = href.split('/doctruyen/')[1]?.replace(new RegExp('/', 'g'), '')
                if (mangaId && title) {
                    manga.push(App.createPartialSourceManga({
                        mangaId,
                        title,
                        image: decodeURIComponent(image),
                    }))
                }
            }
        })
        
        // Remove duplicates by ID
        return manga.filter((v, i, a) => a.findIndex(t => (t.mangaId === v.mangaId)) === i)
    }

    parseMangaDetails($: any, mangaId: string): SourceManga {
        const title = $('.title-manga').text().trim() || $('h1.title').text().trim() || mangaId
        let image = $('.info-image img').attr('src') || $('.image-info img').attr('src') || ''
        if (image && image.includes('timthumb.php?src=')) {
            image = image.split('timthumb.php?src=')[1]?.split('&')[0] || image
        }
        const desc = $('.desc-text').text().trim() || $('.story-detail-info').text().trim() || ''

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: decodeURIComponent(image),
                status: 'ONGOING',
                desc: desc,
            })
        })
    }

    parseChapters($: any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        
        $('.list-chapter li a, table tbody tr td a').each((_: any, el: any) => {
            const href = $(el).attr('href')
            if (href && (href.includes('chap') || href.includes('tap'))) {
                let name = $(el).text().trim()
                if (name) {
                    const match = name.match(/(Chap|Tập|Tap)\s*(\d+(\.\d+)?)/i)
                    let num = 0
                    if (match) {
                        num = parseFloat(match[2]!)
                    }
                    chapters.push(App.createChapter({
                        id: href,
                        name: name,
                        chapNum: num,
                        langCode: 'vi',
                    }))
                }
            }
        })
        
        return chapters.reverse()
    }

    parsePages($: any): string[] {
        const pages: string[] = []
        $('.chapter-content img, .chapter-c img').each((_: any, el: any) => {
            const src = $(el).attr('src') || $(el).attr('data-src')
            if (src) pages.push(src)
        })
        return pages
    }
}
