const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('request', request => {
    const url = request.url();
    if (url.includes('api') || url.includes('.json') || request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
      console.log('API Request:', url);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api') || url.includes('.json') || response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr') {
      try {
        const text = await response.text();
        if (text.includes('chap')) {
            console.log('Response with chap:', url, text.substring(0, 100));
        }
      } catch (e) {}
    }
  });

  await page.goto('https://vinahentai.one/truyen-hentai/giao-vien-the-duc', { waitUntil: 'networkidle2' });
  
  await browser.close();
})();
