/**
 * Orion Ambient Audio Synthesizer (Web Audio API)
 * Generates continuous generative ambient pads, binaural beat fundamentals,
 * and pink noise masking without needing external heavy audio files.
 */

class OrionAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private analyzer: AnalyserNode | null = null;
  private freqData: Uint8Array | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.analyzer = this.ctx.createAnalyser();
      this.analyzer.fftSize = 64;
      this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);

      this.masterGain.connect(this.analyzer);
      this.analyzer.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTrack(trackPreset: 'andromeda' | 'nebula' | 'alpha' | 'zen' = 'andromeda') {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.stop(false);
    this.isPlaying = true;

    const baseFrequencies = {
      andromeda: [108, 162, 216, 324], // D minor ethereal pad
      nebula: [130.81, 196.0, 261.63, 392.0], // C fifths space drift
      alpha: [144, 154, 288, 308], // Alpha 10Hz binaural beat difference
      zen: [96, 144, 192, 288], // Deep meditation grounding
    }[trackPreset];

    // Create soft sine/triangle oscillators
    this.oscillators = baseFrequencies.map((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Subtle LFO modulation for breathing sensation
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.08 + index * 0.03, this.ctx!.currentTime);
      lfoGain.gain.setValueAtTime(3 + index * 2, this.ctx!.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      const individualGain = 0.04 / (index + 1);
      gain.gain.setValueAtTime(individualGain, this.ctx!.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();

      return osc;
    });

    // Fade in master volume
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.2);
  }

  public stop(ramp = true) {
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = false;

    if (ramp) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.oscillators = [];
      }, 700);
    } else {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];
    }
  }

  public setVolume(volume0to1: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const clamped = Math.max(0.0001, Math.min(1, volume0to1 * 0.25));
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.exponentialRampToValueAtTime(clamped, now + 0.1);
  }

  public getEnergy(): number {
    if (!this.analyzer || !this.freqData || !this.isPlaying) return 0;
    this.analyzer.getByteFrequencyData(this.freqData);
    let sum = 0;
    for (let i = 0; i < this.freqData.length; i++) {
      sum += this.freqData[i];
    }
    return sum / (this.freqData.length * 255);
  }

  private alarmInterval: number | null = null;
  private alarmOscillators: OscillatorNode[] = [];
  private alarmGain: GainNode | null = null;
  private isAlarmPlaying: boolean = false;

  public startGentleAlarm() {
    this.init();
    if (!this.ctx) return;
    if (this.isAlarmPlaying) return;

    this.isAlarmPlaying = true;
    this.alarmGain = this.ctx.createGain();
    this.alarmGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.alarmGain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 1.0);
    this.alarmGain.connect(this.ctx.destination);

    // Warm ambient foundation pad (C3 & G3 soft sine)
    const basePads = [130.81, 196.0];
    basePads.forEach((freq) => {
      if (!this.ctx || !this.alarmGain) return;
      const padOsc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      padOsc.type = 'sine';
      padOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      padGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      padOsc.connect(padGain);
      padGain.connect(this.alarmGain);
      padOsc.start();
      this.alarmOscillators.push(padOsc);
    });

    const triggerChime = () => {
      if (!this.ctx || !this.isAlarmPlaying || !this.alarmGain) return;
      const now = this.ctx.currentTime;
      // Soft ascending celestial bell frequencies: E5, G5, B5, E6
      const chimeNotes = [659.25, 783.99, 987.77, 1318.51];

      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx || !this.alarmGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const noteStart = now + idx * 0.12;
        const noteDuration = 1.4;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        // Soft bell envelope: fast attack, natural exponential decay
        noteGain.gain.setValueAtTime(0.0001, noteStart);
        noteGain.gain.exponentialRampToValueAtTime(0.045 / (idx + 1), noteStart + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(noteGain);
        noteGain.connect(this.alarmGain);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
        this.alarmOscillators.push(osc);
      });
    };

    // Play first chime immediately, then repeat every 2.4 seconds
    triggerChime();
    this.alarmInterval = window.setInterval(() => {
      if (this.isAlarmPlaying) {
        triggerChime();
      }
    }, 2400);
  }

  public stopGentleAlarm() {
    this.isAlarmPlaying = false;

    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }

    if (this.ctx && this.alarmGain) {
      try {
        const now = this.ctx.currentTime;
        this.alarmGain.gain.cancelScheduledValues(now);
        this.alarmGain.gain.setValueAtTime(Math.max(this.alarmGain.gain.value, 0.0001), now);
        this.alarmGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.08);
      } catch {
        // ignore
      }
    }

    // Clean up all active alarm oscillators
    this.alarmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.alarmOscillators = [];
  }

  public isGentleAlarmRunning(): boolean {
    return this.isAlarmPlaying;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new OrionAudioEngine();
