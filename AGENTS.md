# AGENTS.md

## Project Overview

This is a **Paperback** extension for the Vietnamese hentai manga website **vi-hentai.pro**. It allows users to browse, search, and read manga through the Paperback iOS app.

## Tech Stack

- **TypeScript** - Language used for the extension
- **@paperback/types** (v0.8.0-alpha.47) - Paperback SDK
- **@paperback/toolchain** (v0.8.0-alpha.47) - Build tools

## Project Structure

```
vi-hentai/
├── src/
│   └── ViHentai/
│       ├── ViHentai.ts        ← Main source implementation
│       ├── ViHentaiParser.ts  ← HTML parsing logic
│       └── includes/
│           └── icon.png      ← Extension icon
├── bundles/                   ← Built extension (auto-generated)
├── package.json               ← Dependencies and scripts
├── tsconfig.json              ← TypeScript config
├── README.md                  ← Setup instructions
└── .gitignore
```

## Key Commands

- `npm run bundle` - Build the extension
- `npm run serve` - Start local server for Paperback to connect
- `npm run dev` - Auto-rebuild on changes

## Main Source Implementation

The core logic is split between two files:

### 1. ViHentai.ts (`src/ViHentai/ViHentai.ts`)

#### SourceInfo (`ViHentaiInfo`)
- **Base URL**: `https://vi-hentai.pro`
- **Version**: 1.1.29
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

#### Request Manager
- 3 requests per second
- 30 second timeout
- Adds `referer` and `user-agent` headers automatically

#### Core Methods

1. **`getHomePageSections(sectionCallback)`** - Returns 3 sections:
   - Mới Cập Nhật (Latest) - `/`
   - Phổ Biến Nhất (Popular) - `/?sort=-views`
   - Truyện Mới (New) - `/?sort=-created_at`

2. **`getSearchResults(query, metadata)`** - Search with pagination
   - URL: `/danh-sach?page={page}&keyword={search}`
   - Also supports genre filtering via `/the-loai/{genre}?page={page}`

3. **`getSearchTags()`** - Returns static genre tags from `ViHentaiParser`

4. **`getMangaDetails(mangaId)`** - Manga info page: `/truyen/{mangaId}`
   - Uses `Parser.parseMangaDetails()`

5. **`getChapters(mangaId)`** - Gets chapter list from reader page
   - First fetches manga index to find first chapter link
   - Then fetches reader page and parses `#chapter-selector` options
   - Options are newest-first, reversed for display

6. **`getChapterDetails(mangaId, chapterId)`** - Returns page images
   - URL: `/truyen/{mangaId}/{chapterId}`
   - Extracts images from `img.lazy-image` elements
   - Falls back to extracting UUIDs (chapter_id, series_id) and constructing CDN URLs
   - Final fallback: hardcoded test pages (used when extraction fails)

7. **`getViewMoreItems(homepageSectionId, metadata)`** - Pagination for homepage sections

8. **`getMangaShareUrl(mangaId)`** - Returns share URL: `/truyen/{mangaId}`

#### Helper Methods

- **`buildRequest(url)`** - Creates basic GET request
- **`slugFromUrl(url)`** - Extracts last path segment from URL
- **`DOMHTML(url)`** - Fetches and parses HTML with CloudFlare error handling
- **`CloudFlareError(status)`** - Throws error on 403/503 status codes

### 2. ViHentaiParser.ts (`src/ViHentai/ViHentaiParser.ts`)

#### Parser Class

Helper methods for parsing HTML content:

1. **`convertTime(timeStr: string)`** - Converts Vietnamese relative time strings to Date
   - Supports: giây, phút, giờ, ngày, tuần, tháng, năm, dd/mm/yyyy

2. **`parseMangaDetails($, mangaId)`** - Parses manga info page
   - Extracts title from `h1.series-name`, `h1.manga-title`, `h1.title`, or first `h1`
   - Extracts cover from `.cover-frame` background-image style
   - Extracts author from `.text-gray-500:contains("Tác giả")` or `a[href*="/tac-gia/"]`
   - Extracts status from `.text-gray-500:contains("Tình trạng")`
   - Extracts description from `.line-clamp-6`, `.series-description`, or `.summary-content`
   - Extracts genres from `.bg-gray-500 a[href*="/the-loai/"]`

3. **`parseSearchResults($)`** - Parses manga listing pages
   - Looks for `.manga-vertical` elements
   - Extracts manga ID from `a[href*="/truyen/"]` link
   - Extracts title from `.text-ellipsis:last`
   - Extracts cover from `.cover` background-image style
   - Extracts latest chapter from `.latest-chapter a`

4. **`parseChapterDetails($)`** - Parses chapter page for images
   - Tries multiple selectors: `img.lazy-image`, `img[data-src]`, `div.image-container img`, `img[src*="shousetsu"]`
   - Filters out data URIs, emojis, avatars, default images
   - Only includes images from `shousetsu.dev` CDN

5. **`getStaticTags()`** - Returns predefined genre tags:
   - 40+ genres including: 3D Hentai, Action, Adult, Ahegao, Anal, Big Boobs, BDSM, Comedy, Doujinshi, Ecchi, Fantasy, Harem, Incest, Lolicon, Manhua, Manhwa, Milf, NTR, Oral, Romance, Yaoi, Yuri, and more

## Image CDN

Images are served from `img.shousetsu.dev`. The source includes Cloudflare bypass support via `getCloudflareBypassRequestAsync()`.

## Important Notes

- The site uses **Livewire** framework - content is loaded dynamically via AJAX
- Chapter images are NOT in the initial HTML (loaded after page render)
- The initial page only shows a loading spinner (`/storage/images/default/loading.gif`)
- `getChapterDetails` has multiple fallbacks:
  1. Direct HTML parsing (`img.lazy-image`) - fails (Livewire loads dynamically)
  2. UUID-based URL construction - needs `series_id` from manga page (currently fails to find it)
  3. Test pages fallback - works but shows same images for all chapters
- The extension requires cloudflare bypass (user must visit home page first)
- Image CDN: `img.shousetsu.dev` also requires Cloudflare bypass headers

## Known Issues

- **Images not showing**: The chapter page returns 403 on CDN images without proper Cloudflare cookies
- **series_id not found**: Current regex `series_id["\s:]+["']?([a-f0-9-]+)` doesn't match any pattern in the manga page
- Need to either: (1) find correct series_id pattern, or (2) call Livewire API directly

## Deployment

- Push to main branch triggers auto-deploy to GitHub Pages
- Users add via: `https://<username>.github.io/vi-hentai/`

## Release Checklist

**Important:** Only update the version for the source you're modifying. Do NOT update both sources at once.

### 1. Update Version Numbers

**If working on ViHentai:** Update `src/ViHentai/ViHentai.ts` - `version: 'x.x.x'`

**If working on NHentaiClub:** Update `src/NHentaiClub/NHentaiClub.ts` - `version: 'x.x.x'`

Optionally update `package.json` version to match (can use same version or keep separate).

### 2. Build and Push

```bash
npm run bundle
git add bundles/ src/ package.json
git commit -m "Version x.x.x - description"
git push
```

GitHub Actions will auto-deploy to GitHub Pages.

### 3. Quick Release Command

To bump patch version and push in one command:
```bash
npm version patch && npm run bundle && git add bundles/ package.json && git commit -m "Version x.x.x" && git push
```

## NHentaiClub Extension

- **Base URL**: https://nhentaiclub.space
- **Current Version**: 1.1.29

### URL Patterns
- Homepage: `https://nhentaiclub.space/`
- Comic: `https://nhentaiclub.space/g/{comicId}`
- Chapter: `https://nhentaiclub.space/read/{comicId}/{chapter}?lang=VI`
- Images: `https://i3.nhentaiclub.shop/{comicId}/VI/{chapter}/{page}.jpg`

### Notes
- Site uses Next.js with client-side rendering
- Images loaded via JavaScript after page load
- CDN images (`i3.nhentaiclub.shop`) are behind Cloudflare protection
- Uses Paperback's built-in cloudflare bypass
- Worker proxy at `https://nhentai-club-proxy.feedandafk2018.workers.dev` (currently unable to bypass CDN)
