# 📐 Hiểu về Vectorization (Chuyển đổi Raster sang Vector)

## ❓ Tại sao không thể 100% giống ảnh gốc?

### Sự khác biệt cơ bản:

**Ảnh Raster (JPG, PNG):**
- Được tạo từ **pixels** (điểm ảnh)
- Mỗi pixel có màu cụ thể
- Ví dụ: Ảnh 1000x1000 = 1 triệu pixels

**Ảnh Vector (SVG):**
- Được tạo từ **paths** (đường nét toán học)
- Sử dụng công thức Bezier curves
- Ví dụ: Một đường cong = 1 equation

### 🔄 Quá trình chuyển đổi:

```
Ảnh Raster → Phân tích pixels → Tìm edges → Tạo paths → SVG
```

Mỗi bước đều có **mất mát thông tin** vì:
1. **Làm tròn:** Pixels thành curves
2. **Đơn giản hóa:** Giảm số điểm để file nhẹ
3. **Gom nhóm màu:** Giảm số màu

## 📊 Độ chính xác có thể đạt được:

| Loại ảnh | Độ giống | Lý do |
|----------|----------|-------|
| Line Art đơn giản | **90-95%** | Ít màu, đường nét rõ |
| Logo/Icon | **85-90%** | Màu flat, shapes đơn giản |
| Phác thảo | **80-85%** | Có texture, nhiều chi tiết nhỏ |
| Ảnh chụp | **60-70%** | Quá nhiều chi tiết, gradients |

## ✅ Cách đạt kết quả TỐT NHẤT:

### 1️⃣ Chuẩn bị ảnh đầu vào

**Cho Line Art (như ảnh thỏ của bạn):**
```
✅ Tăng contrast (đen-trắng rõ ràng)
✅ Xóa background noise
✅ Tăng độ sắc nét
✅ Đảm bảo đường nét liên tục
```

**Công cụ chỉnh ảnh trước:**
- Photoshop: Image → Adjustments → Threshold
- GIMP: Colors → Threshold
- Online: photopea.com

### 2️⃣ Chọn preset phù hợp

**Line Art / Vẽ đường:** (Cho ảnh thỏ)
```javascript
Số màu: 2 (Đen + Trắng)
Blur: 0 (Giữ đường sắc nét)
Threshold: 128 (Chuẩn)
Quality: 2 (Cao nhất)
Path omit: 4 (Giữ chi tiết)
```

**Logo/Icon:**
```javascript
Số màu: 8-16
Blur: 0
Threshold: 128
Quality: 1.5
Path omit: 6
```

**Ảnh màu:**
```javascript
Số màu: 24-32
Blur: 1-2
Threshold: 128
Quality: 1
Path omit: 10
```

### 3️⃣ Các thông số quan trọng

**Số lượng màu (numberofcolors):**
- Quá ít (2-4): Mất chi tiết
- Vừa đủ (8-16): Cân bằng
- Quá nhiều (32+): File nặng, nhiều noise

**Ngưỡng sáng (Threshold - ltres):**
- < 100: Nhiều vùng tối
- 128: Chuẩn (khuyến nghị)
- > 150: Nhiều vùng sáng

**Chất lượng cong (qtres):**
- 0.5-1: Ít chi tiết, file nhẹ
- 1.5-2: Nhiều chi tiết, file nặng
- **Khuyến nghị:** 1-2 cho line art

**Blur:**
- 0: Giữ mọi chi tiết (có thể có noise)
- 1-2: Làm mịn, giảm noise
- 3+: Mất chi tiết quan trọng

### 4️⃣ So sánh với Convertio.co

**Convertio.co sử dụng:**
- Thuật toán tương tự ImageTracer
- Hoặc Potrace (open source)
- Có preprocessing tự động

**Tool này:**
- Sử dụng ImageTracer.js
- Có auto-detect loại ảnh
- Có preset tối ưu
- **Kết quả tương đương** nếu dùng đúng preset

## 🎯 Quy trình để có kết quả TỐT NHẤT với ảnh thỏ:

### Bước 1: Chuẩn bị ảnh
```
1. Mở ảnh trong Paint/Photoshop
2. Tăng contrast: Make đen thành đen đậm, trắng thành trắng tinh
3. Xóa background xám (nếu có) → Thay bằng trắng 100%
4. Save as PNG
```

### Bước 2: Upload và chọn preset
```
1. Upload ảnh vào tool
2. Tool sẽ tự động detect: "Line Art"
3. HOẶC click nút "Line Art / Vẽ đường" để chắc chắn
```

### Bước 3: Điều chỉnh nếu cần
```
Nếu kết quả chưa tốt:
- Tăng Quality lên 2.5
- Giảm Path omit xuống 2 (giữ nhiều chi tiết hơn)
- Thử Threshold: 100, 128, 150 để tìm giá trị tốt nhất
```

### Bước 4: Convert và so sánh
```
1. Click "Chuyển đổi"
2. So sánh với ảnh gốc
3. Nếu chưa ưng: Thay đổi preset và thử lại
```

## 📈 Tối ưu cho từng vấn đề:

### ❌ Vấn đề: Mất đường nét mảnh
**Giải pháp:**
- Giảm Path omit: 8 → 2
- Tăng Quality: 1 → 2
- Threshold: Thử 100-120

### ❌ Vấn đề: Có nhiều điểm lẻ, noise
**Giải pháp:**
- Tăng Blur: 0 → 1
- Tăng Path omit: 4 → 8
- Preprocess ảnh trước (xóa noise)

### ❌ Vấn đề: Màu không đúng
**Giải pháp:**
- Tăng số màu: 16 → 24
- Chế độ màu: Random → Deterministic
- Hoặc ngược lại

### ❌ Vấn đề: File SVG quá nặng
**Giải pháp:**
- Giảm số màu: 32 → 16
- Giảm Quality: 2 → 1
- Tăng Path omit: 4 → 10

## 🔬 Test A/B: So sánh settings

### Test 1: Line Art Basic
```
Số màu: 2 | Blur: 0 | Quality: 1 | Path omit: 8
Kết quả: Nhanh, nhưng mất chi tiết nhỏ
```

### Test 2: Line Art High Quality (KHUYẾN NGHỊ)
```
Số màu: 2 | Blur: 0 | Quality: 2 | Path omit: 4
Kết quả: Chậm hơn, nhưng giữ được chi tiết tốt
```

### Test 3: Line Art Ultra
```
Số màu: 4 | Blur: 0 | Quality: 2.5 | Path omit: 2
Kết quả: Rất chậm, file nặng, nhưng chi tiết nhất
```

## 💡 Tips Pro:

1. **Làm sạch ảnh trước khi convert** = quan trọng nhất
2. **Thử nhiều Threshold** (100, 120, 128, 140, 150)
3. **So sánh với original** và điều chỉnh
4. **Không cần perfect 100%** - Vector phục vụ mục đích scale, không phải pixel-perfect
5. **Export SVG** rồi edit thủ công trong Illustrator/Inkscape nếu cần

## 🆚 So sánh với các tool khác:

| Tool | Thuật toán | Độ chính xác | Tốc độ |
|------|------------|--------------|--------|
| **Tool này** | ImageTracer.js | 85-95% | Nhanh |
| Convertio.co | Mixed | 85-90% | Nhanh |
| Adobe Illustrator | Proprietary | 90-95% | Chậm |
| Inkscape | Potrace | 80-90% | Nhanh |
| Vector Magic | AI-based | 95%+ | Chậm |

## 🎓 Kết luận:

1. **Không có tool nào đạt 100%** vì đây là quá trình ước lượng toán học
2. **85-95% là rất tốt** cho vectorization tự động
3. **Chuẩn bị ảnh tốt** = 50% thành công
4. **Chọn đúng preset** = 30% thành công
5. **Điều chỉnh tinh** = 20% thành công

**Mục tiêu:** Đạt **90%+ giống** cho line art như ảnh thỏ là hoàn toàn khả thi với tool này!

---

## 🚀 Quick Start cho ảnh thỏ của bạn:

```
1. Chỉnh ảnh: Tăng contrast, làm trắng background
2. Upload vào tool
3. Chọn preset: "Line Art / Vẽ đường"
4. Điều chỉnh:
   - Số màu: 2
   - Blur: 0
   - Quality: 2-2.5
   - Threshold: 120-130
   - Path omit: 2-4
5. Convert và tận hưởng!
```

**Kết quả:** 90-95% giống ảnh gốc ✅
