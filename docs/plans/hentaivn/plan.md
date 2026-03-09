# Plan: Nguồn truyện HentaiVN & LxManga
Created: 2026-03-09
Status: 🟡 In Progress

## Overview
Xây dựng 2 nguồn truyện Việt Nam chất lượng cao cho ứng dụng Paperback:
1. **HentaiVN (hentaivn.college)**: Kho truyện 18+ lớn nhất VN, cập nhật siêu tốc.
2. **LxManga**: Kho truyện Manhwa/Manga 18+ bản dịch chất lượng, UI mượt mà.

Cả hai sẽ được xây dựng dựa trên PaperBack Toolchain v0.8.0.

## Nền tảng (Tech Stack)
- Frontend/Parser: `TypeScript`
- Core: `@paperback/toolchain` & `@paperback/types`
- Target App: `Paperback 0.8`

---

## Chi tiết từng Nguồn

### 1. HentaiVN (hentaivn.college)

**Thông tin SourceInfo:**
- Version: 1.0.0
- Author: Dutch25
- Content Rating: ADULT (18+)
- Tags: "Adult" (RED), "18+" (YELLOW)
- Intents: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

**URL Patterns:**
- Homepage: `https://hentaivn.college`
- Manga: `https://hentaivn.college/{manga_id}`
- Chapter: `https://hentaivn.college/{manga_id}/{chapter_id}`
- Search: `https://hentaivn.college/tim-kiem?keyword={search}&page={page}`
- Genre: `https://hentaivn.college/the-loai/{genre}?page={page}`

**Homepage Sections (dự kiến):**
1. **Mới Cập Nhật** - Trang chủ
2. **Truyện Full** - Lọc truyện hoàn thành
3. **Top View** - Xếp hạng theo lượt xem

**Các hàm cần implement:**
- [ ] `getHomePageSections()` - Parse danh sách truyện từ homepage
- [ ] `getSearchResults()` - Tìm kiếm truyện
- [ ] `getSearchTags()` - Danh sách thể loại
- [ ] `getMangaDetails()` - Chi tiết truyện (title, cover, author, status, description, genres)
- [ ] `getChapters()` - Danh sách chương
- [ ] `getChapterDetails()` - Hình ảnh chương
- [ ] `getViewMoreItems()` - Phân trang cho section

**Đặc điểm kỹ thuật:**
- Sử dụng Cheerio để parse HTML
- Có thể cần Cloudflare bypass
- Hình ảnh có thể sử dụng proxy nếu cần

---

### 2. LxManga

**Website**: https://lxmanga.space

**Thông tin SourceInfo:**
- Version: 1.0.0
- Author: Dutch25
- Content Rating: ADULT (18+)
- Tags: "Adult" (RED), "18+" (YELLOW)
- Intents: MANGA_CHAPTERS | HOMEPAGE_SECTIONS | CLOUDFLARE_BYPASS_REQUIRED

**URL Patterns:**
- Homepage: `https://lxmanga.space`
- Manga: `https://lxmanga.space/{manga_id}`
- Chapter: `https://lxmanga.space/{manga_id}/{chapter_id}`
- Search: `https://lxmanga.space/search?q={search}`

**Homepage Sections (dự kiến):**
1. **Mới Cập Nhật** - Trang chủ
2. **Manhwa Mới** - Truyện Hàn mới
3. **Top Tháng** - Xếp hạng tháng

**Các hàm cần implement:**
- [ ] `getHomePageSections()` - Parse danh sách truyện từ homepage
- [ ] `getSearchResults()` - Tìm kiếm truyện
- [ ] `getSearchTags()` - Danh sách thể loại
- [ ] `getMangaDetails()` - Chi tiết truyện
- [ ] `getChapters()` - Danh sách chương
- [ ] `getChapterDetails()` - Hình ảnh chương
- [ ] `getViewMoreItems()` - Phân trang cho section

**Đặc điểm kỹ thuật:**
- Sử dụng Cheerio để parse HTML
- Có thể sử dụng API endpoints nếu có
- Hình ảnh có thể cần qua proxy

---

## Các Giai Đoạn (Phases)

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Cấu trúc Project & Source File | ⬜ Pending | 0% |
| 02 | HentaiVN: Khảo sát & Parse HTML | ⬜ Pending | 0% |
| 03 | HentaiVN: Hoàn thiện logic & Test | ⬜ Pending | 0% |
| 04 | LxManga: Khảo sát & Parse API/HTML | ⬜ Pending | 0% |
| 05 | LxManga: Hoàn thiện logic & Test | ⬜ Pending | 0% |
| 06 | Bundle & Tích hợp vào danh sách | ⬜ Pending | 0% |

---

## Phase chi tiết

### Phase 01: Cấu trúc Project & Source File
- [ ] Tạo thư mục `src/HentaiVN/`
- [ ] Tạo thư mục `src/LxManga/`
- [ ] Tạo file `HentaiVN.ts` với SourceInfo cơ bản
- [ ] Tạo file `HentaiVNParser.ts` với các hàm parse trống
- [ ] Tạo file `LxManga.ts` với SourceInfo cơ bản
- [ ] Tạo file `LxMangaParser.ts` với các hàm parse trống
- [ ] Tạo icon.png cho cả hai nguồn
- [ ] Cập nhật cấu trúc thư mục trong README

### Phase 02: HentaiVN - Khảo sát & Parse HTML
- [ ] Khảo sát website hentaivn.college
- [ ] Xác định selectors cho homepage sections
- [ ] Xác định selectors cho manga details
- [ ] Xác định selectors cho chapter list
- [ ] Xác định cách lấy hình ảnh chapter
- [ ] Implement `parseSearchResults()` trong Parser
- [ ] Implement `parseMangaDetails()` trong Parser
- [ ] Implement `parseChapterList()` trong Parser

### Phase 03: HentaiVN - Hoàn thiện logic & Test
- [ ] Hoàn thiện `getHomePageSections()`
- [ ] Hoàn thiện `getSearchResults()` 
- [ ] Hoàn thiện `getSearchTags()`
- [ ] Hoàn thiện `getMangaDetails()`
- [ ] Hoàn thiện `getChapters()`
- [ ] Hoàn thiện `getChapterDetails()`
- [ ] Hoàn thiện `getViewMoreItems()`
- [ ] Test thử với một số truyện
- [ ] Cập nhật version: 1.0.0

### Phase 04: LxManga - Khảo sát & Parse
- [ ] Khảo sát website LxManga
- [ ] Xác định domain chính xác
- [ ] Xác định selectors cho homepage sections
- [ ] Xác định selectors cho manga details
- [ ] Xác định selectors cho chapter list
- [ ] Xác định cách lấy hình ảnh chapter
- [ ] Implement các hàm parse trong Parser

### Phase 05: LxManga - Hoàn thiện logic & Test
- [ ] Hoàn thiện tất cả các hàm
- [ ] Test thử với một số truyện
- [ ] Cập nhật version: 1.0.0

### Phase 06: Bundle & Release
- [ ] Chạy `npm run bundle`
- [ ] Kiểm tra file bundle đầu ra
- [ ] Commit changes
- [ ] Push lên repository
