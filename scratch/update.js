const fs = require('fs');

let ts = fs.readFileSync('./src/TruyenTranhPhapBi/TruyenTranhPhapBi.ts', 'utf8');

// Replace the old DRAGON_BALL_CHAPTERS with the new constants
const constStart = ts.indexOf('const DRAGON_BALL_CHAPTERS = [');
const constEnd = ts.indexOf(']', constStart) + 1;
const newConsts = fs.readFileSync('db_constants.ts', 'utf8');

ts = ts.slice(0, constStart) + newConsts + ts.slice(constEnd);

// Replace getHomePageSections
const hpStart = ts.indexOf('async getHomePageSections');
const hpEnd = ts.indexOf('async getViewMoreItems');

const newHp = `async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        sectionCallback(App.createHomeSection({
            id: 'Dragon Ball',
            title: 'Dragon Ball',
            containsMoreItems: false,
            type: HomeSectionType.singleRowNormal,
            items: [
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-super-aggregated',
                    title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
                }),
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-aggregated',
                    title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
                })
            ]
        }))

        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: \`\${BASE_URL}/?m=0\` },
            { id: 'Asterix', title: 'Asterix', url: \`\${BASE_URL}/search/label/Asterix?m=0\` },
            { id: 'Lucky Luke', title: 'Lucky Luke', url: \`\${BASE_URL}/search/label/Lucky%20Luke?m=0\` },
            { id: 'Xì trum', title: 'Xì trum', url: \`\${BASE_URL}/search/label/X%C3%AC%20trum?m=0\` },
            { id: 'Tintin', title: 'Tintin', url: \`\${BASE_URL}/search/label/Tintin?m=0\` },
            { id: 'Doremon', title: 'Doremon', url: \`\${BASE_URL}/search/label/Doremon?m=0\` },
        ]

        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal,
            }))
        }

        for (const section of sections) {
            try {
                const response = await this.requestManager.schedule(
                    App.createRequest({ url: section.url, method: 'GET' }), 0
                )
                const $ = this.cheerio.load(response.data as string)
                let items = this.parser.parseHomePage($)
                
                // Filter out individual Dragon Ball posts
                items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'))

                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                    items: items,
                }))
            } catch (e) {
                console.log(e)
            }
        }
    }

    `;

ts = ts.slice(0, hpStart) + newHp + ts.slice(hpEnd);

// Replace getSearchResults to inject both and filter
const searchStart = ts.indexOf('async getSearchResults');
const searchEnd = ts.indexOf('async getMangaDetails');

const newSearch = `async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const searchQuery = encodeURIComponent(query.title ?? '')
        const url = \`\${BASE_URL}/search?q=\${searchQuery}&m=0\`

        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        let items = this.parser.parseHomePage($)
        
        items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'))
        
        if (query.title && query.title.toLowerCase().includes('dragon ball')) {
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-aggregated',
                title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
            }))
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-super-aggregated',
                title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
            }))
        }
        
        return App.createPagedResults({ results: items, metadata: undefined })
    }

    `;
ts = ts.slice(0, searchStart) + newSearch + ts.slice(searchEnd);

// Replace getMangaDetails to handle both
const mdStart = ts.indexOf('async getMangaDetails');
const mdEnd = ts.indexOf('async getChapters');

const newMd = `async getMangaDetails(mangaId: string): Promise<SourceManga> {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball Super (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg',
                    status: 'ONGOING',
                    desc: 'Tổng hợp toàn bộ các tập truyện màu siêu nét của Dragon Ball Super.',
                })
            })
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg',
                    status: 'COMPLETED',
                    desc: 'Tổng hợp toàn bộ các tập truyện Dragon Ball Hồi Tuổi Thơ, Piccolo, Saiyan, Frieza, Cell, Mabu.',
                })
            })
        }

        const realId = mangaId.replace(/_/g, '/')
        const url = \`\${BASE_URL}/\${realId}.html?m=0\`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId)
    }

    `;
ts = ts.slice(0, mdStart) + newMd + ts.slice(mdEnd);

// Replace getChapters to handle both
const chapStart = ts.indexOf('async getChapters');
const chapEnd = ts.indexOf('async getChapterDetails');

const newChap = `async getChapters(mangaId: string): Promise<Chapter[]> {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return DRAGON_BALL_SUPER_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                langCode: 'vi'
            }))
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return DRAGON_BALL_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                langCode: 'vi'
            }))
        }

        const realId = mangaId.replace(/_/g, '/')
        const url = \`\${BASE_URL}/\${realId}.html?m=0\`
        const response = await this.requestManager.schedule(
            App.createRequest({ url, method: 'GET' }), 0
        )
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapters($, mangaId)
    }

    `;
ts = ts.slice(0, chapStart) + newChap + ts.slice(chapEnd);

// Bump version
ts = ts.replace("version: '1.1.0'", "version: '1.1.1'");

fs.writeFileSync('./src/TruyenTranhPhapBi/TruyenTranhPhapBi.ts', ts);
console.log('Update complete');
