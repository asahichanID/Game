import React, { useEffect, useState } from 'react';
import { AssetManager } from '../../core/AssetManager';
import { useCharacter } from '../../game/hooks/useCharacter';
import { Trophy, Sparkles } from 'lucide-react';

interface RaceVictoryOverlayProps {
  onFinish: () => void;
  playerRank?: number;
}

export const RaceVictoryOverlay: React.FC<RaceVictoryOverlayProps> = ({ onFinish, playerRank = 1 }) => {
  const { selectedCharacter } = useCharacter();
  const [logoSettled, setLogoSettled] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Logo animation finishes after ~900ms
    const logoTimer = setTimeout(() => {
      setLogoSettled(true);
    }, 900);

    // 2. Wait ~3.5 seconds total, then fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4200);

    // 3. Complete and return home after fade out
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-lg overflow-hidden transition-opacity duration-700 select-none ${
        fadeOut ? 'opacity-0' : 'opacity-100 animate-fade-in'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/20 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Main Victory Image (~90% Screen Height) */}
      <div className="relative h-[88vh] max-h-[850px] w-full flex items-end justify-center pointer-events-none">
        <img
          src={AssetManager.getUrl(selectedCharacter.winImage || AssetManager.getAsset('winImage'))}
          alt="Victory Character"
          onError={(e) => AssetManager.handleImgError(e, 'winImage')}
          className="h-full object-contain object-bottom drop-shadow-[0_0_50px_rgba(245,158,11,0.6)]"
        />

        {/* WIN LOGO 1st.png - Positioned at bottom-1/4, Spins 2x fast then slams into place */}
        <div className="absolute bottom-[22%] inset-x-0 mx-auto w-fit flex flex-col items-center justify-center z-20">
          <img
            src={AssetManager.getAsset('winningLogo')}
            alt="1st Place WIN Logo"
            onError={(e) => AssetManager.handleImgError(e, 'winningLogo')}
            className="h-28 sm:h-36 object-contain drop-shadow-[0_10px_30px_rgba(245,158,11,0.9)] animate-spin-twice-slam"
          />
        </div>

        {/* 1 LIGHT BEAM SWEEP FROM BOTTOM TO TOP AFTER LOGO SETTLES */}
        {logoSettled && (
          <div className="absolute inset-x-0 bottom-0 h-full pointer-events-none overflow-hidden z-30">
            <div className="w-full h-32 bg-gradient-to-t from-transparent via-amber-200/60 to-white/90 animate-light-sweep" />
          </div>
        )}

        {/* Victory Sub-Banner */}
        <div className="absolute top-6 inset-x-0 mx-auto w-fit bg-slate-950/90 border-2 border-amber-400 px-6 py-2 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-300 animate-bounce" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-black font-mono text-amber-300 tracking-widest uppercase">
              VICTORY CHAMPION!
            </span>
            <span className="text-[10px] text-amber-200/80 font-mono">Rank #1 - Shironna Turf Championship</span>
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
