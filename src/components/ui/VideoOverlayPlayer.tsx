import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AssetManager } from '../../core/AssetManager';
import { useVideo } from '../../game/hooks/useVideo';
import { X, Volume2, VolumeX } from 'lucide-react';

export const VideoOverlayPlayer: React.FC = () => {
  const { activeVideo, stopVideo } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  if (!activeVideo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      >
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center p-4">
          {/* Header Controls */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-3 bg-slate-900/80 p-2 rounded-xl border border-white/20 backdrop-blur-md">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !videoRef.current.muted;
                  setIsMuted(videoRef.current.muted);
                }
              }}
              className="p-2 text-slate-200 hover:text-cyan-300"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={stopVideo}
              className="p-2 text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 text-xs uppercase"
            >
              <X className="w-5 h-5" /> Skip Cutscene
            </button>
          </div>

          {activeVideo.title && (
            <div className="absolute top-6 left-6 z-10 bg-slate-900/80 px-4 py-2 rounded-xl border border-pink-500/40 backdrop-blur-md">
              <span className="text-xs font-black text-pink-400 tracking-wider uppercase">CUTSCENE</span>
              <h3 className="text-sm font-bold text-white">{activeVideo.title}</h3>
            </div>
          )}

          <video
            ref={videoRef}
            src={AssetManager.getUrl(activeVideo.src)}
            autoPlay
            controls={false}
            playsInline
            onEnded={stopVideo}
            onError={(e) => AssetManager.handleVideoError(e, 'ultimateVideo')}
            className="w-full h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] border border-white/10"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
