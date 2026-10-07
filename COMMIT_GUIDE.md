# 🚀 Hướng dẫn Commit Code vào Nhánh Main

## Cách 1: Sử dụng Script Tự động (Khuyến nghị)

### Bước 1: Cấp quyền thực thi
```bash
chmod +x scripts/commit-all.sh
```

### Bước 2: Chạy script
```bash
./scripts/commit-all.sh
```

Script sẽ tự động:
- ✅ Kiểm tra git repository
- ✅ Chuyển sang nhánh main (nếu cần)
- ✅ Thêm tất cả files vào staging
- ✅ Tạo commit với message chi tiết
- ✅ Hỏi có push lên remote không

---

## Cách 2: Manual Commit

### Bước 1: Khởi tạo Git (nếu chưa có)
```bash
git init
```

### Bước 2: Cấu hình user (nếu chưa)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Bước 3: Thêm remote (nếu có repository trên GitHub/GitLab)
```bash
git remote add origin https://github.com/yourusername/motion-graphics-agent.git
```

### Bước 4: Chuyển sang nhánh main
```bash
# Nếu đã có nhánh main
git checkout main

# Nếu chưa có, tạo mới
git checkout -b main
```

### Bước 5: Thêm tất cả files
```bash
git add .
```

### Bước 6: Kiểm tra files đã thêm
```bash
git status
```

### Bước 7: Commit
```bash
git commit -m "feat: Motion Graphics Agent - Complete Implementation

✨ Features:
- AI-powered motion graphics generation with 9Router LLM
- Text-to-Speech integration with TTS Studio API
- Sound effects and background music generation
- 17 animation types with real-time preview
- Scene editor with full customization
- Video export to WebM format
- Keyboard shortcuts and responsive design

🎨 UI/UX:
- Professional Remotion-inspired design
- Clean, minimal interface
- Landing page with example prompts
- Workspace with scene list, preview, and editor

🔧 Technical:
- React 18 + TypeScript + Vite
- Tailwind CSS 4
- Canvas API for rendering
- OpenAI SDK for LLM integration
- Web Audio API for SFX/Music

📚 Documentation:
- README.md, USAGE.md, TESTING.md
- API_TEST_GUIDE.md, DEBUG_PREVIEW.md
- QUICKSTART.md, LOCAL_TESTING.md

🧪 Testing:
- API connection tests
- Unit tests for services
- E2E tests with Playwright

🔌 API Integration:
- 9Router LLM: https://9router-production-bcf1.up.railway.app/v1
- TTS Studio: https://tts.delyai.site"
```

### Bước 8: Push lên remote (nếu có)
```bash
# Push lần đầu (thiết lập upstream)
git push -u origin main

# Các lần sau
git push
```

---

## 📋 Kiểm tra sau khi commit

### Xem commit history
```bash
git log --oneline
```

### Xem chi tiết commit cuối
```bash
git log -1
```

### Xem files trong commit
```bash
git show --name-only
```

### Kiểm tra status
```bash
git status
```

---

## 🔧 Xử lý lỗi thường gặp

### Lỗi: "Please tell me who you are"
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Lỗi: "remote origin already exists"
```bash
# Xóa remote cũ
git remote remove origin

# Thêm lại
git remote add origin <your-repo-url>
```

### Lỗi: "Updates were rejected"
```bash
# Pull trước khi push
git pull origin main --rebase

# Hoặc force push (cẩn thận!)
git push -f origin main
```

### Lỗi: "src refspec main does not match any"
```bash
# Kiểm tra nhánh hiện tại
git branch

# Tạo commit trước khi push
git add .
git commit -m "initial commit"

# Push lại
git push -u origin main
```

---

## 📊 Thống kê repository

### Xem tổng số commits
```bash
git rev-list --count main
```

### Xem kích thước repository
```bash
git count-objects -vH
```

### Xem danh sách files
```bash
git ls-files
```

---

## 🎯 Best Practices

### 1. Commit thường xuyên
- Commit sau mỗi tính năng hoàn chỉnh
- Message rõ ràng, mô tả đầy đủ
- Một commit = một thay đổi logic

### 2. Sử dụng Conventional Commits
```
feat: thêm tính năng mới
fix: sửa lỗi
docs: cập nhật tài liệu
style: format code
refactor: tái cấu trúc
test: thêm test
chore: cập nhật build, dependencies
```

### 3. Viết message chi tiết
```
<type>: <short summary>

<long description>

- Point 1
- Point 2
- Point 3
```

### 4. Review trước khi commit
```bash
# Xem thay đổi
git diff

# Xem files đã staged
git diff --cached

# Xem danh sách files
git status
```

---

## 🚀 Sau khi commit

### 1. Tạo repository trên GitHub
- Vào https://github.com/new
- Tạo repository mới
- Copy URL

### 2. Push code
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Tạo Release (optional)
```bash
# Tạo tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# Push tag
git push origin v1.0.0
```

### 4. Deploy (optional)
- Vercel: Kết nối GitHub repo
- Netlify: Import từ GitHub
- GitHub Pages: Enable trong Settings

---

## 📞 Cần trợ giúp?

### Tài liệu Git
- https://git-scm.com/doc
- https://docs.github.com/en/get-started

### Video hướng dẫn
- Git & GitHub Crash Course
- Git Branching & Merging
- Conventional Commits

### Cộng đồng
- Stack Overflow: git tag
- GitHub Community
- Reddit: r/git

---

## ✅ Checklist

- [ ] Đã chạy `git init` (nếu chưa có)
- [ ] Đã cấu hình user name và email
- [ ] Đã thêm remote (nếu có)
- [ ] Đã chuyển sang nhánh main
- [ ] Đã chạy `git add .`
- [ ] Đã commit với message chi tiết
- [ ] Đã push lên remote (nếu có)
- [ ] Đã kiểm tra `git status` (clean)
- [ ] Đã kiểm tra `git log` (commit exists)

---

**Chúc bạn commit thành công! 🎉**
