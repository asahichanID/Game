import React from 'react';
import { AssetManager } from '../core/AssetManager';
import { useCharacter } from '../game/hooks/useCharacter';
import { useAudio } from '../game/hooks/useAudio';
import { GlassPanel } from '../components/ui/GlassPanel';
import { AnimeButton } from '../components/ui/AnimeButton';
import { Volume2, Sparkles, PlusCircle } from 'lucide-react';

export const CharacterPage: React.FC = () => {
  const { selectedCharacter, allCharacters, selectCharacter } = useCharacter();
  const { playVoice } = useAudio();

  return (
    <div className="flex flex-col gap-6">
      {/* Character Selector Strip */}
      <GlassPanel variant="neutral" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Pilih Karakter (Beta Mode)</h3>
          <span className="text-xs text-slate-400">Total Available: {allCharacters.length}</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {allCharacters.map((char) => (
            <button
              key={char.id}
              onClick={() => selectCharacter(char.id)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedCharacter.id === char.id
                  ? 'bg-pink-500/20 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <img
                src={AssetManager.getUrl(char.icon)}
                alt={char.name}
                onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
                className="w-10 h-10 rounded-lg object-cover bg-slate-800"
              />
              <div className="text-left">
                <h4 className="text-xs font-bold">{char.name}</h4>
                <span className="text-[10px] text-pink-300 font-mono font-bold">{char.rarity}</span>
              </div>
            </button>
          ))}

          {/* Future character slot placeholder */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-white/20 bg-slate-900/30 text-slate-500 text-xs shrink-0">
            <PlusCircle className="w-5 h-5 text-slate-600" />
            <span>Folder Slot +1 (Ready via JSON Config)</span>
          </div>
        </div>
      </GlassPanel>

      {/* Main Character Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full Body View */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[400px]">
          <GlassPanel variant="magenta" glow className="p-6 w-full flex justify-center items-center">
            <img
              src={AssetManager.getUrl(selectedCharacter.fullBody)}
              alt={selectedCharacter.name}
              onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
              className="h-[420px] object-contain drop-shadow-[0_10px_20px_rgba(236,72,153,0.3)]"
            />
          </GlassPanel>
        </div>

        {/* Stats, Voice Lines & Growth */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <GlassPanel variant="cyan" className="p-6">
            <h2 className="text-2xl font-black text-white">{selectedCharacter.name}</h2>
            <p className="text-xs text-cyan-300 font-mono mb-4">{selectedCharacter.title}</p>

            {/* Status Bars */}
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Base Status & Growth</h3>
            <div className="space-y-3">
              {Object.entries(selectedCharacter.status).map(([statKey, val]) => {
                const growthVal = selectedCharacter.growth[`${statKey}Growth` as keyof typeof selectedCharacter.growth];
                return (
                  <div key={statKey} className="flex items-center gap-3 text-xs">
                    <span className="w-20 uppercase font-mono font-bold text-slate-400">{statKey}</span>
                    <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
                        style={{ width: `${Math.min(100, (val / 150) * 100)}%` }}
                      />
                    </div>
                    <span className="w-12 font-mono font-extrabold text-cyan-300">{val}</span>
                    <span className="w-12 text-[10px] text-pink-400 font-mono font-bold">+{growthVal}%</span>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          {/* Voice Lines Player */}
          <GlassPanel variant="neutral" className="p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-pink-400" /> Voice Lines (JVoice Engine)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(selectedCharacter.voice).map(([voiceKey, line]) => (
                <button
                  key={voiceKey}
                  onClick={() => playVoice(line)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/10 hover:border-pink-500/50 text-left transition-colors group cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-pink-400">{voiceKey}</span>
                    <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">{line}</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-pink-400 shrink-0" />
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
