# VietSource - Vietnamese Manga Extension for Paperback

<p align="center">
  <img src="https://paperback.moe/icons/logo-alt.svg" alt="Paperback Logo" width="90" height="90" />
</p>

<h3 align="center">Kho tiện ích mở rộng đọc truyện tranh tiếng Việt dành cho Paperback (iOS)</h3>

<p align="center">
  <a href="https://dutch25.github.io/VietSource/"><img src="https://img.shields.io/badge/Cài_đặt_vào-Paperback-2e84bf?style=for-the-badge&logo=apple" alt="Add to Paperback" /></a>
  <img src="https://img.shields.io/badge/Paperback-v0.8-blue?style=for-the-badge" alt="Paperback Version" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 🚀 Hướng Dẫn Thêm Repository

1. Mở ứng dụng **Paperback** trên thiết bị iOS của bạn.
2. Điều hướng tới **Settings (Cài đặt) → External Sources (Nguồn mở rộng)**.
3. Nhấn dấu `+` và nhập URL repository:
   ```text
   https://dutch25.github.io/VietSource/
   ```
4. Chọn và cài đặt các tiện ích nguồn truyện theo danh sách bên dưới!

Hoặc chạm trực tiếp vào nút **[Add to Paperback](paperback://addRepo?displayName=Dutch25&url=https%3A%2F%2Fdutch25.github.io%2FVietSource%2F)** trên iPhone/iPad.

---

## 📚 Danh Sách Nguồn Truyện (Available Sources)

### 🌟 Truyện Tranh Phổ Thông / Shounen / Manhwa / Tuổi Thơ

| Nguồn | Trang Web | Độ Tuổi | Trạng Thái | Mô Tả |
| :--- | :--- | :---: | :---: | :--- |
| **DragonBallWiki** | [dragonballwiki.net](https://dragonballwiki.net/doctruyen) | Mọi lứa tuổi | ✅ Hoạt động | Trọn bộ Dragon Ball, DB Super, DB Heroes, ngoại truyện full màu & đen trắng, phân chia chapter chuẩn xác. |
| **TruyenTranhPhapBi** | [truyentranhphapbi.blogspot.com](https://truyentranhphapbi.blogspot.com) | Mọi lứa tuổi | ✅ Hoạt động | Chuyên mục Dragon Ball bản màu chất lượng cao, truyện Pháp - Bỉ kinh điển. |
| **TruyenTuoiTho** | [truyentuoitho.com](https://truyentuoitho.com) | Mọi lứa tuổi | ✅ Hoạt động | Kho tàng truyện tranh gắn liền tuổi thơ (Doraemon, Ninja Loạn Thị, Conan, Thần Đồng Đất Việt,...), hỗ trợ Cloudflare proxy. |
| **TruyenQQ** | [truyenqqko.com](https://truyenqqko.com/) | Mọi lứa tuổi | ✅ Hoạt động | Cập nhật nhanh chóng, kho truyện phong phú đa thể loại, tìm kiếm nâng cao. |
| **TopTruyen** | [toptruyenzone10.com](https://www.toptruyenzone10.com/) | Mọi lứa tuổi | ✅ Hoạt động | Tổng hợp manhwa, manhua và manga xu hướng hàng đầu. |
| **GocTruyenTranh** | [goctruyentranhvui30.com](https://goctruyentranhvui30.com/) | Mọi lứa tuổi | ✅ Hoạt động | Đọc truyện bản quyền mượt mà, hỗ trợ tìm kiếm theo thể loại. |
| **LuotTruyen** | [luottruyen16.com](https://luottruyen16.com) | Tuổi Teen | ✅ Hoạt động | Manhwa, truyện màu lãng mạn, hành động hấp dẫn. |

---

### 🔥 Nguồn Truyện 18+ / Adult / Manhwa 18+

| Nguồn | Trang Web | Phân Loại | Trạng Thái | Mô Tả |
| :--- | :--- | :---: | :---: | :--- |
| **DamCoNuong** | [damconuong.pet](https://damconuong.pet/) | 🔞 Adult | ✅ Hoạt động | Đầy đủ truyện 18+, Manhwa 18+ Việt hoá, cập nhật liên tục, lọc theo ngày/tuần/tháng. |
| **TruyenVN** | [truyenvn.onl](https://truyenvn.onl/) | 🔞 Adult | ✅ Hoạt động | Kho truyện Manhwa, Manhua và 18+ phong phú. |
| **NHentaiClub** | [nhentaiclub.space](https://nhentaiclub.space/) | 🔞 Adult | ✅ Hoạt động | Manga/Doujinshi 18+, bảng xếp hạng theo ngày/tuần/tháng/mọi thời đại, lọc hơn 130+ thể loại. |
| **VinaHentai** | [vinahentai.vip](https://vinahentai.vip) | 🔞 Adult | ✅ Hoạt động | Truyện HOT, Hentai mới, bộ sưu tập riêng, cosplay và lọc chi tiết theo tác giả. |
| **MiMi** | [mimimoe.moe](https://mimimoe.moe) | 🔞 Adult | ✅ Hoạt động | Tổng hợp truyện dịch gắn thẻ 18+, chất lượng ảnh sắc nét. |

---

## 🛠️ Phát Triển & Đóng Góp (Development)

Yêu cầu môi trường: **Node.js** (>= 16.x) và **npm**.

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Biên Dịch Extension Bundle
```bash
npm run bundle
```

### 3. Chạy Local Server Thử Nghiệm
Khởi chạy local server để kết nối trực tiếp với ứng dụng Paperback trong cùng mạng LAN:
```bash
npm run serve
```

### 4. Tự Động Biên Dịch Khi Chỉnh Sửa
```bash
npm run dev
```

---

## 📄 License & Disclaimer

- Dự án được phát triển phi lợi nhuận phục vụ nhu cầu đọc truyện cá nhân trên ứng dụng Paperback.
- Tất cả nội dung và hình ảnh thuộc về các website nguồn gốc.
