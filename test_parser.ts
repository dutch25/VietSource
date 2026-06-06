import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function test() {
    const resHome = await fetch('https://vinahentai.bond/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const htmlHome = await resHome.text();

    const imageMap = new Map<string, string>();
    
    // Let's use a simpler Regex to find all slugs and images
    // In the stream data, strings are enclosed in "" or escaped \"\"
    const regex = /"([^"]+)"|\\"([^"]+)\\"/g;
    
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(htmlHome)) !== null) {
        tokens.push(match[1] || match[2]);
    }
    
    for (let i = 0; i < tokens.length; i++) {
        const part = tokens[i];
        if (part && /^https:\/\/cdn\.vinahentai\.bond\/[^\s"'\\]+\.(webp|jpg|jpeg|png)$/.test(part)) {
            for (let j = 1; j <= 20; j++) {
                const prev = tokens[i - j];
                if (prev && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(prev) && prev.length > 3 && prev.length < 100) {
                    imageMap.set(prev, part);
                    break;
                }
            }
        }
    }

    const $ = cheerio.load(htmlHome);
    const cards = $('a[href^="/truyen-hentai/"]');
    
    let failed = 0;
    cards.each((i, el) => {
        const href = $(el).attr('href');
        const slug = href?.split('/')[2];
        if (!slug || slug === 'manage') return;

        const img = $(el).find('img').first();
        let image = img.attr('src') ?? img.attr('data-src') ?? '';

        if (!image) {
            image = imageMap.get(slug) ?? '';
        }

        if (!image) {
            failed++;
        }
    });
    console.log(`Failed to find images for ${failed} cards.`);
}

test();
