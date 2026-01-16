# ⚠️ Fix: Mất chi tiết nhỏ (đám mây, hoa văn, etc.)

## Vấn đề

**Triệu chứng:**
- Ảnh input có đám mây, hoa văn, chi tiết nhỏ
- Output SVG bị **mất những chi tiết này**
- Chỉ còn phần chính (thỏ, cà rốt) mà không có background

**Ví dụ:**
- ❌ Đám mây trong ảnh thỏ bị mất
- ❌ Hoa văn nhỏ bị loại bỏ
- ❌ Cỏ, lá nhỏ không xuất hiện

---

## Nguyên nhân

### 1. Path Omit (Detail Level) quá cao
```javascript
pathomit: 2  // ❌ Loại bỏ paths nhỏ < 2px
```

**Giải thích:**
- `pathomit` = ngưỡng để loại bỏ paths nhỏ
- Nếu path có kích thước < `pathomit` → Bị xóa
- Đám mây thường là paths nhỏ → Bị loại bỏ

### 2. Threshold không phù hợp
```javascript
ltres: 128  // Ngưỡng sáng/tối
```

**Giải thích:**
- Đám mây thường nhạt màu (gray)
- Nếu threshold = 128, chỉ giữ black/white
- Đám mây (gray) → Bị coi là background → Mất

### 3. Thuật toán ImageTracer
- ImageTracer tối ưu cho **line art** (đường nét)
- Không tốt cho **filled regions** (vùng màu)
- Dễ bỏ qua chi tiết nhỏ, mờ

---

## ✅ Giải pháp

### Solution 1: Giảm Path Omit (KHUYẾN NGHỊ)

**Trong preset Line Art:**
```javascript
pathomit: 0  // Giữ TẤT CẢ paths, kể cả nhỏ nhất
```

**Cách làm manual:**
1. Upload ảnh
2. Chọn preset "Custom"
3. Kéo slider **Path Omit (Detail Level)** xuống **0-1**
4. Convert lại

**Lưu ý:**
- pathomit = 0: Giữ mọi chi tiết → File SVG lớn hơn
- pathomit = 10: Loại bỏ nhiều → File SVG nhỏ nhưng mất chi tiết

---

### Solution 2: Dùng Potrace (Server) thay vì ImageTracer

**Tại sao Potrace tốt hơn:**
- ✅ Giữ chi tiết tốt hơn
- ✅ Xử lý vùng màu tốt hơn
- ✅ Không bỏ qua đám mây, background

**Cách dùng:**
1. Start server:
```bash
cd server
npm install
npm start
```

2. Trong UI:
   - Algorithm: **Potrace (Server)**
   - Preset: Line Art
   - Convert

---

### Solution 3: Điều chỉnh Threshold

**Nếu đám mây vẫn mất sau Solution 1:**

1. Chọn preset "Custom"
2. Điều chỉnh **Threshold (ltres)**:
   - Mặc định: 128
   - Giảm xuống: **100-110** (giữ màu xám nhạt hơn)
3. Convert lại

**Nguyên lý:**
```
Threshold = 128:
- Pixel < 128 (tối) → Black
- Pixel >= 128 (sáng) → White
- Đám mây (gray ~150) → White (background) → Mất

Threshold = 100:
- Pixel < 100 (tối) → Black
- Pixel >= 100 (sáng) → White
- Đám mây (gray ~150) → White (vẫn mất)

⚠️ Threshold không phải giải pháp chính!
```

---

### Solution 4: Tiền xử lý ảnh (BEST cho ảnh phức tạp)

**Trong Photoshop/GIMP:**

1. **Tăng độ tương phản đám mây:**
   - Select vùng đám mây (Magic Wand)
   - Brightness/Contrast: Giảm Brightness -20
   - Đám mây sẽ tối hơn → Dễ detect

2. **Tăng stroke cho đám mây:**
   - Filter → Find Edges
   - Stroke → Outline đám mây
   - Đám mây giờ có viền đen rõ ràng

3. **Separate layers:**
   - Layer 1: Thỏ + Cà rốt (main objects)
   - Layer 2: Đám mây + Background
   - Convert riêng từng layer
   - Merge SVG sau

---

### Solution 5: Post-process SVG

**Sau khi download SVG:**

1. **Mở trong Illustrator/Inkscape**
2. **Import ảnh gốc** làm reference (Opacity 50%)
3. **Vẽ lại đám mây** bằng Pen Tool:
   - Trace theo đám mây trong ảnh gốc
   - Tạo closed paths
4. **Export SVG** hoàn chỉnh

---

## 🎯 Quy trình khuyến nghị

**Cho ảnh có đám mây/chi tiết nhỏ:**

### Step 1: Preset tối ưu
```
Algorithm: Potrace (Server) ⭐
Preset: Line Art
Path Omit: 0 (Manual adjust)
Threshold: 128
Output Mode: Coloring Book
Fill Gaps: ✅ Enabled
```

### Step 2: Convert
1. Upload ảnh
2. Apply settings trên
3. Convert
4. Check preview

### Step 3: Verify
**Nếu đám mây vẫn mất:**
- ❌ ImageTracer: Chuyển sang Potrace
- ❌ Path Omit > 0: Giảm xuống 0
- ❌ Threshold: Thử 110-120

### Step 4: Last resort
- Tiền xử lý ảnh (tăng contrast đám mây)
- Hoặc vẽ lại đám mây trong Illustrator

---

## 📊 So sánh Path Omit

| Path Omit | Chi tiết | File size | Khi nào dùng |
|-----------|----------|-----------|--------------|
| 0 | ✅✅✅ Tất cả | Lớn | Ảnh có đám mây, chi tiết nhỏ |
| 1-2 | ✅✅ Nhiều | Trung bình | Line art đơn giản |
| 5-10 | ✅ Ít | Nhỏ | Chỉ giữ main objects |
| 20+ | ⚠️ Rất ít | Rất nhỏ | Chỉ outline chính |

---

## 🧪 Test Case: Ảnh thỏ với đám mây

### Input
- Thỏ holding cà rốt
- 3-4 đám mây ở background
- Cỏ, lá ở dưới

### Expected Output
- ✅ Thỏ: 1 vùng khép kín
- ✅ Cà rốt trái: 1 vùng
- ✅ Cà rốt phải: 1 vùng
- ✅ Mỗi đám mây: 1 vùng riêng (3-4 vùng)
- ✅ Đất/cỏ: 1 vùng khép kín

### Settings
```
Algorithm: Potrace (Server)
Preset: Custom
Path Omit: 0
Threshold: 128
Number of Colors: 2
Blur: 0
Output Mode: Coloring Book
Stroke Width: 2px
Fill Gaps: ✅
```

### Commands
```bash
# Start server
cd server
npm start

# Convert
1. Upload rabbit.png
2. Apply settings
3. Convert
4. Verify clouds in preview
5. Download SVG
```

---

## 💡 Pro Tips

### Tip 1: Check preview trước khi download
- Zoom vào vùng đám mây
- Xem có hiện không
- Nếu không → Adjust pathomit

### Tip 2: Use Custom preset
- Đừng dùng preset Line Art mù quáng
- Custom và adjust pathomit = 0
- Test vài lần với settings khác nhau

### Tip 3: Separate conversion
- Convert main objects (pathomit = 5)
- Convert background details (pathomit = 0) riêng
- Merge 2 SVG sau trong Illustrator

### Tip 4: Contrast là key
- Ảnh input có contrast cao → Kết quả tốt
- Đám mây nhạt → Tăng contrast trước khi convert

---

## ⚠️ Known Limitations

**ImageTracer (Client):**
- ❌ Dễ bỏ qua chi tiết nhỏ
- ❌ Không tốt cho vùng màu mờ
- ✅ Nhưng: Fast, offline

**Potrace (Server):**
- ✅ Giữ chi tiết tốt hơn
- ✅ Xử lý vùng màu tốt
- ❌ Nhưng: Cần server, chậm hơn

**Recommendation:**
- Dùng **Potrace** cho ảnh quan trọng
- Dùng **ImageTracer** cho test/draft nhanh

---

## 📞 Troubleshooting

**Q: Đã set pathomit = 0 nhưng vẫn mất đám mây?**
A:
1. Chuyển sang Potrace (Server)
2. Hoặc: Tiền xử lý ảnh (tăng contrast đám mây)
3. Hoặc: Vẽ lại đám mây trong Illustrator

**Q: File SVG quá lớn khi pathomit = 0?**
A:
1. Accept it (quality > size)
2. Hoặc: Simplify sau trong Illustrator
3. Hoặc: Compress SVG với SVGO

**Q: Đám mây có trong SVG nhưng không khép kín?**
A:
- ✅ Bật "Fill gaps in paths"
- Đám mây sẽ được auto-close

---

## 🎓 Summary

**Vấn đề:** Mất đám mây và chi tiết nhỏ

**Nguyên nhân chính:** `pathomit` quá cao

**Giải pháp nhanh:**
```javascript
// Trong app.js, Line Art preset:
pathomit: 0  // Thay vì 2
```

**Giải pháp tốt nhất:**
1. Dùng Potrace (Server)
2. Set pathomit = 0
3. Bật Fill Gaps
4. Convert

**File đã fix:** Commit mới đã set `pathomit: 0` trong Line Art preset.

---

**Need help?** Xem [COLORING_TIPS.md](COLORING_TIPS.md)
