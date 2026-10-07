import { Bot, CheckCircle2, AlertCircle, Loader2, Sparkles, Volume2, Music, Film } from 'lucide-react';
import type { AgentState } from '../types';

interface AgentStatusProps {
  state: AgentState;
}

export default function AgentStatus({ state }: AgentStatusProps) {
  const steps = [
    { key: 'generating_script', label: 'Tạo kịch bản', icon: Sparkles },
    { key: 'generating_tts', label: 'Tạo giọng nói', icon: Volume2 },
    { key: 'rendering', label: 'Tạo hiệu ứng', icon: Music },
    { key: 'complete', label: 'Hoàn tất', icon: Film },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === state.status);

  if (state.status === 'idle') return null;

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium text-white">Agent Status</span>
        {state.status === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-400 ml-auto" />
        )}
        {state.status === 'complete' && (
          <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
        )}
      </div>

      {/* Progress steps */}
      <div className="space-y-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStepIndex;
          const isComplete = i < currentStepIndex || state.status === 'complete';
          const isPending = i > currentStepIndex && state.status !== 'complete';

          return (
            <div
              key={step.key}
              className={`flex items-center gap-2 text-xs transition-all ${
                isActive ? 'text-purple-300' : isComplete ? 'text-green-400' : 'text-gray-600'
              }`}
            >
              {isActive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              <span>{step.label}</span>
              {isActive && (
                <div className="ml-auto w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      {state.message && (
        <p className="text-xs text-gray-400 italic">{state.message}</p>
      )}

      {/* Error message */}
      {state.error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          {state.error}
        </p>
      )}
    </div>
  );
}
