import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function test() {
    const resHome = await fetch('https://vinahentai.bond/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const htmlHome = await resHome.text();
    const $ = cheerio.load(htmlHome);

    const cards = $('a[href^="/truyen-hentai/"]');
    
    cards.each((i, el) => {
        if (i > 10) return;
        const slug = $(el).attr('href')?.split('/')[2];
        if (slug === 'manage') return;

        // Try extracting title
        const ariaLabel = $(el).attr('aria-label');
        const truncateText = $(el).find('.truncate').last().text().trim();
        const textNodes = $(el).find('div.truncate').map((_, div) => $(div).text().trim()).get();
        
        let title = $(el).attr('aria-label') || $(el).find('div.truncate').last().text().trim() || $(el).find('.truncate').last().text().trim() || slug;

        console.log(`Slug: ${slug}`);
        console.log(`  ariaLabel: ${ariaLabel}`);
        console.log(`  div.truncate array: ${JSON.stringify(textNodes)}`);
        console.log(`  Chosen Title: ${title}`);
        console.log('---');
    });
}

test();
