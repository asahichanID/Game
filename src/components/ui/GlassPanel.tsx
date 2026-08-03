import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'magenta' | 'amber' | 'neutral';
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'neutral',
  glow = false,
}) => {
  const borderStyles = {
    cyan: 'border-cyan-500/40 hover:border-cyan-400/80',
    magenta: 'border-pink-500/40 hover:border-pink-400/80',
    amber: 'border-amber-500/40 hover:border-amber-400/80',
    neutral: 'border-white/20 hover:border-white/40',
  };

  const glowStyles = glow
    ? {
        cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        magenta: 'shadow-[0_0_20px_rgba(236,72,153,0.25)]',
        amber: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        neutral: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
      }[variant]
    : '';

  return (
    <div
      className={`relative backdrop-blur-md bg-slate-900/75 border rounded-2xl transition-all duration-300 ${borderStyles[variant]} ${glowStyles} ${className}`}
    >
      {/* Corner decorative anime accent lines */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pink-400 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-pink-400 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl pointer-events-none" />
      {children}
    </div>
  );
};
