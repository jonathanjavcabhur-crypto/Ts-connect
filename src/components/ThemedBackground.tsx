import React from "react";
import { THEMES } from "../constants/themes";

interface ThemedBackgroundProps {
  children: React.ReactNode;
  themeId: string;
}

export default function ThemedBackground({ children, themeId }: ThemedBackgroundProps) {
  const theme = THEMES[themeId];
  const isiOS27Theme = themeId === "iridescent_silk";

  return (
    <div
      className="min-h-screen w-full transition-all duration-500 font-sans antialiased relative overflow-hidden bg-[#030307]"
      style={{
        color: theme.textPrimary,
      }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {isiOS27Theme ? (
          <>
            {/* The generated high-fidelity premium background image */}
            <img 
              src="/src/assets/images/liquid_silk_glass_1782296703352.jpg" 
              alt="iOS 27 Liquid Silk Glass Background" 
              className="absolute inset-0 w-full h-full object-cover scale-105 select-none opacity-80 mix-blend-screen saturate-125"
              style={{ filter: "blur(2px) brightness(0.8)" }}
              referrerPolicy="no-referrer"
            />
            {/* Liquid overlay layers for ultra realism */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#050510]/50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/80" />
            
            {/* Soft pulsing glass refraction spots */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-magenta-500/20 blur-3xl animate-pulse mix-blend-color-dodge" style={{ animationDuration: "8s" }} />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse mix-blend-color-dodge" style={{ animationDuration: "12s" }} />
          </>
        ) : (
          <>
            {/* Blob 1: Gold / Amber */}
            <div 
              className="absolute w-[450px] h-[450px] rounded-full blur-[110px] opacity-25 mix-blend-screen animate-blob-1" 
              style={{
                top: "-10%",
                left: "15%",
                background: "radial-gradient(circle, #CFA060 0%, rgba(207,160,96,0) 70%)"
              }}
            />

            {/* Blob 2: Cyan / Teal */}
            <div 
              className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 mix-blend-screen animate-blob-2" 
              style={{
                bottom: "10%",
                right: "10%",
                background: "radial-gradient(circle, #06b6d4 0%, rgba(6,182,212,0) 70%)"
              }}
            />

            {/* Blob 3: Pink / Magenta */}
            <div 
              className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 mix-blend-screen animate-blob-3" 
              style={{
                top: "40%",
                left: "-5%",
                background: "radial-gradient(circle, #d946ef 0%, rgba(217,70,239,0) 70%)"
              }}
            />

            {/* Blob 4: Emerald / Purple Accent */}
            <div 
              className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 mix-blend-screen animate-blob-4" 
              style={{
                bottom: "-5%",
                left: "40%",
                background: `radial-gradient(circle, ${theme.primary} 0%, rgba(0,0,0,0) 70%)`
              }}
            />
          </>
        )}

        {/* Diagonal high-fidelity glass reflection streak */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.03] pointer-events-none" />
      </div>

      {/* App content container wrapper */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}

