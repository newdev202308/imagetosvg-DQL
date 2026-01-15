# 🔧 Hướng dẫn khắc phục lỗi

## ❗ Vấn đề: "Đang chuyển đổi..." xoay mãi không ra kết quả

### Nguyên nhân:
Thư viện **ImageTracer.js** không load được từ CDN

### ✅ Giải pháp:

#### Bước 1: Kiểm tra thư viện
Mở file **[test.html](test.html)** bằng trình duyệt để kiểm tra:
- Nếu hiện "✅ Thư viện đã load thành công" → Tool hoạt động bình thường
- Nếu hiện "❌ Không thể load thư viện" → Làm theo bước 2

#### Bước 2: Kiểm tra Console
1. Mở tool trong trình duyệt
2. Nhấn **F12** để mở Developer Tools
3. Chọn tab **Console**
4. Tải ảnh và click "Chuyển đổi"
5. Xem các thông báo lỗi:
   - Nếu thấy `ImageTracer is not defined` → Thư viện không load
   - Nếu thấy `Conversion error` → Có lỗi trong quá trình chuyển đổi

#### Bước 3: Kiểm tra kết nối Internet
Tool cần internet **CHỈ LẦN ĐẦU** để tải thư viện ImageTracer.js:
- Đảm bảo có kết nối internet
- Thử tắt VPN nếu đang bật
- Kiểm tra firewall có chặn không

#### Bước 4: Kiểm tra AdBlock/uBlock
Extensions chặn quảng cáo có thể chặn CDN:
- Tắt AdBlock/uBlock tạm thời
- Hoặc whitelist domain: `cdn.jsdelivr.net`
- Refresh trang (F5)

#### Bước 5: Thử trình duyệt khác
- ✅ Chrome/Edge (Khuyến nghị)
- ✅ Firefox
- ✅ Safari

#### Bước 6: Clear Cache
```
Chrome/Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
```
Chọn xóa cache và refresh trang.

---

## ❗ Vấn đề: File SVG quá lớn

### Giải pháp:
1. **Giảm số lượng màu:** Từ 32 xuống 8-16
2. **Tăng "Path omit":** Từ 8 lên 16-20
3. **Tăng "Blur":** Làm mịn ảnh trước khi convert

---

## ❗ Vấn đề: SVG không giống ảnh gốc

### Giải pháp:
1. **Tăng số lượng màu:** Lên 32-64
2. **Giảm "Ngưỡng sáng":** Thử các giá trị từ 100-150
3. **Điều chỉnh "Chất lượng cong":** Từ 0.5-2.0
4. **Thử các chế độ màu khác nhau:**
   - Random (1): Tốt cho ảnh phức tạp
   - Deterministic (2): Tốt cho logo/icon

---

## ❗ Vấn đề: Không tải được file SVG

### Giải pháp:
1. Kiểm tra thư mục Downloads của trình duyệt
2. Kiểm tra antivirus có chặn không
3. Thử click "Xem code SVG" và copy thủ công:
   - Click "Xem code SVG"
   - Click "Copy code"
   - Mở Notepad
   - Paste (Ctrl+V)
   - Save As → Chọn "All Files" → Đặt tên `file.svg`

---

## ❗ Vấn đề: Ảnh quá lớn (> 10MB)

### Giải pháp:
1. Resize ảnh trước bằng:
   - Paint: Resize → 50%
   - Photoshop: Image Size
   - Online tool: https://imageresizer.com
2. Hoặc tăng giới hạn trong code (không khuyến nghị)

---

## 🆘 Vẫn không giải quyết được?

### Thông tin cần cung cấp khi báo lỗi:
1. **Trình duyệt:** Chrome/Firefox/Safari/Edge (version?)
2. **Hệ điều hành:** Windows/Mac/Linux
3. **Kích thước ảnh:** (width × height, file size)
4. **Console errors:** (F12 → Console → Screenshot)
5. **Các bước đã làm:** Liệt kê những giải pháp đã thử

### Cách chụp Console log:
1. Nhấn **F12**
2. Tab **Console**
3. Chụp ảnh màn hình
4. Gửi kèm khi báo lỗi

---

## 💡 Tips Tăng hiệu suất

### Cho ảnh lớn (> 2MB):
1. Resize xuống 1920×1080 trước
2. Giảm số màu xuống 16
3. Tăng blur lên 2-3
4. Đóng các tab khác trong trình duyệt

### Cho ảnh Line Art (vẽ đường):
```
Chế độ màu: Disabled (0)
Số màu: 2
Blur: 0
Ngưỡng sáng: 128
```

### Cho Logo/Icon:
```
Chế độ màu: Deterministic (2)
Số màu: 8-16
Blur: 0
Chất lượng: 1-2
```

### Cho ảnh màu phức tạp:
```
Chế độ màu: Random (1)
Số màu: 24-32
Blur: 1-2
Chất lượng: 1.5-2
```

---

## 🔍 Debug Mode

Để bật debug mode và xem chi tiết quá trình:
1. Mở **F12** (Developer Tools)
2. Tab **Console**
3. Tải ảnh và convert
4. Sẽ thấy log:
   - `Starting conversion with options: {...}`
   - `Conversion successful, SVG length: xxx`

---

## 📚 Tài liệu kỹ thuật

### CDN sử dụng:
- Primary: `https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js`
- Fallback 1: `https://unpkg.com/imagetracerjs@1.2.6/imagetracer_v1.2.6.js`
- Fallback 2: `https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.js`

### Kiểm tra CDN có hoạt động:
Mở link này trong trình duyệt:
https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js

Nếu hiện code JavaScript → CDN hoạt động ✅
Nếu hiện lỗi 404 → CDN bị lỗi ❌

---

**Cập nhật lần cuối: 2026-01-15**
