import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import type { Scene } from '../types';
import { MotionRenderer } from '../services/renderer';

interface PreviewProps {
  scenes: Scene[];
  currentSceneIndex: number;
  onSceneChange: (index: number) => void;
}

export default function Preview({ scenes, currentSceneIndex, onSceneChange }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MotionRenderer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  useEffect(() => {
    if (canvasRef.current) {
      rendererRef.current = new MotionRenderer(canvasRef.current);
      rendererRef.current.setCallbacks(
        (index) => onSceneChange(index),
        () => setIsPlaying(false)
      );
    }
  }, []);

  useEffect(() => {
    const total = scenes.reduce((sum, s) => sum + s.duration, 0);
    setTotalDuration(total);
  }, [scenes]);

  useEffect(() => {
    if (scenes.length > 0 && canvasRef.current && !isPlaying) {
      rendererRef.current?.renderStaticScene(scenes[currentSceneIndex], 0.5);
    }
  }, [scenes, currentSceneIndex, isPlaying]);

  const play = useCallback(() => {
    if (scenes.length === 0) return;
    setIsPlaying(true);
    startTimeRef.current = performance.now() - pausedAtRef.current * 1000;
    
    const animate = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);
      pausedAtRef.current = elapsed;

      if (elapsed >= totalDuration) {
        setIsPlaying(false);
        pausedAtRef.current = 0;
        setCurrentTime(0);
        return;
      }

      // Find current scene
      let accDuration = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (elapsed < accDuration + scenes[i].duration) {
          if (i !== currentSceneIndex) {
            onSceneChange(i);
          }
          const sceneProgress = (elapsed - accDuration) / scenes[i].duration;
          rendererRef.current?.renderScene(scenes[i], sceneProgress);
          break;
        }
        accDuration += scenes[i].duration;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [scenes, totalDuration, currentSceneIndex, onSceneChange]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const restart = () => {
    pause();
    pausedAtRef.current = 0;
    setCurrentTime(0);
    onSceneChange(0);
    if (scenes.length > 0) {
      rendererRef.current?.renderStaticScene(scenes[0], 0);
    }
  };

  const skipForward = () => {
    const nextIndex = Math.min(currentSceneIndex + 1, scenes.length - 1);
    onSceneChange(nextIndex);
    let accDuration = 0;
    for (let i = 0; i < nextIndex; i++) {
      accDuration += scenes[i].duration;
    }
    pausedAtRef.current = accDuration;
    setCurrentTime(accDuration);
    if (!isPlaying) {
      rendererRef.current?.renderStaticScene(scenes[nextIndex], 0);
    }
  };

  const skipBack = () => {
    const prevIndex = Math.max(currentSceneIndex - 1, 0);
    onSceneChange(prevIndex);
    let accDuration = 0;
    for (let i = 0; i < prevIndex; i++) {
      accDuration += scenes[i].duration;
    }
    pausedAtRef.current = accDuration;
    setCurrentTime(accDuration);
    if (!isPlaying) {
      rendererRef.current?.renderStaticScene(scenes[prevIndex], 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Welcome screen when no scenes
  if (scenes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl overflow-hidden border border-gray-800">
        <div className="text-center p-8 max-w-md">
          <div className="relative mb-6">
            <div className="text-8xl animate-float">🎬</div>
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">✨</div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Motion Graphics Agent
          </h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Tạo video motion graphics chuyên nghiệp với AI. 
            Nhập mô tả và để agent tạo kịch bản, animation, giọng nói và hiệu ứng âm thanh cho bạn.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xs text-gray-400">AI Script</div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-xs text-gray-400">Animation</div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-xs text-gray-400">Audio</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Preview */}
      <div className="flex-1 flex items-center justify-center bg-black/30 rounded-xl overflow-hidden border border-gray-800 relative group">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="max-w-full max-h-full object-contain"
          style={{ aspectRatio: '16/9' }}
        />
        
        {/* Overlay play button */}
        {!isPlaying && (
          <button
            onClick={play}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </button>
        )}

        {/* Scene indicator */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
          Scene {currentSceneIndex + 1}/{scenes.length}
        </div>

        {/* Mute button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white/70 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Controls */}
      <div className="mt-3 space-y-2">
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer group">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100"
            style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
          />
          {/* Scene markers */}
          {scenes.map((_, i) => {
            let accDuration = 0;
            for (let j = 0; j < i; j++) accDuration += scenes[j].duration;
            const pos = (accDuration / totalDuration) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 h-full w-0.5 bg-white/20"
                style={{ left: `${pos}%` }}
              />
            );
          })}
          {/* Playhead */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-gray-500">
            {scenes[currentSceneIndex]?.text?.slice(0, 30)}...
          </span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={skipBack}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            title="Scene trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={restart}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            title="Từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={skipForward}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            title="Scene tiếp"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
