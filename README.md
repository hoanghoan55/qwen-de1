# Motion Graphics Agent - AI Video Creator

Ứng dụng tạo motion graphics tự động với AI, hỗ trợ TTS, SFX và nhạc nền.

## 🚀 Cài đặt & Sử dụng

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- Trình duyệt web hiện đại (Chrome, Firefox, Edge)

### Cài đặt

```bash
# 1. Clone hoặc tải project về máy
cd motion-graphics-agent

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev

# 4. Mở trình duyệt
# Truy cập http://localhost:5173
```

### Build production

```bash
# Build ứng dụng
npm run build

# Preview build
npm run preview

# Files sẽ được tạo trong thư mục dist/
```

## 📖 Hướng dẫn sử dụng

### 1. Tạo video mới

1. Mở ứng dụng trong trình duyệt
2. Nhập mô tả video vào ô text (ví dụ: "Create kinetic typography animation with modern font")
3. Nhấn Enter hoặc click nút gửi
4. Chờ AI tạo script (30-60 giây)

### 2. Xem preview

- Click nút Play để xem video
- Dùng các nút điều khiển: Skip, Restart, Pause
- Click vào scene trong sidebar để nhảy đến scene đó

### 3. Chỉnh sửa scene

1. Click nút "Edit" ở header
2. Chọn scene cần chỉnh sửa từ sidebar trái
3. Chỉnh sửa các thông số:
   - Text: Nội dung hiển thị
   - Narration: Lời đọc TTS
   - Duration: Thời lượng (giây)
   - Colors: Màu nền và màu chữ
   - Font Size: Cỡ chữ
   - Animation: Hiệu ứng chuyển động
   - Sound Effect: Hiệu ứng âm thanh
   - Transition: Chuyển cảnh

### 4. Xuất video

1. Click nút "Export" ở header
2. Chờ quá trình render hoàn tất
3. File WebM sẽ được tải về tự động

## ⌨️ Phím tắt

| Phím | Chức năng |
|------|-----------|
| `Space` | Play/Pause |
| `←` | Scene trước |
| `→` | Scene tiếp |
| `R` | Restart từ đầu |
| `Enter` | Submit prompt (ở landing page) |

## 🔧 API Configuration

### 9Router (LLM)
- URL: `https://9router-production-bcf1.up.railway.app/v1`
- API Key: `sk-3a3d0c15eaf15d37-y9i1da-9ceeb339`
- Model: `openai/gpt-4o-mini`

### TTS Studio
- URL: `https://tts.delyai.site`
- API Key: `WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY`

## 🧪 Testing

### Chạy tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test API connections
npm run test:api
```

### Manual Testing Checklist

- [ ] Landing page hiển thị đúng
- [ ] Nhập prompt và submit thành công
- [ ] Loading state hiển thị progress
- [ ] Video preview render đúng
- [ ] Playback controls hoạt động
- [ ] Scene editor mở/đóng được
- [ ] Chỉnh sửa scene cập nhật preview
- [ ] Export video thành công
- [ ] Keyboard shortcuts hoạt động
- [ ] Responsive trên mobile

## 📁 Cấu trúc project

```
motion-graphics-agent/
├── src/
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript types
│   └── services/
│       ├── llm.ts           # 9Router API
│       ├── tts.ts           # TTS API
│       ├── audio.ts         # SFX & Music generation
│       ├── renderer.ts      # Canvas animation
│       └── exporter.ts      # Video export
├── tests/
│   ├── unit/                # Unit tests
│   ├── e2e/                 # E2E tests
│   └── api/                 # API tests
├── index.html
├── package.json
├── vite.config.js
└── tsconfig.json
```

## 🐛 Troubleshooting

### Lỗi không kết nối được API
- Kiểm tra kết nối internet
- Verify API keys trong `src/services/llm.ts` và `src/services/tts.ts`
- Kiểm tra CORS settings nếu chạy local

### Video không render
- Clear browser cache
- Kiểm tra console để xem lỗi
- Đảm bảo browser hỗ trợ Canvas API

### Export thất bại
- Kiểm tra browser có hỗ trợ MediaRecorder API
- Thử giảm resolution trong settings
- Kiểm tra disk space

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.
