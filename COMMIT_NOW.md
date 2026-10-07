# 🚀 Hướng dẫn Commit Code - Đơn giản nhất

## Cách nhanh nhất (3 bước)

### 1️⃣ Mở terminal và chạy:
```bash
# Cấp quyền thực thi
chmod +x scripts/quick-commit.sh

# Chạy script
./scripts/quick-commit.sh
```

### 2️⃣ Làm theo hướng dẫn:
- Script sẽ tự động thêm tất cả files
- Tạo commit với message chi tiết
- Hỏi có push lên GitHub không

### 3️⃣ Xong! ✅

---

## Nếu muốn làm thủ công

### Bước 1: Khởi tạo Git (nếu chưa có)
```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Bước 2: Thêm tất cả files
```bash
git add .
```

### Bước 3: Commit
```bash
git commit -m "feat: Motion Graphics Agent - Complete Implementation"
```

### Bước 4: Push lên GitHub (nếu có)
```bash
# Tạo repository trên GitHub trước, rồi:
git remote add origin https://github.com/yourusername/motion-graphics-agent.git
git branch -M main
git push -u origin main
```

---

## Kiểm tra kết quả

```bash
# Xem commit
git log --oneline

# Xem status
git status

# Xem files
git ls-files
```

---

## ❓ Gặp lỗi?

### Lỗi: "Please tell me who you are"
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin <new-url>
```

### Lỗi: "Updates were rejected"
```bash
git pull origin main --rebase
git push -u origin main
```

---

## 📚 Tài liệu chi tiết

Xem `COMMIT_GUIDE.md` để biết thêm chi tiết.

---

**Chúc bạn thành công! 🎉**
