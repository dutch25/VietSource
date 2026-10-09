import { Chapter } from '@paperback/types'

export class Parser {
    parseChapters($: CheerioStatic, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        
        $('a').each((_: any, el: any) => {
            const href = $(el).attr('href')
            if (href && href.includes('chap')) {
                let name = $(el).text().trim()
                if (name) {
                    const match = name.match(/Chap (\\d+)/i)
                    let num = 0
                    if (match) {
                        num = parseFloat(match[1]!)
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
        
        // Return sorted if necessary, but we'll reverse since usually older is first or last.
        // Actually the site lists 104 first, then 103, down to 1.
        // Paperback expects newest first or whatever, but just return as is or reversed.
        // I'll return reversed so chap 104 is at the top if the original was chap 1 at bottom?
        // Wait, the page lists 104 -> 103 -> ... -> 1.
        // Wait, Paperback usually likes them descending (highest chapter first).
        return chapters
    }

    parsePages($: CheerioStatic): string[] {
        const pages: string[] = []
        $('.chapter-content img, .chapter-c img').each((_: any, el: any) => {
            const src = $(el).attr('src') || $(el).attr('data-src')
            if (src) pages.push(src)
        })
        return pages
    }
}
