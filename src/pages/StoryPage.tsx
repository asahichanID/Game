import React, { useState } from 'react';
import { AssetManager } from '../core/AssetManager';
import { useCharacter } from '../game/hooks/useCharacter';
import { useAudio } from '../game/hooks/useAudio';
import { GlassPanel } from '../components/ui/GlassPanel';
import { AnimeButton } from '../components/ui/AnimeButton';
import { BookOpen, ChevronRight, Volume2 } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const { playVoice } = useAudio();
  const [step, setStep] = useState(0);

  const script = [
    { speaker: 'Trainer Shironna', text: 'Selamat datang di lintasan pacu utama, Asahi-chan! Hari ini kita latihan perdana.' },
    { speaker: selectedCharacter.name, text: selectedCharacter.voice.greeting, voice: selectedCharacter.voice.greeting },
    { speaker: 'Trainer Shironna', text: 'Mimpimu menjadi pelari nomor satu akan kita wujudkan bersama!' },
    { speaker: selectedCharacter.name, text: selectedCharacter.voice.titleCall, voice: selectedCharacter.voice.titleCall },
  ];

  const currentLine = script[step];

  const handleNext = () => {
    const nextStep = (step + 1) % script.length;
    setStep(nextStep);
    if (script[nextStep].voice) {
      playVoice(script[nextStep].voice);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassPanel variant="magenta" className="p-6 relative min-h-[420px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <span className="text-xs font-mono font-bold text-pink-300 uppercase">Chapter 1: The Rising Sunrise</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Step {step + 1} / {script.length}</span>
        </div>

        {/* Character Portrait */}
        <div className="flex justify-center my-4">
          <img
            src={AssetManager.getUrl(selectedCharacter.fullBody)}
            alt={selectedCharacter.name}
            onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
            className="h-[280px] object-contain drop-shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300"
          />
        </div>

        {/* Dialogue Box */}
        <div className="bg-slate-900/90 border border-pink-500/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-pink-400 font-mono uppercase tracking-wider">
              {currentLine.speaker}
            </span>
            {currentLine.voice && (
              <button onClick={() => playVoice(currentLine.voice)} className="text-pink-400 hover:text-white">
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed min-h-[48px]">
            "{currentLine.text}"
          </p>
          <div className="flex justify-end mt-3">
            <AnimeButton variant="accent" size="sm" icon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
              Lanjut Dialogue
            </AnimeButton>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
