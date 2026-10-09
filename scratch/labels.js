const https = require('https');
const cheerio = require('cheerio');

https.get('https://truyentranhphapbi.blogspot.com/?m=0', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const $ = cheerio.load(data);
        const labels = [];
        $('.list-label-widget-content a').each((_, el) => {
            labels.push({ title: $(el).text().trim(), url: $(el).attr('href') });
        });
        console.log(labels);
    });
});
