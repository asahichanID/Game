import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUI } from '../../game/hooks/useUI';

export const LoadingOverlay: React.FC = () => {
  const { loading } = useUI();

  return (
    <AnimatePresence>
      {loading.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md"
        >
          {/* Animated anime glowing ring */}
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-amber-400 border-b-transparent border-l-pink-400 animate-spin opacity-80" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>

          <p className="text-cyan-300 font-bold tracking-widest text-sm uppercase animate-pulse">
            {loading.message}
          </p>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 animate-pulse w-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
