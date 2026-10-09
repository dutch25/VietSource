const https = require('https');
const cheerio = require('cheerio');

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    }
};

https.get('https://truyentranhphapbi.blogspot.com/2026/09/dragon-ball-super-tap-24-ke-thua-cho_0231872861.html?m=0', options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const $ = cheerio.load(data);
        console.log($('.post-body img').length);
    });
});
