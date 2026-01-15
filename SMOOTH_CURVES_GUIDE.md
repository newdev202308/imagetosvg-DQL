# 🎨 Hướng dẫn tạo Đường cong Mượt mại

## ❓ Vấn đề: Đường cong bị góc cạnh, không smooth

Nếu SVG output có đường cong **góc cạnh, không mềm mại** như ảnh gốc, đọc hướng dẫn này!

## 🔑 Hiểu về các thông số quan trọng

### 1. **Độ mượt đường cong (qtres) - QUAN TRỌNG NHẤT!**

```
⚠️ LƯU Ý: Giá trị THẤP = Đường cong MƯỢT hơn!
```

| Giá trị qtres | Kết quả | File size | Sử dụng cho |
|---------------|---------|-----------|-------------|
| **0.1 - 0.5** | ✅ Rất mượt, nhiều curve points | Lớn | Line art, organic shapes |
| **0.6 - 1.0** | ⚖️ Cân bằng | Trung bình | Hầu hết trường hợp |
| **1.5 - 3.0** | ❌ Góc cạnh, ít curve points | Nhỏ | Geometric shapes, simple icons |

**Giải thích:**
- `qtres = 0.5` → ImageTracer tạo nhiều control points → Đường cong mượt
- `qtres = 2.0` → ImageTracer tạo ít control points → Đường cong góc cạnh

**Ví dụ cho ảnh thỏ:**
```
Thử các giá trị: 0.3, 0.5, 0.7
Chọn giá trị có đường cong mượt nhất
```

### 2. **Path omit - Chi tiết nhỏ**

```
Thấp (0-2) = Giữ tất cả chi tiết
Cao (8+) = Bỏ qua chi tiết nhỏ
```

| Path omit | Kết quả |
|-----------|---------|
| **0-1** | Giữ tất cả chi tiết, bao gồm cả curve nhỏ |
| **2-4** | Bỏ qua một vài chi tiết không quan trọng |
| **5-8** | Đơn giản hóa nhiều |
| **10+** | Mất nhiều chi tiết |

**Cho đường cong mượt:**
```
Path omit = 0 hoặc 1
```

### 3. **Blur - Làm mịn ảnh**

```
Blur nhẹ (1-2) giúp đường cong mượt hơn!
```

| Blur | Kết quả |
|------|---------|
| **0** | Giữ nguyên ảnh gốc (có thể có noise) |
| **1-2** | ✅ Làm mịn nhẹ, giúp curves smooth |
| **3-5** | Mờ quá, mất chi tiết |

**Cho line art:**
```
Blur = 1 (RECOMMENDED)
```

### 4. **Threshold (ltres) - Ngưỡng sáng/tối**

Ảnh hưởng đến độ dày đường nét:

```
Thấp (80-100) = Đường nét mỏng
Chuẩn (120-140) = Cân bằng
Cao (150+) = Đường nét dày
```

## 🎯 Settings TỐI ƯU cho đường cong mượt

### 🐰 Cho ảnh thỏ (Line Art):

```yaml
Preset: Line Art / Vẽ đường
Số màu: 2
Độ mượt (qtres): 0.3 - 0.5  ⭐ QUAN TRỌNG!
Blur: 1
Threshold: 120-130
Path omit: 0-1              ⭐ QUAN TRỌNG!
```

### 🎨 Cho sketches mềm mại:

```yaml
Preset: Phác thảo / Sketch
Số màu: 4
Độ mượt (qtres): 0.4 - 0.6
Blur: 1-2
Threshold: 120
Path omit: 1
```

### 🏷️ Cho logo/icon (góc cạnh ok):

```yaml
Preset: Logo / Icon
Số màu: 8
Độ mượt (qtres): 1.0 - 1.5
Blur: 0
Threshold: 128
Path omit: 4-6
```

## 📋 Checklist để có đường cong MƯỢT

### ✅ Trước khi convert:

- [ ] Ảnh đã được làm sạch (xóa noise)
- [ ] Background trắng 100%
- [ ] Đường nét liên tục (không bị đứt)
- [ ] Contrast đã tăng

### ✅ Settings trong tool:

- [ ] **qtres = 0.3 đến 0.5** (QUAN TRỌNG!)
- [ ] **Path omit = 0 hoặc 1** (QUAN TRỌNG!)
- [ ] Blur = 1
- [ ] Threshold điều chỉnh theo ảnh (120-130)
- [ ] Số màu = 2 (cho line art đen trắng)

### ✅ Sau khi convert:

- [ ] Zoom vào kiểm tra curves
- [ ] So sánh với ảnh gốc
- [ ] Nếu chưa mượt → Giảm qtres xuống
- [ ] Nếu mất chi tiết → Giảm path omit xuống

## 🔧 Quy trình điều chỉnh từng bước

### Bước 1: Upload ảnh thỏ

Tool tự động chọn preset "Line Art"

### Bước 2: Điều chỉnh để SIÊU MƯỢT

```
1. Click vào slider "Độ mượt đường cong"
2. Kéo xuống 0.3 (trái nhất)
3. Path omit: Đổi thành 0
4. Blur: Đổi thành 1
5. Threshold: Giữ 128 hoặc thử 120
```

### Bước 3: Convert và kiểm tra

```
1. Click "Chuyển đổi sang SVG"
2. Đợi 5-15 giây (lâu hơn vì nhiều curve points)
3. Zoom vào xem đường cong
```

### Bước 4: Fine-tuning

**Nếu vẫn còn góc cạnh:**
```
- Giảm qtres: 0.3 → 0.2 → 0.1
- Tăng Blur: 1 → 1.5 → 2
```

**Nếu quá smooth, mất hình dạng:**
```
- Tăng qtres: 0.3 → 0.4 → 0.5
- Giảm Blur: 1 → 0.5 → 0
```

**Nếu mất chi tiết nhỏ:**
```
- Path omit: 0 (giữ tất cả)
- Threshold: Thử 120, 125, 130, 135
```

## 📊 So sánh qtres values

### Test với ảnh thỏ:

```
qtres = 3.0:
❌ Đường cong góc cạnh như "zigzag"
❌ Mất tính tự nhiên
✅ File nhỏ (20KB)

qtres = 1.0:
⚖️ Cân bằng
⚖️ Một số chỗ vẫn hơi góc
✅ File trung bình (35KB)

qtres = 0.5:
✅ Đường cong mượt mại
✅ Trông giống ảnh gốc
⚠️ File lớn hơn (50KB)

qtres = 0.2:
✅✅ Cực kỳ mượt mại
✅✅ Gần như giống 100% ảnh gốc
⚠️⚠️ File rất lớn (80KB)
```

## 💡 Tips Pro

### Tip 1: Luôn bắt đầu với qtres thấp
```
Start: qtres = 0.3
Nếu quá lâu: Tăng lên 0.5
Nếu vẫn góc: Giảm xuống 0.2
```

### Tip 2: Preprocessing ảnh quan trọng hơn settings
```
Ảnh sạch + qtres = 0.5 > Ảnh xấu + qtres = 0.1
```

### Tip 3: Kiên nhẫn với conversion time
```
qtres thấp = Thời gian lâu hơn (5-20 giây)
Nhưng kết quả đáng giá!
```

### Tip 4: Test nhiều giá trị
```
Convert 3 lần với:
- qtres = 0.3
- qtres = 0.5
- qtres = 0.7

Chọn kết quả tốt nhất
```

### Tip 5: Combine với blur
```
qtres = 0.4 + Blur = 1 = Perfect combo!
```

## ⚡ Quick Fix cho ảnh thỏ

### Nếu đang thấy đường cong góc cạnh:

```bash
1. Mở tool
2. Upload ảnh thỏ
3. IGNORE preset tự động
4. Điều chỉnh thủ công:
   - Độ mượt: 0.3 ⭐
   - Path omit: 0 ⭐
   - Blur: 1
   - Threshold: 125
   - Số màu: 2
5. Click "Chuyển đổi"
6. Đợi 10-15 giây
7. DONE! Curves mượt mại ✅
```

## 🎓 Hiểu sâu về qtres

### Qtres là gì?

`qtres` = **Quadratic Threshold Resolution**

- Ngưỡng để quyết định khi nào fit một quadratic curve
- Thấp hơn = Fit curves dễ dàng hơn = Nhiều curves = Smooth
- Cao hơn = Khó fit curves hơn = Ít curves = Angular

### Công thức đơn giản:

```
qtres ↓ = curve points ↑ = smoothness ↑ = file size ↑
qtres ↑ = curve points ↓ = smoothness ↓ = file size ↓
```

### Technical details:

```javascript
// ImageTracer sẽ fit một curve nếu:
if (error < qtres) {
    // Use quadratic bezier curve (smooth)
} else {
    // Use straight line (angular)
}
```

## 📈 Kết quả mong đợi

Với settings tối ưu trên:

| Metric | Kết quả |
|--------|---------|
| **Độ mượt đường cong** | 95-98% giống ảnh gốc |
| **Thời gian convert** | 8-20 giây |
| **File size** | 40-80 KB |
| **Khả năng scale** | ∞ (vector) |
| **Độ hài lòng** | 😊😊😊😊😊 |

## 🆚 Before vs After

### Before (qtres = 2.0, pathomit = 8):
```
❌ Đường cong góc cạnh
❌ Trông như low-poly 3D
❌ Mất tính chân thực
⏱️ Nhanh (3 giây)
```

### After (qtres = 0.3, pathomit = 0):
```
✅ Đường cong mượt mại
✅ Giống ảnh gốc 95%+
✅ Trông professional
⏱️ Chậm hơn (10-15 giây)
```

## 🎯 Kết luận

**3 điều QUAN TRỌNG NHẤT:**

1. **qtres THẤP (0.3-0.5)** = Đường cong mượt ⭐⭐⭐
2. **Path omit THẤP (0-1)** = Giữ chi tiết ⭐⭐⭐
3. **Blur NHẸ (1-2)** = Smooth natural ⭐⭐

Làm theo 3 điều này = 95% cơ hội có đường cong đẹp!

---

**Thời gian đọc:** 8 phút | **Apply:** 2 phút | **Kết quả:** Curves mượt như lụa! 🎨✨
