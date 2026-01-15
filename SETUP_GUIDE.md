# 📖 Hướng dẫn Setup - Image to SVG Converter

## 🎯 Chọn phương án phù hợp

### Option A: Client-side (ImageTracer) 💻
**Phù hợp với:**
- ✅ Người dùng muốn dùng ngay không cần cài đặt
- ✅ Không có NodeJS
- ✅ Chuyển đổi occasional (không thường xuyên)
- ⚠️ Chấp nhận chất lượng 85-90%

**Cách dùng:**
1. Double-click `index.html`
2. Upload ảnh
3. Chuyển đổi
4. Done!

---

### Option B: Server-side (Potrace) 🚀 ⭐ KHUYẾN NGHỊ
**Phù hợp với:**
- ✅ Muốn chất lượng cao nhất (95%+)
- ✅ Chuyển đổi line art, coloring books
- ✅ Có NodeJS hoặc sẵn sàng cài
- ✅ Muốn kết quả giống convertio.co

**Yêu cầu:**
- Node.js >= 14.0.0
- npm hoặc yarn

---

## 🟢 Setup Server-side (Potrace)

### Bước 1: Cài đặt Node.js

**Windows:**
1. Download: https://nodejs.org/
2. Chọn LTS version
3. Install và restart máy

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Bước 2: Kiểm tra cài đặt

```bash
node --version  # Phải >= v14.0.0
npm --version
```

### Bước 3: Cài dependencies

```bash
# Mở terminal trong folder SVG
cd server
npm install
```

**Lưu ý:**
- Windows: Có thể cần Visual Studio Build Tools
- Mac: Có thể cần Xcode Command Line Tools
- Linux: Có thể cần build-essential

### Bước 4: Chạy server

```bash
npm start
```

Thấy message này là thành công:
```
🚀 Server đang chạy!
📡 URL: http://localhost:3000
🔧 API endpoint: http://localhost:3000/api/convert
✅ Status: http://localhost:3000/health
```

### Bước 5: Test server

Mở trình duyệt, vào: http://localhost:3000/health

Kết quả phải là:
```json
{"status":"OK","message":"Server is running"}
```

### Bước 6: Sử dụng tool

1. Mở `index.html` trong trình duyệt
2. Bật toggle: **Potrace (Server)** ⭐
3. Kiểm tra Server URL: `http://localhost:3000`
4. Upload ảnh thỏ
5. Click "Chuyển đổi"
6. Kết quả: Chất lượng 95%+! 🎉

---

## 🔧 Troubleshooting Server

### Lỗi: "Cannot find module 'express'"
```bash
cd server
npm install
```

### Lỗi: "sharp" installation failed
```bash
npm install sharp --ignore-scripts=false
# Hoặc
npm rebuild sharp
```

### Lỗi: Port 3000 đã được sử dụng
```bash
# Cách 1: Đổi port
PORT=3001 npm start

# Cách 2: Kill process trên port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Lỗi: Permission denied (Mac/Linux)
```bash
sudo npm install
# Hoặc fix npm permissions:
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Server chạy nhưng API không hoạt động
1. Kiểm tra firewall
2. Kiểm tra server URL trong tool (phải là `http://localhost:3000`)
3. Xem console logs trong browser (F12)
4. Xem server logs trong terminal

---

## 🌐 Deploy lên Production

### Vercel (Free - Khuyến nghị)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd server
vercel
```

3. Copy URL từ Vercel (ví dụ: `https://svg-converter.vercel.app`)

4. Trong tool, đổi Server URL thành URL từ Vercel

### Railway (Free tier)

1. Tạo account: https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repo hoặc folder `server`
4. Railway tự động deploy
5. Copy URL và dùng trong tool

### Heroku

```bash
heroku create svg-converter-app
git subtree push --prefix server heroku main
```

---

## 💡 Tips

### Chạy server background (không tắt terminal)

**Windows:**
```bash
# Install pm2
npm install -g pm2

# Start server
cd server
pm2 start server.js --name svg-converter

# Stop
pm2 stop svg-converter

# Restart
pm2 restart svg-converter
```

**Mac/Linux:**
```bash
# Sử dụng nohup
cd server
nohup npm start > server.log 2>&1 &

# Check logs
tail -f server.log

# Stop
ps aux | grep node
kill <PID>
```

### Auto-restart khi code thay đổi

```bash
npm run dev
```

Sử dụng `nodemon` để tự động restart khi file thay đổi.

### Monitoring logs

```bash
# Xem logs real-time
cd server
npm start

# Logs sẽ hiện:
# - Request URLs
# - Processing time
# - Errors
```

---

## 📊 So sánh Performance

### ImageTracer (Client-side)
```
✅ Không cần server
✅ Instant setup (0 phút)
✅ Hoạt động offline
⚠️ Chất lượng 85-90%
⚠️ Đường cong hơi góc cạnh
⏱️ Conversion: 3-5 giây
```

### Potrace (Server-side)
```
✅ Chất lượng 95%+ (giống convertio.co)
✅ Đường cong mượt mại hoàn hảo
✅ File size nhỏ hơn 30%
⚠️ Cần cài server (5-10 phút)
⚠️ Cần internet nếu deploy
⏱️ Conversion: 0.5-1.5 giây
```

---

## 🎓 Video Tutorials (Coming Soon)

- [ ] How to install Node.js
- [ ] Setup server locally
- [ ] Deploy to Vercel
- [ ] Compare ImageTracer vs Potrace

---

## 📞 Need Help?

### Quick checklist:
- [ ] Node.js installed? (`node --version`)
- [ ] Dependencies installed? (`npm install`)
- [ ] Server running? (Check terminal logs)
- [ ] Correct Server URL? (`http://localhost:3000`)
- [ ] Firewall not blocking? (Try turning off temporarily)

### Still stuck?
1. Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check server logs
3. Check browser console (F12)
4. Try with a simple image first

---

**Ready to get 95%+ quality like convertio.co?** 🚀

Follow Option B setup and enjoy professional-grade SVG conversion!
