require('ts-node').register({ transpileOnly: true });

const cheerio = require('cheerio');

global.App = {
    createHomeSection: (opts) => opts,
    createPartialSourceManga: (opts) => opts,
    createSourceManga: (opts) => opts,
    createMangaInfo: (opts) => opts,
    createChapter: (opts) => opts,
    createChapterDetails: (opts) => opts,
    createPagedResults: (opts) => opts,
    createTag: (opts) => opts,
    createTagSection: (opts) => opts,
    createRequest: (opts) => opts,
    createRequestManager: (opts) => {
        return {
            schedule: async (req, retry) => {
                if (opts.interceptor?.interceptRequest) {
                    req = await opts.interceptor.interceptRequest(req);
                }
                const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
                const res = await fetch(req.url, {
                    method: req.method,
                    headers: req.headers
                });
                const data = await res.text();
                return { status: res.status, data };
            },
            getDefaultUserAgent: async () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        };
    }
};

async function testSource(sourceName) {
    console.log(`\n--- TESTING SOURCE: ${sourceName} ---`);
    const sourcePath = `./src/${sourceName}/${sourceName}.ts`;
    const SourceModule = require(sourcePath);
    
    // Find the exported class
    const SourceClass = Object.values(SourceModule).find(v => typeof v === 'function' && v.name === sourceName);
    
    if (!SourceClass) {
        console.error('Could not find Source class in module.');
        return;
    }
    
    const source = new SourceClass();
    source.cheerio = cheerio;
    
    try {
        console.log('\n[1] Testing getHomePageSections...');
        const sections = [];
        await source.getHomePageSections((s) => sections.push(s));
        console.log(`Received ${sections.length} sections.`);
        const firstSection = sections.find(s => s.items && s.items.length > 0);
        
        if (!firstSection) {
            console.error('No sections with items returned!');
            return;
        }
        console.log(`First section '${firstSection.id}' has ${firstSection.items.length} items.`);
        const firstManga = firstSection.items[0];
        console.log('Sample manga:', firstManga);
        
        console.log(`\n[2] Testing getMangaDetails for ${firstManga.mangaId}...`);
        const details = await source.getMangaDetails(firstManga.mangaId);
        console.log('Details:', details.mangaInfo.titles[0]);
        
        console.log(`\n[3] Testing getChapters for ${firstManga.mangaId}...`);
        const chapters = await source.getChapters(firstManga.mangaId);
        console.log(`Found ${chapters.length} chapters.`);
        if (chapters.length === 0) return;
        const firstChapter = chapters[0];
        console.log('Sample chapter:', firstChapter.name);
        
        console.log(`\n[4] Testing getChapterDetails for chapter ${firstChapter.id}...`);
        const chapterDetails = await source.getChapterDetails(firstManga.mangaId, firstChapter.id);
        console.log(`Found ${chapterDetails.pages.length} pages.`);
        console.log('Sample page:', chapterDetails.pages[0]);
        
        console.log('\n--- TEST SUCCESSFUL ---');
    } catch (e) {
        console.error('\n--- TEST FAILED ---');
        console.error(e);
    }
}

const target = process.argv[2] || 'TruyenTranhPhapBi';
testSource(target);
