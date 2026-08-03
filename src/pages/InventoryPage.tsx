import React from 'react';
import { useSave } from '../game/hooks/useSave';
import { useUI } from '../game/hooks/useUI';
import { GlassPanel } from '../components/ui/GlassPanel';
import { AnimeButton } from '../components/ui/AnimeButton';
import { Package, Sparkles } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { inventory } = useSave();
  const { showToast } = useUI();

  const handleUseItem = (itemName: string) => {
    showToast('Item Used', `Menggunakan ${itemName}! Status stamina meningkat!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassPanel variant="neutral" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Item Inventory & Storage</h2>
            <p className="text-xs text-slate-400">Daftar item konsumsi, kuis, dan perlengkapan trainer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="px-2 py-0.5 text-[9px] bg-pink-500/20 text-pink-300 rounded font-mono font-bold">
                    {item.rarity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs font-mono font-bold text-cyan-300">Jumlah: {item.quantity}</span>
                  <AnimeButton variant="primary" size="sm" onClick={() => handleUseItem(item.name)}>
                    Gunakan
                  </AnimeButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
