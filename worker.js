export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get('url')
    
    // Allow both nhentaiclub and vi-hentai/shousetsu domains
    const allowedDomains = ['nhentaiclub.shop', 'nhentaiclub.space', 'shousetsu.dev', 'vi-hentai.pro']
    const isAllowed = allowedDomains.some(domain => target?.includes(domain))
    
    if (!target || !isAllowed) {
      return new Response('Invalid URL', { status: 400 })
    }

    try {
      // Get cookies from main site first
      const mainDomain = target.includes('shousetsu.dev') || target.includes('vi-hentai') 
        ? 'https://vi-hentai.pro' 
        : 'https://nhentaiclub.space'
      
      const mainRes = await fetch(mainDomain, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      })

      const cookies = mainRes.headers.get('set-cookie') || ''

      // Fetch target with those cookies
      const response = await fetch(target, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': mainDomain + '/',
          'Cookie': cookies,
        },
      })

      const contentType = response.headers.get('Content-Type') || 'image/jpeg'

      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (error) {
      return new Response('Proxy Error: ' + error.message, { status: 500 })
    }
  }
}
