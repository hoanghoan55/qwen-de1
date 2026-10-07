import { Download, Share2, Settings, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Scene } from '../types';

interface ExportPanelProps {
  scenes: Scene[];
  isExporting: boolean;
  exportProgress: number;
  onExport: (format: 'webm' | 'gif') => void;
}

export default function ExportPanel({ scenes, isExporting, exportProgress, onExport }: ExportPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [resolution, setResolution] = useState('1280x720');
  const [fps, setFps] = useState(30);

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  if (scenes.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Export button */}
      <button
        onClick={() => onExport('webm')}
        disabled={isExporting || scenes.length === 0}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang xuất video... {Math.round(exportProgress)}%</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Xuất Video (WebM)</span>
          </>
        )}
      </button>

      {/* Progress bar */}
      {isExporting && (
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
      )}

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full py-2 px-4 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Settings className="w-4 h-4" />
        <span>Cài đặt xuất video</span>
      </button>

      {/* Settings panel */}
      {showSettings && (
        <div className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Độ phân giải</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="1920x1080">1920×1080 (Full HD)</option>
              <option value="1280x720">1280×720 (HD)</option>
              <option value="854x480">854×480 (SD)</option>
              <option value="640x360">640×360</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">FPS</label>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value={24}>24 fps</option>
              <option value={30}>30 fps</option>
              <option value={60}>60 fps</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            <p>📐 Kích thước: {resolution.replace('x', ' × ')} px</p>
            <p>⏱️ Thời lượng: ~{totalDuration.toFixed(1)}s</p>
            <p>📦 Kích thước ước tính: ~{(totalDuration * fps * 0.01).toFixed(1)} MB</p>
          </div>
        </div>
      )}

      {/* Share button */}
      <button
        className="w-full py-2 px-4 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Motion Graphics Video',
              text: 'Xem video motion graphics tôi vừa tạo!',
            });
          }
        }}
      >
        <Share2 className="w-4 h-4" />
        <span>Chia sẻ</span>
      </button>
    </div>
  );
}
