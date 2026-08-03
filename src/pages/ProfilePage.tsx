import React from 'react';
import { AssetManager } from '../core/AssetManager';
import { useSave } from '../game/hooks/useSave';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ShieldCheck, Award, Trophy, User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { player, badges, achievements } = useSave();

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <GlassPanel variant="cyan" glow className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-pink-500 p-1 shadow-lg">
            <img
              src={AssetManager.getUrl(player.avatar)}
              alt={player.username}
              onError={(e) => AssetManager.handleImgError(e, 'characterFullBody')}
              className="w-full h-full rounded-xl object-cover bg-slate-900"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{player.username}</h2>
              <span className="px-2.5 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 font-mono font-bold rounded-lg border border-cyan-500/40">
                Lv.{player.trainerLevel}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">Public ID: <strong className="text-cyan-300">{player.publicId}</strong></p>
            <p className="text-[11px] text-slate-400 mt-1">Last Synced: {new Date(player.lastSyncedAt).toLocaleString()}</p>
          </div>
        </div>
      </GlassPanel>

      {/* Badges & Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel variant="neutral" className="p-6">
          <h3 className="text-sm font-bold text-cyan-300 uppercase mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" /> Trainer Badges
          </h3>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                  <p className="text-[11px] text-slate-300">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel variant="neutral" className="p-6">
          <h3 className="text-sm font-bold text-pink-300 uppercase mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pink-400" /> Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                  <p className="text-[11px] text-slate-300">{ach.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">+{ach.rewardCarrotCoins} CC</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
