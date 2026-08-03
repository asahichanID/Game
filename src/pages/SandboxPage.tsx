import React, { useState } from 'react';
import { useUI } from '../game/hooks/useUI';
import { useEndpoint } from '../game/hooks/useEndpoint';
import { useAudio } from '../game/hooks/useAudio';
import { useVideo } from '../game/hooks/useVideo';
import { useSave } from '../game/hooks/useSave';
import { useCharacter } from '../game/hooks/useCharacter';
import { ResourceManager } from '../core/ResourceManager';
import { GlassPanel } from '../components/ui/GlassPanel';
import { AnimeButton } from '../components/ui/AnimeButton';
import {
  Terminal,
  Play,
  Volume2,
  Film,
  Zap,
  RefreshCw,
  Coins,
  CheckCircle,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SandboxPage: React.FC = () => {
  const { showToast, showDialog, openPopup, showLoading, hideLoading } = useUI();
  const { isMock, toggleMockMode, loginWithToken, syncCarrotCoins, performFullSync, isSyncing, lastSyncMsg } =
    useEndpoint();
  const { playSFX, playVoice } = useAudio();
  const { playVideo } = useVideo();
  const { player, exportSave } = useSave();
  const { selectedCharacter } = useCharacter();

  const [testTokenInput, setTestTokenInput] = useState('MAINAPP_JWT_MOCK_TOKEN_98241');
  const [preloadProgress, setPreloadProgress] = useState<number | null>(null);

  const handleTestPreload = async () => {
    setPreloadProgress(0);
    showLoading('Preloading Game Resources (Images, Video, Audio)...');
    await ResourceManager.preloadCriticalBatch((prog) => {
      setPreloadProgress(prog.percentage);
    });
    hideLoading();
    showToast('Preload Finished', 'Seluruh resource game berhasil di-cache!', 'success');
  };

  const handleTestTokenLogin = async () => {
    if (!testTokenInput) return;
    showLoading('Memverifikasi Token dari Web Utama...');
    const res = await loginWithToken(testTokenInput);
    hideLoading();
    showToast('Token Verified', res.message, res.success ? 'success' : 'error');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sandbox Header */}
      <GlassPanel variant="magenta" glow className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-black text-white">Developer Testing & Sandbox Inspector</h2>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">
            AI Studio Environment
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Gunakan halaman ini untuk menguji seluruh Manager, Endpoint, Audio/Video Engine, Save System, dan Asset Preloader tanpa bergantung pada web app utama.
        </p>
      </GlassPanel>

      {/* Grid Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: UI & MANAGER TEST */}
        <GlassPanel variant="cyan" className="p-6">
          <h3 className="text-sm font-bold text-cyan-300 uppercase mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> 1. UI Managers & Preloader Test
          </h3>

          <div className="flex flex-wrap gap-2.5">
            <AnimeButton
              variant="primary"
              size="sm"
              onClick={() => showToast('Test Toast', 'Ini adalah sampel Toast Notification!', 'info')}
            >
              Toast Info
            </AnimeButton>

            <AnimeButton
              variant="accent"
              size="sm"
              onClick={() => showToast('Sukses!', 'Carrot Coins tersinkronkan', 'success')}
            >
              Toast Success
            </AnimeButton>

            <AnimeButton
              variant="amber"
              size="sm"
              onClick={() =>
                showDialog({
                  title: 'Dialog Konfirmasi Test',
                  content: 'Uji coba modal dialog confirm!',
                  type: 'reward',
                  confirmText: 'Lanjutkan',
                })
              }
            >
              Trigger Dialog
            </AnimeButton>

            <AnimeButton
              variant="secondary"
              size="sm"
              onClick={() => openPopup('Modular Panel Test', 'CharacterDetailsComponent', { id: selectedCharacter.id })}
            >
              Open Modular Popup
            </AnimeButton>

            <AnimeButton variant="secondary" size="sm" onClick={handleTestPreload}>
              Preload Resources {preloadProgress !== null && `(${preloadProgress}%)`}
            </AnimeButton>
          </div>
        </GlassPanel>

        {/* SECTION 2: MAIN WEB APP ENDPOINT BRIDGE TEST */}
        <GlassPanel variant="amber" className="p-6">
          <h3 className="text-sm font-bold text-amber-300 uppercase mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> 2. Web App Endpoint API Bridge Test
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Mode Endpoint:</span>
              <button
                onClick={() => toggleMockMode(!isMock)}
                className={`px-2 py-0.5 rounded font-bold ${
                  isMock ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300'
                }`}
              >
                {isMock ? 'Mock Server Enabled' : 'Live REST API'}
              </button>
            </div>

            {/* Token Input Login Simulator */}
            <div className="flex gap-2">
              <input
                type="text"
                value={testTokenInput}
                onChange={(e) => setTestTokenInput(e.target.value)}
                placeholder="Masukkan Token Web Utama"
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <AnimeButton variant="amber" size="sm" onClick={handleTestTokenLogin} disabled={isSyncing}>
                Test Token Login
              </AnimeButton>
            </div>

            {/* Sync Actions */}
            <div className="flex flex-wrap gap-2 mt-2">
              <AnimeButton
                variant="primary"
                size="sm"
                icon={<Coins className="w-3.5 h-3.5" />}
                onClick={() => syncCarrotCoins(250, 'Sandbox Test Bonus')}
              >
                Sync +250 Carrot Coins
              </AnimeButton>

              <AnimeButton
                variant="secondary"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={performFullSync}
              >
                Perform Full Sync
              </AnimeButton>
            </div>

            {lastSyncMsg && <p className="text-[11px] font-mono text-emerald-400 mt-1">Status: {lastSyncMsg}</p>}
          </div>
        </GlassPanel>

        {/* SECTION 3: AUDIO & VIDEO ENGINE TEST */}
        <GlassPanel variant="neutral" className="p-6">
          <h3 className="text-sm font-bold text-pink-300 uppercase mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-pink-400" /> 3. Audio & Video Engine Test
          </h3>

          <div className="flex flex-wrap gap-2.5">
            <AnimeButton
              variant="accent"
              size="sm"
              icon={<Film className="w-3.5 h-3.5" />}
              onClick={() =>
                playVideo({
                  src: selectedCharacter.ultimateVideo,
                  title: `${selectedCharacter.name} Ultimate Cutscene MP4`,
                })
              }
            >
              Play Ultimate Video MP4
            </AnimeButton>

            <AnimeButton variant="secondary" size="sm" onClick={() => playSFX('click')}>
              Synth Click SFX
            </AnimeButton>

            <AnimeButton variant="secondary" size="sm" onClick={() => playSFX('levelup')}>
              Synth LevelUp SFX
            </AnimeButton>

            <AnimeButton variant="secondary" size="sm" onClick={() => playVoice(selectedCharacter.voice.greeting)}>
              Play Voice Line
            </AnimeButton>
          </div>
        </GlassPanel>

        {/* SECTION 4: CHARACTER & SAVE JSON INSPECTOR */}
        <GlassPanel variant="neutral" className="p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> 4. Raw Character JSON Config Inspector
          </h3>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 text-[10px] font-mono text-cyan-300 max-h-[160px] overflow-y-auto">
            {JSON.stringify(selectedCharacter, null, 2)}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
