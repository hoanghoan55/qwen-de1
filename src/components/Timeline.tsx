import { Film, Type, Music, Volume2 } from 'lucide-react';
import type { Scene } from '../types';

interface TimelineProps {
  scenes: Scene[];
  currentSceneIndex: number;
  onSceneSelect: (index: number) => void;
}

export default function Timeline({ scenes, currentSceneIndex, onSceneSelect }: TimelineProps) {
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const getAnimationIcon = (animation: string) => {
    switch (animation) {
      case 'fadeIn': case 'fadeOut': return '✨';
      case 'slideUp': case 'slideDown': return '↕️';
      case 'slideLeft': case 'slideRight': return '↔️';
      case 'scaleIn': case 'scaleOut': return '🔍';
      case 'rotate': return '🔄';
      case 'bounce': return '⚡';
      case 'typewriter': return '⌨️';
      case 'glow': return '💡';
      case 'pulse': return '💓';
      case 'shake': return '📳';
      case 'flip': return '🔃';
      case 'zoomIn': case 'zoomOut': return '🔎';
      default: return '🎬';
    }
  };

  if (scenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Timeline sẽ hiển thị ở đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Timeline header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">Timeline</span>
        </div>
        <span className="text-xs text-gray-400">
          {scenes.length} scenes • {totalDuration.toFixed(1)}s
        </span>
      </div>

      {/* Scene list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => onSceneSelect(index)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              index === currentSceneIndex
                ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-2">
              {/* Scene number */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === currentSceneIndex ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}>
                {index + 1}
              </div>

              {/* Scene info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{getAnimationIcon(scene.animation)}</span>
                  <span className="text-xs text-gray-400">{scene.duration}s</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-400">
                    {scene.animation}
                  </span>
                </div>
                <p className="text-sm text-white truncate">{scene.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  {scene.sfx && scene.sfx !== 'none' && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                      <Volume2 className="w-3 h-3" />
                      {scene.sfx}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-xs text-gray-500">
                    <Type className="w-3 h-3" />
                    {scene.transition}
                  </span>
                </div>
              </div>

              {/* Color preview */}
              <div className="flex-shrink-0 flex gap-1">
                <div
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: scene.backgroundColor }}
                  title="Background"
                />
                <div
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: scene.textColor }}
                  title="Text"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Music track info */}
      <div className="px-3 py-2 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Music className="w-3.5 h-3.5 text-green-400" />
          <span>Nhạc nền: Ambient Generated</span>
        </div>
      </div>
    </div>
  );
}
