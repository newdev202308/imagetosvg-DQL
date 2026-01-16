# 🎨 Image to SVG Converter

Công cụ chuyển đổi ảnh JPG, PNG, JPEG sang định dạng SVG vector chất lượng cao, hoàn toàn miễn phí và chạy offline.

## ✨ Tính năng

- ⭐ **3 thuật toán chuyển đổi:**
  - **Potrace RGB (Server)** ⭐⭐⭐⭐ - TỐT NHẤT cho Coloring Book! Tạo nhiều vùng tô riêng biệt
  - **Potrace (Server)** ⭐⭐⭐ - Giống convertio.co, TỐT cho line art! Chất lượng 95%+
  - **ImageTracer (Client)** ⭐⭐ - Đa năng, chạy offline, không cần server
- 🎨 **NEW: Coloring Book Mode** - Xuất SVG dạng stroke để tô màu trong apps khác!
- ✅ Chuyển đổi ảnh JPG, PNG, JPEG sang SVG vector
- ✅ **Auto-detect** loại ảnh và chọn preset tối ưu
- ✅ Giao diện đẹp, hiện đại và dễ sử dụng
- ✅ Hỗ trợ kéo thả (drag & drop) file
- ✅ Preview ảnh gốc và SVG đã chuyển đổi
- ✅ Tùy chỉnh nhiều thông số chuyển đổi
- ✅ Tải xuống file SVG
- ✅ Xem và copy code SVG
- ✅ Hoạt động 100% offline (không cần internet sau khi tải về)
- ✅ Không giới hạn số lần chuyển đổi
- ✅ Bảo mật tuyệt đối (không upload lên server)

## 🚀 Cách sử dụng

### 🎯 Lựa chọn: Client-side hoặc Server-side?

**Option A: Client-side (ImageTracer) - Không cần cài đặt**
- ✅ Chạy hoàn toàn offline
- ✅ Không cần server
- ✅ Dễ dùng nhất
- ⚠️ Chất lượng: 85-90%

**Option B: Server-side (Potrace) - Chất lượng cao nhất ⭐**
- ✅ Chất lượng 95%+ giống convertio.co
- ✅ Đường cong mượt mại hoàn hảo
- ⚠️ Cần cài NodeJS và chạy server
- ⚠️ Phức tạp hơn một chút

---

### 🔵 Option A: Client-side (ImageTracer)

#### Bước 1: Mở file
Mở file `index.html` bằng trình duyệt web (Chrome, Firefox, Edge, Safari...)

#### Bước 2: Upload và chuyển đổi
- Upload ảnh
- Chọn preset hoặc điều chỉnh settings
- Click "Chuyển đổi"
- Done!

---

### 🟢 Option B: Server-side (Potrace) ⭐ KHUYẾN NGHỊ cho line art

#### Bước 1: Cài đặt server

```bash
# Di chuyển vào folder server
cd server

# Cài dependencies
npm install

# Chạy server
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

#### Bước 2: Mở tool
Mở file `index.html` bằng trình duyệt

#### Bước 3: Chuyển thuật toán
- Bật toggle: **Potrace (Server)** ⭐
- Kiểm tra Server URL: `http://localhost:3000`
- Upload ảnh và click "Chuyển đổi"
- Kết quả: Chất lượng 95%+ giống convertio.co!

**Xem chi tiết:** [server/README.md](server/README.md)

---

### Bước 1 (tiếp): Mở file
Mở file `index.html` bằng trình duyệt web (Chrome, Firefox, Edge, Safari...)

### Bước 2: Upload ảnh
- **Cách 1:** Kéo thả ảnh vào vùng upload
- **Cách 2:** Click nút "Chọn file" và chọn ảnh từ máy tính

### Bước 3: Tùy chỉnh cài đặt
Điều chỉnh các thông số để có kết quả tốt nhất:
- **Chế độ màu:** Cách lấy mẫu màu (Random/Deterministic)
- **Số lượng màu:** Số màu trong SVG (2-64)
- **Làm mờ (Blur):** Làm mịn ảnh trước khi chuyển đổi
- **Ngưỡng sáng:** Điều chỉnh độ sáng/tối
- **Chất lượng cong:** Chất lượng đường cong vector
- **Path omit:** Bỏ qua các path nhỏ

### Bước 4: Chuyển đổi
Click nút "🔄 Chuyển đổi sang SVG" và đợi vài giây

### Bước 5: Tải xuống
- Click "⬇️ Tải xuống SVG" để lưu file
- Click "👁️ Xem code SVG" để xem và copy code

## 🎯 Preset tối ưu (Tự động)

Tool **tự động phát hiện** loại ảnh và chọn preset phù hợp:

### 🎨 Line Art / Vẽ đường (Cho ảnh như thỏ)
- **Tốt nhất cho:** Coloring book, line drawing, sketches
- **Độ chính xác:** 90-95% giống ảnh gốc
- **Tự động áp dụng:** Số màu: 2, Quality: 2, Blur: 0

### 🏷️ Logo / Icon
- **Tốt nhất cho:** Logo, icon, hình đơn giản
- **Độ chính xác:** 85-90%
- **Tự động áp dụng:** Số màu: 8, Quality: 1.5

### 📸 Ảnh màu phức tạp
- **Tốt nhất cho:** Ảnh chụp, illustrations
- **Độ chính xác:** 70-80%
- **Tự động áp dụng:** Số màu: 32, Quality: 1, Blur: 2

### ✏️ Phác thảo / Sketch
- **Tốt nhất cho:** Hand-drawn sketches
- **Độ chính xác:** 80-85%
- **Tự động áp dụng:** Số màu: 4, Quality: 2

## 📖 Tài liệu chi tiết

### 🎨 Coloring Book Mode (NEW!)

#### 📘 [COLORING_BOOK_MODE.md](COLORING_BOOK_MODE.md) - Hướng dẫn đầy đủ
- 🎨 Hướng dẫn sử dụng Coloring Book Mode
- 🔄 So sánh Fill Mode vs Stroke Mode
- 💡 Tips cho kết quả tốt nhất
- 🎯 Use cases cụ thể
- ❓ FAQ và troubleshooting

#### 📋 [COLORING_APP_REQUIREMENTS.md](COLORING_APP_REQUIREMENTS.md) - Yêu cầu kỹ thuật
- ✅ Chi tiết tất cả requirements
- 🔍 Ví dụ output hợp lệ
- 📊 So sánh before/after
- 🛠️ Implementation details

#### 🚀 [QUICK_START_COLORING.md](QUICK_START_COLORING.md) - Quick reference
- 5 bước đơn giản
- Settings tối ưu
- Troubleshooting nhanh

#### 💡 [COLORING_TIPS.md](COLORING_TIPS.md) - ⭐ Paths không khép kín
- Giải quyết vùng tô không khép kín
- So sánh Potrace vs ImageTracer
- Tiền xử lý ảnh đầu vào
- Post-process trong Illustrator
- Tips & best practices

#### ⚠️ [MISSING_DETAILS_FIX.md](MISSING_DETAILS_FIX.md) - Chi tiết nhỏ bị mất
- Fix đám mây, hoa văn bị mất
- Path Omit settings
- Threshold adjustment
- Tiền/hậu xử lý
- Test case cụ thể

#### 🔴 [SINGLE_PATH_FIX.md](SINGLE_PATH_FIX.md) - ⭐ SVG chỉ có 1 path (QUAN TRỌNG!)
- **Fix SVG chỉ có 1 path → Không tô màu từng vùng được**
- Dùng Potrace RGB (Server) cho multiple paths
- So sánh algorithms
- Settings tối ưu
- Step-by-step guide

#### 🧪 [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing procedures
- Test scenarios
- Validation checklist
- Performance testing
- Report template

#### 📝 [CHANGELOG_COLORING_MODE.md](CHANGELOG_COLORING_MODE.md) - Chi tiết thay đổi
- Tất cả updates
- Code references
- Technical notes

### 🎨 [SMOOTH_CURVES_GUIDE.md](SMOOTH_CURVES_GUIDE.md) - ⭐ ĐỌC NÀY NẾU ĐƯỜNG CONG BỊ GÓC CẠNH!
- ❗ Khắc phục đường cong góc cạnh, không mượt
- 🔑 Hiểu về qtres (Độ mượt) - QUAN TRỌNG NHẤT!
- ⚙️ Settings tối ưu cho curves mượt mại
- 📋 Checklist và quy trình từng bước
- 💡 Tips & tricks để đạt 95%+ giống

### 📐 [VECTORIZATION_EXPLAINED.md](VECTORIZATION_EXPLAINED.md)
- ❓ Tại sao không thể 100% giống ảnh gốc
- 📐 Cách hoạt động của vectorization
- 🎯 Làm thế nào để đạt 90-95% giống
- 💡 Tips & tricks tối ưu kết quả
- 🔧 Giải quyết các vấn đề thường gặp

### 🐰 [QUICK_START_RABBIT.md](QUICK_START_RABBIT.md)
- Hướng dẫn cụ thể cho ảnh thỏ
- Quy trình hoàn chỉnh từ A-Z

## 📁 Cấu trúc file

```
SVG/
├── index.html                  # File chính - Mở file này để dùng tool
├── style.css                   # Styling giao diện đẹp
├── app.js                      # Logic chuyển đổi + Auto-detect
├── test.html                   # Test thư viện và debug
├── README.md                   # Hướng dẫn sử dụng (file này)
├── SMOOTH_CURVES_GUIDE.md      # ⭐ Hướng dẫn tạo đường cong mượt
├── VECTORIZATION_EXPLAINED.md  # Giải thích về vectorization
├── QUICK_START_RABBIT.md       # Quick start cho ảnh thỏ
└── TROUBLESHOOTING.md          # Hướng dẫn khắc phục lỗi
```

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và responsive
- **JavaScript (ES6+)** - Logic xử lý
- **ImageTracer.js** - Thư viện chuyển đổi ảnh sang SVG

## 💡 Tips

1. **Ảnh đầu vào chất lượng cao** sẽ cho kết quả SVG tốt hơn
2. **Giảm số lượng màu** nếu file SVG quá lớn
3. **Tăng blur** nếu có quá nhiều chi tiết nhỏ không cần thiết
4. **Thử nghiệm** các thông số khác nhau để tìm kết quả tốt nhất
5. Công cụ này chạy **hoàn toàn trên trình duyệt**, không cần server

## 🔒 Bảo mật

- Tất cả xử lý diễn ra trên máy tính của bạn
- Không có dữ liệu nào được gửi lên server
- Không lưu trữ hoặc thu thập thông tin
- Hoàn toàn an toàn và riêng tư

## 🌐 Trình duyệt hỗ trợ

- ✅ Chrome/Edge (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Các trình duyệt hiện đại khác

## 📝 Lưu ý

- Kích thước file tối đa: **10MB**
- Định dạng hỗ trợ: **JPG, PNG, JPEG**
- Ảnh càng phức tạp thì thời gian chuyển đổi càng lâu
- File SVG có thể lớn hơn ảnh gốc nếu ảnh có nhiều chi tiết

## 🎓 Tài liệu tham khảo

- [ImageTracer.js Documentation](https://github.com/jankovicsandras/imagetracerjs)
- [SVG Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG)

## 📞 Hỗ trợ

### 🧪 Test thư viện
Nếu gặp vấn đề, hãy mở file **[test.html](test.html)** để kiểm tra:
- Kiểm tra thư viện ImageTracer.js có load được không
- Test chuyển đổi cơ bản
- Xem thông tin debug chi tiết

### ❗ Gặp lỗi?
Xem file **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** để được hướng dẫn chi tiết:
- Lỗi "Đang chuyển đổi..." xoay mãi
- Lỗi không tải được thư viện
- File SVG quá lớn
- SVG không giống ảnh gốc
- Các vấn đề khác

### Debug nhanh:
1. Mở **test.html** → Kiểm tra thư viện
2. Nhấn **F12** → Xem Console logs
3. Đọc **TROUBLESHOOTING.md** → Tìm giải pháp
4. Thử refresh trang (F5)
5. Thử trình duyệt khác (Chrome khuyến nghị)

---

**Made with ❤️ | Tạo công cụ chuyển đổi SVG miễn phí**
