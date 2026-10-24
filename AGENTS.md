# AGENTS.md

## Project Overview

This is a **Paperback** iOS extension supporting **Vietnamese manga sources**:
- **dragonballwiki.net/doctruyen** - `DragonBallWiki`
- **truyentranhphapbi.blogspot.com** - `TruyenTranhPhapBi`
- **truyentuoitho.com** - `TruyenTuoiTho`
- **truyenqqko.com** - `TruyenQQ`
- **www.toptruyenzone12.com** - `TopTruyen`
- **goctruyentranhvui30.com** - `GocTruyenTranh`
- **luottruyen16.com** - `LuotTruyen`
- **vinahentai.vip** - `VinaHentai`
- **mimimoe.moe** - `MiMi`
- **zettruyen4.com** - `ZetTruyen`
- **truyenggvn.com** - `TruyenGG`
- **tranh18.cc** - `Tranh18`
- **www.hentaivnx.com** - `HentaiVN`
- **multporn.net** - `Multporn`
- **ilikecomix.com** - `ILikeComix`
- **8muses.io** - `EightMuses`
- **allporncomic.com** - `AllPornComic`

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
│   ├── VinaHentai/
│   ├── MiMi/
│   ├── ZetTruyen/
│   ├── TruyenGG/
│   ├── Tranh18/
│   ├── HentaiVN/
│   ├── Multporn/
│   ├── ILikeComix/
│   ├── EightMuses/
│   └── AllPornComic/
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

**Website**: https://www.toptruyenzone13.com

### SourceInfo
- **Version**: 1.1.15
- **Author**: AlanNois
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI

### URL Patterns
- Homepage: `https://www.toptruyenzone13.com/`
- Manga: `https://www.toptruyenzone13.com/truyen-tranh/{mangaId}`
- Chapter: `https://www.toptruyenzone13.com/truyen-tranh/{mangaId}/{chapterId}`
- Search: `https://www.toptruyenzone13.com/tim-truyen?keyword={search}&genres={genres}&page={page}`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> TopTruyen -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: ZetTruyen

**Website**: https://www.zettruyen4.com

### SourceInfo
- **Version**: 1.0.2
- **Author**: Dutch25
- **Content Rating**: EVERYONE
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://www.zettruyen4.com/`
- Manga: `https://www.zettruyen4.com/truyen-tranh/{mangaId}`
- Chapters API: `https://www.zettruyen4.com/api/comics/{mangaId}/chapters`
- Reader: `https://www.zettruyen4.com/truyen-tranh/{mangaId}/chuong-{num}`
- Search: `https://www.zettruyen4.com/tim-kiem-nang-cao?q={search}&page={page}`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> ZetTruyen -> Cài đặt nguồn -> URL cơ sở**.

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

# Source: TruyenGG

**Website**: https://truyenggvn.com

### SourceInfo
- **Version**: 1.0.0
- **Author**: Dutch25
- **Content Rating**: EVERYONE
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://truyenggvn.com/`
- Manga: `https://truyenggvn.com/truyen-tranh/{mangaId}`
- Chapter: `https://truyenggvn.com/truyen-tranh/{chapterId}`
- Search Ajax: `POST https://truyenggvn.com/frontend/search/search` (body: `search={keyword}`)
- Genre / Tag: `https://truyenggvn.com/the-loai/{genreId}.html`

### Homepage Sections
1. **Truyện HOT**: `https://truyenggvn.com/truyen-yeu-thich.html`
2. **Mới Cập Nhật**: `https://truyenggvn.com/truyen-moi-cap-nhat.html`
3. **Top Manhwa**: `https://truyenggvn.com/the-loai/manhwa-49.html?sort=4`
4. **Top Manhua**: `https://truyenggvn.com/the-loai/manhua-35.html?sort=4`
5. **Top Manga**: `https://truyenggvn.com/the-loai/manga-469.html?sort=4`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> TruyenGG -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: Tranh18

**Website**: https://tranh18.cc

### SourceInfo
- **Version**: 1.0.3
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://tranh18.cc/`
- Manga: `https://tranh18.cc/comic/{mangaId}`
- Chapter: `https://tranh18.cc/{mangaId}/chapter/{chapterNum}`
- Search: `https://tranh18.cc/search?keyword={search}&page={page}`
- Tag / Genre: `https://tranh18.cc/tag/{tagSlug}?page={page}`

### Homepage Sections
1. **Mới Cập Nhật**: `https://tranh18.cc/update`
2. **Manhwa 18+**: `https://tranh18.cc/tag/manhwa`
3. **Truyện Hoàn Thành**: `https://tranh18.cc/completed`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> Tranh18 -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: HentaiVN

**Website**: https://www.hentaivnx.com

### SourceInfo
- **Version**: 1.0.3
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://www.hentaivnx.com/`
- Manga: `https://www.hentaivnx.com/truyen-hentai/{mangaId}`
- Chapter: `https://www.hentaivnx.com/truyen-hentai/{chapterId}`
- Search: `https://www.hentaivnx.com/tim-truyen?keyword={search}&page={page}`
- Tag / Genre: `https://www.hentaivnx.com/tim-truyen/{genreId}?page={page}`

### Homepage Sections
1. **Truyện Đề Cử**: `https://www.hentaivnx.com/`
2. **Mới Cập Nhật**: `https://www.hentaivnx.com/`
3. **Manhwa 18+**: `https://www.hentaivnx.com/tim-truyen/manhwa`
4. **Doujinshi**: `https://www.hentaivnx.com/tim-truyen/doujinshi`
5. **Truyện Màu**: `https://www.hentaivnx.com/tim-truyen/truyen-mau`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> HentaiVN -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: Multporn

**Website**: https://multporn.net

### SourceInfo
- **Version**: 1.0.2
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI

### URL Patterns
- Homepage: `https://multporn.net/`
- Comic / Node: `https://multporn.net/{mangaId}`
- Search: `https://multporn.net/search?search_api_views_fulltext={keyword}&page={page}`
- Category: `https://multporn.net/{categorySlug}?page={page}`

### Homepage Sections
1. **Mới Nhất (New Uploads)**: `https://multporn.net/new`
2. **Comics Cập Nhật**: `https://multporn.net/updated_comics`
3. **Hentai Manga**: `https://multporn.net/new?type=3&language=1`
4. **Manga Cập Nhật**: `https://multporn.net/updated_manga`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> Multporn -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: ILikeComix

**Website**: https://ilikecomix.com/manga

### SourceInfo
- **Version**: 1.0.0
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI

### URL Patterns
- Homepage: `https://ilikecomix.com/manga/`
- Comic: `https://ilikecomix.com/manga/c/{mangaId}/`
- Chapter: `https://ilikecomix.com/manga/c/{chapterId}/`
- Search: `https://ilikecomix.com/manga/?s={search}&post_type=wp-manga`
- Genre: `https://ilikecomix.com/manga/manga-genre/{genreId}/`

### Homepage Sections
1. **Mới Cập Nhật**: `https://ilikecomix.com/manga/?m_orderby=latest`
2. **Xem Nhiều (Trending)**: `https://ilikecomix.com/manga/?m_orderby=trending`
3. **Đánh Giá Cao**: `https://ilikecomix.com/manga/?m_orderby=rating`
4. **3D Comics**: `https://ilikecomix.com/manga/manga-genre/3d-comics/`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> ILikeComix -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: EightMuses

**Website**: https://8muses.io

### SourceInfo
- **Version**: 1.0.0
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI

### URL Patterns
- Homepage: `https://8muses.io/`
- Comic / Gallery: `https://8muses.io/g/{mangaId}`
- Search: `https://8muses.io/search?q={search}` & `https://8muses.io/search/page/{page}?q={search}`
- Browse: `https://8muses.io/browse` & `https://8muses.io/browse/page/{page}`
- New: `https://8muses.io/new` & `https://8muses.io/new/page/{page}`

### Homepage Sections
1. **Mới Nhất (New)**: `https://8muses.io/new`
2. **Tất Cả (Browse All)**: `https://8muses.io/browse`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> EightMuses -> Cài đặt nguồn -> URL cơ sở**.

---

# Source: AllPornComic

**Website**: https://allporncomic.com

### SourceInfo
- **Version**: 1.0.1
- **Author**: Dutch25
- **Content Rating**: ADULT (18+)
- **Tags**: "Adult" (RED), "18+" (YELLOW)
- **Intents**: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | SETTINGS_UI | CLOUDFLARE_BYPASS_REQUIRED

### URL Patterns
- Homepage: `https://allporncomic.com/`
- Comic / Manga: `https://allporncomic.com/porncomic/{mangaId}/`
- Chapter Reader: `https://allporncomic.com/porncomic/{mangaId}/{chapterId}/`
- Search: `https://allporncomic.com/?s={search}&post_type=wp-manga` & `https://allporncomic.com/page/{page}/?s={search}&post_type=wp-manga`
- Category / Genre: `https://allporncomic.com/porncomic-category/{catId}/` & `https://allporncomic.com/porncomic-category/{catId}/page/{page}/`

### Homepage Sections
1. **Mới Cập Nhật**: `https://allporncomic.com/porncomic/?m_orderby=latest`
2. **Xem Nhiều (Trending)**: `https://allporncomic.com/porncomic/?m_orderby=views`
3. **Đánh Giá Cao**: `https://allporncomic.com/porncomic/?m_orderby=rating`
4. **Private 1**: `https://allporncomic.com/?s&post_type=wp-manga&genre%5B0%5D=analc&genre%5B1%5D=uncensorede&op&author&artist&release&adult&m_orderby=rating`
5. **Private 2**: `https://allporncomic.com/?s&post_type=wp-manga&genre%5B0%5D=analc&genre%5B1%5D=uncensorede&op&author&artist&release&adult&m_orderby=trending`
6. **Private 3**: `https://allporncomic.com/?s&post_type=wp-manga&genre%5B0%5D=analc&genre%5B1%5D=uncensorede&op&author&artist&release&adult&m_orderby=views`
7. **3D Comics**: `https://allporncomic.com/porncomic-category/3dd/`
8. **Manhwa 18+**: `https://allporncomic.com/porncomic-category/manhwad/`
9. **Hentai Manga**: `https://allporncomic.com/porncomic-category/hentaib/`

### In-App Manual Domain Update
- Supports `SETTINGS_UI`: User can change base URL inside Paperback via **Settings -> Sources -> AllPornComic -> Cài đặt nguồn -> URL cơ sở**.

---

# Release Checklist

**IMPORTANT: You MUST update the version in the .ts file every time you make changes!**

### 1. Update Version Numbers (REQUIRED)

**If working on ViHentai:** Update `src/ViHentai/ViHentai.ts` - `version: 'x.x.x'`

**If working on GocTruyenTranh:** Update `src/GocTruyenTranh/GocTruyenTranh.ts` - `version: 'x.x.x'`

**If working on TruyenQQ:** Update `src/TruyenQQ/TruyenQQ.ts` - `version: 'x.x.x'`

**If working on TopTruyen:** Update `src/TopTruyen/TopTruyen.ts` - `version: 'x.x.x'`

**If working on ZetTruyen:** Update `src/ZetTruyen/ZetTruyen.ts` - `version: 'x.x.x'`

**If working on TruyenTuoiTho:** Update `src/TruyenTuoiTho/TruyenTuoiTho.ts` - `version: 'x.x.x'`

**If working on TruyenGG:** Update `src/TruyenGG/TruyenGG.ts` - `version: 'x.x.x'`

**If working on Tranh18:** Update `src/Tranh18/Tranh18.ts` - `version: 'x.x.x'`

**If working on HentaiVN:** Update `src/HentaiVN/HentaiVN.ts` - `version: 'x.x.x'`

**If working on Multporn:** Update `src/Multporn/Multporn.ts` - `version: 'x.x.x'`

**If working on ILikeComix:** Update `src/ILikeComix/ILikeComix.ts` - `version: 'x.x.x'`

**If working on EightMuses:** Update `src/EightMuses/EightMuses.ts` - `version: 'x.x.x'`

**If working on AllPornComic:** Update `src/AllPornComic/AllPornComic.ts` - `version: 'x.x.x'`

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
