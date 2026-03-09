export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (!url.searchParams.has('url')) {
      return new Response('Not found', { status: 404 })
    }

    let target = url.searchParams.get('url')
    if (!target) return new Response('Missing URL', { status: 400 })

    // Normalize target URL (handle // prefix)
    if (target.startsWith('//')) {
      target = `https:${target}`
    }

    // Allowed domains for images (CDN)
    const imageAllowed = [
      'https://vvcz.store/',      // NHentaiClub
      'https://cdn.hv2t.com/',    // HV2T
      'https://hv2t.store/',      // HV2T Cover/Images
    ]

    // Allowed domains for pages (HTML)
    const pageAllowed = [
      'nhentaiclub.site',
      'hv2t.store',
      'cdn.hv2t.com',
    ]

    const isImage = imageAllowed.some(prefix => target.startsWith(prefix))
    const isPage = pageAllowed.some(domain => target.includes(domain)) && !isImage

    if (!isImage && !isPage) {
      return new Response('Invalid URL', { status: 400 })
    }

    // Determine the referer based on the target URL
    let referer = 'https://nhentaiclub.site'
    if (target.includes('hv2t.store') || target.includes('cdn.hv2t.com')) {
      referer = 'https://hv2t.store'
    }

    // HARDCODED AUTH COOKIES (from browser session)
    // NOTE: These may expire eventually. Update them if access is lost.
    const AUTH_COOKIES = 'access_token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNjkxNCIsImFkbWluIjpmYWxzZSwiaWF0IjoxNzczMDU1MDE5LCJleHAiOjE3NzM2NTk4MTl9.8fxPlfp_wRQ_iBWp5nm0VIFvb92M3nnR6_X6H0WvL0Y; cf_clearance=RwXPQ_Fxw6VPzCo1KAPg60FCTYZ.L5FAMJQGm1IqFPQ-1773059004-1.2.1.1-k3YJEfif8DCORlcVYgOsSCE1iPksiKVbvrNaAGc5f5soBIsj5oZhfxfIXJ2Xb1U1cf5JlLWnnMPDng.BGh15CKx_IG0Y5DTcNhsw4PoqSc9FVMHCh9LTYDv3zj_CiwT0HXmUDwRXSgJ0QLaNYdpCY_hM0uy1d2jdmP9Mr7zMAfjj1mtJTaKMva26q7d.ACT7dREVAWOWCOJyRkiPU8TkmyZFUHBW7UUWriu0bYOqQ_Y'

    const fetchHeaders = {
      'Referer': referer,
      'Origin': referer,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }

    // Apply auth cookies for HV2T requests
    if (target.includes('hv2t.store') || target.includes('cdn.hv2t.com')) {
      fetchHeaders['Cookie'] = AUTH_COOKIES
    }

    // Use manual redirect handling to preserve headers (Referer & Cookies) across domains
    let response = await fetch(target, {
      headers: fetchHeaders,
      redirect: 'manual'
    })

    // Handle redirects (up to 3 hops)
    let hops = 0
    while ([301, 302, 303, 307, 308].includes(response.status) && hops < 3) {
      const location = response.headers.get('Location')
      if (!location) break

      const nextUrl = new URL(location, target).href

      response = await fetch(nextUrl, {
        headers: fetchHeaders,
        redirect: 'manual'
      })
      hops++
    }

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
