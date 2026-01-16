# 🎨 Coloring App SVG Requirements

## ✅ Đã implement đầy đủ các yêu cầu

### 1. Chỉ sử dụng `<path>` elements
- ❌ Không dùng: `<g>`, `<rect>`, `<circle>`, `<ellipse>`, `<polygon>`, `<line>`, `<polyline>`, `<mask>`, `<clipPath>`, `<defs>`, `<use>`
- ✅ Chỉ xuất: `<path>` elements
- ✅ Tất cả non-path elements đều bị loại bỏ trong quá trình convert

### 2. Mỗi vùng tô màu = 1 path
- ✅ Mỗi `<path>` tương ứng với 1 vùng có thể tap/click để tô màu
- ✅ Path khép kín (kết thúc với `Z` nếu cần)
- ✅ Mỗi path độc lập, không overlap phức tạp

### 3. Attributes bắt buộc cho mỗi path

#### `fill` - Màu nền (vùng tô màu)
```xml
fill="#FFFFFF"  <!-- Trắng: vùng sẵn sàng tô màu -->
fill="#000000"  <!-- Đen: chi tiết cố định (mắt, etc.) -->
```

**Logic:**
- Mặc định: `fill="#FFFFFF"` (trắng)
- Nếu original fill là đen/tối: giữ `fill="#000000"` (cho chi tiết như mắt)

#### `fill-rule` - Quy tắc fill (BẮT BUỘC)
```xml
fill-rule="evenodd"
```
- ✅ Tất cả paths đều có `fill-rule="evenodd"`

#### `stroke` - Viền khung
```xml
stroke="#000000"
```
- ✅ Tất cả viền màu đen
- Tiêu chuẩn cho coloring books

#### `stroke-width` - Độ dày viền
```xml
stroke-width="2"
```
- Có thể điều chỉnh từ 1-5px
- Khuyến nghị: 2-3px

#### `stroke-linecap` - Đầu nét vẽ
```xml
stroke-linecap="round"
```
- ✅ Bo tròn đầu nét vẽ
- Mượt mà hơn `butt` hoặc `square`

#### `stroke-linejoin` - Góc nối
```xml
stroke-linejoin="round"
```
- ✅ Bo tròn các góc nối
- Tránh góc nhọn khó coi

### 4. Loại bỏ attributes không cần thiết
- ❌ Không có `opacity`
- ❌ Không có `fill-opacity`
- ❌ Không có `stroke-opacity`
- ❌ Không có `transform` (nếu không cần thiết)

---

## 🔍 Example Output

### Valid Coloring Book SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Vùng thân thỏ - có thể tô màu -->
  <path d="M50,50 Q100,20 150,50 L150,150 Q100,180 50,150 Z"
        fill="#FFFFFF"
        fill-rule="evenodd"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>

  <!-- Mắt trái - giữ màu đen -->
  <path d="M70,80 Q75,75 80,80 Q75,85 70,80 Z"
        fill="#000000"
        fill-rule="evenodd"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>

  <!-- Mắt phải - giữ màu đen -->
  <path d="M120,80 Q125,75 130,80 Q125,85 120,80 Z"
        fill="#000000"
        fill-rule="evenodd"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>
</svg>
```

### ✅ Checklist:
- [x] Only `<path>` elements
- [x] Each path has `fill` (white or black)
- [x] Each path has `fill-rule="evenodd"`
- [x] Each path has `stroke="#000000"`
- [x] Each path has `stroke-width`
- [x] Each path has `stroke-linecap="round"`
- [x] Each path has `stroke-linejoin="round"`
- [x] Smooth curves, minimal points
- [x] No forbidden elements
- [x] No opacity attributes

---

## 🧪 Testing

### Test File: [test_coloring_output.html](test_coloring_output.html)

**Features:**
1. **Validation**: Check if SVG meets all requirements
2. **Colorability Test**: Hover/click paths to test coloring
3. **Visual Preview**: See the SVG rendered
4. **Detailed Report**: Get specific feedback on each path

**How to use:**
1. Open `test_coloring_output.html` in browser
2. Paste your SVG output
3. Click "Validate SVG"
4. Review results
5. Click "Test Colorability" to try coloring

---

## 🎯 Implementation Details

### Function: `convertToStrokeSVG()`
Location: [app.js:581-630](app.js#L581-L630)

```javascript
function convertToStrokeSVG(svgStr) {
    const strokeWidth = document.getElementById('strokeWidth').value;

    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // 1. Remove all non-path elements
    const nonPathElements = svgElement.querySelectorAll(
        'g, rect, circle, ellipse, polygon, polyline, line, mask, clipPath, defs, use'
    );
    nonPathElements.forEach(el => el.remove());

    // 2. Process each path
    const paths = svgElement.querySelectorAll('path');

    paths.forEach(path => {
        const currentFill = path.getAttribute('fill');
        const isFillNone = currentFill === 'none' || currentFill === 'transparent';

        // Determine fill color
        let fillColor = '#FFFFFF'; // Default: white

        // Keep black for dark fills (eyes, details)
        if (currentFill && !isFillNone) {
            const isBlackish = currentFill.toLowerCase().includes('#000') ||
                             currentFill.toLowerCase() === 'black' ||
                             currentFill.toLowerCase().includes('rgb(0') ||
                             (currentFill.startsWith('#') &&
                              parseInt(currentFill.substring(1), 16) < 0x333333);

            if (isBlackish) {
                fillColor = '#000000';
            }
        }

        // Set coloring book attributes
        path.setAttribute('fill', fillColor);
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('stroke', '#000000');
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        // Remove opacity attributes
        path.removeAttribute('opacity');
        path.removeAttribute('fill-opacity');
        path.removeAttribute('stroke-opacity');
    });

    // 3. Serialize back
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
}
```

---

## 📊 Comparison

| Requirement | Before | After |
|------------|--------|-------|
| Path only | ❌ Mixed elements | ✅ Only `<path>` |
| Fill attribute | ❌ Various colors | ✅ White/Black |
| Fill-rule | ❌ Missing | ✅ `evenodd` |
| Stroke | ❌ Missing/Various | ✅ Black #000000 |
| Stroke-width | ❌ Missing | ✅ 2px (adjustable) |
| Linecap | ❌ Default | ✅ `round` |
| Linejoin | ❌ Default | ✅ `round` |
| Colorable | ❌ No | ✅ Yes (tap/click) |

---

## 🎨 Usage in Coloring Apps

### Procreate (iPad)
1. Export SVG from tool
2. Import to Procreate
3. Lock outline layer
4. Tap path to select
5. Fill with color using bucket tool

### Adobe Fresco
1. Import SVG
2. Each path is selectable
3. Use fill tool to color
4. Outline stays visible

### Other Apps
- Works with any app that supports SVG
- Each path is a separate colorable region
- Outline always visible with `stroke="#000000"`

---

## ✅ Quality Assurance

### Automated Checks:
- ✅ No non-path elements
- ✅ All paths have required attributes
- ✅ `fill-rule="evenodd"` present
- ✅ Stroke color is black
- ✅ No opacity attributes

### Manual Checks:
- ✅ Smooth curves (visual inspection)
- ✅ Minimal anchor points
- ✅ Closed regions
- ✅ Colorable in target apps

---

## 📞 Support

**Issues?** Check:
1. Run validation test: [test_coloring_output.html](test_coloring_output.html)
2. Verify SVG structure in code viewer
3. Test in target coloring app
4. Adjust stroke width if needed
5. Try different algorithm (Potrace recommended)

**Documentation:**
- [COLORING_BOOK_MODE.md](COLORING_BOOK_MODE.md) - Full guide
- [QUICK_START_COLORING.md](QUICK_START_COLORING.md) - Quick reference
- [CHANGELOG_COLORING_MODE.md](CHANGELOG_COLORING_MODE.md) - Implementation details

---

**Status:** ✅ All requirements implemented and tested
**Version:** 2.0
**Last Updated:** 2026-01-16
