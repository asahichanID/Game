import React from 'react';
import { motion } from 'motion/react';
import { AudioManager } from '../../core/AudioManager';

interface AnimeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  sound?: string;
}

export const AnimeButton: React.FC<AnimeButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  sound = 'click',
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    AudioManager.playSFX(sound);
    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 border-cyan-300/40',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/60 shadow-slate-900/50',
    accent:
      'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-500/25 border-pink-300/40',
    amber:
      'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black shadow-amber-500/25 border-yellow-200/50',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-500/25 border-red-400/40',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-bold',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-3 font-extrabold tracking-wide',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center border shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...(props as unknown as React.ComponentProps<typeof motion.button>)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
