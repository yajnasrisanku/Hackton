/**
 * CalmPath AI - Web Audio Synthesizer
 * Generates soft, calming mindfulness chimes and bells using Web Audio API.
 * Zero external audio files required.
 */

class SoundEffects {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a gentle Tibetan bowl / meditation bell chime
   */
  playChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Fundamental pitch (C5 ~ 528 Hz - "solfeggio frequency")
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      
      // Gentle overtone (E5 ~ 660 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(792, now);

      // Volume envelope: soft attack, long exponential decay
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      // Connect nodes
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      // Start and stop
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.6);
      osc2.stop(now + 2.6);
    } catch (e) {
      console.warn('Audio playback not supported or blocked:', e);
    }
  }

  /**
   * Plays a soft two-tone success chord for activity completion
   */
  playCompletionChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [528, 660, 792, 1056]; // C major harmonic progression

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.15;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.3);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const soundEffects = new SoundEffects();
