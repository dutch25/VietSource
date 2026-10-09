const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\Dutch\\.gemini\\antigravity-ide\\brain\\e0734863-5a7f-4cca-9a61-3df0b520a39b\\.system_generated\\steps\\44\\content.md', 'utf8');
const $ = cheerio.load(html);

const results = [];
$('.post').each((_, el) => {
    const titleLink = $(el).find('.post-title a').first();
    if (titleLink.length === 0) return;

    const title = titleLink.text().trim();
    const href = titleLink.attr('href') || '';

    if (!href || !title) return;

    const match = href.match(/\/(\d{4}\/\d{2}\/[^/]+)\.html/);
    if (!match) return;
    const id = match[1];

    let image = 'https://truyentranhphapbi.blogspot.com/favicon.ico';
    const htmlContent = $(el).html() || '';
    const imgMatch = htmlContent.match(/snips_image_creator\("([^"]+)"/);
    if (imgMatch) {
        image = imgMatch[1].replace(/\/s\d+[a-z-]*\//, '/s0/');
    } else {
        const fallbackImg = $(el).find('img').first().attr('src');
        if (fallbackImg && !fallbackImg.includes('icon18_edit')) {
            image = fallbackImg;
        }
    }

    results.push({ mangaId: id, title, image });
});

console.log(results.length, results[0]);
