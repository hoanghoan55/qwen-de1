# Hướng dẫn Testing

## 🧪 Tổng quan

Project có 3 loại tests:
1. **API Tests** - Kiểm tra kết nối đến 9Router và TTS APIs
2. **Unit Tests** - Test các service functions
3. **E2E Tests** - Test toàn bộ flow trên browser

## 🚀 Chạy Tests trên Máy Local

### 1. Chuẩn bị

```bash
# Clone project
git clone <repo-url>
cd motion-graphics-agent

# Cài đặt dependencies
npm install
```

### 2. Chạy tất cả tests

```bash
# Cách 1: Dùng script tự động
chmod +x scripts/test.sh
./scripts/test.sh

# Cách 2: Chạy từng loại test
npm run test:api      # API connection tests
npm run test:unit     # Unit tests (typecheck)
npm run test:e2e      # E2E tests (cần cài Playwright)
npm run build         # Build test
```

### 3. Test API Connections

```bash
# Kiểm tra kết nối API
node tests/api/test-connections.js

# Output mẫu:
# 🔍 Testing 9Router API...
# ✅ Health check: OK
# ✅ Models endpoint: 50 models available
# ✅ Chat completion: Working
#
# 🔍 Testing TTS API...
# ✅ Voices endpoint: 5 voices available
# ✅ TTS generation: Working (2.5s)
#
# 📊 Test Results:
#   9Router: ✅ PASS
#   TTS:     ✅ PASS
#
# ✅ All tests passed!
```

### 4. Test E2E với Playwright

```bash
# Cài đặt Playwright browsers
npx playwright install

# Chạy E2E tests
npm run test:e2e

# Chạy với UI mode (interactive)
npx playwright test --ui

# Chạy specific test
npx playwright test app.spec.ts

# Chạy trên specific browser
npx playwright test --project=chromium
```

## 📋 Manual Testing Checklist

### Landing Page
- [ ] Trang load thành công
- [ ] Heading "What do you want to create?" hiển thị
- [ ] Textarea có placeholder đúng
- [ ] Example prompts hiển thị (5 buttons)
- [ ] Click example prompt fill textarea
- [ ] Submit button disabled khi textarea rỗng
- [ ] Submit button enabled khi có text
- [ ] Enter key submit form
- [ ] Shift+Enter tạo dòng mới

### Video Generation
- [ ] Submit prompt bắt đầu generation
- [ ] Loading state hiển thị
- [ ] Progress bar cập nhật
- [ ] Status messages thay đổi:
  - "Generating script..."
  - "Generating voiceover..."
  - "Generating sound effects..."
  - "Complete!"
- [ ] Chuyển sang workspace khi xong
- [ ] Xử lý lỗi gracefully

### Workspace
- [ ] Scene list sidebar hiển thị
- [ ] Số scenes đúng
- [ ] Click scene chọn scene đó
- [ ] Canvas preview hiển thị
- [ ] Scene indicator (1/N) hiển thị
- [ ] Playback controls hiển thị
- [ ] Progress bar hiển thị
- [ ] Time display (0:00 / 0:30)

### Playback
- [ ] Play button bắt đầu playback
- [ ] Pause button dừng playback
- [ ] Skip forward đến scene tiếp
- [ ] Skip back đến scene trước
- [ ] Restart về đầu video
- [ ] Progress bar cập nhật real-time
- [ ] Scene markers trên progress bar
- [ ] Auto-pause khi kết thúc

### Scene Editor
- [ ] Click "Edit" mở editor
- [ ] Editor hiển thị scene hiện tại
- [ ] Text input editable
- [ ] Narration textarea editable
- [ ] Duration slider hoạt động
- [ ] Color pickers hoạt động
- [ ] Font size slider hoạt động
- [ ] Animation dropdown hoạt động
- [ ] SFX dropdown hoạt động
- [ ] Transition dropdown hoạt động
- [ ] Thay đổi cập nhật preview
- [ ] Click X đóng editor

### Export
- [ ] Export button hiển thị
- [ ] Click Export bắt đầu render
- [ ] Progress hiển thị %
- [ ] File WebM download tự động
- [ ] File có thể play được

### Keyboard Shortcuts
- [ ] Space: Play/Pause
- [ ] Arrow Right: Skip forward
- [ ] Arrow Left: Skip back
- [ ] R: Restart
- [ ] Enter: Submit (landing page)

### Responsive
- [ ] Desktop (1920x1080) OK
- [ ] Laptop (1366x768) OK
- [ ] Tablet (768x1024) OK
- [ ] Mobile (375x667) OK

### Performance
- [ ] Landing page load < 2s
- [ ] Script generation < 30s
- [ ] TTS per scene < 5s
- [ ] Preview render 60fps
- [ ] Export 30s video < 60s

## 🐛 Debugging Tests

### API Tests fail
```bash
# Kiểm tra internet connection
ping 9router-production-bcf1.up.railway.app
ping tts.delyai.site

# Kiểm tra API keys
grep -r "sk-3a3d0c15eaf15d37" src/
grep -r "WwlIYBeO3SxiN4Wpa7sw" src/

# Test manual với curl
curl -H "Authorization: Bearer sk-3a3d0c15eaf15d37-y9i1da-9ceeb339" \
  https://9router-production-bcf1.up.railway.app/v1/models
```

### E2E Tests fail
```bash
# Chạy với debug mode
DEBUG=pw:api npx playwright test

# Xem screenshots
ls test-results/

# Xem trace
npx playwright show-report

# Chạy single test với debug
npx playwright test -g "Landing page loads" --debug
```

### Build fails
```bash
# Clean và rebuild
rm -rf node_modules dist
npm install
npm run build

# Check TypeScript errors
npm run typecheck

# Check specific file
npx tsc --noEmit src/App.tsx
```

## 📊 Test Coverage

| Component | Unit | E2E | Manual |
|-----------|------|-----|--------|
| LLM Service | ✅ | ✅ | ✅ |
| TTS Service | ✅ | ✅ | ✅ |
| Audio Service | ✅ | - | ✅ |
| Renderer | ✅ | ✅ | ✅ |
| Exporter | ✅ | ✅ | ✅ |
| Landing Page | - | ✅ | ✅ |
| Workspace | - | ✅ | ✅ |
| Scene Editor | - | ✅ | ✅ |
| Playback | - | ✅ | ✅ |

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
      
      - name: API tests
        run: node tests/api/test-connections.js
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: E2E tests
        run: npm run test:e2e
```

## 📝 Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../src/services/yourService';

describe('Your Service', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('your test', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Your test logic
  const element = page.locator('your-selector');
  await expect(element).toBeVisible();
});
```

## 🎯 Test Goals

- **API Tests**: Đảm bảo APIs hoạt động
- **Unit Tests**: Đảm bảo logic đúng
- **E2E Tests**: Đảm bảo user flow hoạt động
- **Manual Tests**: Đảm bảo UX tốt

## 📚 Resources

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Vitest Docs](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/)
