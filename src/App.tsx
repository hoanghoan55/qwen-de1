import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Film, Wand2, Play, Pause, RotateCcw, SkipForward, SkipBack, 
  Download, Settings, ChevronDown, ChevronUp, ArrowUp, 
  Loader2, Check, AlertCircle, Type, Layers, Clock, Palette,
  Volume2, Music, Sparkles, BarChart3, MessageCircle, Hash, Disc,
  X
} from 'lucide-react';
import type { Scene, AgentState } from './types';
import { generateScript } from './services/llm';
import { generateSceneTTS, getVoices } from './services/tts';
import { SFXGenerator, MusicGenerator } from './services/audio';
import { exportVideo, downloadBlob } from './services/exporter';
import { MotionRenderer } from './services/renderer';

// Example prompts with icons and colors (like Remotion)
const examplePrompts = [
  { id: '1', icon: Type, headline: 'Kinetic Typography', prompt: 'Create kinetic typography animation with words fading in one by one, modern sans-serif font on dark background', color: '#0B84F3' },
  { id: '2', icon: BarChart3, headline: 'Data Visualization', prompt: 'Animated bar chart showing growth data with smooth transitions between values, clean modern style', color: '#10B981' },
  { id: '3', icon: MessageCircle, headline: 'Chat UI', prompt: 'Chat message UI animation with bubbles appearing one by one, iMessage style with typing indicator', color: '#8B5CF6' },
  { id: '4', icon: Hash, headline: 'Social Media', prompt: 'Social media story format animation with bold text, vibrant colors, and dynamic transitions', color: '#F59E0B' },
  { id: '5', icon: Disc, headline: 'Logo Animation', prompt: 'Logo reveal animation with particles assembling into shape, then text appearing with glow effect', color: '#EF4444' },
];

type AppView = 'landing' | 'workspace';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    progress: 0,
    message: '',
    scenes: [],
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSceneEditor, setShowSceneEditor] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MotionRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const sfxGenerator = useRef(new SFXGenerator());
  const musicGenerator = useRef(new MusicGenerator());

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const isLoading = agentState.status === 'generating_script' || agentState.status === 'generating_tts' || agentState.status === 'rendering';

  // Initialize renderer when canvas is available (workspace view)
  useEffect(() => {
    if (view === 'workspace' && canvasRef.current) {
      // Always create new renderer when entering workspace
      console.log('[MotionGraphics] Initializing renderer...');
      rendererRef.current = new MotionRenderer(canvasRef.current);
      
      // Render initial scene if scenes already exist
      if (scenes.length > 0) {
        console.log('[MotionGraphics] Rendering initial scene...');
        setTimeout(() => {
          if (rendererRef.current && scenes[currentSceneIndex]) {
            rendererRef.current.renderStaticScene(scenes[currentSceneIndex], 0.5);
          }
        }, 50);
      }
    }
    // Reset renderer when going back to landing
    if (view === 'landing') {
      rendererRef.current = null;
    }
  }, [view, scenes, currentSceneIndex]);

  // Render current scene when not playing
  useEffect(() => {
    if (view === 'workspace' && scenes.length > 0 && rendererRef.current && !isPlaying) {
      console.log('[MotionGraphics] Rendering scene', currentSceneIndex);
      // Small delay to ensure canvas is ready
      const timer = setTimeout(() => {
        if (rendererRef.current) {
          rendererRef.current.renderStaticScene(scenes[currentSceneIndex], 0.5);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, scenes, currentSceneIndex, isPlaying]);

  const handleGenerate = useCallback(async (inputPrompt: string) => {
    setAgentState({
      status: 'generating_script',
      progress: 0,
      message: 'Connecting to AI...',
      scenes: [],
    });

    try {
      // Step 1: Generate script
      setAgentState(prev => ({ ...prev, progress: 10, message: 'Generating script...' }));
      const generatedScenes = await generateScript(inputPrompt, (msg) => {
        setAgentState(prev => ({ ...prev, message: msg, progress: 20 }));
      });

      console.log('[MotionGraphics] Generated scenes:', generatedScenes.length);
      setScenes(generatedScenes);
      setCurrentSceneIndex(0);
      setView('workspace');

      setAgentState({
        status: 'generating_tts',
        progress: 30,
        message: 'Generating voiceover...',
        scenes: generatedScenes,
      });

      // Step 2: Generate TTS
      try {
        const voices = await getVoices();
        const voiceId = voices.length > 0 ? voices[0].voice_id : 'default';
        
        await generateSceneTTS(
          generatedScenes.map(s => ({ id: s.id, narration: s.narration })),
          voiceId,
          'vi',
          (msg, progress) => {
            setAgentState(prev => ({ ...prev, message: msg, progress: 30 + progress * 0.4 }));
          }
        );

        setAgentState(prev => ({ ...prev, progress: 70, message: 'Generating sound effects...' }));

        // Step 3: Generate SFX
        for (const scene of generatedScenes) {
          if (scene.sfx && scene.sfx !== 'none') {
            await sfxGenerator.current.playSFX(scene.sfx);
          }
        }

        // Step 4: Generate music
        const duration = generatedScenes.reduce((sum, s) => sum + s.duration, 0);
        await musicGenerator.current.generateMusic(duration, 'ambient');

        setAgentState({
          status: 'complete',
          progress: 100,
          message: 'Complete! Your video is ready.',
          scenes: generatedScenes,
        });
      } catch (ttsError) {
        console.warn('TTS generation failed:', ttsError);
        setAgentState({
          status: 'complete',
          progress: 100,
          message: 'Complete! (Demo mode)',
          scenes: generatedScenes,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      setAgentState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        scenes: [],
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    handleGenerate(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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

      let accDuration = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (elapsed < accDuration + scenes[i].duration) {
          setCurrentSceneIndex(i);
          const sceneProgress = (elapsed - accDuration) / scenes[i].duration;
          rendererRef.current?.renderScene(scenes[i], sceneProgress);
          break;
        }
        accDuration += scenes[i].duration;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [scenes, totalDuration]);

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
    setCurrentSceneIndex(0);
    if (scenes.length > 0) {
      rendererRef.current?.renderStaticScene(scenes[0], 0);
    }
  };

  const skipForward = () => {
    const nextIndex = Math.min(currentSceneIndex + 1, scenes.length - 1);
    setCurrentSceneIndex(nextIndex);
    let accDuration = 0;
    for (let i = 0; i < nextIndex; i++) accDuration += scenes[i].duration;
    pausedAtRef.current = accDuration;
    setCurrentTime(accDuration);
    if (!isPlaying) rendererRef.current?.renderStaticScene(scenes[nextIndex], 0);
  };

  const skipBack = () => {
    const prevIndex = Math.max(currentSceneIndex - 1, 0);
    setCurrentSceneIndex(prevIndex);
    let accDuration = 0;
    for (let i = 0; i < prevIndex; i++) accDuration += scenes[i].duration;
    pausedAtRef.current = accDuration;
    setCurrentTime(accDuration);
    if (!isPlaying) rendererRef.current?.renderStaticScene(scenes[prevIndex], 0);
  };

  const handleExport = async () => {
    if (!canvasRef.current || scenes.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1280;
      exportCanvas.height = 720;
      
      const blob = await exportVideo(scenes, exportCanvas, (progress) => {
        setExportProgress(progress);
      });

      downloadBlob(blob, `motion-graphics-${Date.now()}.webm`);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSceneUpdate = (updatedScene: Scene) => {
    const newScenes = [...scenes];
    newScenes[currentSceneIndex] = updatedScene;
    setScenes(newScenes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'workspace' || scenes.length === 0) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'ArrowRight':
          skipForward();
          break;
        case 'ArrowLeft':
          skipBack();
          break;
        case 'r':
          restart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, scenes, isPlaying, play, pause, skipForward, skipBack, restart]);

  // ===================== LANDING VIEW =====================
  if (view === 'landing') {
    return (
      <div className="h-screen w-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 h-12 border-b border-border flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="text-sm font-medium text-foreground">Motion Graphics</span>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            What do you want to create?
          </h1>

          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="bg-background-elevated rounded-xl border border-border p-4">
              {/* Error display */}
              {agentState.status === 'error' && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{agentState.message}</span>
                  <button 
                    type="button" 
                    onClick={() => setAgentState(prev => ({ ...prev, status: 'idle' }))}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your animation..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground-dim focus:outline-none resize-none text-base min-h-[60px] max-h-[200px]"
                disabled={isLoading}
                rows={2}
              />

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground-dim">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Powered by 9Router AI</span>
                </div>

                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Example prompts */}
            <div className="flex flex-wrap items-center justify-center mt-6 gap-2">
              <span className="text-muted-foreground-dim text-xs mr-1">
                Examples
              </span>
              {examplePrompts.map((example) => {
                const Icon = example.icon;
                return (
                  <button
                    key={example.id}
                    type="button"
                    onClick={() => setPrompt(example.prompt)}
                    style={{
                      borderColor: `${example.color}40`,
                      color: example.color,
                    }}
                    className="rounded-full bg-background-elevated border hover:brightness-125 transition-all flex items-center gap-1 px-2 py-1 text-xs"
                    disabled={isLoading}
                  >
                    <Icon className="w-3 h-3" />
                    {example.headline}
                  </button>
                );
              })}
            </div>
          </form>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 bg-background-elevated border border-border rounded-full">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-foreground">{agentState.message}</span>
              </div>
              <div className="w-64 h-1.5 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${agentState.progress}%` }}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 h-10 border-t border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground-dim">
            AI-Powered Motion Graphics • TTS • SFX • Music
          </span>
        </footer>
      </div>
    );
  }

  // ===================== WORKSPACE VIEW =====================
  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="text-sm font-medium text-foreground">Motion Graphics</span>
          </button>
          
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1 bg-background-elevated border border-border rounded-full">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">{agentState.message}</span>
            </div>
          )}
          {agentState.status === 'complete' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Ready</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSceneEditor(!showSceneEditor)}
            disabled={scenes.length === 0}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-background-elevated transition-all disabled:opacity-30 flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={handleExport}
            disabled={scenes.length === 0 || isExporting}
            className="px-3 py-1.5 text-xs text-foreground bg-foreground/10 hover:bg-foreground/20 border border-border rounded-lg transition-all disabled:opacity-30 flex items-center gap-1.5"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {Math.round(exportProgress)}%
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Export
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Scene List */}
        <div className="w-56 flex-shrink-0 border-r border-border overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Scenes</span>
              <span className="text-xs text-muted-foreground-dim">{scenes.length}</span>
            </div>
            <div className="space-y-1.5">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setCurrentSceneIndex(index);
                    if (!isPlaying) rendererRef.current?.renderStaticScene(scene, 0.5);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    index === currentSceneIndex
                      ? 'bg-background-elevated border-border'
                      : 'border-transparent hover:bg-background-elevated/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-medium ${
                      index === currentSceneIndex ? 'bg-foreground text-background' : 'bg-accent text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground-dim">{scene.duration}s</span>
                  </div>
                  <p className="text-xs text-foreground truncate">{scene.text}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div
                      className="w-3 h-3 rounded border border-border"
                      style={{ backgroundColor: scene.backgroundColor }}
                    />
                    <div
                      className="w-3 h-3 rounded border border-border"
                      style={{ backgroundColor: scene.textColor }}
                    />
                    <span className="text-[10px] text-muted-foreground-dim ml-auto">{scene.animation}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-background-elevated rounded-xl border border-border overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              
              {/* Play overlay */}
              {!isPlaying && scenes.length > 0 && (
                <button
                  onClick={play}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-14 h-14 bg-foreground/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-background ml-0.5" />
                  </div>
                </button>
              )}

              {/* Scene indicator */}
              {scenes.length > 0 && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-foreground">
                  {currentSceneIndex + 1} / {scenes.length}
                </div>
              )}
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="flex-shrink-0 border-t border-border p-4">
            {/* Progress bar */}
            <div className="relative h-1.5 bg-border rounded-full overflow-hidden mb-3 cursor-pointer group">
              <div 
                className="absolute left-0 top-0 h-full bg-foreground rounded-full transition-all duration-100"
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
                    className="absolute top-0 h-full w-px bg-background"
                    style={{ left: `${pos}%` }}
                  />
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">{formatTime(currentTime)}</span>
              
              <div className="flex items-center gap-1">
                <button onClick={skipBack} disabled={scenes.length === 0} className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={isPlaying ? pause : play}
                  disabled={scenes.length === 0}
                  className="p-2.5 bg-foreground text-background rounded-full hover:bg-gray-200 disabled:opacity-30 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={skipForward} disabled={scenes.length === 0} className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                  <SkipForward className="w-4 h-4" />
                </button>
                <button onClick={restart} disabled={scenes.length === 0} className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-muted-foreground font-mono">{formatTime(totalDuration)}</span>
            </div>
          </div>
        </div>

        {/* Right - Scene Editor */}
        {showSceneEditor && scenes.length > 0 && (
          <div className="w-72 flex-shrink-0 border-l border-border overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Scene {currentSceneIndex + 1}</span>
                <button onClick={() => setShowSceneEditor(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Text */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Type className="w-3 h-3" />
                  Text
                </label>
                <input
                  type="text"
                  value={scenes[currentSceneIndex].text}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], text: e.target.value })}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Narration */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Layers className="w-3 h-3" />
                  Narration
                </label>
                <textarea
                  value={scenes[currentSceneIndex].narration}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], narration: e.target.value })}
                  rows={2}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Clock className="w-3 h-3" />
                  Duration: {scenes[currentSceneIndex].duration}s
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={scenes[currentSceneIndex].duration}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], duration: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Palette className="w-3 h-3" />
                  Colors
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-muted-foreground-dim block mb-1">Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={scenes[currentSceneIndex].backgroundColor}
                        onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer"
                      />
                      <span className="text-[10px] text-muted-foreground-dim font-mono">{scenes[currentSceneIndex].backgroundColor}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-muted-foreground-dim block mb-1">Text</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={scenes[currentSceneIndex].textColor}
                        onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], textColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer"
                      />
                      <span className="text-[10px] text-muted-foreground-dim font-mono">{scenes[currentSceneIndex].textColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Font Size: {scenes[currentSceneIndex].fontSize}px</label>
                <input
                  type="range"
                  min="24"
                  max="72"
                  value={scenes[currentSceneIndex].fontSize}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Animation */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Animation</label>
                <select
                  value={scenes[currentSceneIndex].animation}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], animation: e.target.value as any })}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  {['fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'scaleOut', 'rotate', 'bounce', 'typewriter', 'glow', 'pulse', 'shake', 'flip', 'zoomIn', 'zoomOut'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* SFX */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Volume2 className="w-3 h-3" />
                  Sound Effect
                </label>
                <select
                  value={scenes[currentSceneIndex].sfx || 'none'}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], sfx: e.target.value as any })}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  {['none', 'whoosh', 'pop', 'click', 'ding', 'swoosh', 'impact', 'sparkle'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Transition */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Transition</label>
                <select
                  value={scenes[currentSceneIndex].transition}
                  onChange={(e) => handleSceneUpdate({ ...scenes[currentSceneIndex], transition: e.target.value as any })}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  {['none', 'fade', 'slide', 'wipe', 'dissolve'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
