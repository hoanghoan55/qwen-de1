export interface Scene {
  id: string;
  duration: number; // seconds
  text: string;
  narration: string;
  animation: AnimationType;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  elements: SceneElement[];
  sfx?: SFXType;
  transition: TransitionType;
}

export interface SceneElement {
  id: string;
  type: 'text' | 'shape' | 'icon' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  animation: AnimationType;
  delay: number;
  color: string;
  opacity: number;
}

export type AnimationType = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'rotate'
  | 'bounce'
  | 'typewriter'
  | 'glow'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'zoomIn'
  | 'zoomOut'
  | 'none';

export type TransitionType = 
  | 'fade'
  | 'slide'
  | 'wipe'
  | 'dissolve'
  | 'none';

export type SFXType = 
  | 'whoosh'
  | 'pop'
  | 'click'
  | 'ding'
  | 'swoosh'
  | 'impact'
  | 'sparkle'
  | 'none';

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  volume: number;
}

export interface ProjectConfig {
  title: string;
  prompt: string;
  scenes: Scene[];
  musicTrack?: MusicTrack;
  voiceId: string;
  language: string;
  resolution: { width: number; height: number };
  fps: number;
}

export interface AgentState {
  status: 'idle' | 'generating_script' | 'generating_tts' | 'rendering' | 'complete' | 'error';
  progress: number;
  message: string;
  scenes: Scene[];
  audioData?: string;
  error?: string;
}
