// Cloudflare Worker - No headless browser needed
// Uses inline JSON data if available in HTML

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
      // Fetch the manga page
      const response = await fetch(mangaUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      
      // Try to find chapters from various sources
      let chapters = [];
      
      // Method 1: Look for JSON data embedded in page
      chapters = extractFromJson(html, mangaUrl);
      
      // Method 2: Look for links in the page
      if (chapters.length === 0) {
        chapters = extractFromLinks(html, mangaUrl);
      }
      
      // Method 3: Look for WordPress post meta
      if (chapters.length === 0) {
        chapters = extractFromMeta(html, mangaUrl);
      }
      
      return new Response(JSON.stringify({ 
        chapters,
        source: chapters.length > 0 ? 'html' : 'none'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

function extractFromJson(html, mangaUrl) {
  const chapters = [];
  const seenUrls = new Set();
  
  // Look for JSON arrays with chapter data
  const jsonMatches = html.match(/\[[\s\S]*?"name"[\s\S]*?\]/g);
  if (jsonMatches) {
    for (const jsonStr of jsonMatches) {
      try {
        const data = JSON.parse(jsonStr);
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item.name && item.pictures) {
              const chapterId = item.name;
              const numMatch = chapterId.match(/(\d+)/);
              const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1;
              
              if (!seenUrls.has(chapterId)) {
                seenUrls.add(chapterId);
                chapters.push({
                  id: chapterId,
                  chapNum: chapNum,
                  name: `Chapter ${chapterId}`,
                  url: `${mangaUrl}/${chapterId}`
                });
              }
            }
          }
        }
      } catch (e) {}
    }
  }
  
  return chapters;
}

function extractFromLinks(html, mangaUrl) {
  const chapters = [];
  const seenUrls = new Set();
  
  // Extract manga slug
  const mangaIdMatch = mangaUrl.match(/\/manga\/([^/]+)/);
  const mangaSlug = mangaIdMatch ? mangaIdMatch[1] : '';
  
  // Find all chapter links
  const linkRegex = /href="([^"]*\/tap-[^"]*|[^"]*\/chuong-[^"]*)"/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href || seenUrls.has(href)) continue;
    
    // Only include links for this manga
    if (!href.includes(`/${mangaSlug}/`)) continue;
    
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

function extractFromMeta(html, mangaUrl) {
  const chapters = [];
  
  // Look for WordPress post meta with chapter info
  const metaMatch = html.match(/<meta[^>]*name="chapter[^"]*"[^>]*content="([^"]*)"/gi);
  if (metaMatch) {
    for (const meta of metaMatch) {
      const contentMatch = meta.match(/content="([^"]*)"/);
      if (contentMatch) {
        const chapterName = contentMatch[1];
        const numMatch = chapterName.match(/(\d+)/);
        const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1;
        
        chapters.push({
          id: chapterName,
          chapNum: chapNum,
          name: chapterName,
          url: `${mangaUrl}/${chapterName}`
        });
      }
    }
  }
  
  return chapters;
}
