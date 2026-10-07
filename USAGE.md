# Hướng dẫn sử dụng chi tiết

## 🎯 Quy trình làm việc

### Bước 1: Tạo ý tưởng video

1. Mở ứng dụng tại http://localhost:5173
2. Bạn sẽ thấy landing page với ô nhập prompt
3. Mô tả video bạn muốn tạo bằng tiếng Anh hoặc tiếng Việt

**Ví dụ prompts hiệu quả:**

```
✅ Tốt:
- "Create a product launch video with modern typography, blue gradient background, and smooth transitions"
- "Animated bar chart showing sales growth from Q1 to Q4 with green bars"
- "Social media story with bold text, orange background, and bounce animations"
- "Logo reveal with particles assembling into shape, then text appearing"

❌ Tránh:
- "Make a video" (quá chung chung)
- "Hello" (không phải mô tả video)
- "Can you help me?" (câu hỏi, không phải yêu cầu)
```

### Bước 2: Xem AI tạo script

Sau khi submit prompt:

1. **Script Generation** (10-20 giây)
   - AI phân tích prompt
   - Tạo danh sách scenes với text, animation, colors
   - Hiển thị progress bar

2. **Voice Generation** (20-40 giây)
   - Tạo giọng đọc TTS cho từng scene
   - Nếu TTS server không khả dụng, vẫn tiếp tục

3. **Sound Effects** (5-10 giây)
   - Tạo hiệu ứng âm thanh cho mỗi scene
   - Whoosh, pop, ding, sparkle...

4. **Background Music** (5-10 giây)
   - Tạo nhạc nền ambient
   - Tự động điều chỉnh theo duration

### Bước 3: Xem và chỉnh sửa

Khi video đã sẵn sàng, bạn sẽ thấy workspace:

**Left Sidebar - Scene List:**
- Danh sách tất cả scenes
- Click để chọn scene
- Hiển thị thumbnail với colors
- Thời lượng mỗi scene

**Center - Preview:**
- Canvas hiển thị video
- Playback controls: Play, Pause, Skip, Restart
- Progress bar với scene markers
- Time display

**Right Sidebar - Editor** (click "Edit" để mở):
- Chỉnh sửa text, narration
- Thay đổi duration
- Chọn colors (background, text)
- Chọn animation type
- Chọn sound effect
- Chọn transition

### Bước 4: Export video

1. Click nút "Export" ở header
2. Chờ quá trình render (phụ thuộc vào số scenes)
3. File WebM sẽ được tải về
4. Import vào video editor hoặc upload lên mạng

## 🎨 Các loại animation

| Animation | Mô tả | Sử dụng khi |
|-----------|-------|-------------|
| `fadeIn` | Mờ dần xuất hiện | Mở đầu, chuyển cảnh nhẹ |
| `slideUp` | Trượt lên từ dưới | Text xuất hiện |
| `scaleIn` | Phóng to từ nhỏ | Logo, icons |
| `bounce` | Nảy lên | Elements vui nhộn |
| `typewriter` | Gõ chữ từng ký tự | Text dài, quotes |
| `rotate` | Xoay vào | Dynamic elements |
| `glow` | Phát sáng | Highlights |
| `pulse` | Nhịp đập | Attention grabbers |

## 🎵 Sound Effects

| SFX | Mô tả | Phù hợp với |
|-----|-------|-------------|
| `whoosh` | Gió thổi nhanh | Slide animations |
| `pop` | Tiếng pop | Scale, bounce |
| `click` | Tiếng click | UI elements |
| `ding` | Tiếng chuông | Success, complete |
| `sparkle` | Lấp lánh | Magic, special |
| `impact` | Tiếng va chạm | Dramatic moments |

## 🎬 Transition Types

| Transition | Mô tả |
|------------|-------|
| `fade` | Mờ dần sang đen |
| `slide` | Trượt sang trái |
| `wipe` | Lau từ phải sang trái |
| `dissolve` | Tan biến |

## 💡 Mẹo sử dụng

### Tạo video chuyên nghiệp

1. **Sử dụng prompts chi tiết:**
   ```
   "Create a 20-second product demo with:
   - Scene 1: Logo reveal with glow effect (3s)
   - Scene 2: Feature list with slide-up animation (5s)
   - Scene 3: Call-to-action with bounce (4s)
   Use blue color scheme and modern sans-serif font"
   ```

2. **Chỉnh sửa từng scene:**
   - Chọn animation phù hợp với nội dung
   - Đảm bảo colors có contrast tốt
   - Điều chỉnh duration cho phù hợp với narration

3. **Test trước khi export:**
   - Play toàn bộ video
   - Kiểm tra timing của animations
   - Nghe thử narration

### Tối ưu performance

- Giảm số scenes nếu video chậm
- Sử dụng resolution thấp hơn (854x480)
- Tắt sound effects nếu không cần

## 🔍 Debugging

### Kiểm tra Console

Mở DevTools (F12) để xem logs:

```javascript
// Kiểm tra API connections
console.log('Testing 9Router API...');
fetch('https://9router-production-bcf1.up.railway.app/v1/models', {
  headers: { 'Authorization': 'Bearer sk-3a3d0c15eaf15d37-y9i1da-9ceeb339' }
}).then(r => r.json()).then(console.log);

// Kiểm tra TTS API
console.log('Testing TTS API...');
fetch('https://tts.delyai.site/v1/voices', {
  headers: { 'x-api-key': 'WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY' }
}).then(r => r.json()).then(console.log);
```

### Common Issues

**Lỗi: "Failed to generate script"**
- Kiểm tra kết nối internet
- Verify API key còn hoạt động
- Thử prompt đơn giản hơn

**Lỗi: "TTS generation failed"**
- TTS server có thể offline
- Ứng dụng vẫn hoạt động, chỉ thiếu voice
- Kiểm tra console để xem chi tiết

**Lỗi: "Export failed"**
- Browser không hỗ trợ MediaRecorder
- Thử Chrome hoặc Firefox mới nhất
- Giảm resolution

## 📊 Performance Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Script generation | < 30s | ~15-20s |
| TTS per scene | < 5s | ~3-4s |
| Preview render | 60fps | 60fps |
| Export (30s video) | < 60s | ~30-45s |

## 🎓 Ví dụ thực tế

### Ví dụ 1: Product Launch

```
Prompt: "Create a product launch video for a new smartphone app. 
Scene 1: App logo with glow effect (3s)
Scene 2: Key features with icons sliding in (5s)  
Scene 3: Download CTA with bounce animation (4s)
Use modern blue gradient and clean typography"
```

### Ví dụ 2: Data Visualization

```
Prompt: "Animated bar chart showing quarterly sales:
Q1: $100k, Q2: $150k, Q3: $200k, Q4: $280k
Green bars growing from bottom, with numbers counting up.
Clean white background with dark text"
```

### Ví dụ 3: Social Media Story

```
Prompt: "Instagram story format video with:
- Bold headline: 'SUMMER SALE'
- Countdown timer animation
- Swipe up CTA
Vibrant orange and yellow colors, energetic transitions"
```

## 🚀 Next Steps

Sau khi tạo video:

1. **Edit trong video editor:**
   - Import file WebM vào Premiere, DaVinci, etc.
   - Thêm music, voiceover chuyên nghiệp
   - Adjust color grading

2. **Upload lên platforms:**
   - YouTube, TikTok, Instagram
   - Convert sang format phù hợp
   - Add captions, hashtags

3. **Iterate và improve:**
   - Xem analytics
   - Thử prompts khác
   - A/B test different styles
