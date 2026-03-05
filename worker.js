export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (!url.searchParams.has('url')) {
      return new Response('Not found', { status: 404 })
    }

    const target = url.searchParams.get('url')

    const imageAllowed = [
      'https://i1.nhentaiclub.shop/',
      'https://i2.nhentaiclub.shop/',
      'https://i3.nhentaiclub.shop/',
    ]

    const isImage = imageAllowed.some(prefix => target.startsWith(prefix))
    const isPage = target.includes('nhentaiclub.space') && !isImage

    if (!isImage && !isPage) {
      return new Response('Invalid URL', { status: 400 })
    }

    const response = await fetch(target, {
      headers: {
        'Referer': 'https://nhentaiclub.space',
        'Origin': 'https://nhentaiclub.space',
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
