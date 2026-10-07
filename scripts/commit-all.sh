#!/bin/bash

# Script để commit tất cả code vào nhánh main

echo "🚀 Commit tất cả code vào nhánh main"
echo "===================================="
echo ""

# Kiểm tra git
if [ ! -d ".git" ]; then
    echo "❌ Không tìm thấy thư mục .git"
    echo "💡 Khởi tạo git repository trước:"
    echo "   git init"
    echo "   git remote add origin <your-repo-url>"
    exit 1
fi

# Kiểm tra nhánh hiện tại
current_branch=$(git branch --show-current)
echo "📍 Nhánh hiện tại: $current_branch"

# Nếu không phải main, chuyển sang main
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Đang ở nhánh $current_branch, chuyển sang main..."
    
    # Kiểm tra có thay đổi chưa commit không
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "⚠️  Có thay đổi chưa commit, commit trước khi chuyển nhánh..."
        git add .
        git commit -m "temp: save changes before switching to main"
    fi
    
    # Chuyển sang main hoặc tạo mới
    if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
    else
        git checkout -b main
    fi
    
    echo "✅ Đã chuyển sang nhánh main"
fi

# Thêm tất cả files
echo ""
echo "📦 Thêm tất cả files vào staging..."
git add .

# Hiển thị danh sách files sẽ commit
echo ""
echo "📋 Files sẽ commit:"
git diff --cached --name-status | awk '{print "  " $1 " " $2}'

# Đếm số lượng files
file_count=$(git diff --cached --name-only | wc -l)
echo ""
echo "📊 Tổng số files: $file_count"

# Tạo commit message
commit_msg="feat: Motion Graphics Agent - Complete Implementation

✨ Features:
- AI-powered motion graphics generation with 9Router LLM
- Text-to-Speech integration with TTS Studio API
- Sound effects generation (Web Audio API)
- Background music generation
- 17 animation types (fadeIn, slideUp, scaleIn, bounce, etc.)
- Real-time canvas preview with playback controls
- Scene editor with full customization
- Video export to WebM format
- Keyboard shortcuts (Space, Arrow keys, R)
- Responsive design with dark theme

🎨 UI/UX:
- Professional Remotion-inspired design
- Clean, minimal interface
- Landing page with example prompts
- Workspace with scene list, preview, and editor
- Smooth animations and transitions

🔧 Technical:
- React 18 + TypeScript + Vite
- Tailwind CSS 4
- Canvas API for rendering
- OpenAI SDK for LLM integration
- Web Audio API for SFX/Music
- MediaRecorder API for video export

📚 Documentation:
- README.md - Installation & usage guide
- USAGE.md - Detailed usage instructions
- TESTING.md - Testing guide
- LOCAL_TESTING.md - Local testing instructions
- API_TEST_GUIDE.md - API connection testing
- DEBUG_PREVIEW.md - Preview debugging guide
- QUICKSTART.md - Quick start guide

🧪 Testing:
- API connection tests
- Unit tests for services
- E2E tests with Playwright
- Manual testing checklist

🔌 API Integration:
- 9Router LLM: https://9router-production-bcf1.up.railway.app/v1
- TTS Studio: https://tts.delyai.site

📁 Project Structure:
- src/ - Source code (App, services, types)
- public/ - Test pages (api-test.html, canvas-test.html)
- tests/ - Test files (api, unit, e2e)
- scripts/ - Utility scripts (test.sh, verify.js)

Ready for production use!"

# Commit
echo ""
echo "💾 Committing..."
git commit -m "$commit_msg"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit thành công!"
    echo ""
    echo "📊 Commit info:"
    git log -1 --pretty=format:"  Hash: %h%n  Author: %an%n  Date: %ad%n  Message: %s" --date=short
    echo ""
    echo ""
    
    # Hỏi có push không
    read -p "🚀 Push lên remote? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "📤 Pushing to remote..."
        git push -u origin main
        if [ $? -eq 0 ]; then
            echo "✅ Push thành công!"
        else
            echo "❌ Push thất bại. Kiểm tra remote configuration."
        fi
    else
        echo ""
        echo "💡 Để push sau, chạy:"
        echo "   git push -u origin main"
    fi
else
    echo ""
    echo "❌ Commit thất bại!"
    exit 1
fi

echo ""
echo "🎉 Hoàn tất!"
