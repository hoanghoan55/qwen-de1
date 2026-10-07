import type { Scene } from '../types';
import { MotionRenderer } from './renderer';

export async function exportVideo(
  scenes: Scene[],
  canvas: HTMLCanvasElement,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const renderer = new MotionRenderer(canvas);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const fps = 30;
  const totalFrames = Math.ceil(totalDuration * fps);

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(e);
    };

    mediaRecorder.start();

    // Render frames
    let currentFrame = 0;
    const renderFrame = () => {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      const currentTime = currentFrame / fps;
      
      // Find current scene
      let accDuration = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (currentTime < accDuration + scenes[i].duration) {
          const sceneProgress = (currentTime - accDuration) / scenes[i].duration;
          renderer.renderScene(scenes[i], sceneProgress);
          break;
        }
        accDuration += scenes[i].duration;
      }

      onProgress((currentFrame / totalFrames) * 100);
      currentFrame++;
      
      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
