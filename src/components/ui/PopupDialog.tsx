import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUI } from '../../game/hooks/useUI';
import { AnimeButton } from './AnimeButton';
import { GlassPanel } from './GlassPanel';
import { X } from 'lucide-react';

export const PopupDialog: React.FC = () => {
  const { dialog, popup, closeDialog, closePopup } = useUI();

  return (
    <>
      {/* Dialog Confirm/Alert */}
      <AnimatePresence>
        {dialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="max-w-md w-full"
            >
              <GlassPanel variant={dialog.type === 'danger' ? 'magenta' : 'cyan'} glow className="p-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <h3 className="text-lg font-black tracking-wide text-cyan-300 uppercase">{dialog.title}</h3>
                  <button onClick={closeDialog} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-4 text-sm text-slate-200">{dialog.content}</div>
                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  {dialog.cancelText && (
                    <AnimeButton variant="secondary" size="sm" onClick={closeDialog}>
                      {dialog.cancelText}
                    </AnimeButton>
                  )}
                  <AnimeButton
                    variant={dialog.type === 'danger' ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => {
                      if (dialog.onConfirm) dialog.onConfirm();
                      closeDialog();
                    }}
                  >
                    {dialog.confirmText || 'OK'}
                  </AnimeButton>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Popup Modular Panel */}
      <AnimatePresence>
        {popup && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-2xl w-full"
            >
              <GlassPanel variant="magenta" glow className="p-6">
                <div className="flex justify-between items-center pb-4 border-b border-pink-500/30">
                  <h3 className="text-xl font-black text-pink-300 uppercase">{popup.title}</h3>
                  <button onClick={closePopup} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="py-5 text-slate-200 min-h-[180px]">
                  <p className="text-sm text-slate-300 mb-4">
                    Component Popup Modular Dynamic: <span className="text-pink-400 font-mono">{popup.componentName}</span>
                  </p>
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-white/10 text-xs font-mono">
                    {JSON.stringify(popup.props || {}, null, 2)}
                  </div>
                </div>
                <div className="flex justify-end pt-3">
                  <AnimeButton variant="secondary" size="sm" onClick={closePopup}>
                    Tutup Popup
                  </AnimeButton>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
