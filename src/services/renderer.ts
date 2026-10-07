import type { Scene, AnimationType } from '../types';

export class MotionRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame: number | null = null;
  private startTime: number = 0;
  private currentSceneIndex: number = 0;
  private isPlaying: boolean = false;
  private onSceneChange?: (index: number) => void;
  private onComplete?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  setCallbacks(onSceneChange: (index: number) => void, onComplete: () => void) {
    this.onSceneChange = onSceneChange;
    this.onComplete = onComplete;
  }

  renderScene(scene: Scene, progress: number) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = scene.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Background pattern
    this.drawBackgroundPattern(ctx, width, height, scene.backgroundColor, progress);

    // Render elements
    for (const element of scene.elements) {
      const elementProgress = Math.max(0, Math.min(1, (progress - element.delay / scene.duration)));
      if (elementProgress <= 0) continue;

      this.renderElement(ctx, element, elementProgress, width, height);
    }

    // Render main text with animation
    this.renderText(ctx, scene, progress, width, height);

    // Apply transition overlay
    if (progress > 0.85) {
      const transitionProgress = (progress - 0.85) / 0.15;
      this.applyTransition(ctx, scene.transition, transitionProgress, width, height);
    }
  }

  private drawBackgroundPattern(ctx: CanvasRenderingContext2D, width: number, height: number, bgColor: string, progress: number) {
    // Subtle animated particles
    ctx.save();
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const x = ((i * 137.5 + progress * 100) % width);
      const y = ((i * 97.3 + progress * 50) % height);
      const size = 2 + Math.sin(progress * Math.PI * 2 + i) * 1;
      const alpha = 0.1 + 0.05 * Math.sin(progress * Math.PI * 4 + i);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderElement(ctx: CanvasRenderingContext2D, element: any, progress: number, canvasWidth: number, canvasHeight: number) {
    const x = (element.position.x / 100) * canvasWidth;
    const y = (element.position.y / 100) * canvasHeight;
    const w = (element.size.width / 100) * canvasWidth;
    const h = (element.size.height / 100) * canvasHeight;

    ctx.save();
    
    // Apply animation
    const animTransform = this.getAnimationTransform(element.animation, progress);
    ctx.globalAlpha = element.opacity * animTransform.opacity;
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(animTransform.scale, animTransform.scale);
    ctx.rotate(animTransform.rotation);
    ctx.translate(-(x + w / 2), -(y + h / 2));

    ctx.fillStyle = element.color;
    ctx.strokeStyle = element.color;

    switch (element.type) {
      case 'shape':
        if (element.content === 'circle') {
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (element.content === 'square') {
          ctx.fillRect(x, y, w, h);
        } else if (element.content === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(x + w / 2, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.closePath();
          ctx.fill();
        } else if (element.content === 'line') {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y + h / 2);
          ctx.lineTo(x + w, y + h / 2);
          ctx.stroke();
        }
        break;
      case 'icon':
        ctx.font = `${Math.min(w, h)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, x + w / 2, y + h / 2);
        break;
      case 'text':
        ctx.font = `bold ${Math.min(w, h) * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, x + w / 2, y + h / 2);
        break;
    }

    ctx.restore();
  }

  private renderText(ctx: CanvasRenderingContext2D, scene: Scene, progress: number, width: number, height: number) {
    const animTransform = this.getAnimationTransform(scene.animation, progress);
    
    ctx.save();
    ctx.globalAlpha = animTransform.opacity;
    ctx.translate(width / 2, height / 2);
    ctx.scale(animTransform.scale, animTransform.scale);
    ctx.rotate(animTransform.rotation);
    
    // Text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = scene.textColor;
    ctx.font = `bold ${scene.fontSize}px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (scene.animation === 'typewriter') {
      const visibleChars = Math.floor(progress * scene.text.length * 1.5);
      const visibleText = scene.text.slice(0, Math.min(visibleChars, scene.text.length));
      ctx.fillText(visibleText, 0 + animTransform.translateX, 0 + animTransform.translateY);
      
      // Cursor
      if (progress < 0.9) {
        const textWidth = ctx.measureText(visibleText).width;
        ctx.fillStyle = scene.textColor;
        ctx.fillRect(textWidth / 2 + 5, -scene.fontSize / 2, 3, scene.fontSize);
      }
    } else {
      ctx.fillText(scene.text, 0 + animTransform.translateX, 0 + animTransform.translateY);
    }

    ctx.restore();
  }

  private getAnimationTransform(animation: AnimationType, progress: number) {
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const p = Math.min(1, progress * 2); // Speed up animation
    const eased = easeOut(p);

    switch (animation) {
      case 'fadeIn':
        return { opacity: eased, scale: 1, rotation: 0, translateX: 0, translateY: 0 };
      case 'fadeOut':
        return { opacity: 1 - eased * 0.5, scale: 1, rotation: 0, translateX: 0, translateY: 0 };
      case 'slideUp':
        return { opacity: eased, scale: 1, rotation: 0, translateX: 0, translateY: (1 - eased) * 100 };
      case 'slideDown':
        return { opacity: eased, scale: 1, rotation: 0, translateX: 0, translateY: -(1 - eased) * 100 };
      case 'slideLeft':
        return { opacity: eased, scale: 1, rotation: 0, translateX: (1 - eased) * 200, translateY: 0 };
      case 'slideRight':
        return { opacity: eased, scale: 1, rotation: 0, translateX: -(1 - eased) * 200, translateY: 0 };
      case 'scaleIn':
        return { opacity: eased, scale: eased, rotation: 0, translateX: 0, translateY: 0 };
      case 'scaleOut':
        return { opacity: eased, scale: 2 - eased, rotation: 0, translateX: 0, translateY: 0 };
      case 'rotate':
        return { opacity: eased, scale: eased, rotation: (1 - eased) * Math.PI * 2, translateX: 0, translateY: 0 };
      case 'bounce': {
        const bounceP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        return { opacity: 1, scale: 0.5 + bounceP * 0.5, rotation: 0, translateX: 0, translateY: 0 };
      }
      case 'typewriter':
        return { opacity: 1, scale: 1, rotation: 0, translateX: 0, translateY: 0 };
      case 'glow':
        return { opacity: 0.7 + 0.3 * Math.sin(progress * Math.PI * 4), scale: 1, rotation: 0, translateX: 0, translateY: 0 };
      case 'pulse':
        return { opacity: 1, scale: 1 + 0.1 * Math.sin(progress * Math.PI * 6), rotation: 0, translateX: 0, translateY: 0 };
      case 'shake':
        return { opacity: eased, scale: 1, rotation: 0, translateX: Math.sin(progress * 20) * 5 * (1 - p), translateY: 0 };
      case 'flip':
        return { opacity: eased, scale: Math.abs(Math.cos(progress * Math.PI)), rotation: 0, translateX: 0, translateY: 0 };
      case 'zoomIn':
        return { opacity: eased, scale: 0.3 + eased * 0.7, rotation: 0, translateX: 0, translateY: 0 };
      case 'zoomOut':
        return { opacity: eased, scale: 1.5 - eased * 0.5, rotation: 0, translateX: 0, translateY: 0 };
      default:
        return { opacity: 1, scale: 1, rotation: 0, translateX: 0, translateY: 0 };
    }
  }

  private applyTransition(ctx: CanvasRenderingContext2D, transition: string, progress: number, width: number, height: number) {
    ctx.save();
    
    switch (transition) {
      case 'fade':
        ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
        ctx.fillRect(0, 0, width, height);
        break;
      case 'slide':
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width * progress, height);
        break;
      case 'wipe':
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(width * (1 - progress), 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(width * (1 - progress), height);
        ctx.closePath();
        ctx.fill();
        break;
      case 'dissolve':
        ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.8})`;
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = progress * 30;
          ctx.fillRect(x, y, size, size);
        }
        break;
    }
    
    ctx.restore();
  }

  play(scenes: Scene[]) {
    if (scenes.length === 0) return;
    
    this.isPlaying = true;
    this.currentSceneIndex = 0;
    this.startTime = performance.now();
    
    const animate = () => {
      if (!this.isPlaying) return;
      
      const elapsed = (performance.now() - this.startTime) / 1000;
      
      // Calculate which scene we're in
      let totalDuration = 0;
      let sceneStart = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (elapsed < totalDuration + scenes[i].duration) {
          if (i !== this.currentSceneIndex) {
            this.currentSceneIndex = i;
            this.onSceneChange?.(i);
          }
          const sceneProgress = (elapsed - sceneStart) / scenes[i].duration;
          this.renderScene(scenes[i], Math.min(1, sceneProgress));
          this.animationFrame = requestAnimationFrame(animate);
          return;
        }
        totalDuration += scenes[i].duration;
        sceneStart = totalDuration;
      }
      
      // All scenes done
      this.isPlaying = false;
      this.onComplete?.();
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  pause() {
    this.isPlaying = false;
  }

  resume() {
    // This is simplified - in a full implementation we'd track pause time
    this.isPlaying = true;
  }

  renderStaticScene(scene: Scene, progress: number = 0.5) {
    this.renderScene(scene, progress);
  }
}
