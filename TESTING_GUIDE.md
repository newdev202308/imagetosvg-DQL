# 🧪 Testing Guide - Coloring Book Mode

## Quick Test Checklist

### ✅ Before Testing
- [ ] Server running (if using Potrace)
- [ ] Browser opened (Chrome recommended)
- [ ] Test image ready (line art, sketch, or simple drawing)

---

## 📝 Test Scenarios

### Scenario 1: Basic Line Art
**Goal:** Verify simple line art converts correctly

**Steps:**
1. Open [index.html](index.html)
2. Upload simple line drawing (rabbit, flower, etc.)
3. Mode: **Coloring Book Mode** (should be default)
4. Stroke Width: **2px**
5. Algorithm: **Potrace (Server)**
6. Preset: **Line Art**
7. Click **Convert**

**Expected Result:**
- ✅ Preview shows black outlines
- ✅ Download button appears
- ✅ Info shows "Mode: Coloring Book"

**Validation:**
8. Click **View SVG Code**
9. Check for:
   - Only `<path>` elements
   - `fill="#FFFFFF"` or `fill="#000000"`
   - `fill-rule="evenodd"`
   - `stroke="#000000"`
   - `stroke-width="2"`

10. Copy SVG code
11. Open [test_coloring_output.html](test_coloring_output.html)
12. Paste code and click **Validate SVG**
13. Should show: **"🎉 Perfect! SVG meets all requirements"**

---

### Scenario 2: Complex Image with Details
**Goal:** Test with image that has dark details (eyes, shadows)

**Steps:**
1. Upload image with dark areas (e.g., character with eyes)
2. Mode: **Coloring Book Mode**
3. Stroke Width: **2-3px**
4. Algorithm: **Potrace (Server)**
5. Preset: **Line Art** or **Sketch**
6. Convert

**Expected Result:**
- ✅ Most paths have `fill="#FFFFFF"` (white)
- ✅ Dark details (eyes) have `fill="#000000"` (black)
- ✅ All paths have proper stroke attributes

**Validation:**
7. View code and verify:
   - Some paths with `fill="#FFFFFF"`
   - Some paths with `fill="#000000"` (details)
   - All have `fill-rule="evenodd"`

---

### Scenario 3: Test Stroke Width Adjustment
**Goal:** Verify stroke width changes affect output

**Steps:**
1. Upload image
2. Mode: **Coloring Book Mode**
3. Try different stroke widths:
   - 1px (thin)
   - 2px (normal)
   - 3px (thick)
   - 5px (very thick)
4. Convert each time

**Expected Result:**
- ✅ Preview shows different line thickness
- ✅ SVG code shows `stroke-width="[value]"`
- ✅ Download works for each

---

### Scenario 4: Fill Mode vs Coloring Book Mode
**Goal:** Compare two output modes

**Steps:**
1. Upload image
2. Set **Fill Mode**
3. Convert → Save as "test_fill.svg"
4. Reset
5. Upload same image
6. Set **Coloring Book Mode**
7. Convert → Save as "test_coloring.svg"

**Expected Differences:**

**Fill Mode:**
```xml
<path d="..." fill="#000000"/>
<!-- or -->
<circle cx="50" cy="50" r="20" fill="#FF0000"/>
```

**Coloring Book Mode:**
```xml
<path d="..."
      fill="#FFFFFF"
      fill-rule="evenodd"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"/>
```

---

### Scenario 5: Algorithm Comparison
**Goal:** Test all 3 algorithms

**Steps:**
1. Upload same image
2. Mode: **Coloring Book Mode**
3. Test each algorithm:
   - **Potrace (Server)** - Best quality
   - **Potrace RGB (Server)** - Color layers
   - **ImageTracer (Client)** - Offline

**Expected Result:**
- ✅ All produce valid coloring book SVG
- ✅ Potrace: Smoothest curves
- ✅ ImageTracer: More paths, less smooth

---

## 🎨 Interactive Colorability Test

### Using test_coloring_output.html

**Steps:**
1. Generate SVG from main tool
2. Copy SVG code
3. Open [test_coloring_output.html](test_coloring_output.html)
4. Paste code
5. Click **Test Colorability**

**Interactive Tests:**
- ✅ Hover over paths → Should turn yellow
- ✅ Click paths → Should change to random color
- ✅ Each path clickable separately
- ✅ Outline stays visible

---

## 🐛 Common Issues & Fixes

### Issue 1: SVG has non-path elements
**Symptom:** Validation shows "Found X forbidden elements"

**Fix:**
- Code is working correctly, this shouldn't happen
- If it does, check `convertToStrokeSVG()` function
- Verify `nonPathElements.forEach(el => el.remove())` is running

### Issue 2: Paths missing fill-rule
**Symptom:** Validation shows "missing/wrong fill-rule"

**Fix:**
- Check line: `path.setAttribute('fill-rule', 'evenodd');`
- Should be present in `convertToStrokeSVG()`

### Issue 3: Stroke not black
**Symptom:** Validation shows "missing/wrong stroke"

**Fix:**
- Verify: `path.setAttribute('stroke', '#000000');`
- Should apply to all paths

### Issue 4: Can't color in Procreate/Fresco
**Symptom:** Paths not selectable or won't fill

**Possible Causes:**
- Path not closed (missing Z or not naturally closed)
- Path too complex (simplify with higher pathomit)
- App doesn't support SVG (try exporting as PNG first)

**Fix:**
- Increase Path Omit setting (5-10)
- Try different algorithm
- Verify path has `fill` attribute (not `fill="none"`)

---

## 📊 Performance Testing

### File Size Test
**Goal:** Check SVG file size

**Steps:**
1. Upload test image (e.g., 800x800px)
2. Convert with different settings:
   - Stroke Width: 1px, 2px, 3px, 5px
   - Path Omit: 1, 5, 10, 20
3. Note file sizes

**Expected:**
- ✅ Larger stroke width = Slightly larger file
- ✅ Higher path omit = Smaller file
- ✅ Coloring Book Mode ≈ Similar to Fill Mode

### Conversion Speed Test
**Goal:** Measure conversion time

**Steps:**
1. Upload same image
2. Test each algorithm:
   - ImageTracer (Client): ~1-3 seconds
   - Potrace (Server): ~2-5 seconds
   - Potrace RGB (Server): ~5-10 seconds
3. Note times

**Expected:**
- ✅ Client mode: Fastest (local processing)
- ✅ Server mode: Slower but better quality
- ✅ RGB mode: Slowest (multiple layers)

---

## ✅ Final Validation Checklist

Before deploying or sharing SVG:

- [ ] Open SVG in text editor
- [ ] Verify only `<path>` elements (no rect, circle, etc.)
- [ ] Check all paths have:
  - [ ] `fill` attribute (white or black)
  - [ ] `fill-rule="evenodd"`
  - [ ] `stroke="#000000"`
  - [ ] `stroke-width`
  - [ ] `stroke-linecap="round"`
  - [ ] `stroke-linejoin="round"`
- [ ] Import to target coloring app
- [ ] Test coloring 3-5 different paths
- [ ] Verify outline stays visible
- [ ] Check file size is reasonable
- [ ] Save as final version

---

## 🎯 Test Report Template

Copy and fill this after testing:

```
TEST REPORT
Date: ____________
Tester: ____________

Image Type: [ ] Line Art  [ ] Sketch  [ ] Photo  [ ] Logo
Algorithm: [ ] Potrace  [ ] Potrace RGB  [ ] ImageTracer
Stroke Width: ___px

VALIDATION RESULTS:
[ ] Only <path> elements: PASS / FAIL
[ ] All paths have fill: PASS / FAIL
[ ] All paths have fill-rule="evenodd": PASS / FAIL
[ ] All paths have stroke="#000000": PASS / FAIL
[ ] All paths have stroke-width: PASS / FAIL
[ ] All paths have stroke-linecap="round": PASS / FAIL
[ ] All paths have stroke-linejoin="round": PASS / FAIL

COLORABILITY TEST:
[ ] Paths hoverable: PASS / FAIL
[ ] Paths clickable: PASS / FAIL
[ ] Color changes work: PASS / FAIL
[ ] Outline stays visible: PASS / FAIL

PROCREATE/FRESCO TEST (if applicable):
[ ] Imports successfully: PASS / FAIL
[ ] Paths selectable: PASS / FAIL
[ ] Fill tool works: PASS / FAIL
[ ] Outline visible: PASS / FAIL

NOTES:
_______________________________________
_______________________________________
_______________________________________

OVERALL: PASS / FAIL
```

---

## 📞 Support

Issues during testing?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [COLORING_BOOK_MODE.md](COLORING_BOOK_MODE.md)
3. Run validation test: [test_coloring_output.html](test_coloring_output.html)
4. Check console for errors (F12)
5. Try different browser (Chrome recommended)

---

**Happy Testing!** 🎨
