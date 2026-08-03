import React, { useEffect, useRef, useState } from 'react';
import { AssetManager } from '../../core/AssetManager';
import { Racer, RaceOption, RunningStyle } from './RaceTypes';
import { UltimateCutscene } from './UltimateCutscene';
import { Zap, Trophy, ShieldAlert, Flag, Flame } from 'lucide-react';

interface RaceTrackCanvasProps {
  race: RaceOption;
  style: RunningStyle;
  playerCharacter: {
    name: string;
    icon: string;
  };
  onRaceFinish: (playerRank: number) => void;
}

export const RaceTrackCanvas: React.FC<RaceTrackCanvasProps> = ({
  race,
  style,
  playerCharacter,
  onRaceFinish,
}) => {
  // Screen Shake & Cutscene Overlay states
  const [isShaking, setIsShaking] = useState(false);
  const [showUltimateCutscene, setShowUltimateCutscene] = useState(false);
  const [ultimateUsed, setUltimateUsed] = useState(false);
  const [playerAuraActive, setPlayerAuraActive] = useState(false);

  // Racers state (5 participants)
  const [racers, setRacers] = useState<Racer[]>([]);
  const isFinishedRef = useRef(false);

  // Initialize Racers
  useEffect(() => {
    // Generate AI racers with slightly randomized base speeds
    const initialRacers: Racer[] = [
      {
        id: 'player',
        name: playerCharacter.name,
        avatar: playerCharacter.icon || '/oguri_cap.png',
        isPlayer: true,
        color: 'border-amber-400 ring-2 ring-amber-300',
        baseSpeed: 60,
        currentSpeed: 60,
        progress: 0,
        distanceRemaining: race.distance,
        placement: 1,
        hasUltimateActive: false,
        style: style,
      },
      {
        id: 'ai-1',
        name: 'Special Week',
        avatar: '/oguri_cap.png',
        isPlayer: false,
        color: 'border-blue-400',
        baseSpeed: 58 + Math.random() * 5,
        currentSpeed: 60,
        progress: 0,
        distanceRemaining: race.distance,
        placement: 2,
        hasUltimateActive: false,
        style: 'Front',
      },
      {
        id: 'ai-2',
        name: 'Silence Suzuka',
        avatar: '/oguri_win.png',
        isPlayer: false,
        color: 'border-emerald-400',
        baseSpeed: 59 + Math.random() * 4,
        currentSpeed: 60,
        progress: 0,
        distanceRemaining: race.distance,
        placement: 3,
        hasUltimateActive: false,
        style: 'Pace',
      },
      {
        id: 'ai-3',
        name: 'Tokai Teio',
        avatar: '/oguri_cap.png',
        isPlayer: false,
        color: 'border-red-400',
        baseSpeed: 57 + Math.random() * 6,
        currentSpeed: 60,
        progress: 0,
        distanceRemaining: race.distance,
        placement: 4,
        hasUltimateActive: false,
        style: 'Late',
      },
      {
        id: 'ai-4',
        name: 'Mejiro McQueen',
        avatar: '/oguri_win.png',
        isPlayer: false,
        color: 'border-purple-400',
        baseSpeed: 58 + Math.random() * 5,
        currentSpeed: 60,
        progress: 0,
        distanceRemaining: race.distance,
        placement: 5,
        hasUltimateActive: false,
        style: 'End',
      },
    ];

    setRacers(initialRacers);
  }, [race.distance, style, playerCharacter]);

  // Main Race Game Loop (requestAnimationFrame)
  useEffect(() => {
    let animFrameId: number;
    let lastTime = performance.now();

    // Duration scaling based on track distance:
    // 1400m ~ 13s, 2000m ~ 19s, 3400m ~ 30s
    const targetDurationSec = race.distance === 1400 ? 13 : race.distance === 2000 ? 19 : 30;

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setRacers((prevRacers) => {
        if (prevRacers.length === 0 || isFinishedRef.current) return prevRacers;

        let allFinished = true;

        const updated = prevRacers.map((r) => {
          if (r.progress >= 1) return r;
          allFinished = false;

          // Calculate current speed
          let speedKmh = r.baseSpeed;

          // Style modifiers based on lap segment
          if (r.style === 'Front' && r.progress < 0.4) speedKmh += 4;
          if (r.style === 'Late' && r.progress > 0.6) speedKmh += 5;
          if (r.style === 'End' && r.progress > 0.75) speedKmh += 7;

          // Ultimate speed boost! (+180 km/h)
          if (r.hasUltimateActive) {
            speedKmh = 180;
          }

          // Progress increment
          const stepProgress = (dt / targetDurationSec) * (speedKmh / 60);
          const newProgress = Math.min(1.0, r.progress + stepProgress);
          const remaining = Math.max(0, Math.round(race.distance * (1 - newProgress)));

          return {
            ...r,
            currentSpeed: Math.round(speedKmh),
            progress: newProgress,
            distanceRemaining: remaining,
          };
        });

        // Calculate placements
        const sorted = [...updated].sort((a, b) => b.progress - a.progress);
        const withPlacements = updated.map((r) => {
          const rank = sorted.findIndex((s) => s.id === r.id) + 1;
          return { ...r, placement: rank };
        });

        // Check if player or everyone finished
        const playerRacer = withPlacements.find((r) => r.isPlayer);
        if (playerRacer && playerRacer.progress >= 1.0 && !isFinishedRef.current) {
          isFinishedRef.current = true;
          const finalRank = playerRacer.placement;
          setTimeout(() => {
            onRaceFinish(finalRank);
          }, 600);
        }

        return withPlacements;
      });

      if (!isFinishedRef.current) {
        animFrameId = requestAnimationFrame(updateLoop);
      }
    };

    animFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [race.distance, onRaceFinish]);

  // Trigger Ultimate
  const handleTriggerUltimate = () => {
    if (ultimateUsed) return;
    setUltimateUsed(true);

    // 1. Shake screen
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // 2. Open Ultimate video cutscene
    setShowUltimateCutscene(true);
  };

  // On Cutscene Finished
  const handleUltimateComplete = () => {
    setShowUltimateCutscene(false);

    // Grant Purple-Black Flame Aura & 180 km/h speed boost for 7 seconds!
    setPlayerAuraActive(true);
    setRacers((prev) =>
      prev.map((r) => (r.isPlayer ? { ...r, hasUltimateActive: true } : r))
    );

    // After 7 seconds, revert speed to normal
    setTimeout(() => {
      setPlayerAuraActive(false);
      setRacers((prev) =>
        prev.map((r) => (r.isPlayer ? { ...r, hasUltimateActive: false } : r))
      );
    }, 7000);
  };

  // Find player racer
  const playerRacer = racers.find((r) => r.isPlayer);
  const leadingRacer = racers.reduce((prev, curr) => (curr.progress > prev.progress ? curr : prev), racers[0] || {});

  // Determine if racers are in final stretch (progress >= 0.75) to reveal finish line overlay smoothly
  const isFinalStretch = (playerRacer?.progress || 0) >= 0.75;

  // Convert progress (0 to 1) into (X%, Y%) position along oval track
  const getTrackPosition = (progress: number, racerIndex: number) => {
    // Lane offset to avoid overlapping avatars
    const laneOffset = (racerIndex - 2) * 2.8; // % offset

    // Parametric Oval Loop:
    // 0.0 -> 0.35: Top straight lane (Left -> Right)
    // 0.35 -> 0.5: Right curve turn (Top -> Bottom)
    // 0.5 -> 0.85: Bottom home straight lane (Right -> Left)
    // 0.85 -> 1.0: Left curve turn back to finish (Bottom -> Top)

    let x = 50;
    let y = 50;

    if (progress <= 0.35) {
      // Top straight (going right)
      const p = progress / 0.35;
      x = 22 + p * 56;
      y = 28 + laneOffset;
    } else if (progress <= 0.5) {
      // Right curve (going down)
      const p = (progress - 0.35) / 0.15;
      const angle = -Math.PI / 2 + p * Math.PI;
      x = 78 + Math.cos(angle) * 12;
      y = 50 + Math.sin(angle) * 22 + laneOffset;
    } else if (progress <= 0.85) {
      // Bottom home straight (going left towards finish)
      const p = (progress - 0.5) / 0.35;
      x = 78 - p * 56;
      y = 72 + laneOffset;
    } else {
      // Left curve (going up to complete lap)
      const p = (progress - 0.85) / 0.15;
      const angle = Math.PI / 2 + p * Math.PI;
      x = 22 + Math.cos(angle) * 12;
      y = 50 + Math.sin(angle) * 22 + laneOffset;
    }

    return { x, y };
  };

  return (
    <div
      className={`relative w-full h-full min-h-screen bg-slate-950 overflow-hidden select-none font-sans ${
        isShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* 1. ARENA TRACK BACKGROUND IMAGE (track_race.jpg) */}
      <div className="absolute inset-0 z-0">
        <img
          src={AssetManager.getAsset('raceTrackBackground')}
          alt="Race Track"
          onError={(e) => AssetManager.handleImgError(e, 'raceTrackBackground')}
          className="w-full h-full object-cover object-center brightness-95 contrast-105"
        />
        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* 2. FINISH LINE OVERLAY (Hides finish line until Final Stretch) */}
      <div
        className={`absolute bottom-[22%] left-[12%] w-[18%] h-[12%] bg-slate-950/90 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 z-10 transition-opacity duration-1000 ${
          isFinalStretch ? 'opacity-0 pointer-events-none' : 'opacity-95'
        }`}
      >
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>FINISH LINE HIDDEN</span>
        </div>
      </div>

      {/* 3. VISUAL START & FINISH LINES ON TRACK */}
      {/* Start Line (Top Right Straight) */}
      <div className="absolute top-[22%] left-[22%] w-1.5 h-16 bg-white shadow-[0_0_10px_#ffffff] rotate-12 z-0 flex items-center justify-center">
        <span className="text-[8px] font-mono font-black text-black bg-white px-1 rounded-sm rotate-90">
          START
        </span>
      </div>

      {/* Finish Line (Bottom Left Straight - Revealed on Final Stretch) */}
      <div className="absolute bottom-[24%] left-[20%] w-2.5 h-16 bg-gradient-to-b from-amber-400 via-white to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.9)] -rotate-12 z-0 flex items-center justify-center">
        <span className="text-[9px] font-mono font-black text-slate-950 bg-amber-300 px-1 rounded-sm -rotate-90 shadow-md">
          FINISH
        </span>
      </div>

      {/* 4. RACERS AVATARS ON TRACK */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {racers.map((racer, idx) => {
          const { x, y } = getTrackPosition(racer.progress, idx);
          const isPlayer = racer.isPlayer;

          return (
            <div
              key={racer.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear flex flex-col items-center"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Rank / Name Tag */}
              <div
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black shadow-lg flex items-center gap-1 mb-1 whitespace-nowrap border ${
                  isPlayer
                    ? 'bg-amber-500 text-slate-950 border-amber-300 animate-bounce'
                    : 'bg-slate-900/90 text-white border-white/20'
                }`}
              >
                <span>#{racer.placement}</span>
                <span>{racer.name}</span>
              </div>

              {/* Avatar Circle with Border & Optional Purple Flame Aura */}
              <div
                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 bg-slate-900 shadow-xl ${racer.color} ${
                  isPlayer && playerAuraActive ? 'animate-purple-flame scale-110' : ''
                }`}
              >
                <img
                  src={AssetManager.getUrl(racer.avatar)}
                  alt={racer.name}
                  onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
                  className="w-full h-full object-cover"
                />

                {/* Flame Aura overlay for player ultimate */}
                {isPlayer && playerAuraActive && (
                  <div className="absolute inset-0 bg-purple-600/30 backdrop-blur-[1px] border border-purple-300 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-purple-200 animate-pulse fill-purple-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. TOP HUD: LEADERBOARD & DISTANCE REMAINING */}
      <div className="absolute top-14 inset-x-3 z-30 flex items-start justify-between pointer-events-none">
        {/* Left: Live Leaderboard */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-1.5 pointer-events-auto max-w-[200px]">
          <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-amber-300 font-mono font-black text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>LEADERBOARD</span>
          </div>

          <div className="space-y-1">
            {[...racers]
              .sort((a, b) => a.placement - b.placement)
              .map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-[10px] font-mono ${
                    r.isPlayer
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold'
                      : 'bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-amber-400">#{r.placement}</span>
                    <span className="truncate max-w-[80px]">{r.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400">{r.currentSpeed} km/h</span>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Race Info & Speedometer */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Track Name & Distance Remaining */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-400/50 px-3 py-2 rounded-2xl shadow-2xl flex flex-col items-end">
            <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
              {race.name}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-mono font-black text-sm">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>{playerRacer?.distanceRemaining || 0}m REMAINING</span>
            </div>
          </div>

          {/* Player Speedometer */}
          <div
            className={`px-3.5 py-1.5 rounded-full border font-mono font-black text-xs shadow-2xl flex items-center gap-1.5 transition-all ${
              playerAuraActive
                ? 'bg-purple-950/90 border-purple-400 text-purple-200 animate-pulse scale-105'
                : 'bg-slate-950/85 border-cyan-400/60 text-cyan-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{playerRacer?.currentSpeed || 60} km/h</span>
            {playerAuraActive && <span className="text-[9px] bg-purple-500 px-1.5 py-0.2 rounded text-white uppercase">BOOST</span>}
          </div>
        </div>
      </div>

      {/* 6. BOTTOM CENTER: ULTIMATE BUTTON */}
      <div className="absolute bottom-6 inset-x-0 mx-auto w-fit z-40 flex flex-col items-center pointer-events-auto">
        <button
          onClick={handleTriggerUltimate}
          disabled={ultimateUsed}
          className={`px-8 py-3 rounded-full font-black text-sm tracking-widest uppercase border-2 transition-all cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.6)] ${
            ultimateUsed
              ? 'bg-slate-900/80 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 border-purple-300 text-white hover:brightness-125 active:scale-95 animate-pulse'
          }`}
        >
          {ultimateUsed ? 'ULTIMATE USED' : '⚡ ULTIMATE'}
        </button>
      </div>

      {/* 7. ULTIMATE VIDEO CUTSCENE OVERLAY */}
      {showUltimateCutscene && (
        <UltimateCutscene onComplete={handleUltimateComplete} />
      )}
    </div>
  );
};
