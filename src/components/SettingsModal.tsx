import React from "react";
import { THEMES } from "../constants/themes";
import { X, Settings, Check, Sparkles, Smartphone, Play } from "lucide-react";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  themeId: string;
  vibeEnabled: boolean;
  onVibeEnabledChange: (enabled: boolean) => void;
  vibeDuration: number;
  onVibeDurationChange: (duration: number) => void;
  vibeIntensity: number;
  onVibeIntensityChange: (intensity: number) => void;
  onTestVibe: (type: "click" | "like") => void;
}

export default function SettingsModal({
  visible,
  onClose,
  themeId,
  vibeEnabled,
  onVibeEnabledChange,
  vibeDuration,
  onVibeDurationChange,
  vibeIntensity,
  onVibeIntensityChange,
  onTestVibe,
}: SettingsModalProps) {
  if (!visible) return null;

  const currentTheme = THEMES[themeId];

  const INTENSITY_LABELS = ["Soft Pulse", "Vibrant Buzz", "Deep Resonance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      {/* Backdrop tap zone */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div 
        className="w-full max-w-md overflow-hidden rounded-[32px] shadow-2xl transition-all duration-300 liquid-glass border border-white/10"
        style={{ 
          color: currentTheme.textPrimary 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div 
              className="p-1.5 rounded-xl border"
              style={{ 
                borderColor: `${currentTheme.primary}40`,
                backgroundColor: `${currentTheme.primary}15`,
                color: currentTheme.primary
              }}
            >
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Tactile Settings</h3>
              <p className="text-[11px] opacity-80" style={{ color: currentTheme.textMuted }}>
                Customize haptic and vibration feedback
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            style={{ color: currentTheme.textMuted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-none">
          
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-zinc-100 flex items-center gap-1.5">
                <Smartphone size={14} className="text-pink-400" />
                Vibration Feedback
              </span>
              <p className="text-[10px]" style={{ color: currentTheme.textMuted }}>
                Enable tactile sensations for card interactions
              </p>
            </div>
            <button
              onClick={() => onVibeEnabledChange(!vibeEnabled)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              style={{ 
                backgroundColor: vibeEnabled ? currentTheme.primary : "rgba(255, 255, 255, 0.15)"
              }}
            >
              <span
                className={`${
                  vibeEnabled ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          {vibeEnabled && (
            <>
              {/* Slider for Duration */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                    Vibration Duration
                  </h4>
                  <span className="text-xs font-mono font-bold" style={{ color: currentTheme.primary }}>
                    {vibeDuration} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={vibeDuration}
                  onChange={(e) => onVibeDurationChange(parseInt(e.target.value, 10))}
                  className="w-full accent-current cursor-pointer"
                  style={{ color: currentTheme.primary }}
                />
                <div className="flex justify-between text-[9px] font-semibold" style={{ color: currentTheme.textMuted }}>
                  <span>Short (5ms)</span>
                  <span>Medium (50ms)</span>
                  <span>Long (100ms)</span>
                </div>
              </div>

              {/* Slider for Vibe Intensity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                    Vibe Intensity
                  </h4>
                  <span className="text-xs font-bold" style={{ color: currentTheme.primary }}>
                    {INTENSITY_LABELS[vibeIntensity]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={vibeIntensity}
                  onChange={(e) => onVibeIntensityChange(parseInt(e.target.value, 10))}
                  className="w-full accent-current cursor-pointer"
                  style={{ color: currentTheme.primary }}
                />
                <div className="flex justify-between text-[9px] font-semibold" style={{ color: currentTheme.textMuted }}>
                  <span>Soft</span>
                  <span>Vibrant</span>
                  <span>Deep</span>
                </div>
              </div>

              {/* Interactive Sandbox Test Area */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                  Interactive Haptic Test Bench
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onTestVibe("click")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-zinc-100"
                  >
                    <Play size={12} className="text-cyan-400" />
                    <span>Test Tap Vibe</span>
                  </button>
                  <button
                    onClick={() => onTestVibe("like")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-zinc-100"
                  >
                    <Sparkles size={12} className="text-pink-400" />
                    <span>Test Burst Vibe</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {!vibeEnabled && (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Vibration is disabled. Enable it above to test and configure.
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/25 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-center text-white transition-all duration-300 active:scale-98 cursor-pointer shadow-md"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 4px 15px ${currentTheme.primary}40`
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
