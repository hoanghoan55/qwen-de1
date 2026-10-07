const TTS_BASE_URL = 'https://tts.delyai.site';
const TTS_API_KEY = 'WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY';

export interface Voice {
  voice_id: string;
  name: string;
  description?: string;
}

export async function getVoices(): Promise<Voice[]> {
  try {
    const response = await fetch(`${TTS_BASE_URL}/v1/voices`, {
      headers: {
        'x-api-key': TTS_API_KEY,
      },
    });
    
    if (!response.ok) {
      console.error('TTS voices error:', response.status);
      return getDefaultVoices();
    }
    
    const data = await response.json();
    return data.voices || getDefaultVoices();
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return getDefaultVoices();
  }
}

function getDefaultVoices(): Voice[] {
  return [
    { voice_id: 'default', name: 'Default Voice', description: 'Giọng mặc định' },
    { voice_id: 'male_news', name: 'Male News', description: 'Giọng nam đọc tin tức' },
    { voice_id: 'female_gentle', name: 'Female Gentle', description: 'Giọng nữ nhẹ nhàng' },
  ];
}

export async function generateTTS(
  text: string, 
  voiceId: string = 'default',
  language: string = 'vi',
  onProgress?: (message: string) => void
): Promise<{ audioBlob: Blob; duration: number }> {
  onProgress?.('Đang tạo giọng nói...');
  
  try {
    const response = await fetch(`${TTS_BASE_URL}/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TTS_API_KEY,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: 1.0,
        },
        output_format: 'mp3',
        language,
        normalize_text: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const duration = parseFloat(response.headers.get('X-Audio-Duration') || '0');
    
    return { audioBlob, duration: duration || estimateDuration(text) };
  } catch (error) {
    console.error('TTS Error:', error);
    // Return silent audio as fallback
    return { audioBlob: createSilentAudio(estimateDuration(text)), duration: estimateDuration(text) };
  }
}

export async function generateSceneTTS(
  scenes: { id: string; narration: string }[],
  voiceId: string = 'default',
  language: string = 'vi',
  onProgress?: (message: string, progress: number) => void
): Promise<Map<string, { audioBlob: Blob; duration: number }>> {
  const results = new Map<string, { audioBlob: Blob; duration: number }>();
  
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    onProgress?.(`Đang tạo giọng cho scene ${i + 1}/${scenes.length}...`, (i / scenes.length) * 100);
    
    const result = await generateTTS(scene.narration, voiceId, language);
    results.set(scene.id, result);
  }
  
  return results;
}

function estimateDuration(text: string): number {
  // Rough estimate: ~3 words per second for Vietnamese
  const words = text.split(/\s+/).length;
  return Math.max(2, words / 3);
}

function createSilentAudio(duration: number): Blob {
  // Create a minimal silent WAV file
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
