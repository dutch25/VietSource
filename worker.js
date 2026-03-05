export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (!url.searchParams.has('url')) {
      return new Response('Not found', { status: 404 })
    }

    const target = url.searchParams.get('url')

    const imageAllowed = [
      'https://vvcz.store/',
    ]

    const isImage = imageAllowed.some(prefix => target.startsWith(prefix))
    const isPage = target.includes('nhentaiclub.site') && !isImage

    if (!isImage && !isPage) {
      return new Response('Invalid URL', { status: 400 })
    }

    const response = await fetch(target, {
      headers: {
        'Referer': 'https://nhentaiclub.site',
        'Origin': 'https://nhentaiclub.site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
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
