import React, { useEffect, useRef, useState } from 'react';
import { AssetManager } from '../../core/AssetManager';
import { useCharacter } from '../../game/hooks/useCharacter';

interface UltimateCutsceneProps {
  onComplete: () => void;
}

export const UltimateCutscene: React.FC<UltimateCutsceneProps> = ({ onComplete }) => {
  const { selectedCharacter } = useCharacter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animStage, setAnimStage] = useState<'enter' | 'playing' | 'exit'>('enter');

  useEffect(() => {
    // Stage 1: Slide in from right (300ms)
    const enterTimer = setTimeout(() => {
      setAnimStage('playing');
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Fallback if autoplay restricted
          setTimeout(() => setAnimStage('exit'), 2000);
        });
      }
    }, 400);

    return () => clearTimeout(enterTimer);
  }, []);

  const handleVideoEnd = () => {
    setAnimStage('exit');
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-hidden pointer-events-auto">
      {/* Container with Motion Blur & Slide Transitions */}
      <div
        className={`relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden border-2 border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.7)] transition-all duration-400 ease-out ${
          animStage === 'enter'
            ? 'translate-x-full blur-md opacity-0'
            : animStage === 'playing'
            ? 'translate-x-0 blur-0 opacity-100'
            : '-translate-x-full blur-md opacity-0'
        }`}
      >
        <video
          ref={videoRef}
          src={AssetManager.getUrl(selectedCharacter.ultimateVideo || AssetManager.getAsset('ultimateVideo'))}
          playsInline
          onEnded={handleVideoEnd}
          onError={(e) => AssetManager.handleVideoError(e, 'ultimateVideo')}
          className="w-full h-full object-cover"
        />

        {/* Dynamic Glowing Cutscene Banner */}
        <div className="absolute top-4 left-4 bg-purple-950/80 backdrop-blur-md border border-purple-400 px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-black font-mono text-purple-200 tracking-widest uppercase">
            ULTIMATE CUTSCENE
          </span>
        </div>
      </div>
    </div>
  );
};
