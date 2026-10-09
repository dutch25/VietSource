const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('C:\\Users\\Dutch\\.gemini\\antigravity-ide\\brain\\e0734863-5a7f-4cca-9a61-3df0b520a39b\\.system_generated\\steps\\710\\content.md', 'utf8');

const $ = cheerio.load(content);
const chaps = [];
$('a').each((_, el) => {
    let href = $(el).attr('href');
    if (href && href.includes('chap')) {
        chaps.push({ text: $(el).text().trim(), href });
    }
});
console.log("Found chapters:", chaps.length);
console.log(chaps.slice(0, 10));
