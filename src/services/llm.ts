import OpenAI from 'openai';
import type { Scene, AnimationType, TransitionType, SFXType } from '../types';

const client = new OpenAI({
  baseURL: 'https://9router-production-bcf1.up.railway.app/v1',
  apiKey: 'sk-3a3d0c15eaf15d37-y9i1da-9ceeb339',
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a professional motion graphics director and scriptwriter. 
Your task is to create engaging motion graphics video scripts from user prompts.

You must respond with a valid JSON array of scenes. Each scene should have:
- id: unique string identifier
- duration: number (seconds, typically 3-6 seconds per scene)
- text: the main text/heading displayed on screen
- narration: what the voiceover should say for this scene
- animation: one of ["fadeIn", "fadeOut", "slideUp", "slideDown", "slideLeft", "slideRight", "scaleIn", "scaleOut", "rotate", "bounce", "typewriter", "glow", "pulse", "shake", "flip", "zoomIn", "zoomOut", "none"]
- backgroundColor: hex color code
- textColor: hex color code  
- fontSize: number (24-72)
- elements: array of visual elements with {id, type, content, position: {x, y}, size: {width, height}, animation, delay, color, opacity}
- sfx: one of ["whoosh", "pop", "click", "ding", "swoosh", "impact", "sparkle", "none"]
- transition: one of ["fade", "slide", "wipe", "dissolve", "none"]

Design principles:
1. Use contrasting colors for readability
2. Vary animations to keep it dynamic
3. Keep text concise and impactful
4. Match SFX to the animation type
5. Use appropriate transitions between scenes
6. Total video should be 15-30 seconds (3-6 scenes)
7. Narration should be natural and engaging

Respond ONLY with valid JSON, no markdown or explanation.`;

export async function generateScript(prompt: string, onProgress?: (message: string) => void): Promise<Scene[]> {
  onProgress?.('Đang tạo kịch bản motion graphics...');
  
  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Create a motion graphics video script for: "${prompt}"` }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content from LLM');

    // Parse JSON from response
    let jsonStr = content.trim();
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    }
    
    const scenes = JSON.parse(jsonStr) as Scene[];
    
    // Validate and fix scenes
    const validAnimations: AnimationType[] = ['fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'scaleOut', 'rotate', 'bounce', 'typewriter', 'glow', 'pulse', 'shake', 'flip', 'zoomIn', 'zoomOut', 'none'];
    const validTransitions: TransitionType[] = ['fade', 'slide', 'wipe', 'dissolve', 'none'];
    const validSfx: SFXType[] = ['whoosh', 'pop', 'click', 'ding', 'swoosh', 'impact', 'sparkle', 'none'];

    return scenes.map((scene, i) => ({
      ...scene,
      id: scene.id || `scene-${i}`,
      duration: scene.duration || 4,
      animation: validAnimations.includes(scene.animation) ? scene.animation : 'fadeIn',
      transition: validTransitions.includes(scene.transition) ? scene.transition : 'fade',
      sfx: validSfx.includes(scene.sfx || 'none') ? scene.sfx : 'none',
      backgroundColor: scene.backgroundColor || '#1a1a2e',
      textColor: scene.textColor || '#ffffff',
      fontSize: scene.fontSize || 48,
      elements: scene.elements || [],
    }));
  } catch (error) {
    console.error('LLM Error:', error);
    // Return fallback scenes
    return generateFallbackScenes(prompt);
  }
}

function generateFallbackScenes(prompt: string): Scene[] {
  return [
    {
      id: 'scene-0',
      duration: 4,
      text: prompt.slice(0, 30) || 'Motion Graphics',
      narration: `Đây là video về ${prompt}`,
      animation: 'zoomIn',
      backgroundColor: '#0f0c29',
      textColor: '#ffffff',
      fontSize: 56,
      elements: [{
        id: 'el-0',
        type: 'shape',
        content: 'circle',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        animation: 'pulse',
        delay: 0,
        color: '#e94560',
        opacity: 0.8,
      }],
      sfx: 'whoosh',
      transition: 'fade',
    },
    {
      id: 'scene-1',
      duration: 4,
      text: 'Sáng tạo bởi AI',
      narration: 'Được tạo hoàn toàn bằng trí tuệ nhân tạo',
      animation: 'slideUp',
      backgroundColor: '#302b63',
      textColor: '#00d2ff',
      fontSize: 42,
      elements: [{
        id: 'el-1',
        type: 'icon',
        content: '✨',
        position: { x: 50, y: 30 },
        size: { width: 60, height: 60 },
        animation: 'bounce',
        delay: 0.5,
        color: '#ffd700',
        opacity: 1,
      }],
      sfx: 'sparkle',
      transition: 'slide',
    },
    {
      id: 'scene-2',
      duration: 4,
      text: '🎬 Kết thúc',
      narration: 'Cảm ơn bạn đã xem!',
      animation: 'scaleIn',
      backgroundColor: '#24243e',
      textColor: '#ffffff',
      fontSize: 48,
      elements: [],
      sfx: 'ding',
      transition: 'fade',
    },
  ];
}

export async function listModels(): Promise<string[]> {
  try {
    const response = await fetch('https://9router-production-bcf1.up.railway.app/v1/models', {
      headers: {
        'Authorization': 'Bearer sk-3a3d0c15eaf15d37-y9i1da-9ceeb339',
      },
    });
    const data = await response.json();
    return data.data?.map((m: any) => m.id) || [];
  } catch {
    return [];
  }
}
