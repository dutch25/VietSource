const https = require('https');
const cheerio = require('cheerio');

async function fetchLabel(label) {
    let allPosts = [];
    let url = `https://truyentranhphapbi.blogspot.com/search/label/${encodeURIComponent(label)}?m=0&max-results=50`;
    
    while (url) {
        console.log('Fetching', url);
        const data = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve(body));
                res.on('error', reject);
            });
        });
        
        const $ = cheerio.load(data);
        $('.date-outer').each((_, el) => {
            const a = $(el).find('.post-title a');
            if (a.length) {
                let link = a.attr('href');
                let title = a.text().trim();
                let id = link.replace('https://truyentranhphapbi.blogspot.com/', '').replace('.html', '').replace(/\//g, '_');
                allPosts.push({ id, title, link });
            }
        });
        
        const next = $('.blog-pager-older-link').attr('href');
        if (next && next.includes('?')) {
            url = next + '&m=0';
        } else if (next) {
            url = next + '?m=0';
        } else {
            url = null;
        }
    }
    
    // Sort posts chronologically (usually older posts are listed later on the blog or vice-versa)
    // Actually, blog posts are newest first, so we reverse to get chapter 1 first.
    return allPosts.reverse();
}

async function run() {
    const dbSuper = await fetchLabel('Dragon Ball Super');
    const db = await fetchLabel('Dragon Ball');
    
    const fs = require('fs');
    fs.writeFileSync('db_super.json', JSON.stringify(dbSuper, null, 2));
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    console.log('DB Super:', dbSuper.length);
    console.log('DB:', db.length);
}

run();
