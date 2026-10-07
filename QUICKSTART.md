# 🚀 Bắt đầu nhanh

## Cài đặt và sử dụng trên máy local

### 1. Tải project về máy

```bash
# Nếu có git
git clone <repo-url>
cd motion-graphics-agent

# Hoặc download ZIP từ sandbox
# Giải nén và cd vào thư mục
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### 4. Sử dụng

1. **Nhập mô tả video** (tiếng Anh hoặc Việt)
   - Ví dụ: "Create a product launch video with modern typography"
   
2. **Nhấn Enter** hoặc click nút gửi

3. **Chờ AI tạo video** (30-60 giây)
   - Script generation: 10-20s
   - Voice generation: 20-40s
   - Sound effects: 5-10s

4. **Xem preview**
   - Click Play để xem
   - Dùng controls: Skip, Restart, Pause
   
5. **Chỉnh sửa** (optional)
   - Click "Edit" để mở editor
   - Chỉnh text, colors, animation, duration
   
6. **Export video**
   - Click "Export"
   - File WebM sẽ download tự động

## ⌨️ Phím tắt

| Phím | Chức năng |
|------|-----------|
| `Space` | Play/Pause |
| `←` | Scene trước |
| `→` | Scene tiếp |
| `R` | Restart |
| `Enter` | Submit prompt |

## 🧪 Testing

### Test nhanh

```bash
# Verify project
node scripts/verify.js

# Test API connections
node tests/api/test-connections.js

# Build test
npm run build
```

### Test đầy đủ

```bash
# Chạy tất cả tests
./scripts/test.sh

# Hoặc từng loại
npm run test:api    # API tests
npm run test:e2e    # E2E tests (cần Playwright)
```

### E2E Testing

```bash
# Cài đặt Playwright
npx playwright install

# Chạy E2E tests
npm run test:e2e

# Hoặc với UI
npx playwright test --ui
```

## 📁 Cấu trúc project

```
motion-graphics-agent/
├── src/
│   ├── App.tsx              # Main app
│   ├── types.ts             # TypeScript types
│   └── services/
│       ├── llm.ts           # 9Router API
│       ├── tts.ts           # TTS API
│       ├── audio.ts         # SFX & Music
│       ├── renderer.ts      # Canvas renderer
│       └── exporter.ts      # Video export
├── tests/
│   ├── api/                 # API tests
│   ├── unit/                # Unit tests
│   └── e2e/                 # E2E tests
├── scripts/
│   ├── test.sh              # Test runner
│   └── verify.js            # Quick verify
├── README.md                # Hướng dẫn chi tiết
├── USAGE.md                 # Cách sử dụng
├── TESTING.md               # Hướng dẫn test
└── LOCAL_TESTING.md         # Test trên máy local
```

## 🔧 API Configuration

APIs đã được cấu hình sẵn:

- **9Router (LLM)**: `https://9router-production-bcf1.up.railway.app/v1`
- **TTS Studio**: `https://tts.delyai.site`

Không cần cấu hình thêm!

## 🐛 Troubleshooting

### Lỗi không kết nối API
```bash
# Kiểm tra internet
ping 9router-production-bcf1.up.railway.app

# Test API
node tests/api/test-connections.js
```

### Lỗi build
```bash
# Clean và rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Lỗi không chạy được
```bash
# Check Node version (cần 18+)
node --version

# Reinstall
rm -rf node_modules
npm install
```

## 📚 Tài liệu

- **README.md** - Hướng dẫn cài đặt chi tiết
- **USAGE.md** - Hướng dẫn sử dụng đầy đủ
- **TESTING.md** - Hướng dẫn testing
- **LOCAL_TESTING.md** - Test trong môi trường sandbox

## 🎯 Ví dụ prompts

```
✅ Tốt:
- "Create kinetic typography with modern font, blue background"
- "Animated bar chart showing growth data, green bars"
- "Social media story with bold text, orange colors"
- "Logo reveal with particles, glow effect"

❌ Tránh:
- "Make a video" (quá chung)
- "Hello" (không phải mô tả)
```

## 🎬 Features

- ✅ AI-powered script generation (9Router)
- ✅ Text-to-Speech (TTS Studio)
- ✅ Sound effects (Web Audio API)
- ✅ Background music generation
- ✅ 17 animation types
- ✅ Real-time preview
- ✅ Scene editor
- ✅ Video export (WebM)
- ✅ Keyboard shortcuts
- ✅ Responsive design

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra README.md
2. Xem TESTING.md
3. Chạy `node scripts/verify.js`
4. Kiểm tra console browser (F12)

## 🎉 Sẵn sàng!

Bây giờ bạn đã sẵn sàng tạo motion graphics với AI!

```bash
npm run dev
```

Mở http://localhost:5173 và bắt đầu sáng tạo! 🚀
