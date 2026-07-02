import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Wait for animation to finish
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2.5, 
          ease: "easeInOut" 
        }}
        className="relative"
      >
        <motion.h1
          className="text-[15rem] font-black tracking-tighter uppercase text-white"
          animate={{
            textShadow: [
              "0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de",
              "0 0 20px #00f2ff, 0 0 40px #00f2ff, 0 0 60px #00f2ff",
              "0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de"
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            WebkitTextStroke: "4px #fff",
          }}
        >
          TS
        </motion.h1>
        
        {/* Neon light scan effect */}
        <motion.div
          className="absolute -top-10 -left-10 right-0 bottom-0 pointer-events-none"
          animate={{
            y: [-100, 400],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-md" />
        </motion.div>
      </motion.div>
    </div>
  );
};
