export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const mangaUrl = url.searchParams.get('url');
    
    if (!mangaUrl) {
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const browser = await env.BROWSER;
      
      const page = await browser.newPage();
      await page.goto(mangaUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for chapters to load
      await page.waitForTimeout(3000);
      
      // Get page content after JavaScript execution
      const html = await page.content();
      
      // Extract chapters from HTML
      const chapters = extractChapters(html, mangaUrl);
      
      await page.close();
      
      return new Response(JSON.stringify({ chapters }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

function extractChapters(html, mangaUrl) {
  const chapters = [];
  const seenUrls = new Set();
  
  // Extract manga ID from URL
  const mangaIdMatch = mangaUrl.match(/\/manga\/([^/]+)/);
  const mangaId = mangaIdMatch ? mangaIdMatch[1] : '';
  
  // Match chapter links
  const linkRegex = /href="([^"]*\/tap-[^"]*|[^"]*\/chuong-[^"]*)"/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href || seenUrls.has(href)) continue;
    seenUrls.add(href);
    
    const chapterMatch = href.match(/\/manga\/[^/]+\/([^/]+)/);
    if (!chapterMatch) continue;
    
    const chapterId = chapterMatch[1];
    const numMatch = chapterId.match(/(\d+)/);
    const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1;
    
    chapters.push({
      id: chapterId,
      chapNum: chapNum,
      name: chapterId,
      url: href
    });
  }
  
  return chapters.reverse();
}
