import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUI } from '../../game/hooks/useUI';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useUI();

  const icons = {
    info: <Info className="w-5 h-5 text-cyan-400" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
  };

  const borders = {
    info: 'border-cyan-500/50 bg-cyan-950/80',
    success: 'border-emerald-500/50 bg-emerald-950/80',
    warning: 'border-amber-500/50 bg-amber-950/80',
    error: 'border-rose-500/50 bg-rose-950/80',
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl text-white ${borders[toast.type]}`}
          >
            <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-wide">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
