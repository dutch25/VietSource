const https = require('https');
const cheerio = require('cheerio');

https.get('https://truyentranhphapbi.blogspot.com/2026/09/dragon-ball-super-tap-24-ke-thua-cho_0231872861.html', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const $ = cheerio.load(data);
        const pages = [];
        $('.post-body img').each((_, el) => {
            let imgSrc = $(el).attr('src') || '';
            if (imgSrc) {
                imgSrc = imgSrc.replace(/\/[swh]\d+[a-z-]*\//, '/s0/');
                pages.push(imgSrc);
            }
        });
        console.log(pages.length);
        console.log(pages[0]);
    });
});
