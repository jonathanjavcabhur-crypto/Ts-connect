import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Sparkles, Flame, CheckCircle } from "lucide-react";
import { triggerHaptic } from "../App";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  vibeEnabled: boolean;
  vibeDuration: number;
  vibeIntensity: number;
}

export default function LoginScreen({
  onLoginSuccess,
  vibeEnabled,
  vibeDuration,
  vibeIntensity,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor, introduce tu correo y contraseña.");
      triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");
      return;
    }

    setIsLoading(true);
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");

    // Seductive visual feedback delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");

      setTimeout(() => {
        onLoginSuccess();
      }, 2000);
    }, 1200);
  };

  const handleQuickGuestAccess = () => {
    setEmail("invitado@tsconnect.com");
    setPassword("vibe_secret_123");
    setIsLoading(true);
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020205] z-[9998] flex items-center justify-center p-4 select-none">
      {/* Absolute high-fidelity neon atmospheric glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-25 bg-pink-600 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 bg-purple-600 mix-blend-screen pointer-events-none" />

      <div 
        className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-black/55 backdrop-blur-3xl text-white shadow-2xl relative transition-all duration-700"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl animate-pulse">
            <Flame size={28} className="text-pink-500 fill-pink-500" />
          </div>
          <div className="space-y-1">
            <span 
              className="text-xl font-bold tracking-[0.3em] text-white"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              TS CONNECT
            </span>
            <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-semibold">
              Conexión Secreta & Genuina
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-scale-up">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400">
              <CheckCircle size={44} className="animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">¡Vibe Autorizado!</h3>
              <p className="text-xs text-zinc-400">Sincronizando frecuencias de usuario...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block pl-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-pink-500/50 rounded-2xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block">
                  Contraseña
                </label>
                <span className="text-[10px] text-zinc-500 hover:text-pink-400 cursor-pointer transition-colors">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-pink-500/50 rounded-2xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl cursor-pointer active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={14} className="text-pink-200" />
                  <span>INICIAR SESIÓN</span>
                </>
              )}
            </button>

            {/* Divider line */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] text-zinc-500 uppercase tracking-widest font-black">
                O conecta con
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="py-3 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
                title="Google"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="py-3 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
                title="iCloud"
              >
                <span className="text-white font-black text-xs">iC</span>
              </button>
              <button
                type="button"
                className="py-3 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
                title="Teléfono"
              >
                <span className="text-white font-black text-xs">📱</span>
              </button>
            </div>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={handleQuickGuestAccess}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 font-bold text-xs rounded-2xl cursor-pointer transition-all flex items-center justify-center space-x-2"
            >
              <span>Entrar como Invitado</span>
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-[10px] text-zinc-500">
            ¿No tienes cuenta? <span className="text-pink-400 hover:underline cursor-pointer">Regístrate</span>
          </p>
        </div>
      </div>
    </div>
  );
}
