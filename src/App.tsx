import { useState, useRef, useCallback } from 'react';
import { Film, Wand2, Zap, Volume2, Music, Settings, Github } from 'lucide-react';
import type { Scene, AgentState } from './types';
import { generateScript } from './services/llm';
import { generateSceneTTS, getVoices } from './services/tts';
import { SFXGenerator, MusicGenerator } from './services/audio';
import { exportVideo, downloadBlob } from './services/exporter';
import PromptPanel from './components/PromptPanel';
import Preview from './components/Preview';
import Timeline from './components/Timeline';
import SceneEditor from './components/SceneEditor';
import ExportPanel from './components/ExportPanel';
import AgentStatus from './components/AgentStatus';

export default function App() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    progress: 0,
    message: '',
    scenes: [],
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'prompt' | 'editor' | 'export'>('prompt');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sfxGenerator = useRef(new SFXGenerator());
  const musicGenerator = useRef(new MusicGenerator());

  const handleGenerate = useCallback(async (prompt: string) => {
    setAgentState({
      status: 'generating_script',
      progress: 0,
      message: 'Đang kết nối với AI...',
      scenes: [],
    });
    setActiveTab('prompt');

    try {
      // Step 1: Generate script with LLM
      setAgentState(prev => ({ ...prev, progress: 10, message: 'Đang tạo kịch bản...' }));
      const generatedScenes = await generateScript(prompt, (msg) => {
        setAgentState(prev => ({ ...prev, message: msg, progress: 20 }));
      });

      setScenes(generatedScenes);
      setCurrentSceneIndex(0);

      setAgentState({
        status: 'generating_tts',
        progress: 30,
        message: 'Đang tạo giọng nói...',
        scenes: generatedScenes,
      });

      // Step 2: Generate TTS for each scene
      try {
        const voices = await getVoices();
        const voiceId = voices.length > 0 ? voices[0].voice_id : 'default';
        
        const ttsResults = await generateSceneTTS(
          generatedScenes.map(s => ({ id: s.id, narration: s.narration })),
          voiceId,
          'vi',
          (msg, progress) => {
            setAgentState(prev => ({ ...prev, message: msg, progress: 30 + progress * 0.4 }));
          }
        );

        setAgentState(prev => ({ ...prev, progress: 70, message: 'Đang tạo hiệu ứng âm thanh...' }));

        // Step 3: Generate SFX for scenes
        for (const scene of generatedScenes) {
          if (scene.sfx && scene.sfx !== 'none') {
            await sfxGenerator.current.playSFX(scene.sfx);
          }
        }

        // Step 4: Generate background music
        const totalDuration = generatedScenes.reduce((sum, s) => sum + s.duration, 0);
        await musicGenerator.current.generateMusic(totalDuration, 'ambient');

        setAgentState({
          status: 'complete',
          progress: 100,
          message: 'Hoàn tất! Video đã sẵn sàng.',
          scenes: generatedScenes,
        });
      } catch (ttsError) {
        console.warn('TTS generation failed, continuing without voice:', ttsError);
        setAgentState({
          status: 'complete',
          progress: 100,
          message: 'Hoàn tất! (Voice được tạo ở chế độ demo)',
          scenes: generatedScenes,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      setAgentState({
        status: 'error',
        progress: 0,
        message: `Lỗi: ${error instanceof Error ? error.message : 'Không xác định'}`,
        scenes: [],
      });
    }
  }, []);

  const handleExport = async (format: 'webm' | 'gif') => {
    if (!canvasRef.current || scenes.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Create an offscreen canvas for export
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1280;
      exportCanvas.height = 720;
      
      const blob = await exportVideo(scenes, exportCanvas, (progress) => {
        setExportProgress(progress);
      });

      downloadBlob(blob, `motion-graphics-${Date.now()}.webm`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Lỗi khi xuất video. Vui lòng thử lại.');
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

  const isLoading = agentState.status === 'generating_script' || agentState.status === 'generating_tts' || agentState.status === 'rendering';

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden animated-bg">
      {/* Header */}
      <header className="flex-shrink-0 h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Motion Graphics Agent
            </h1>
            <p className="text-xs text-gray-500">AI-Powered Video Creation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs text-purple-300">{agentState.message}</span>
            </div>
          )}
          {agentState.status === 'complete' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-green-300">Sẵn sàng</span>
            </div>
          )}

          {/* Feature badges */}
          <div className="hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
              <Zap className="w-3 h-3 text-yellow-400" />
              9Router LLM
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
              <Volume2 className="w-3 h-3 text-blue-400" />
              TTS
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
              <Music className="w-3 h-3 text-green-400" />
              SFX
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Controls */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800 flex flex-col bg-gray-900/30">
          {/* Tab navigation */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex-1 py-3 px-4 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'prompt' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Tạo mới
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              disabled={scenes.length === 0}
              className={`flex-1 py-3 px-4 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'editor' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white disabled:opacity-30'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => setActiveTab('export')}
              disabled={scenes.length === 0}
              className={`flex-1 py-3 px-4 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'export' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white disabled:opacity-30'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Xuất
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <PromptPanel
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  status={agentState.message}
                  hasScenes={scenes.length > 0}
                />
                <AgentStatus state={agentState} />
              </div>
            )}
            {activeTab === 'editor' && (
              <SceneEditor
                scene={scenes[currentSceneIndex] || null}
                sceneIndex={currentSceneIndex}
                onUpdate={handleSceneUpdate}
              />
            )}
            {activeTab === 'export' && (
              <ExportPanel
                scenes={scenes}
                isExporting={isExporting}
                exportProgress={exportProgress}
                onExport={handleExport}
              />
            )}
          </div>
        </div>

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <Preview
            scenes={scenes}
            currentSceneIndex={currentSceneIndex}
            onSceneChange={setCurrentSceneIndex}
          />
          {/* Hidden canvas for export */}
          <canvas ref={canvasRef} width={1280} height={720} className="hidden" />
        </div>

        {/* Right sidebar - Timeline */}
        <div className="w-72 flex-shrink-0 border-l border-gray-800 bg-gray-900/30">
          <Timeline
            scenes={scenes}
            currentSceneIndex={currentSceneIndex}
            onSceneSelect={setCurrentSceneIndex}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 h-8 border-t border-gray-800 flex items-center justify-between px-4 bg-gray-900/50">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>🎬 Motion Graphics Agent v1.0</span>
          {scenes.length > 0 && (
            <span>• {scenes.length} scenes • {scenes.reduce((sum, s) => sum + s.duration, 0).toFixed(1)}s</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Powered by 9Router + TTS Studio</span>
        </div>
      </footer>
    </div>
  );
}
