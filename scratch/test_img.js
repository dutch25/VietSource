const https = require('https');
const cheerio = require('cheerio');
https.get('https://dragonballwiki.net/doctruyen/dragon-ball-super/chap-104-3.html', (res) => {
    let body = '';
    res.on('data', c=>body+=c);
    res.on('end', () => {
        const $ = cheerio.load(body);
        let imgs = [];
        $('.chapter-c img, .chapter-content img').each((_, el) => {
            imgs.push($(el).attr('src'));
        });
        console.log("Images found:", imgs.length);
        if (imgs.length === 0) {
            console.log($('img').map((i,el)=>$(el).attr('src')).get().slice(0, 10));
        }
    });
});
