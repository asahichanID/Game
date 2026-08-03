import { AUDIO_CONFIG } from '../config/audio.config';
import { AudioChannelState } from '../types/manager';

class AudioManagerClass {
  private bgmAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  private sfxAudioMap: Map<string, HTMLAudioElement> = new Map();

  private state: AudioChannelState = {
    bgmVolume: AUDIO_CONFIG.defaultVolumes.bgm,
    voiceVolume: AUDIO_CONFIG.defaultVolumes.voice,
    sfxVolume: AUDIO_CONFIG.defaultVolumes.sfx,
    movieVolume: AUDIO_CONFIG.defaultVolumes.movie,
    isMuted: false,
  };

  private audioCtx: AudioContext | null = null;

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getState(): AudioChannelState {
    return { ...this.state };
  }

  public setVolume(channel: keyof typeof AUDIO_CONFIG.defaultVolumes, volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.state[`${channel}Volume` as keyof AudioChannelState] = clamped as never;

    if (channel === 'bgm' && this.bgmAudio) {
      this.bgmAudio.volume = this.state.isMuted ? 0 : clamped;
    }
    if (channel === 'voice' && this.voiceAudio) {
      this.voiceAudio.volume = this.state.isMuted ? 0 : clamped;
    }
  }

  public toggleMute(): boolean {
    this.state.isMuted = !this.state.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.state.isMuted ? 0 : this.state.bgmVolume;
    }
    return this.state.isMuted;
  }

  /**
   * Play background music
   */
  public playBGM(url: string): void {
    if (this.state.currentBgmTrack === url && this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }

    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }

    try {
      this.bgmAudio = new Audio(url);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.state.isMuted ? 0 : this.state.bgmVolume;
      this.state.currentBgmTrack = url;
      this.bgmAudio.play().catch(() => {
        // Autoplay policy fallback
      });
    } catch {
      // Audio playback catch
    }
  }

  /**
   * Play character voice line
   */
  public playVoice(url: string | undefined): void {
    if (!url) return;
    if (this.voiceAudio) {
      this.voiceAudio.pause();
    }

    try {
      this.voiceAudio = new Audio(url);
      this.voiceAudio.volume = this.state.isMuted ? 0 : this.state.voiceVolume;
      this.voiceAudio.play().catch(() => {});
    } catch {
      // Audio playback catch
    }
  }

  /**
   * Play sound effect with Web Audio API synthesizer fallback
   */
  public playSFX(sfxKey: string): void {
    this.initAudioContext();
    if (this.state.isMuted) return;

    // Web Audio Synthesizer fallback for instant responsive feedback
    if (this.audioCtx) {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const now = this.audioCtx.currentTime;

        gain.gain.setValueAtTime(this.state.sfxVolume * 0.15, now);

        if (sfxKey === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          return;
        }

        if (sfxKey === 'levelup' || sfxKey === 'reward') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          return;
        }
      } catch {
        // Fallthrough
      }
    }
  }
}

export const AudioManager = new AudioManagerClass();
