import React from "react";
import { THEMES } from "../constants/themes";
import { X, Settings, Check, Sparkles, Smartphone, Play, LogOut, User, MapPin, Shield } from "lucide-react";
import { auth } from "../lib/firebase";
import AdminAdsManager from "./AdminAdsManager";
import { ModelAd } from "../lib/userService";

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
  currentUserProfile?: {
    name: string;
    pronouns: string;
    genderIdentity: string;
    locationName: string;
    photo?: string;
    premium?: boolean;
  } | null;
  onLogout?: () => void;
  onOpenPremium?: () => void;
  onAdsUpdated?: (ads: ModelAd[]) => void;
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
  currentUserProfile,
  onLogout,
  onOpenPremium,
  onAdsUpdated,
}: SettingsModalProps) {
  if (!visible) return null;

  const currentTheme = THEMES[themeId];

  const INTENSITY_LABELS = ["Soft Pulse", "Vibrant Buzz", "Deep Resonance"];

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
              <h3 className="text-base font-black tracking-tight">Ajustes & Cuenta</h3>
              <p className="text-[11px] opacity-80" style={{ color: currentTheme.textMuted }}>
                Personaliza tu vibra y perfil social
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
          
          {/* Real User Account Info Profile Section */}
          {currentUserProfile ? (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest block text-pink-400">
                Tu Cuenta Auténtica
              </span>
              <div className="flex items-center space-x-3.5">
                <img 
                  src={currentUserProfile.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"} 
                  alt={currentUserProfile.name} 
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-white truncate flex items-center gap-1.5">
                    {currentUserProfile.name}
                    <span className="text-[10px] font-normal text-zinc-400">({currentUserProfile.pronouns})</span>
                    {currentUserProfile.premium && (
                      <span className="text-[8px] font-black text-black bg-gradient-to-r from-yellow-400 to-amber-500 py-0.5 px-1.5 rounded-full uppercase shrink-0">GOLD</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-zinc-300 truncate flex items-center gap-1">
                    <User size={10} className="text-purple-400" />
                    {currentUserProfile.genderIdentity}
                  </p>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-cyan-400" />
                    {currentUserProfile.locationName}
                  </p>
                </div>
              </div>

              {currentUserProfile.premium ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center space-x-1.5 text-xs font-extrabold animate-pulse">
                  <span>👑 Suscripción Gold Activa</span>
                </div>
              ) : (
                <button
                  onClick={onOpenPremium}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black flex items-center justify-center space-x-1.5 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-lg hover:shadow-yellow-500/10"
                >
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Activar TS Connect Gold 👑</span>
                </button>
              )}

              <button
                onClick={handleLogoutClick}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center space-x-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <LogOut size={12} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center py-5 space-y-1">
              <p className="text-xs font-bold text-zinc-300">Modo de Prueba (Invitado)</p>
              <p className="text-[10px] text-zinc-500">Regístrate para habilitar tu perfil único con persistencia en la nube.</p>
            </div>
          )}

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-zinc-100 flex items-center gap-1.5">
                <Smartphone size={14} className="text-pink-400" />
                Vibración Háptica
              </span>
              <p className="text-[10px]" style={{ color: currentTheme.textMuted }}>
                Habilitar sensaciones táctiles para interacciones
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
                    Duración de Vibración
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
                  <span>Corta (5ms)</span>
                  <span>Mediana (50ms)</span>
                  <span>Larga (100ms)</span>
                </div>
              </div>

              {/* Slider for Vibe Intensity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                    Intensidad de Vibra
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
                  <span>Suave</span>
                  <span>Vibrante</span>
                  <span>Profunda</span>
                </div>
              </div>

              {/* Interactive Sandbox Test Area */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                  Probador Háptico Interactivo
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onTestVibe("click")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-zinc-100"
                  >
                    <Play size={12} className="text-cyan-400" />
                    <span>Probar Toque</span>
                  </button>
                  <button
                    onClick={() => onTestVibe("like")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-zinc-100"
                  >
                    <Sparkles size={12} className="text-pink-400" />
                    <span>Probar Estallido</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {!vibeEnabled && (
            <div className="py-8 text-center text-zinc-500 text-xs">
              La vibración está desactivada. Actívala arriba para probar.
            </div>
          )}

          {/* Admin Panel: Model Sponsorship & Ad Management */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-100 pb-1">
              <div className="p-1 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Shield size={12} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">
                Panel de Administración (Modelos y Publicidad)
              </span>
            </div>
            
            <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 shadow-inner">
              <AdminAdsManager 
                themeId={themeId} 
                theme={currentTheme} 
                onAdsUpdated={onAdsUpdated}
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-t-white/10 bg-black/25 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-center text-white transition-all duration-300 active:scale-98 cursor-pointer shadow-md"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 4px 15px ${currentTheme.primary}40`
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
