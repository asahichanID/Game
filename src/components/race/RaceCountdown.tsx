import React, { useEffect, useState } from 'react';

interface RaceCountdownProps {
  onFinishCountdown: () => void;
}

export const RaceCountdown: React.FC<RaceCountdownProps> = ({ onFinishCountdown }) => {
  const [step, setStep] = useState<number>(3);

  useEffect(() => {
    if (step > 0) {
      const timer = setTimeout(() => {
        setStep((prev) => prev - 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onFinishCountdown();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [step, onFinishCountdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm select-none pointer-events-none">
      <div className="relative flex items-center justify-center">
        {step > 0 ? (
          <div
            key={step}
            className="text-8xl sm:text-9xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-orange-400 to-amber-700 drop-shadow-[0_10px_30px_rgba(245,158,11,0.8)] animate-bounce"
          >
            {step}
          </div>
        ) : (
          <div
            key="go"
            className="text-8xl sm:text-9xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-700 drop-shadow-[0_10px_30px_rgba(56,189,248,0.9)] animate-pulse"
          >
            GO!
          </div>
        )}
      </div>
    </div>
  );
};
