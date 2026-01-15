# ⚡ Quick Reference - Settings nhanh

## 🎯 Đường cong MỰA như LỤA (cho ảnh thỏ)

```yaml
✅ Độ mượt (qtres): 0.3 - 0.5   ⭐⭐⭐ QUAN TRỌNG!
✅ Path omit: 0 - 1              ⭐⭐⭐ QUAN TRỌNG!
✅ Blur: 1                       ⭐⭐
✅ Threshold: 120 - 130          ⭐
✅ Số màu: 2
```

## 📊 Bảng tra cứu nhanh qtres

| qtres | Đường cong | File size | Thời gian |
|-------|------------|-----------|-----------|
| 0.1-0.3 | 🌟🌟🌟 Siêu mượt | Lớn | 10-20s |
| 0.4-0.6 | 🌟🌟 Mượt | Trung bình | 5-10s |
| 0.7-1.0 | 🌟 OK | Nhỏ | 3-5s |
| 1.5+ | ❌ Góc cạnh | Rất nhỏ | <3s |

## 🔑 Nhớ công thức:

```
qtres ↓ = Mượt ↑
Path omit ↓ = Chi tiết ↑
Blur ↑ (1-2) = Smooth ↑
```

## ⚡ Action plan 30 giây:

1. Upload ảnh
2. Kéo slider "Độ mượt" về **0.3**
3. Đổi "Path omit" thành **0**
4. Đổi "Blur" thành **1**
5. Click "Chuyển đổi"
6. Done! ✨

## 🆘 Troubleshooting nhanh

| Vấn đề | Giải pháp |
|--------|-----------|
| Góc cạnh | qtres ↓ (0.3 → 0.2) |
| Mất chi tiết | Path omit ↓ (1 → 0) |
| Có noise | Blur ↑ (1 → 2) |
| Đường nét mỏng | Threshold ↓ (128 → 120) |
| Đường nét dày | Threshold ↑ (128 → 135) |

---
**Đọc chi tiết:** [SMOOTH_CURVES_GUIDE.md](SMOOTH_CURVES_GUIDE.md)
