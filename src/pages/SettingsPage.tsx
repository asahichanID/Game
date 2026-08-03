import React from 'react';
import { useAudio } from '../game/hooks/useAudio';
import { useSave } from '../game/hooks/useSave';
import { useUI } from '../game/hooks/useUI';
import { GlassPanel } from '../components/ui/GlassPanel';
import { AnimeButton } from '../components/ui/AnimeButton';
import { Settings, Volume2, Download, Upload, RotateCcw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { audioState, setVolume, toggleMute } = useAudio();
  const { exportSave, importSave, resetSave } = useSave();
  const { showToast, showDialog } = useUI();

  const handleExport = () => {
    const json = exportSave();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shironna_game_save_${Date.now()}.json`;
    a.click();
    showToast('Export Success', 'Save File JSON berhasil diunduh!', 'success');
  };

  const handleReset = () => {
    showDialog({
      title: 'Reset Save Data?',
      content: 'Apakah Anda yakin ingin mengembalikan seluruh progress ke setelan awal?',
      type: 'danger',
      confirmText: 'Reset Sekarang',
      onConfirm: () => {
        resetSave();
        showToast('Reset Done', 'Save data telah dikembalikan ke default!', 'info');
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassPanel variant="neutral" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-black text-white">Pengaturan Multi-Channel Audio & Systems</h2>
        </div>

        {/* Audio Volume Controls */}
        <div className="space-y-4 max-w-lg mb-8">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>BGM Volume</span>
              <span className="font-mono">{Math.round(audioState.bgmVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.bgmVolume}
              onChange={(e) => setVolume('bgm', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>Voice Volume</span>
              <span className="font-mono">{Math.round(audioState.voiceVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.voiceVolume}
              onChange={(e) => setVolume('voice', parseFloat(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>SFX Volume</span>
              <span className="font-mono">{Math.round(audioState.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.sfxVolume}
              onChange={(e) => setVolume('sfx', parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Management */}
        <h3 className="text-sm font-bold text-cyan-300 uppercase mb-3">Sistem Save Manager & Data Migration</h3>
        <div className="flex flex-wrap gap-3">
          <AnimeButton variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export Save JSON
          </AnimeButton>

          <AnimeButton variant="danger" icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>
            Reset All Save Progress
          </AnimeButton>
        </div>
      </GlassPanel>
    </div>
  );
};
