# Hướng dẫn Test E2E trên Môi trường Này

## ⚠️ Giới hạn của Môi trường Sandbox

Môi trường hiện tại là **sandbox** với các giới hạn:
- ✅ Có thể build project
- ✅ Có thể chạy scripts Node.js
- ✅ Có thể test API connections
- ❌ Không thể chạy dev server liên tục
- ❌ Không thể mở browser để test UI
- ❌ Không thể chạy Playwright E2E tests

## ✅ Những gì CÓ THỂ test ở đây

### 1. Build Test

```bash
# Kiểm tra project build thành công
npm run build

# Output:
# ✓ built in X.XXs
# dist/index.html    X.XX kB
# dist/assets/...    X.XX kB
```

**Kết quả hiện tại:** ✅ Build thành công

### 2. API Connection Test

```bash
# Test kết nối APIs
node tests/api/test-connections.js
```

**Output mẫu:**
```
🧪 API Connection Tests
==================================================

🔍 Testing 9Router API...
✅ Health check: OK
✅ Models endpoint: 50 models available
✅ Chat completion: Working

🔍 Testing TTS API...
✅ Voices endpoint: 5 voices available
✅ TTS generation: Working (2.5s)

==================================================

📊 Test Results:
  9Router: ✅ PASS
  TTS:     ✅ PASS

✅ All tests passed!
```

### 3. TypeScript Type Check

```bash
# Kiểm tra type safety
npm run typecheck

# Output:
# ✓ Found 0 errors.
```

## 🚀 Test E2E Đầy đủ trên Máy Local

Để test E2E đầy đủ, bạn cần chạy trên máy local:

### Bước 1: Clone và cài đặt

```bash
# Tải project về máy
# (Download từ sandbox hoặc clone từ git)

cd motion-graphics-agent
npm install
```

### Bước 2: Chạy dev server

```bash
npm run dev

# Output:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Bước 3: Mở browser

Truy cập: http://localhost:5173

### Bước 4: Test manual

1. **Landing Page Test:**
   - Nhập prompt: "Create a simple test animation"
   - Nhấn Enter
   - Kiểm tra loading state hiển thị

2. **Video Generation Test:**
   - Chờ AI tạo script (30-60s)
   - Kiểm tra progress bar
   - Kiểm tra workspace hiển thị

3. **Playback Test:**
   - Click Play button
   - Kiểm tra video chạy
   - Test Skip, Restart buttons

4. **Editor Test:**
   - Click "Edit" button
   - Chỉnh sửa text, colors
   - Kiểm tra preview cập nhật

5. **Export Test:**
   - Click "Export" button
   - Chờ render hoàn tất
   - Kiểm tra file WebM download

### Bước 5: Chạy automated E2E tests

```bash
# Cài đặt Playwright browsers
npx playwright install

# Chạy E2E tests
npm run test:e2e

# Hoặc chạy với UI mode
npx playwright test --ui
```

## 📋 Quick Test Script cho Máy Local

Tạo file `quick-test.sh`:

```bash
#!/bin/bash

echo "🚀 Quick Test - Motion Graphics Agent"
echo "======================================"

# 1. Build test
echo -e "\n1️⃣  Build Test..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# 2. API test
echo -e "\n2️⃣  API Test..."
node tests/api/test-connections.js
if [ $? -eq 0 ]; then
    echo "✅ APIs working"
else
    echo "❌ API test failed"
fi

# 3. Start dev server
echo -e "\n3️⃣  Starting dev server..."
echo "   Open http://localhost:5173 in browser"
echo "   Press Ctrl+C to stop"
npm run dev
```

Chạy:
```bash
chmod +x quick-test.sh
./quick-test.sh
```

## 🎯 Test Cases Quan trọng

### Critical Path Test

1. **User Journey:**
   ```
   Landing Page → Enter Prompt → Submit → Loading → Workspace → Play → Export
   ```

2. **Expected Results:**
   - Landing page load < 2s
   - Script generation < 30s
   - Video preview renders
   - Playback works smoothly
   - Export creates WebM file

### Edge Cases

1. **Empty Prompt:**
   - Submit button disabled
   - No API call

2. **Invalid Prompt:**
   - AI returns fallback scenes
   - App continues working

3. **API Timeout:**
   - Error message hiển thị
   - User có thể retry

4. **Large Video:**
   - Export takes longer
   - Progress bar accurate

## 🔍 Debug trong Browser

Mở DevTools (F12) và kiểm tra:

### Console Tab
```javascript
// Test API directly
fetch('https://9router-production-bcf1.up.railway.app/v1/models', {
  headers: { 'Authorization': 'Bearer sk-3a3d0c15eaf15d37-y9i1da-9ceeb339' }
}).then(r => r.json()).then(console.log);

// Check app state
console.log(window.__APP_STATE__); // Nếu có
```

### Network Tab
- Kiểm tra API calls
- Verify request/response
- Check timing

### Performance Tab
- Record performance
- Check frame rate
- Identify bottlenecks

## 📊 Test Results Template

```markdown
# Test Report - [Date]

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Node: 18.17.0

## Results

### Build
- [✅] TypeScript compilation
- [✅] Vite build
- [✅] Assets generated

### API
- [✅] 9Router connection
- [✅] TTS connection
- [✅] Response times OK

### UI
- [✅] Landing page loads
- [✅] Prompt submission
- [✅] Loading states
- [✅] Workspace renders
- [✅] Playback works
- [✅] Editor functional
- [✅] Export successful

### Performance
- Landing page: 1.2s
- Script generation: 18s
- Preview render: 60fps
- Export (30s video): 45s

## Issues Found
- None

## Recommendations
- All tests passed
- Ready for production
```

## 🎓 Kết luận

**Trong môi trường sandbox này:**
- ✅ Build thành công
- ✅ TypeScript types OK
- ✅ API connections OK (có thể test)
- ❌ Không thể test UI/E2E

**Trên máy local:**
- ✅ Full E2E testing
- ✅ Playwright automation
- ✅ Manual testing
- ✅ Performance profiling

**Để test đầy đủ, hãy:**
1. Download project về máy
2. Chạy `npm install`
3. Chạy `npm run dev`
4. Mở browser và test manual
5. Chạy `npm run test:e2e` cho automated tests
