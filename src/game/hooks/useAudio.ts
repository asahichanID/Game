import { useState } from 'react';
import { AudioManager } from '../../core/AudioManager';

export function useAudio() {
  const [audioState, setAudioState] = useState(AudioManager.getState());

  const playBGM = (url: string) => {
    AudioManager.playBGM(url);
    setAudioState(AudioManager.getState());
  };

  const playVoice = (url: string | undefined) => {
    AudioManager.playVoice(url);
  };

  const playSFX = (key: string) => {
    AudioManager.playSFX(key);
  };

  const setVolume = (channel: 'bgm' | 'voice' | 'sfx' | 'movie', vol: number) => {
    AudioManager.setVolume(channel, vol);
    setAudioState(AudioManager.getState());
  };

  const toggleMute = () => {
    AudioManager.toggleMute();
    setAudioState(AudioManager.getState());
  };

  return {
    audioState,
    playBGM,
    playVoice,
    playSFX,
    setVolume,
    toggleMute,
  };
}
