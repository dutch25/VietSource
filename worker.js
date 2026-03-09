export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (!url.searchParams.has('url')) {
      return new Response('Not found', { status: 404 })
    }

    const target = url.searchParams.get('url')

    // Allowed domains for images (CDN)
    const imageAllowed = [
      'https://vvcz.store/',      // NHentaiClub
      'https://cdn.hv2t.com/',    // HV2T
    ]

    // Allowed domains for pages (HTML)
    const pageAllowed = [
      'nhentaiclub.site',
      'hv2t.store',
    ]

    const isImage = imageAllowed.some(prefix => target.startsWith(prefix))
    const isPage = pageAllowed.some(domain => target.includes(domain)) && !isImage

    if (!isImage && !isPage) {
      return new Response('Invalid URL', { status: 400 })
    }

    // Determine the referer based on the target URL
    let referer = 'https://nhentaiclub.site'
    if (target.includes('hv2t.store')) {
      referer = 'https://hv2t.store'
    }

    const response = await fetch(target, {
      headers: {
        'Referer': referer,
        'Origin': referer,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    if (isImage) {
      return new Response(response.body, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') ?? 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}
