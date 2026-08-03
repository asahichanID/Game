import React, { useState } from 'react';
import { useSave } from '../game/hooks/useSave';
import { useEndpoint } from '../game/hooks/useEndpoint';
import { RoutePath, GAME_ROUTES } from '../router/routes';
import { ToastContainer } from '../components/ui/ToastContainer';
import { PopupDialog } from '../components/ui/PopupDialog';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { VideoOverlayPlayer } from '../components/ui/VideoOverlayPlayer';
import { ParticleCanvas } from '../components/ui/ParticleCanvas';
import {
  Home,
  User,
  Dumbbell,
  Trophy,
  BookOpen,
  Package,
  ShieldCheck,
  Settings,
  Terminal,
  Menu,
  X,
  Coins,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MainGameLayoutProps {
  currentRoute: RoutePath;
  onRouteChange: (route: RoutePath) => void;
  children: React.ReactNode;
}

export const MainGameLayout: React.FC<MainGameLayoutProps> = ({
  currentRoute,
  onRouteChange,
  children,
}) => {
  const { player } = useSave();
  const { isSyncing, syncCarrotCoins } = useEndpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'User': return <User className="w-4 h-4" />;
      case 'Dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-screen h-screen min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Background Anime Particles */}
      <ParticleCanvas />

      {/* Global Overlays */}
      <ToastContainer />
      <PopupDialog />
      <LoadingOverlay />
      <VideoOverlayPlayer />

      {/* FLOATING TOP HUD (MOBILE GAME STYLE) */}
      <header className="fixed top-2 left-2 right-2 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Player Trainer Lv & Carrot Coins */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Trainer Lv Badge */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-full shadow-lg">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black text-cyan-300 font-mono tracking-wide">
              Lv.{player.trainerLevel}
            </span>
          </div>

          {/* Carrot Coins */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-full shadow-lg">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="text-xs font-extrabold text-amber-300 font-mono">
              {player.carrotCoins.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right: Floating Menu Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-white/20 hover:border-pink-500/60 text-white px-3 py-1.5 rounded-full shadow-xl hover:bg-slate-900 transition-all cursor-pointer active:scale-95"
            title="Buka Menu Navigasi Game"
          >
            <Menu className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold tracking-wide uppercase">Menu</span>
          </button>
        </div>
      </header>

      {/* SLEEK MOBILE SLIDE-OVER DRAWER FOR OTHER ROUTES */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-72 max-w-[80vw] h-full bg-slate-900/95 border-l border-white/10 p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h3 className="font-black text-base text-white tracking-wider">GAME MENU</h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Route Links */}
              <div className="space-y-1.5">
                {GAME_ROUTES.map((route) => {
                  const isActive = currentRoute === route.path;
                  return (
                    <button
                      key={route.path}
                      onClick={() => {
                        onRouteChange(route.path);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getIcon(route.iconName)}
                        <span>{route.title}</span>
                      </div>
                      {route.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-pink-500/20 text-pink-300 rounded-full font-mono border border-pink-400/30">
                          {route.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  syncCarrotCoins(100, 'Daily Bonus');
                }}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
              >
                <Coins className="w-4 h-4" />
                <span>Claim +100 Carrot Coins</span>
              </button>
              <p className="text-[10px] text-center text-slate-500 font-mono">
                Uma Musume Inspired &bull; MediaGame
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GAME CONTENT VIEW */}
      <main className="w-full h-full relative z-10">{children}</main>
    </div>
  );
};

