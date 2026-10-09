const html = require('fs').readFileSync('test_ttt.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
$('.item-thumb img, .manga-thumb img, .tab-thumb img, .item-summary img, img').slice(0, 10).each((i, el) => {
    console.log(i, Object.keys(el.attribs).map(k => `${k}="${el.attribs[k]}"`).join(' '));
});
