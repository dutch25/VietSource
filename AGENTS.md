# AGENTS.md

## Project Overview

This is a **Paperback** iOS extension supporting **Vietnamese manga sources**:
- **dragonballwiki.net/doctruyen** - `DragonBallWiki`
- **truyentranhphapbi.blogspot.com** - `TruyenTranhPhapBi`
- **truyentuoitho.com** - `TruyenTuoiTho`
- **truyenqqko.com** - `TruyenQQ`
- **www.toptruyenzone10.com** - `TopTruyen`
- **goctruyentranhvui30.com** - `GocTruyenTranh`
- **luottruyen16.com** - `LuotTruyen`
- **damconuong.pet** - `DamCoNuong`
- **truyenvn.onl** - `TruyenVN`
- **nhentaiclub.space** - `NHentaiClub`
- **vinahentai.vip** - `VinaHentai`
- **mimimoe.moe** - `MiMi`

Users can browse, search, and read manga from these sites through the Paperback app.

## Tech Stack

- **TypeScript** - Language used for the extension
- **@paperback/types** (v0.8.0-alpha.47) - Paperback SDK
- **@paperback/toolchain** (v0.8.0-alpha.47) - Build tools

## Project Structure

```
dutch-extension/
├── src/
│   ├── DragonBallWiki/
│   ├── TruyenTranhPhapBi/
│   ├── TruyenTuoiTho/
│   ├── TruyenQQ/
│   ├── TopTruyen/
│   ├── GocTruyenTranh/
│   ├── LuotTruyen/
│   ├── DamCoNuong/
│   ├── TruyenVN/
│   ├── NHentaiClub/
│   ├── VinaHentai/
│   └── MiMi/
├── bundles/                      ← Built extension (auto-generated)
├── package.json                  ← Dependencies and scripts
├── tsconfig.json                  ← TypeScript config
├── README.md                      ← Setup instructions
└── .gitignore
```

## Key Commands

- `npm run bundle` - Build the extension
- `npm run serve` - Start local server for Paperback to connect
- `npm run dev` - Auto-rebuild on changes

---

# Source: NHentaiClub

**Website**: https://nhentaiclub.space

### SourceInfo
- **Version**: 1.1.75
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://nhentaiclub.space/`
- Manga: `https://nhentaiclub.space/g/{mangaId}`
- Search: `https://nhentaiclub.space/search?keyword={search}&page={page}`
- Genre: `https://nhentaiclub.space/genre/{genreId}?page={page}`
- Ranking: `/ranking/{all-time|day|week|month}?page={page}`
- Images: `https://i{n}.nhentaiclub.shop/{mangaId}/VI/{chapterId}/{page}.jpg`

### Homepage Sections
1. **Mới Cập Nhật** (Latest) - `/`
2. **Xếp Hạng Tất Cả** (All-Time) - `/ranking/all-time`
3. **Xếp Hạng Ngày** (Day) - `/ranking/day`
4. **Xếp Hạng Tuần** (Week) - `/ranking/week`
5. **Xếp Hạng Tháng** (Month) - `/ranking/month`

### How It Works

1. **getHomePageSections** - Fetches each section URL and parses `a[href^="/g/"]` links
2. **getSearchResults** - Searches via `/search` or filters by genre
3. **getMangaDetails** - Parses `/g/{mangaId}` page: extracts title from `og:title`, cover from `og:image`, description from `og:description`
4. **getChapters** - Extracts chapter list from embedded Next.js JSON in HTML
   - Chapter data stored in script tag as: `\"data\":[{\"name\":\"1\",\"pictures\":25,...}]`
   - Parser unescapes quotes and extracts JSON array
5. **getChapterDetails** - Builds image URLs using:
   - CDN base from `og:image` meta tag (e.g., `https://i3.nhentaiclub.shop`)
   - Page count from chapter JSON (`pictures` field)
   - Format: `{cdnBase}/{mangaId}/VI/{chapterId}/{page}.jpg`
   - All image URLs go through worker proxy

### Proxy
- Worker proxy: `https://nhentai-club-proxy.feedandafk2018.workers.dev`
- Used for both cover images and chapter pages
- ⚠️ CDN images still return 403 (proxy can't bypass CDN Cloudflare)

### Search Tags
- 130+ genres defined in `NHentaiClubParser.getSearchTags()`

---

# Source: DamCoNuong

**Website**: https://damconuong.pet

### SourceInfo
- **Version**: 1.1.7
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://damconuong.pet/`
- Manga: `https://damconuong.pet/truyen/{mangaId}`
- Chapter: `https://damconuong.pet/truyen/{mangaId}/{chapterId}`
- Search: `https://damconuong.pet/tim-kiem?q={search}`

### How It Works

1. **getHomePageSections** - Scrapes the homepage sections using `.manga-vertical` containers.
2. **getSearchResults** - Searches via `/tim-kiem`.
3. **getMangaDetails** - Parses manga details from `/truyen/{mangaId}`.
4. **getChapters** - Extracts the chapter list from the individual truyen info page.
5. **getChapterDetails** - Scrapes high-quality image URLs from chapter reader pages using relaxed image filters.

---

# Source: TruyenVN

**Website**: https://truyenvn.onl

### SourceInfo
- **Version**: 1.1.2
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://truyenvn.onl/`
- Manga: `https://truyenvn.onl/truyen-tranh/{mangaId}`
- Chapter: `https://truyenvn.onl/truyen-tranh/{mangaId}/{chapterId}`
- Search: `https://truyenvn.onl/?s={search}`

---

# Source: TruyenQQ

**Website**: https://truuyenqqko.com

### SourceInfo
- **Version**: 1.1.6
- **Author**: AlanNois
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://truyenqqko.com/`
- Manga: `https://truyenqqko.com/truyen-tranh/{mangaId}`
- Chapter: `https://truyenqqko.com/truyen-tranh/{mangaId}/{chapterId}`
- Search: `https://truyenqqko.com/tim-kiem/trang-1?q={search}`

---

# Source: TopTruyen

**Website**: https://www.toptruyenzone2.com

### SourceInfo
- **Version**: 1.1.6
- **Author**: AlanNois
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://www.toptruyenzone2.com/`
- Manga: `https://www.toptruyenzone2.com/truyen-tranh/{mangaId}`
- Chapter: `https://www.toptruyenzone2.com/truyen-tranh/{mangaId}/{chapterId}`

---

# Source: TruyenTuoiTho

**Website**: https://truyentuoitho.com

### SourceInfo
- **Version**: 1.1.6
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://truyentuoitho.com`
- Manga: `https://truyentuoitho.com/manga/{mangaId}/`
- Chapter: `https://truyentuoitho.com/manga/{mangaId}/{chapterId}/`
- Search: `https://truyentuoitho.com/?s={search}&post_type=wp-manga`

---

# Release Checklist

**IMPORTANT: You MUST update the version in the .ts file every time you make changes!**

### 1. Update Version Numbers (REQUIRED)

**If working on ViHentai:** Update `src/ViHentai/ViHentai.ts` - `version: 'x.x.x'`

**If working on NHentaiClub:** Update `src/NHentaiClub/NHentaiClub.ts` - `version: 'x.x.x'`

**If working on GocTruyenTranh:** Update `src/GocTruyenTranh/GocTruyenTranh.ts` - `version: 'x.x.x'`

**If working on TruyenQQ:** Update `src/TruyenQQ/TruyenQQ.ts` - `version: 'x.x.x'`

**If working on TopTruyen:** Update `src/TopTruyen/TopTruyen.ts` - `version: 'x.x.x'`

**If working on TruyenTuoiTho:** Update `src/TruyenTuoiTho/TruyenTuoiTho.ts` - `version: 'x.x.x'`

DO NOT update package.json unless specifically asked.

### 2. Build and Push

```bash
npm run bundle
git add bundles/ src/ package.json
git commit -m "Version x.x.x - description"
git push
```

GitHub Actions auto-deploys to GitHub Pages.

### 3. Quick Release Command

```bash
npm version patch && npm run bundle && git add bundles/ package.json && git commit -m "Version x.x.x" && git push
```

---

# Deployment

- Push to main branch triggers auto-deploy to GitHub Pages
