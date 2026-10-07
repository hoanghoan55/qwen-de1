import { useState } from 'react';
import { Sparkles, Wand2, Loader2, RefreshCw } from 'lucide-react';

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  status: string;
  hasScenes?: boolean;
}

export default function PromptPanel({ onGenerate, isLoading, status, hasScenes }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const examplePrompts = [
    '🚀 Giới thiệu sản phẩm công nghệ mới',
    '🎓 Khóa học lập trình trực tuyến',
    '💪 Video động lực khởi đầu ngày mới',
    '🌍 Biến đổi khí hậu - Sự thật cần biết',
    '🎮 Trailer game phiêu lưu mới',
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Mô tả video của bạn</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Mô tả video motion graphics bạn muốn tạo...&#10;&#10;Ví dụ: Tạo video giới thiệu về ứng dụng quản lý tài chính cá nhân với phong cách hiện đại, năng động..."
          className="flex-1 min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          disabled={isLoading}
        />

        {/* Example prompts */}
        <div className="mt-3 flex flex-wrap gap-2">
          {examplePrompts.map((example, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(example.slice(2))}
              className="text-xs px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-purple-500/50 transition-all"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{status || 'Đang xử lý...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>{hasScenes ? 'Tạo lại' : 'Tạo Motion Graphics'}</span>
              </>
            )}
          </button>
          {hasScenes && !isLoading && (
            <button
              type="button"
              onClick={() => prompt.trim() && onGenerate(prompt.trim())}
              disabled={!prompt.trim() || isLoading}
              className="py-3 px-4 bg-gray-800 border border-gray-700 hover:border-purple-500/50 hover:bg-gray-700 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2"
              title="Tạo lại với prompt khác"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
