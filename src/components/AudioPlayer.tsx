import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  isPlaying: boolean;
  onEnded?: () => void;
}

export default function AudioPlayer({ audioUrl, isPlaying, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg">
      <Music className="w-3.5 h-3.5 text-green-400" />
      <audio
        ref={audioRef}
        src={audioUrl}
        muted={isMuted}
        onEnded={onEnded}
        className="hidden"
      />
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          setVolume(parseFloat(e.target.value));
          if (parseFloat(e.target.value) > 0) setIsMuted(false);
        }}
        className="flex-1 h-1 accent-green-500"
      />
      <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
    </div>
  );
}
