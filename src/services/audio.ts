// SFX Generator - creates simple sound effects using Web Audio API
export class SFXGenerator {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  async generateSFX(type: string): Promise<AudioBuffer> {
    const ctx = this.getContext();
    const duration = 0.5;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'whoosh':
        this.generateWhoosh(data, sampleRate);
        break;
      case 'pop':
        this.generatePop(data, sampleRate);
        break;
      case 'click':
        this.generateClick(data, sampleRate);
        break;
      case 'ding':
        this.generateDing(data, sampleRate);
        break;
      case 'swoosh':
        this.generateSwoosh(data, sampleRate);
        break;
      case 'impact':
        this.generateImpact(data, sampleRate);
        break;
      case 'sparkle':
        this.generateSparkle(data, sampleRate);
        break;
      default:
        // silence
        break;
    }

    return buffer;
  }

  private generateWhoosh(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq = 200 + 2000 * (t / 0.5);
      const envelope = Math.exp(-t * 4) * Math.sin(t * 20);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }
  }

  private generatePop(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq = 800 * Math.exp(-t * 10);
      const envelope = Math.exp(-t * 15);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.5;
    }
  }

  private generateClick(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = t < 0.01 ? 1 : Math.exp(-(t - 0.01) * 50);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }
  }

  private generateDing(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3);
      data[i] = (Math.sin(2 * Math.PI * 1200 * t) + 0.5 * Math.sin(2 * Math.PI * 2400 * t)) * envelope * 0.3;
    }
  }

  private generateSwoosh(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq = 100 + 1500 * Math.sin(t * Math.PI / 0.5);
      const envelope = Math.sin(t * Math.PI / 0.5) * Math.exp(-t * 2);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    }
  }

  private generateImpact(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq = 60 * Math.exp(-t * 5);
      const envelope = Math.exp(-t * 8);
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 20);
      data[i] = (Math.sin(2 * Math.PI * freq * t) * envelope + noise * 0.5) * 0.4;
    }
  }

  private generateSparkle(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq1 = 3000 + 2000 * Math.sin(t * 30);
      const freq2 = 5000 + 1000 * Math.sin(t * 20);
      const envelope = Math.exp(-t * 4) * (0.5 + 0.5 * Math.sin(t * 15));
      data[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * envelope * 0.2;
    }
  }

  async playSFX(type: string) {
    if (type === 'none') return;
    const ctx = this.getContext();
    const buffer = await this.generateSFX(type);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  }
}

// Background music generator
export class MusicGenerator {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  async generateMusic(duration: number, style: 'ambient' | 'upbeat' | 'dramatic' = 'ambient'): Promise<AudioBuffer> {
    const ctx = this.getContext();
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    switch (style) {
      case 'ambient':
        this.generateAmbient(leftChannel, rightChannel, sampleRate, duration);
        break;
      case 'upbeat':
        this.generateUpbeat(leftChannel, rightChannel, sampleRate, duration);
        break;
      case 'dramatic':
        this.generateDramatic(leftChannel, rightChannel, sampleRate, duration);
        break;
    }

    return buffer;
  }

  private generateAmbient(left: Float32Array, right: Float32Array, sampleRate: number, duration: number) {
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major
      [246.94, 311.13, 369.99], // B minor
      [261.63, 329.63, 392.00], // C major
    ];
    
    const chordDuration = duration / chords.length;
    
    for (let i = 0; i < left.length; i++) {
      const t = i / sampleRate;
      const chordIndex = Math.min(Math.floor(t / chordDuration), chords.length - 1);
      const chord = chords[chordIndex];
      const localT = (t % chordDuration) / chordDuration;
      
      let sample = 0;
      for (const freq of chord) {
        sample += Math.sin(2 * Math.PI * freq * t) * 0.1;
      }
      
      // Add gentle pad
      sample += Math.sin(2 * Math.PI * 130.81 * t) * 0.05;
      
      // Envelope per chord
      const env = Math.sin(localT * Math.PI) * 0.8 + 0.2;
      sample *= env;
      
      // Stereo spread
      left[i] = sample * 0.9;
      right[i] = sample * 1.1;
    }
  }

  private generateUpbeat(left: Float32Array, right: Float32Array, sampleRate: number, duration: number) {
    const bpm = 120;
    const beatDuration = 60 / bpm;
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
    
    for (let i = 0; i < left.length; i++) {
      const t = i / sampleRate;
      const beatIndex = Math.floor(t / beatDuration) % notes.length;
      const localT = (t % beatDuration) / beatDuration;
      
      const freq = notes[beatIndex];
      const envelope = Math.exp(-localT * 4);
      let sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
      
      // Add bass
      sample += Math.sin(2 * Math.PI * freq / 2 * t) * 0.1 * envelope;
      
      // Add hi-hat pattern
      if (localT < 0.05) {
        sample += (Math.random() * 2 - 1) * 0.05 * Math.exp(-localT * 40);
      }
      
      left[i] = sample * 0.8;
      right[i] = sample * 1.2;
    }
  }

  private generateDramatic(left: Float32Array, right: Float32Array, sampleRate: number, duration: number) {
    for (let i = 0; i < left.length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Deep bass drone
      let sample = Math.sin(2 * Math.PI * 55 * t) * 0.15;
      
      // Rising tension
      const riseFreq = 100 + 400 * progress;
      sample += Math.sin(2 * Math.PI * riseFreq * t) * 0.08 * progress;
      
      // String-like pad
      sample += Math.sin(2 * Math.PI * 220 * t) * 0.05 * Math.sin(progress * Math.PI);
      sample += Math.sin(2 * Math.PI * 277.18 * t) * 0.04 * Math.sin(progress * Math.PI);
      
      // Subtle tremolo
      sample *= 0.8 + 0.2 * Math.sin(t * 3);
      
      left[i] = sample * 0.9;
      right[i] = sample * 1.1;
    }
  }
}
