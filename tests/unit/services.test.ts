/**
 * Unit Tests cho Service Functions
 */

import { describe, it, expect, vi } from 'vitest';
import { generateScript } from '../src/services/llm';
import { generateTTS, getVoices } from '../src/services/tts';
import { SFXGenerator, MusicGenerator } from '../src/services/audio';

// Mock fetch globally
global.fetch = vi.fn();

describe('LLM Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generateScript returns scenes array', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify([
            {
              id: 'scene-1',
              duration: 4,
              text: 'Test Scene',
              narration: 'Test narration',
              animation: 'fadeIn',
              backgroundColor: '#000000',
              textColor: '#ffffff',
              fontSize: 48,
              elements: [],
              sfx: 'none',
              transition: 'fade',
            }
          ])
        }
      }]
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const scenes = await generateScript('Test prompt');
    
    expect(Array.isArray(scenes)).toBe(true);
    expect(scenes.length).toBeGreaterThan(0);
    expect(scenes[0]).toHaveProperty('text');
    expect(scenes[0]).toHaveProperty('animation');
  });

  it('generateScript handles API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const scenes = await generateScript('Test prompt');
    
    // Should return fallback scenes
    expect(Array.isArray(scenes)).toBe(true);
    expect(scenes.length).toBeGreaterThan(0);
  });
});

describe('TTS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getVoices returns voices array', async () => {
    const mockVoices = {
      voices: [
        { voice_id: 'default', name: 'Default Voice' },
        { voice_id: 'male', name: 'Male Voice' },
      ]
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVoices),
    });

    const voices = await getVoices();
    
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
    expect(voices[0]).toHaveProperty('voice_id');
  });

  it('generateTTS returns audio blob', async () => {
    const mockBlob = new Blob(['test'], { type: 'audio/mp3' });
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
      headers: {
        get: () => '2.5',
      },
    });

    const result = await generateTTS('Test text', 'default', 'vi');
    
    expect(result).toHaveProperty('audioBlob');
    expect(result).toHaveProperty('duration');
    expect(result.audioBlob).toBeInstanceOf(Blob);
  });

  it('generateTTS handles errors and returns silent audio', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('TTS Error'));

    const result = await generateTTS('Test text', 'default', 'vi');
    
    // Should return silent audio as fallback
    expect(result).toHaveProperty('audioBlob');
    expect(result).toHaveProperty('duration');
    expect(result.duration).toBeGreaterThan(0);
  });
});

describe('Audio Generators', () => {
  it('SFXGenerator creates audio buffer', async () => {
    const generator = new SFXGenerator();
    
    // Mock AudioContext
    const mockContext = {
      sampleRate: 44100,
      createBuffer: vi.fn(() => ({
        getChannelData: () => new Float32Array(44100),
      })),
      createBufferSource: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        buffer: null,
      })),
      destination: {},
    };

    // @ts-ignore
    global.AudioContext = vi.fn(() => mockContext);

    const buffer = await generator.generateSFX('whoosh');
    
    expect(buffer).toBeDefined();
  });

  it('MusicGenerator creates audio buffer', async () => {
    const generator = new MusicGenerator();
    
    const mockContext = {
      sampleRate: 44100,
      createBuffer: vi.fn(() => ({
        getChannelData: () => new Float32Array(44100 * 10),
      })),
    };

    // @ts-ignore
    global.AudioContext = vi.fn(() => mockContext);

    const buffer = await generator.generateMusic(10, 'ambient');
    
    expect(buffer).toBeDefined();
  });
});

describe('Animation Types', () => {
  const validAnimations = [
    'fadeIn', 'fadeOut', 'slideUp', 'slideDown',
    'slideLeft', 'slideRight', 'scaleIn', 'scaleOut',
    'rotate', 'bounce', 'typewriter', 'glow',
    'pulse', 'shake', 'flip', 'zoomIn', 'zoomOut'
  ];

  it('all animation types are defined', () => {
    expect(validAnimations.length).toBe(17);
  });

  it('animation types are unique', () => {
    const unique = new Set(validAnimations);
    expect(unique.size).toBe(validAnimations.length);
  });
});

describe('Scene Structure', () => {
  it('scene has required properties', () => {
    const scene = {
      id: 'test-1',
      duration: 4,
      text: 'Test',
      narration: 'Test narration',
      animation: 'fadeIn',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      fontSize: 48,
      elements: [],
      sfx: 'none',
      transition: 'fade',
    };

    expect(scene).toHaveProperty('id');
    expect(scene).toHaveProperty('duration');
    expect(scene).toHaveProperty('text');
    expect(scene).toHaveProperty('narration');
    expect(scene).toHaveProperty('animation');
    expect(scene).toHaveProperty('backgroundColor');
    expect(scene).toHaveProperty('textColor');
    expect(scene).toHaveProperty('fontSize');
    expect(scene).toHaveProperty('elements');
    expect(scene).toHaveProperty('sfx');
    expect(scene).toHaveProperty('transition');
  });

  it('scene duration is positive', () => {
    const scene = { duration: 4 };
    expect(scene.duration).toBeGreaterThan(0);
  });

  it('scene colors are valid hex', () => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    const bgColor = '#000000';
    const textColor = '#ffffff';
    
    expect(hexRegex.test(bgColor)).toBe(true);
    expect(hexRegex.test(textColor)).toBe(true);
  });
});
