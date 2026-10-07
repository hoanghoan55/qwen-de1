import { useState } from 'react';
import { Edit3, Palette, Clock, Type, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import type { Scene } from '../types';

interface SceneEditorProps {
  scene: Scene | null;
  sceneIndex: number;
  onUpdate: (scene: Scene) => void;
}

export default function SceneEditor({ scene, sceneIndex, onUpdate }: SceneEditorProps) {
  const [expanded, setExpanded] = useState(true);

  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chọn scene để chỉnh sửa</p>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof Scene, value: any) => {
    onUpdate({ ...scene, [field]: value });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-3 py-2 border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Scene {sceneIndex + 1}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Text */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
              <Type className="w-3 h-3" />
              Văn bản
            </label>
            <input
              type="text"
              value={scene.text}
              onChange={(e) => updateField('text', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Narration */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
              <Layers className="w-3 h-3" />
              Lời đọc (TTS)
            </label>
            <textarea
              value={scene.narration}
              onChange={(e) => updateField('narration', e.target.value)}
              rows={2}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
              <Clock className="w-3 h-3" />
              Thời lượng (giây)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={scene.duration}
              onChange={(e) => updateField('duration', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <span className="text-xs text-gray-400">{scene.duration}s</span>
          </div>

          {/* Colors */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
              <Palette className="w-3 h-3" />
              Màu sắc
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Nền</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={scene.backgroundColor}
                    onChange={(e) => updateField('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-700 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono">{scene.backgroundColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Chữ</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={scene.textColor}
                    onChange={(e) => updateField('textColor', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-700 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono">{scene.textColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Cỡ chữ: {scene.fontSize}px</label>
            <input
              type="range"
              min="24"
              max="72"
              value={scene.fontSize}
              onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Animation */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Animation</label>
            <select
              value={scene.animation}
              onChange={(e) => updateField('animation', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {['fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'scaleOut', 'rotate', 'bounce', 'typewriter', 'glow', 'pulse', 'shake', 'flip', 'zoomIn', 'zoomOut'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* SFX */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Hiệu ứng âm thanh</label>
            <select
              value={scene.sfx || 'none'}
              onChange={(e) => updateField('sfx', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {['none', 'whoosh', 'pop', 'click', 'ding', 'swoosh', 'impact', 'sparkle'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Transition */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Chuyển cảnh</label>
            <select
              value={scene.transition}
              onChange={(e) => updateField('transition', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {['none', 'fade', 'slide', 'wipe', 'dissolve'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
