# Hướng dẫn Debug Preview Video

## 🔍 Kiểm tra Console Logs

Mở DevTools (F12) → Console tab và kiểm tra các logs:

### Khi vào Workspace:
```
[MotionGraphics] Generated scenes: 3
[MotionGraphics] Initializing renderer...
[MotionRenderer] Initialized with canvas 1280 x 720
[MotionGraphics] Rendering initial scene...
[MotionRenderer] Rendering scene: Your text here progress: 0.50 size: 1280 x 720
```

### Nếu không thấy logs trên:
- Renderer chưa được khởi tạo
- Canvas chưa sẵn sàng
- Scenes chưa được tạo

## 🐛 Các vấn đề thường gặp

### 1. Canvas không hiển thị

**Triệu chứng:** Màn hình đen hoặc trắng, không có gì hiển thị

**Kiểm tra:**
```javascript
// Trong Console
const canvas = document.querySelector('canvas');
console.log('Canvas exists:', !!canvas);
console.log('Canvas size:', canvas?.width, 'x', canvas?.height);
console.log('Canvas visible:', canvas?.offsetWidth, 'x', canvas?.offsetHeight);
```

**Giải pháp:**
- Kiểm tra CSS có đúng không
- Đảm bảo canvas có `display: block`
- Kiểm tra parent container có kích thước

### 2. Renderer không khởi tạo

**Triệu chứng:** Không thấy log "[MotionRenderer] Initialized"

**Kiểm tra:**
```javascript
// Kiểm tra view state
console.log('Current view:', /* state variable */);
console.log('Canvas ref:', /* canvasRef.current */);
```

**Giải pháp:**
- Đảm bảo view === 'workspace'
- Canvas ref phải tồn tại
- Kiểm tra useEffect dependencies

### 3. Scene không render

**Triệu chứng:** Có log init nhưng không có log "Rendering scene"

**Kiểm tra:**
```javascript
// Kiểm tra scenes
console.log('Scenes count:', /* scenes.length */);
console.log('Current scene:', /* scenes[currentSceneIndex] */);
```

**Giải pháp:**
- Đảm bảo scenes.length > 0
- currentSceneIndex hợp lệ
- Scene có đầy đủ properties

### 4. Canvas context lỗi

**Triệu chứng:** Error "Failed to get canvas 2D context"

**Nguyên nhân:**
- Canvas chưa sẵn sàng khi getContext được gọi
- Browser không hỗ trợ Canvas 2D

**Giải pháp:**
- Đợi canvas mount xong
- Sử dụng setTimeout hoặc requestAnimationFrame
- Kiểm tra browser compatibility

## 🔧 Debug Commands

### Test renderer trực tiếp:
```javascript
// Tạo canvas test
const testCanvas = document.createElement('canvas');
testCanvas.width = 800;
testCanvas.height = 600;
document.body.appendChild(testCanvas);

// Test render
const ctx = testCanvas.getContext('2d');
ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, 800, 600);
ctx.fillStyle = '#ffffff';
ctx.font = '48px Arial';
ctx.fillText('Test', 350, 300);
```

### Kiểm tra scene data:
```javascript
// Log scene hiện tại
console.log('Current scene:', JSON.stringify(scenes[currentSceneIndex], null, 2));

// Kiểm tra required fields
const scene = scenes[currentSceneIndex];
console.log('Has text:', !!scene.text);
console.log('Has backgroundColor:', !!scene.backgroundColor);
console.log('Has textColor:', !!scene.textColor);
console.log('Has fontSize:', !!scene.fontSize);
```

### Force re-render:
```javascript
// Trigger render manually
if (rendererRef.current && scenes[currentSceneIndex]) {
  rendererRef.current.renderStaticScene(scenes[currentSceneIndex], 0.5);
}
```

## 📊 Checklist Debug

- [ ] Console có log "[MotionGraphics] Generated scenes"
- [ ] Console có log "[MotionRenderer] Initialized"
- [ ] Console có log "[MotionRenderer] Rendering scene"
- [ ] Canvas element tồn tại trong DOM
- [ ] Canvas có kích thước > 0
- [ ] Scenes array không rỗng
- [ ] currentSceneIndex hợp lệ
- [ ] Scene có đầy đủ properties
- [ ] Không có error trong Console
- [ ] Network tab không có failed requests

## 🎯 Quick Fix

Nếu preview vẫn không hiển thị, thử:

1. **Hard refresh:** Ctrl+Shift+R (Cmd+Shift+R trên Mac)

2. **Clear cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Check browser console:** F12 → Console → xem errors

4. **Test với prompt đơn giản:**
   ```
   Create a simple test with white text on black background
   ```

5. **Kiểm tra API:**
   ```bash
   node tests/api/test-connections.js
   ```

## 📞 Nếu vẫn không được

1. Chụp màn hình Console logs
2. Chụp màn hình Network tab
3. Kiểm tra browser version
4. Thử browser khác (Chrome/Firefox/Edge)
5. Report issue với logs
