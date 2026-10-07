# 🔌 Hướng dẫn Test API Connection

## ✅ API đã được kết nối!

Cả 2 API đều đã được cấu hình trong code:

### LLM (9Router)
- **URL**: `https://9router-production-bcf1.up.railway.app/v1`
- **API Key**: `sk-3a3d0c15eaf15d37-y9i1da-9ceeb339`
- **Model**: `openai/gpt-4o-mini`
- **File**: `src/services/llm.ts`

### TTS
- **URL**: `https://tts.delyai.site`
- **API Key**: `WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY`
- **Endpoint**: `/v1/text-to-speech/{voiceId}`
- **File**: `src/services/tts.ts`

## 🧪 Cách Test API

### 1. Chạy dev server
```bash
npm run dev
```

### 2. Mở trang test API
Truy cập: **http://localhost:5173/api-test.html**

### 3. Test từng API

#### Test LLM:
1. Click "Test Models Endpoint" → Kiểm tra kết nối
2. Nhập prompt → Click "Test Generate Script" → Test tạo script

#### Test TTS:
1. Click "Test Voices Endpoint" → Lấy danh sách voices
2. Nhập text → Click "Test TTS Generate" → Tạo giọng nói

### 4. Test nhanh tất cả
Click nút "Chạy tất cả tests" để kiểm tra nhanh cả 4 endpoints

## 🐛 Các lỗi thường gặp

### 1. CORS Error
```
Access to fetch at '...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Nguyên nhân**: Browser chặn request cross-origin

**Giải pháp**:
- API server cần cho phép CORS từ `http://localhost:5173`
- Hoặc dùng proxy server

### 2. API Key Invalid
```
HTTP 401: Unauthorized
```

**Nguyên nhân**: API key không hợp lệ hoặc hết hạn

**Giải pháp**:
- Kiểm tra API key trong code
- Liên hệ admin để lấy key mới

### 3. Network Error
```
Failed to fetch
```

**Nguyên nhân**: 
- Không có internet
- API server offline
- Firewall chặn

**Giải pháp**:
- Kiểm tra kết nối internet
- Ping API server: `ping 9router-production-bcf1.up.railway.app`
- Kiểm tra firewall

### 4. Model Not Found
```
HTTP 404: Model not found
```

**Nguyên nhân**: Model `openai/gpt-4o-mini` không tồn tại

**Giải pháp**:
- Kiểm tra danh sách models từ "Test Models Endpoint"
- Đổi model trong `src/services/llm.ts`

## 🔍 Debug từ Console

Mở DevTools (F12) → Console tab và kiểm tra:

### Khi gọi LLM:
```javascript
// Test trực tiếp từ Console
fetch('https://9router-production-bcf1.up.railway.app/v1/models', {
  headers: {
    'Authorization': 'Bearer sk-3a3d0c15eaf15d37-y9i1da-9ceeb339'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Khi gọi TTS:
```javascript
// Test trực tiếp từ Console
fetch('https://tts.delyai.site/v1/voices', {
  headers: {
    'x-api-key': 'WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 📊 Kết quả test

### ✅ Nếu tất cả PASS:
- API hoạt động bình thường
- Ứng dụng sẽ tạo video được
- Vào trang chính và test tạo video

### ❌ Nếu có FAIL:
- Xem chi tiết lỗi trong kết quả test
- Kiểm tra các nguyên nhân phía trên
- Thử test từ Console để biết thêm chi tiết

## 🎯 Next Steps

1. **Test API** → Mở `http://localhost:5173/api-test.html`
2. **Nếu PASS** → Vào trang chính và tạo video
3. **Nếu FAIL** → Xem lỗi và fix theo hướng dẫn
4. **Nếu vẫn không được** → Kiểm tra Console logs và report issue

## 📞 Support

Nếu gặp vấn đề:
1. Chụp màn hình kết quả test API
2. Chụp màn hình Console logs
3. Ghi lại lỗi cụ thể
4. Report issue với đầy đủ thông tin
