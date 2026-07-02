import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MockUser } from '../types';

interface VibeCardItemProps {
  item: MockUser;
  isLiked: boolean;
  isVibeAligned: boolean;
  onClick: () => void;
  boosterGlowStyle: React.CSSProperties;
}

export const VibeCardItem: React.FC<VibeCardItemProps> = ({ item, isLiked, isVibeAligned, onClick, boosterGlowStyle }) => {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    if (isVibeAligned) {
      // Futuristic synth-wave sound
      const playVibeSound = () => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      };
      
      // Small timeout to avoid immediate play on mount if not desired, 
      // but here it is fine. 
      setTimeout(playVibeSound, 100);
    }
  }, [isVibeAligned]);

  const handleClick = () => {
    onClick();
    if (item.matchPct >= 85) {
      setRipple(true);
      setTimeout(() => setRipple(false), 1000);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative aspect-4/5 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-lg active:scale-97 card-3d glass-shine border border-white/5 bg-zinc-900/40 backdrop-blur-xs ${isVibeAligned ? 'animate-vibe-pulse' : ''}`}
      style={boosterGlowStyle}
    >
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-cyan-400/40 rounded-full z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <img
        src={item.photo}
        alt={item.name}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      {isLiked && (
        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-500 font-black shadow-xl">
            ♥
          </div>
        </div>
      )}
    </div>
  );
};
