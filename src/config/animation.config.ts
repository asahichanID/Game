export const ANIMATION_CONFIG = {
  durations: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    epic: 1.0,
  },
  easing: {
    spring: { type: 'spring', stiffness: 400, damping: 25 },
    bounce: { type: 'spring', stiffness: 300, damping: 15 },
    smooth: [0.4, 0, 0.2, 1],
  },
  presets: {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    slideUp: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -20, opacity: 0 } },
    scalePop: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 } },
    glowPulse: { animate: { boxShadow: ['0 0 10px rgba(59,130,246,0.5)', '0 0 25px rgba(236,72,153,0.8)', '0 0 10px rgba(59,130,246,0.5)'] } },
  },
};
