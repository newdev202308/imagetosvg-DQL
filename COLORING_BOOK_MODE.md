# 🎨 Coloring Book Mode - Hướng dẫn sử dụng

## Tính năng mới: Xuất SVG dạng khung để tô màu

### 📖 Giới thiệu

Tính năng **Coloring Book Mode** cho phép bạn xuất file SVG dưới dạng **đường viền (stroke)** thay vì **fill**, phù hợp để sử dụng trong các app tô màu như:
- Procreate
- Adobe Fresco
- Affinity Designer
- Các app coloring book trên mobile/tablet

### 🔄 So sánh 2 chế độ

#### **Fill Mode** (Chế độ thường)
```xml
<path d="M10,10 L50,50..." fill="#000000"/>
```
- ✅ Phù hợp: Logo, icon, illustrations
- ❌ Không phù hợp: Coloring apps (không tô được)

#### **Coloring Book Mode** (Chế độ mới) ⭐
```xml
<path d="M10,10 L50,50..."
      fill="#FFFFFF"
      fill-rule="evenodd"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"/>
```
- ✅ Phù hợp: Coloring books, line art, sketches
- ✅ Có thể tô màu trong apps khác (thay đổi fill)
- ✅ Đường viền rõ ràng, mượt mà
- ✅ Chỉ sử dụng `<path>` elements
- ✅ Mỗi path = 1 vùng tô màu

---

## 🚀 Cách sử dụng

### Bước 1: Upload ảnh
- Kéo thả hoặc chọn file ảnh (JPG, PNG, JPEG)
- **Khuyến nghị:** Ảnh line art, vẽ đường, hoặc ảnh có viền rõ ràng

### Bước 2: Chọn Output Mode
Trong phần **🎨 Output Mode**, chọn:
- **Fill Mode**: Chế độ SVG thường (filled paths)
- **Coloring Book Mode**: ⭐ Chế độ stroke để tô màu

### Bước 3: Điều chỉnh Stroke Width
Khi chọn Coloring Book Mode, bạn sẽ thấy thanh trượt **Stroke Width**:
- **1-2px**: Đường viền mỏng, tinh tế
- **2-3px**: Đường viền trung bình (khuyến nghị)
- **3-5px**: Đường viền dày, dễ nhìn

### Bước 4: Chọn Algorithm và Preset
Khuyến nghị cho Coloring Book:
- **Algorithm**: Potrace (Server) - Chất lượng cao nhất
- **Preset**: Line Art - Tối ưu cho line drawings

### Bước 5: Convert và Download
- Click **🔄 Convert to SVG**
- Xem preview
- Click **⬇️ Download SVG** để lưu file

---

## 💡 Tips cho kết quả tốt nhất

### 1. Chọn ảnh phù hợp
✅ **Tốt:**
- Line art, coloring pages
- Sketches, drawings
- Ảnh có viền rõ ràng
- Ảnh đơn giản, ít chi tiết nhỏ

❌ **Không tốt:**
- Ảnh phức tạp, nhiều chi tiết
- Ảnh gradient, shadow
- Ảnh mờ, chất lượng thấp

### 2. Settings tối ưu

**Cho Line Art (Coloring Book):**
```
Algorithm: Potrace (Server)
Preset: Line Art
Output Mode: Coloring Book Mode
Stroke Width: 2-3px
```

**Cho Sketches:**
```
Algorithm: Potrace (Server)
Preset: Sketch
Output Mode: Coloring Book Mode
Stroke Width: 1.5-2px
```

### 3. Xử lý sau khi convert

Sau khi download SVG:
1. Mở trong Illustrator/Inkscape để kiểm tra
2. Xóa các paths nhỏ không cần thiết (nếu có)
3. Gộp các paths gần nhau (optional)
4. Import vào coloring app yêu thích

---

## 🎯 Use Cases

### 1. Tạo Coloring Book từ ảnh
- Upload ảnh line art
- Chọn Coloring Book Mode
- Download SVG
- Import vào Procreate/Fresco để tô màu

### 2. Vector hóa sketches
- Upload sketch vẽ tay
- Chọn Preset: Sketch
- Stroke Width: 1.5px
- Download và dùng trong design projects

### 3. Tạo outline cho illustrations
- Upload illustration
- Chọn Coloring Book Mode
- Stroke Width: 2px
- Dùng làm template để vẽ lại

---

## 🛠️ Technical Details

### Thuật toán chuyển đổi

Khi bật Coloring Book Mode, app sẽ:
1. Convert ảnh sang SVG như bình thường
2. **Loại bỏ tất cả elements không phải `<path>`** (g, rect, circle, ellipse, polygon, polyline, line, mask, clipPath, defs, use)
3. Parse tất cả `<path>` elements
4. Chuyển đổi mỗi path thành vùng tô màu:
   - `fill="#FFFFFF"` (trắng - vùng tô mặc định)
   - `fill="#000000"` (giữ đen cho chi tiết như mắt)
   - `fill-rule="evenodd"` (bắt buộc)
   - `stroke="#000000"` (viền đen)
   - `stroke-width="[value]px"`
   - `stroke-linecap="round"`
   - `stroke-linejoin="round"`
5. Loại bỏ opacity, transform không cần thiết

**Quy tắc quan trọng:**
- ✅ Chỉ output `<path>` elements
- ✅ Mỗi path = 1 vùng có thể tap/click để tô màu
- ✅ `fill-rule="evenodd"` cho tất cả paths
- ✅ Đường cong mượt, ít điểm neo

### Tương thích

- ✅ Hoạt động với cả 3 algorithms:
  - ImageTracer (Client)
  - Potrace (Server)
  - Potrace RGB (Server)

- ✅ Tương thích với tất cả coloring apps hỗ trợ SVG

---

## ❓ FAQ

**Q: Tại sao SVG của tôi bị vỡ/góc cạnh?**
A: Tăng Curve Smoothness (qtres) lên 0.8-1.0, hoặc dùng Potrace (Server) cho chất lượng tốt hơn.

**Q: Stroke quá mỏng/dày?**
A: Điều chỉnh Stroke Width slider (1-5px).

**Q: Có quá nhiều đường nhỏ lẻ?**
A: Tăng Path Omit (Detail Level) để loại bỏ paths nhỏ.

**Q: Có thể tô màu ngay trong tool này không?**
A: Hiện tại chưa hỗ trợ. Bạn cần import SVG vào coloring app khác (Procreate, Fresco, etc.)

**Q: Fill Mode và Coloring Book Mode khác nhau thế nào?**
A:
- Fill Mode: Paths được fill màu → Dùng cho logo, icons
- Coloring Book Mode: Paths chỉ có stroke → Dùng cho tô màu

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Ảnh đầu vào có rõ ràng không?
2. Đã chọn đúng Preset chưa?
3. Stroke Width có phù hợp không?
4. Thử các algorithm khác nhau

---

**Made with ❤️ | Tính năng Coloring Book Mode by DQL**
