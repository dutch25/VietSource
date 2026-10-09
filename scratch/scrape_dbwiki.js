const https = require('https');
const cheerio = require('cheerio');

https.get('https://dragonballwiki.net/doctruyen/dragon-ball-super', (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        const $ = cheerio.load(body);
        let chaps = [];
        $('.list-chapter li a').each((_, el) => {
            chaps.push($(el).attr('href'));
        });
        console.log("Chapters:", chaps.length);
        if (chaps.length > 0) {
            console.log("Sample:", chaps[0]);
            console.log("Sample:", chaps[chaps.length - 1]);
        }
        
        // Also check if we can get a manga's images
        if (chaps.length > 0) {
            https.get(chaps[chaps.length - 1], (res2) => {
                let body2 = '';
                res2.on('data', c => body2 += c);
                res2.on('end', () => {
                    const $2 = cheerio.load(body2);
                    let imgs = [];
                    $('.chapter-c img').each((_, el) => {
                        imgs.push($2(el).attr('src'));
                    });
                    console.log("Images:", imgs.length);
                    if (imgs.length > 0) {
                        console.log("Sample Image:", imgs[0]);
                    }
                });
            });
        }
    });
});
