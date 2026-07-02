import React from "react";
import { THEMES } from "../constants/themes";
import { UserTheme } from "../types";
import { X, Check } from "lucide-react";

interface ThemePickerProps {
  visible: boolean;
  onClose: () => void;
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export default function ThemePicker({
  visible,
  onClose,
  activeThemeId,
  onSelectTheme,
}: ThemePickerProps) {
  if (!visible) return null;

  const currentTheme = THEMES[activeThemeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div 
        className="w-full max-w-md overflow-hidden rounded-[32px] shadow-2xl transition-all duration-300 liquid-glass border border-white/10"
        style={{ 
          color: currentTheme.textPrimary 
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b border-white/10"
        >
          <div>
            <h3 className="text-base font-black tracking-tight">Select App Theme</h3>
            <p className="text-[11px] opacity-80" style={{ color: currentTheme.textMuted }}>
              Personalize your TS Connect experience
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            style={{ color: currentTheme.textMuted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-4 space-y-2.5 max-h-[50vh] overflow-y-auto scrollbar-none">
          {Object.values(THEMES).map((theme: UserTheme) => {
            const isActive = theme.id === activeThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 active:scale-98 cursor-pointer ${
                  isActive ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
                style={{
                  boxShadow: isActive ? `0 0 15px ${theme.primary}25` : "none"
                }}
              >
                <div className="flex items-center space-x-3">
                  {/* Theme Circle Color Preview */}
                  <div className="flex -space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs" 
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs" 
                      style={{ backgroundColor: theme.headerBg }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs" 
                      style={{ backgroundColor: theme.background }}
                    />
                  </div>

                  <div>
                    <span className="font-extrabold text-xs block text-zinc-100">{theme.name}</span>
                    <span className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                      {theme.id === "sophisticated" 
                        ? "Luxurious gold & deep black" 
                        : theme.id === "iridescent_silk" 
                          ? "Futuristic iOS 27 Liquid Glass" 
                          : theme.id === "emerald" 
                            ? "Light elegant theme" 
                            : "Dark immersive theme"}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{ 
                      backgroundColor: theme.primary, 
                      color: "#fff",
                      boxShadow: `0 0 10px ${theme.primary}`
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 flex justify-end border-t border-white/10 bg-black/20"
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer hover:brightness-110 shadow-md"
            style={{ 
              backgroundColor: currentTheme.primary,
              boxShadow: `0 4px 15px ${currentTheme.primary}45`,
              color: "#fff"
            }}
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}
