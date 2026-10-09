const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('request', request => {
    const url = request.url();
    if (url.includes('api') || url.includes('.json') || request.resourceType() === 'fetch' || request.resourceType() === 'xhr' || url.includes('.data')) {
      console.log('API Request:', url);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api') || url.includes('.json') || response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr' || url.includes('.data')) {
      try {
        const text = await response.text();
        if (text.includes('chap') || text.includes('Chap')) {
            console.log('Response with chap:', url);
        }
      } catch (e) {}
    }
  });

  console.log("Navigating...");
  await page.goto('https://vinahentai.one/truyen-hentai/mommy-kafka-bbc-cuckold', { waitUntil: 'networkidle2' });
  console.log("Done navigating!");
  await browser.close();
})();
