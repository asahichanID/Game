import React, { useState } from 'react';
import { RaceOption, RunningStyle, StyleOption } from './RaceTypes';
import { Trophy, Flag, Zap, Compass, Play, ArrowLeft } from 'lucide-react';

interface RacePrepModalProps {
  onStartRace: (race: RaceOption, style: RunningStyle) => void;
  onBackToHome?: () => void;
}

const RACE_OPTIONS: RaceOption[] = [
  {
    id: 'arima_kinen',
    name: 'Arima Kinen',
    distance: 3400,
    category: 'Long',
    description: 'Trek stamina jarak jauh 3400m. Butuh ketahanan pacu tinggi.',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  },
  {
    id: 'kyoto_turn',
    name: 'Kyoto Turn',
    distance: 2000,
    category: 'Medium',
    description: 'Trek menengah 2000m seimbang antara kecepatan dan stamina.',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  },
  {
    id: 'japan_derby',
    name: 'Japan Derby',
    distance: 1400,
    category: 'Sprint',
    description: 'Trek akselerasi cepat 1400m. Kunci kemenangan di sprint awal!',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
];

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'Front', label: 'Front (Nige)', description: 'Memimpin balapan sejak awal garis start.' },
  { id: 'Pace', label: 'Pace (Senko)', description: 'Menempel ketat di grup depan hingga tikungan akhir.' },
  { id: 'Late', label: 'Late (Sashi)', description: 'Berada di tengah lalu menyalip di lintasan lurus.' },
  { id: 'End', label: 'End (Oikomi)', description: 'Menyimpan stamina untuk sprint dahsyat di garis finish.' },
];

export const RacePrepModal: React.FC<RacePrepModalProps> = ({ onStartRace, onBackToHome }) => {
  const [selectedRace, setSelectedRace] = useState<RaceOption>(RACE_OPTIONS[1]); // Kyoto Turn default
  const [selectedStyle, setSelectedStyle] = useState<RunningStyle>('Pace');

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto z-30 font-sans text-white">
      <div className="w-full max-w-xl bg-slate-900/95 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer mr-1"
                title="Kembali ke Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
            <div>
              <h2 className="font-black text-lg sm:text-xl text-white tracking-wide uppercase">
                PERSIAPAN BALAPAN
              </h2>
              <span className="text-[10px] font-mono text-amber-300">Paddock & Strategy Selection</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono font-black text-amber-300">
            <Flag className="w-3.5 h-3.5" />
            <span>PADDOCK READY</span>
          </div>
        </div>

        {/* 1. RACE SELECTION */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>PILIHAN LINTASAN (RACE SELECTION)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {RACE_OPTIONS.map((race) => {
              const isSelected = selectedRace.id === race.id;
              return (
                <div
                  key={race.id}
                  onClick={() => setSelectedRace(race)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/60 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.02]'
                      : 'bg-slate-950/80 border-white/10 hover:border-amber-400/50 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-black rounded-md uppercase border ${race.badgeBg}`}>
                        {race.category}
                      </span>
                      <span className="text-xs font-mono font-black text-white">
                        {race.distance}m
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white mb-1">{race.name}</h3>
                    <p className="text-[10px] text-slate-300 leading-snug">{race.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. RUNNING STYLE SELECTION */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-extrabold text-cyan-300 uppercase tracking-widest flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>STRATEGI LARI (RUNNING STYLE)</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {STYLE_OPTIONS.map((st) => {
              const isSelected = selectedStyle === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-500/20 to-blue-950/60 border-2 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-[1.02]'
                      : 'bg-slate-950/80 border-white/10 hover:border-cyan-400/50 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs text-white mb-0.5 flex items-center justify-between">
                      <span>{st.label}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-tight">{st.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. START RACE BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => onStartRace(selectedRace, selectedStyle)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-black text-sm tracking-widest uppercase border border-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 text-amber-200 fill-amber-200" />
            <span>START RACE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
