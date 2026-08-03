import React, { useState } from 'react';
import { AssetManager } from '../core/AssetManager';
import { useCharacter } from '../game/hooks/useCharacter';
import { useAudio } from '../game/hooks/useAudio';
import { useVideo } from '../game/hooks/useVideo';
import { useUI } from '../game/hooks/useUI';
import { RoutePath } from '../router/routes';
import {
  Zap,
  Flame,
  Dumbbell,
  Sparkles,
  Coins,
  Volume2,
  Film,
  Activity,
  Heart,
  ChevronUp,
  Trophy,
  BookOpen,
  X,
  CheckCircle2,
  ShieldAlert,
  Users,
  Award,
  Play,
  ArrowRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate?: (route: RoutePath) => void;
}

type StatKey = 'spd' | 'sta' | 'pow' | 'guts' | 'wit';

interface FacilityConfig {
  key: StatKey;
  label: string;
  facilityName: string;
  level: number;
  icon: React.ReactNode;
  color: string;
  badgeBg: string;
}

interface SkillItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: string;
  iconColor: string;
}

const FACILITIES: FacilityConfig[] = [
  {
    key: 'spd',
    label: 'SPD',
    facilityName: 'Speed Track',
    level: 3,
    icon: <Zap className="w-4 h-4 text-cyan-400" />,
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
  },
  {
    key: 'sta',
    label: 'STA',
    facilityName: 'Stamina Gym',
    level: 2,
    icon: <Flame className="w-4 h-4 text-amber-400" />,
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
  },
  {
    key: 'pow',
    label: 'POW',
    facilityName: 'Power Weights',
    level: 2,
    icon: <Dumbbell className="w-4 h-4 text-pink-400" />,
    color: 'text-pink-300',
    badgeBg: 'bg-pink-500/20 border-pink-400/40 text-pink-300',
  },
  {
    key: 'guts',
    label: 'GUTS',
    facilityName: 'Guts Slopes',
    level: 1,
    icon: <Sparkles className="w-4 h-4 text-red-400" />,
    color: 'text-red-300',
    badgeBg: 'bg-red-500/20 border-red-400/40 text-red-300',
  },
  {
    key: 'wit',
    label: 'WIT',
    facilityName: 'Wit Study',
    level: 2,
    icon: <Activity className="w-4 h-4 text-purple-400" />,
    color: 'text-purple-300',
    badgeBg: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
  },
];

const SUPPORT_CARDS = [
  { id: 1, name: 'Tazuna', avatar: '/oguri_cap.png', bond: 85 },
  { id: 2, name: 'Spe-chan', avatar: '/oguri_cap.png', bond: 60 },
  { id: 3, name: 'Suzuka', avatar: '/oguri_win.png', bond: 45 },
];

const AVAILABLE_SKILLS: SkillItem[] = [
  {
    id: 'sk_01',
    name: 'Arc Professor',
    cost: 40,
    description: 'Meningkatkan kecepatan jelajah saat melintasi tikungan tajam.',
    type: 'Speed',
    iconColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
  {
    id: 'sk_02',
    name: 'Guts Burst',
    cost: 30,
    description: 'Mencegah penurunan drastis stamina di garis finish akhir.',
    type: 'Guts',
    iconColor: 'bg-red-500/20 text-red-300 border-red-400/40',
  },
  {
    id: 'sk_03',
    name: 'Corner Specialist',
    cost: 25,
    description: 'Akselerasi instan tanpa kehilangan keseimbangan saat belok.',
    type: 'Acceleration',
    iconColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  },
  {
    id: 'sk_04',
    name: 'Speed Demon',
    cost: 50,
    description: 'Laju kecepatan maksimum bertambah pesat di trek lurus.',
    type: 'Speed',
    iconColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
  {
    id: 'sk_05',
    name: 'Maestro Stamina',
    cost: 35,
    description: 'Pemulihan ritme napas dan stamina bertahap di pertengahan balapan.',
    type: 'Stamina',
    iconColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  },
  {
    id: 'sk_06',
    name: 'Shadow Spurt',
    cost: 45,
    description: 'Menerobos celah sempit di antara kerumunan pelari lawan.',
    type: 'Position',
    iconColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { selectedCharacter } = useCharacter();
  const { playVoice, playSFX } = useAudio();
  const { playVideo } = useVideo();
  const { showToast } = useUI();

  // Stats State (SPD, STA, POW, GUTS, WIT + PTS Currency)
  const [stats, setStats] = useState({
    spd: 919,
    sta: 829,
    pow: 632,
    guts: 548,
    wit: 567,
    pts: 462,
  });

  // Selected Facility State
  const [selectedFacility, setSelectedFacility] = useState<StatKey>('spd');
  const [previewStatBonus, setPreviewStatBonus] = useState<number>(18);
  const [previewPtsBonus, setPreviewPtsBonus] = useState<number>(7);

  // Training & Rest Execution State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [energy, setEnergy] = useState<number>(85);

  // Skill Shop Modal State
  const [showSkillModal, setShowSkillModal] = useState<boolean>(false);
  const [ownedSkillIds, setOwnedSkillIds] = useState<string[]>(['sk_03']);

  // Rank Badge Helper
  const getStatRank = (val: number) => {
    if (val >= 1100) return { rank: 'SS', color: 'bg-amber-500 text-slate-950 font-black' };
    if (val >= 900) return { rank: 'S', color: 'bg-pink-500 text-white font-black' };
    if (val >= 700) return { rank: 'A', color: 'bg-purple-500 text-white font-black' };
    if (val >= 500) return { rank: 'B', color: 'bg-cyan-500 text-slate-950 font-black' };
    if (val >= 300) return { rank: 'C', color: 'bg-blue-500 text-white font-black' };
    return { rank: 'D', color: 'bg-slate-600 text-white font-black' };
  };

  // PTS Reward Calculator based on Stat Bonus
  const calculatePtsReward = (bonus: number): number => {
    if (bonus >= 20) return Math.floor(bonus * 0.45); // 9~11 PTS
    if (bonus >= 12) return Math.floor(bonus * 0.4);  // 5~8 PTS
    if (bonus >= 1) return Math.max(1, Math.floor(bonus * 0.35)); // 1~4 PTS
    return 0;
  };

  // Select Facility & Preview Gains
  const handleSelectFacility = (key: StatKey) => {
    if (isTraining || isResting) return;

    if (selectedFacility !== key) {
      const randomStatGain = Math.floor(Math.random() * 18) + 8; // 8 to 25
      const calculatedPts = calculatePtsReward(randomStatGain);
      setSelectedFacility(key);
      setPreviewStatBonus(randomStatGain);
      setPreviewPtsBonus(calculatedPts);
      playSFX('click');
    } else {
      executeTraining(key);
    }
  };

  // Execute 2-Second Training Session
  const executeTraining = (key: StatKey) => {
    if (energy < 15) {
      showToast('Energy Habis!', 'Gunakan tombol REST untuk mengisi energi!', 'warning');
      playSFX('error');
      return;
    }

    setIsTraining(true);
    playSFX('levelup');
    playVoice(selectedCharacter.voice.trainingStart);

    setTimeout(() => {
      const addedStatGain = previewStatBonus;
      const addedPts = previewPtsBonus;

      setStats((prev) => ({
        ...prev,
        [key]: prev[key] + addedStatGain,
        pts: prev.pts + addedPts,
      }));
      setEnergy((prev) => Math.max(0, prev - 15));

      setIsTraining(false);
      playSFX('reward');
      playVoice(selectedCharacter.voice.trainingSuccess);
      showToast(
        'Training Complete!',
        `${key.toUpperCase()} +${addedStatGain} & PTS +${addedPts}!`,
        'success'
      );

      // Generate next random preview
      const nextStatGain = Math.floor(Math.random() * 18) + 8;
      setPreviewStatBonus(nextStatGain);
      setPreviewPtsBonus(calculatePtsReward(nextStatGain));
    }, 2000);
  };

  // Handle REST Action
  const handleRest = () => {
    if (isTraining || isResting) return;

    setIsResting(true);
    playSFX('reward');
    playVoice(selectedCharacter.voice.greeting);

    setTimeout(() => {
      setEnergy(100);
      setIsResting(false);
      showToast('Rest Selesai!', 'Energy pulih 100%!', 'info');
    }, 1500);
  };

  // Handle RACE Action
  const handleRace = () => {
    if (isTraining || isResting) return;
    playSFX('click');
    if (onNavigate) {
      onNavigate('race');
    } else {
      showToast('Race Paddock', 'Mempersiapkan arena balapan...', 'info');
    }
  };

  // Buy Skill with PTS
  const handleBuySkill = (skill: SkillItem) => {
    if (ownedSkillIds.includes(skill.id)) return;

    if (stats.pts < skill.cost) {
      showToast('PTS Tidak Cukup!', `Dibutuhkan ${skill.cost} PTS untuk ${skill.name}.`, 'warning');
      playSFX('error');
      return;
    }

    setStats((prev) => ({ ...prev, pts: prev.pts - skill.cost }));
    setOwnedSkillIds((prev) => [...prev, skill.id]);
    playSFX('levelup');
    showToast('Skill Dipelajari!', `Berhasil mempelajari ${skill.name}!`, 'success');
  };

  const activeFacilityConfig = FACILITIES.find((f) => f.key === selectedFacility) || FACILITIES[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-white">
      {/* 1. FULLSCREEN BACKGROUND (Uma Musume Training Ground) */}
      <img
        src={AssetManager.getAsset('trainingBackground')}
        alt="Training Backdrop"
        onError={(e) => AssetManager.handleImgError(e, 'trainingBackground')}
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
      />

      {/* Dark gradient mask for legibility */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/85 pointer-events-none z-0" />

      {/* 2. TOP GAME HUD HEADER (UMA MUSUME STYLE) */}
      <header className="fixed top-11 inset-x-2 z-20 flex flex-col gap-1 max-w-xl mx-auto">
        {/* Top Banner: Date, Turn, Goal */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-mono font-black text-[10px] rounded-lg tracking-wider">
              URA FINALE
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-amber-300 leading-tight">
                Senior Class &bull; Dec Half
              </span>
              <span className="text-[9px] text-slate-300 font-mono">
                Goal: Place 1st in URA Finale
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-mono block">TURN LEFT</span>
              <span className="text-sm font-black text-cyan-300 font-mono leading-none">2 Turns</span>
            </div>
          </div>
        </div>

        {/* Energy & Mood Status Gauge */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-amber-500/40 rounded-2xl px-3 py-1.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 flex-1 max-w-[65%]">
            <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest">
              ENERGY
            </span>
            <div className="flex-1 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
            <span className="text-xs font-black font-mono text-amber-300">{energy}%</span>
          </div>

          {/* Condition Mood Badge */}
          <div className="flex items-center gap-1 bg-pink-500/20 border border-pink-400/40 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-pink-300 animate-spin" />
            <span className="text-[10px] font-black text-pink-300 font-mono tracking-wider">
              VERY GOOD
            </span>
          </div>
        </div>
      </header>

      {/* 3. MAIN CHARACTER CANVAS & FACILITY PREVIEW */}
      <div className="fixed inset-x-0 top-28 bottom-0 z-10 flex flex-col items-center justify-end pointer-events-none pb-28">
        {/* Facility Info Banner & Support Members at Top of Character Canvas */}
        <div className="w-full max-w-xl flex items-center justify-between pointer-events-auto px-3 absolute top-2 z-20">
          {/* Facility Title Banner */}
          <div className="flex items-center gap-2 bg-amber-500/90 text-slate-950 px-3 py-1 rounded-xl shadow-lg border border-amber-300 font-black text-xs tracking-wider uppercase">
            {activeFacilityConfig.icon}
            <span>
              {activeFacilityConfig.facilityName} (Lv.{activeFacilityConfig.level})
            </span>
          </div>

          {/* Support Cards Stack */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl">
            <span className="text-[9px] font-mono font-bold text-slate-300 mr-1">
              Support
            </span>
            <div className="flex -space-x-2">
              {SUPPORT_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="relative w-7 h-7 rounded-full border border-amber-400 bg-slate-900 overflow-hidden shadow-md"
                  title={`${card.name} (Bond: ${card.bond}%)`}
                >
                  <img
                    src={AssetManager.getUrl(card.avatar)}
                    alt={card.name}
                    onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Character Full Body Image (~75% Screen Height) */}
        <div
          className="relative pointer-events-auto cursor-pointer flex items-end justify-center z-0"
          onClick={() => playVoice(selectedCharacter.voice.greeting)}
        >
          <img
            src={AssetManager.getUrl(selectedCharacter.fullBody)}
            alt="Character Sprite"
            onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
            className="h-[78vh] max-h-[760px] object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:scale-[1.01] -mb-10"
          />

          {/* Quick Voice & Video Action Badges */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playVoice(selectedCharacter.voice.greeting);
            }}
            className="absolute top-1/3 -right-6 sm:-right-10 bg-slate-950/80 backdrop-blur-md border border-pink-500/60 p-2 rounded-full shadow-2xl text-pink-300 hover:scale-110 active:scale-95 transition-all z-20"
            title="Voice Greeting"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playSFX('reward');
              playVideo({
                src: selectedCharacter.ultimateVideo,
                title: `${selectedCharacter.name} - Ultimate Cutscene!`,
              });
            }}
            className="absolute top-1/2 -right-6 sm:-right-10 bg-slate-950/80 backdrop-blur-md border border-amber-500/60 p-2 rounded-full shadow-2xl text-amber-300 hover:scale-110 active:scale-95 transition-all z-20"
            title="Ultimate Video"
          >
            <Film className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. STATS OVERVIEW PANEL & FACILITY SELECTION ROW & 3 BOTTOM BUTTONS */}
      <div className="fixed bottom-2 inset-x-2 z-30 flex flex-col gap-2 max-w-xl mx-auto">
        {/* Main Stats Overview Panel (5 Main Stats + PTS Currency Display) */}
        <div className="bg-slate-950/85 backdrop-blur-lg border border-white/20 rounded-2xl p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.85)] relative">
          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {/* 5 MAIN TRAINABLE STATS */}
            {FACILITIES.map((f) => {
              const val = stats[f.key];
              const rankInfo = getStatRank(val);
              const isSelected = selectedFacility === f.key;

              return (
                <div
                  key={f.key}
                  onClick={() => handleSelectFacility(f.key)}
                  className={`relative flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/25 border-2 border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-slate-900/60 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* PLAIN TEXT STAT BONUS ABOVE SELECTED STAT (NO BOX / BADGE / PANEL / BACKGROUND) */}
                  {isSelected && (
                    <span className="absolute -top-6 inset-x-0 mx-auto w-max text-sm sm:text-base font-black font-mono bg-gradient-to-b from-amber-300 via-orange-400 to-amber-900 bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] z-40 animate-bounce select-none">
                      +{previewStatBonus}
                    </span>
                  )}

                  <div className="flex items-center gap-1 mb-0.5">
                    {f.icon}
                    <span className={`text-[10px] font-black font-mono ${f.color}`}>
                      {f.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 my-0.5">
                    <span className={`text-[9px] px-1 rounded ${rankInfo.color}`}>
                      {rankInfo.rank}
                    </span>
                    <span className="text-xs font-black text-white font-mono">{val}</span>
                  </div>

                  <div className="w-full text-center text-[9px] font-mono text-slate-400">
                    /1200
                  </div>
                </div>
              );
            })}

            {/* PTS STAT DISPLAY (PLAIN TEXT PTS BONUS ABOVE PTS COLUMN) */}
            <div className="relative flex flex-col items-center p-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
              {/* PLAIN TEXT PTS BONUS ABOVE PTS COLUMN */}
              <span className="absolute -top-6 inset-x-0 mx-auto w-max text-sm sm:text-base font-black font-mono bg-gradient-to-b from-amber-300 via-orange-400 to-amber-900 bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] z-40 animate-bounce select-none">
                +{previewPtsBonus}
              </span>

              <div className="flex items-center gap-1 mb-0.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black font-mono text-amber-300">PTS</span>
              </div>

              <div className="text-sm font-black text-amber-300 font-mono my-0.5">
                {stats.pts}
              </div>

              <div className="text-[8px] font-mono font-bold text-amber-400/80 uppercase">
                CURRENCY
              </div>
            </div>
          </div>
        </div>

        {/* 5 TRAINING FACILITY BUTTONS ROW */}
        <div className="grid grid-cols-5 gap-1.5">
          {FACILITIES.map((f) => {
            const isSelected = selectedFacility === f.key;

            return (
              <button
                key={f.key}
                onClick={() => handleSelectFacility(f.key)}
                disabled={isTraining || isResting}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-slate-950 font-black border-2 border-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.6)] animate-pulse'
                    : 'bg-slate-900/90 text-slate-200 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  {f.icon}
                  <span className="text-[10px] font-black uppercase font-mono tracking-wider">
                    {f.label}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-300">Lv.{f.level}</span>
              </button>
            );
          })}
        </div>

        {/* 5. THREE PARALLEL BUTTONS: REST RACE SKILL */}
        <div className="grid grid-cols-3 gap-2 w-full pt-0.5">
          {/* REST BUTTON (LEFT) */}
          <button
            onClick={handleRest}
            disabled={isTraining || isResting}
            className="py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md hover:bg-emerald-500/20 border border-emerald-500/50 hover:border-emerald-300 text-emerald-300 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            <span>REST</span>
          </button>

          {/* RACE BUTTON (CENTER - MAIN PROMINENT BUTTON) */}
          <button
            onClick={handleRace}
            disabled={isTraining || isResting}
            className="py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-black text-xs tracking-widest uppercase border border-amber-300/60 shadow-[0_4px_25px_rgba(245,158,11,0.5)] hover:brightness-110 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-200 fill-amber-300" />
            <span>RACE</span>
          </button>

          {/* SKILL BUTTON (RIGHT - OPENS SKILL SHOP WITH PTS) */}
          <button
            onClick={() => {
              playSFX('click');
              setShowSkillModal(true);
            }}
            disabled={isTraining || isResting}
            className="py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SKILL</span>
          </button>
        </div>
      </div>

      {/* 6. TRAINING TRANSITION OVERLAY (2 Seconds Fade Black) */}
      {isTraining && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 animate-fade-in text-center select-none">
          <div className="relative flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-400 animate-spin p-1 mb-6 shadow-[0_0_50px_rgba(236,72,153,0.8)]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Dumbbell className="w-10 h-10 text-cyan-400 animate-bounce" />
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 animate-pulse">
              Training Session In Progress
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider mb-2">
              Latihan {activeFacilityConfig.label} Berlangsung...
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm font-extrabold text-cyan-300 font-mono animate-bounce bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/40">
                +{previewStatBonus} {activeFacilityConfig.label} GAIN
              </p>
              <p className="text-sm font-extrabold text-amber-300 font-mono animate-bounce bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                +{previewPtsBonus} PTS REWARD
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. REST TRANSITION OVERLAY (1.5 Seconds) */}
      {isResting && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-6 animate-fade-in text-center select-none backdrop-blur-md">
          <div className="relative flex flex-col items-center">
            <Heart className="w-16 h-16 text-pink-400 fill-pink-500 animate-pulse mb-4 shadow-[0_0_30px_rgba(236,72,153,0.8)]" />
            <h2 className="text-2xl font-black text-white tracking-wider mb-1">
              Masa Istirahat Karakter...
            </h2>
            <p className="text-xs font-mono text-pink-300">
              Memulihkan Energy Kembali 100%
            </p>
          </div>
        </div>
      )}

      {/* 8. SKILL SHOP MODAL (PURCHASE WITH PTS) */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-lg text-white tracking-wide">SKILL ACQUISITION</h3>
              </div>

              {/* Current PTS Balance */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-extrabold text-amber-300 font-mono">
                    {stats.pts} PTS
                  </span>
                </div>

                <button
                  onClick={() => setShowSkillModal(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Skill List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
              {AVAILABLE_SKILLS.map((skill) => {
                const isOwned = ownedSkillIds.includes(skill.id);
                const canAfford = stats.pts >= skill.cost;

                return (
                  <div
                    key={skill.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isOwned
                        ? 'bg-slate-950/60 border-emerald-500/30'
                        : canAfford
                        ? 'bg-slate-950/90 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-slate-950/40 border-white/5 opacity-75'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md uppercase border ${skill.iconColor}`}>
                          {skill.type}
                        </span>
                        <h4 className="font-extrabold text-sm text-white">{skill.name}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{skill.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 min-w-[90px]">
                      {isOwned ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-black font-mono bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>TERBELI</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuySkill(skill)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl font-mono font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                              : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3 h-3" />
                          <span>{skill.cost} PTS</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 mt-3 text-center">
              <p className="text-[10px] font-mono text-slate-400">
                Dapatkan PTS tambahan dari setiap sesi latihan untuk mempelajari Skill baru!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
