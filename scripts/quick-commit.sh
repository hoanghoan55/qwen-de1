#!/bin/bash

# Quick commit script - Commit tất cả code vào nhánh main

echo "🚀 Quick Commit to Main"
echo "======================="
echo ""

# Kiểm tra git
if [ ! -d ".git" ]; then
    echo "❌ Không tìm thấy .git"
    echo ""
    echo "💡 Khởi tạo git:"
    echo "   git init"
    echo "   git config user.name \"Your Name\""
    echo "   git config user.email \"your.email@example.com\""
    exit 1
fi

# Kiểm tra và chuyển sang main
current_branch=$(git branch --show-current 2>/dev/null)
if [ -z "$current_branch" ]; then
    # Chưa có commit nào
    echo "📝 Tạo commit đầu tiên..."
    git add .
    git commit -m "feat: Motion Graphics Agent - Initial commit

✨ Complete implementation with:
- AI-powered motion graphics (9Router LLM)
- Text-to-Speech (TTS Studio API)
- Sound effects & background music
- 17 animation types
- Real-time canvas preview
- Scene editor
- Video export (WebM)
- Professional Remotion-inspired UI
- Full documentation & tests

🔌 APIs:
- LLM: https://9router-production-bcf1.up.railway.app/v1
- TTS: https://tts.delyai.site"
    
    echo ""
    echo "✅ Commit thành công!"
    echo ""
    echo "📊 Commit info:"
    git log -1 --pretty=format:"  Hash: %h%n  Date: %ad%n  Message: %s" --date=short
    echo ""
    echo ""
    echo "💡 Next steps:"
    echo "   1. Tạo repository trên GitHub"
    echo "   2. git remote add origin <your-repo-url>"
    echo "   3. git push -u origin main"
    exit 0
fi

echo "📍 Nhánh hiện tại: $current_branch"

# Nếu không phải main, tạo hoặc chuyển sang main
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Chuyển sang nhánh main..."
    
    # Commit thay đổi hiện tại nếu có
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "💾 Commit thay đổi hiện tại..."
        git add .
        git commit -m "chore: save changes before switching to main"
    fi
    
    # Tạo hoặc checkout main
    if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
    else
        git checkout -b main
    fi
fi

# Thêm tất cả files
echo ""
echo "📦 Adding all files..."
git add .

# Hiển thị summary
file_count=$(git diff --cached --name-only | wc -l | tr -d ' ')
echo "✅ Added $file_count files"

# Commit
echo ""
echo "💾 Committing..."
git commit -m "feat: Motion Graphics Agent - Complete Implementation

✨ Features:
- AI-powered motion graphics generation (9Router LLM)
- Text-to-Speech integration (TTS Studio API)
- Sound effects & background music (Web Audio API)
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

🔧 Technical Stack:
- React 18 + TypeScript + Vite
- Tailwind CSS 4
- Canvas API for rendering
- OpenAI SDK for LLM integration
- Web Audio API for SFX/Music
- MediaRecorder API for video export

📚 Documentation:
- README.md - Installation & usage
- USAGE.md - Detailed instructions
- TESTING.md - Testing guide
- LOCAL_TESTING.md - Local testing
- API_TEST_GUIDE.md - API testing
- DEBUG_PREVIEW.md - Debug guide
- QUICKSTART.md - Quick start
- COMMIT_GUIDE.md - This guide

🧪 Testing:
- API connection tests (tests/api/)
- Unit tests (tests/unit/)
- E2E tests with Playwright (tests/e2e/)
- Test pages (public/api-test.html, canvas-test.html)

🔌 API Integration:
- 9Router LLM: https://9router-production-bcf1.up.railway.app/v1
- TTS Studio: https://tts.delyai.site

📁 Project Structure:
- src/ - Source code (App, services, types)
- public/ - Test pages
- tests/ - Test files
- scripts/ - Utility scripts

Ready for production! 🎉"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit thành công!"
    echo ""
    echo "📊 Commit info:"
    git log -1 --pretty=format:"  Hash: %h%n  Author: %an%n  Date: %ad%n  Message: %s" --date=short
    echo ""
    echo ""
    
    # Kiểm tra remote
    if git remote | grep -q "origin"; then
        echo "🚀 Push lên remote?"
        read -p "   (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "📤 Pushing..."
            git push -u origin main
            if [ $? -eq 0 ]; then
                echo "✅ Push thành công!"
            else
                echo "❌ Push thất bại"
            fi
        fi
    else
        echo "💡 Chưa có remote. Để push lên GitHub:"
        echo "   1. Tạo repository trên https://github.com/new"
        echo "   2. git remote add origin <your-repo-url>"
        echo "   3. git push -u origin main"
    fi
else
    echo ""
    echo "❌ Commit thất bại!"
    echo ""
    echo "💡 Kiểm tra:"
    echo "   git status"
    echo "   git diff --cached"
    exit 1
fi

echo ""
echo "🎉 Hoàn tất!"
