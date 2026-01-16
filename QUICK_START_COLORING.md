# 🎨 Quick Start - Coloring Book Mode

## 5 bước đơn giản để tạo SVG tô màu

### 1️⃣ Upload ảnh
- Kéo thả hoặc chọn file
- **Best:** Ảnh line art, vẽ đường, sketch

### 2️⃣ Chọn "Coloring Book Mode"
- Trong section **🎨 Output Mode**
- Click vào **Coloring Book Mode** (icon 🖌️)
- ✅ Đã active khi có màu xanh

### 3️⃣ Set Stroke Width
- Thanh trượt **Stroke Width**: `2px` (khuyến nghị)
- Mỏng (1px) cho chi tiết
- Dày (3-5px) cho bold lines

### 4️⃣ Chọn Algorithm & Preset
**Khuyến nghị:**
```
Algorithm: Potrace (Server) ⭐
Preset: Line Art
```

**Nếu không có server:**
```
Algorithm: ImageTracer (Client)
Preset: Line Art
```

### 5️⃣ Convert & Download
- Click **🔄 Convert to SVG**
- Đợi vài giây
- Click **⬇️ Download SVG**
- ✅ Done! Import vào app tô màu yêu thích

---

## 🎯 Settings tối ưu

### Cho Line Art / Coloring Books
```
Output Mode: Coloring Book Mode
Stroke Width: 2-3px
Algorithm: Potrace (Server)
Preset: Line Art
```

### Cho Sketches
```
Output Mode: Coloring Book Mode
Stroke Width: 1.5-2px
Algorithm: Potrace (Server)
Preset: Sketch
```

### Cho Icons/Logos đơn giản
```
Output Mode: Coloring Book Mode
Stroke Width: 2px
Algorithm: Potrace (Server)
Preset: Logo / Icon
```

---

## 📱 Dùng SVG trong Apps

### Procreate (iPad)
1. Download SVG từ tool
2. Mở Procreate → Import → Select SVG
3. Tạo layer mới phía dưới
4. Tô màu thoải mái!

### Adobe Fresco
1. Download SVG
2. Import vào Fresco
3. Lock layer outline
4. Tô màu trên layer mới

### Affinity Designer
1. Import SVG
2. Expand strokes nếu cần
3. Tô màu với fill tool

### Apps khác
- Hầu hết apps hỗ trợ SVG đều OK
- Nếu không import được → Convert sang PNG/PDF trước

---

## ❓ Troubleshooting nhanh

**Q: SVG bị vỡ/góc cạnh?**
→ Tăng Curve Smoothness (qtres) hoặc dùng Potrace

**Q: Stroke quá mỏng/dày?**
→ Điều chỉnh Stroke Width slider

**Q: Quá nhiều đường nhỏ?**
→ Tăng Path Omit (Detail Level)

**Q: Không tô được màu?**
→ Kiểm tra đã chọn Coloring Book Mode chưa

---

## 📊 So sánh nhanh

| Feature | Fill Mode | Coloring Book Mode |
|---------|-----------|-------------------|
| Paths | Filled | Stroked |
| Tô màu được | ❌ | ✅ |
| Dùng cho | Logo, Icons | Line art, Coloring |
| File size | Nhỏ hơn | Lớn hơn một chút |
| Quality | High | High |

---

## 🎨 Example Output

**Input:** Line art image (rabbit.jpg)

**Settings:**
- Mode: Coloring Book
- Stroke: 2px
- Algorithm: Potrace
- Preset: Line Art

**Output:** SVG với:
```xml
<path d="..."
      fill="#FFFFFF"
      fill-rule="evenodd"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"/>
```

**Result:** ✅ Có thể tap/click vào mỗi path để tô màu trong Procreate!

**Key Features:**
- Chỉ có `<path>` elements
- Mỗi path = 1 vùng tô màu
- `fill="#FFFFFF"` sẵn sàng để thay đổi màu
- Viền đen rõ ràng với `stroke="#000000"`

---

**Need help?** Xem [COLORING_BOOK_MODE.md](COLORING_BOOK_MODE.md) để biết thêm chi tiết!
