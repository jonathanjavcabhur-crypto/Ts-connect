import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MapPin, 
  Flame, 
  MessageSquare, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Layers, 
  Crown, 
  Check, 
  ShieldAlert,
  Grid,
  Info,
  Smartphone,
  Zap,
  Globe
} from "lucide-react";
import { ModelAd, getModelAds } from "../lib/userService";
import { triggerHaptic } from "../App";

interface InteractiveGuideProps {
  visible: boolean;
  onClose: () => void;
  themeId: string;
  theme: any;
  vibeEnabled: boolean;
  vibeDuration: number;
  vibeIntensity: number;
}

type GuideStep = "welcome" | "interactive" | "benefits" | "games" | "sponsorships" | "finish";

export default function InteractiveGuide({
  visible,
  onClose,
  themeId,
  theme,
  vibeEnabled,
  vibeDuration,
  vibeIntensity
}: InteractiveGuideProps) {
  const [step, setStep] = useState<GuideStep>("welcome");
  const [activeTab, setActiveTab] = useState<"discover" | "nearby" | "rightnow" | "chats" | "radar" | "sponsors">("discover");
  const [models, setModels] = useState<ModelAd[]>([]);
  const [showCelebrate, setShowCelebrate] = useState(false);

  // Load custom models on mount
  useEffect(() => {
    async function loadAds() {
      const liveAds = await getModelAds();
      setModels(liveAds);
    }
    if (visible) {
      loadAds();
    }
  }, [visible]);

  if (!visible) return null;

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");
  };

  const handleNextStep = (next: GuideStep) => {
    setStep(next);
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");
  };

  const handleFinish = () => {
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");
    setShowCelebrate(true);
    localStorage.setItem("ts_connect_tutorial_completed", "true");
    setTimeout(() => {
      setShowCelebrate(false);
      onClose();
    }, 2000);
  };

  // Render sponsored models in the guide ads slots
  const getSponsorAd = (index: number) => {
    if (models.length === 0) return null;
    const model = models[index % models.length];
    return (
      <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 space-y-2 mt-3 text-left">
        <div className="flex items-center gap-2">
          <img 
            src={model.photoUrl} 
            alt={model.name}
            className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600";
            }}
          />
          <div className="min-w-0">
            <h5 className="text-[10px] font-black text-pink-300 uppercase tracking-wide truncate">
              {model.name} <span className="text-[8px] font-normal text-zinc-400">({model.vibeTag})</span>
            </h5>
            <p className="text-[9px] text-zinc-400 font-semibold truncate leading-none">
              Sponsor Oficial de TS Connect
            </p>
          </div>
        </div>
        <p className="text-[9px] text-zinc-300 leading-normal italic">
          "{model.description}"
        </p>
        <a 
          href={model.contactUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-pink-500 text-black text-[8px] font-black uppercase hover:bg-pink-400 transition-colors"
        >
          <Globe size={8} />
          <span>Contratar / Apoyar</span>
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <AnimatePresence>
        {showCelebrate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-center space-y-4"
          >
            <motion.div 
              animate={{ rotate: 360, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Sparkles size={48} className="animate-pulse" />
            </motion.div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 uppercase tracking-widest">
              ¡Guía Completada!
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs px-4">
              Estás lista para explorar TS Connect. Siente la vibración de conexiones auténticas.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-zinc-950 border border-white/10 shadow-2xl relative flex flex-col min-h-[520px]">
        
        {/* Header decoration */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">
              Guía Inteligente TS Connect
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content box */}
        <div className="flex-1 p-6 flex flex-col justify-between text-zinc-300">
          
          <AnimatePresence mode="wait">
            
            {/* STAGE: Welcome */}
            {step === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-center py-4 flex-1 flex flex-col justify-center"
              >
                <div className="mx-auto p-4 rounded-full bg-pink-500/10 border border-pink-500/20 w-16 h-16 flex items-center justify-center text-pink-400 shadow-lg">
                  <Sparkles size={32} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 tracking-tight leading-tight">
                    ¡Te damos la bienvenida!
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    Tu espacio social trans-inclusivo háptico y seguro
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed px-2">
                  Esta guía inteligente te enseñará de forma interactiva para qué sirve cada botón, cómo usar nuestros juegos y cómo apoyamos a modelos reales.
                </p>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-left text-[11px] space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="text-pink-400 shrink-0">✨</span>
                    <span><strong>Interactivo:</strong> Haz clic en cualquier botón del simulador para ver su explicación.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0">📳</span>
                    <span><strong>Háptico:</strong> Siente vibraciones físicas únicas con cada acción.</span>
                  </div>
                </div>

                <button
                  onClick={() => handleNextStep("interactive")}
                  className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Iniciar Tutorial Interactivo</span>
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* STAGE: Interactive Simulator */}
            {step === "interactive" && (
              <motion.div
                key="interactive"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div>
                  <h3 className="text-sm font-black uppercase text-pink-300">
                    Pulsa los botones del simulador
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Descubre las opciones de la app interactuando con este mockup funcional
                  </p>
                </div>

                {/* Simulated Phone UI mock */}
                <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5 shadow-inner space-y-4 relative">
                  
                  {/* Explanation panel based on selection */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2 min-h-[160px] flex flex-col justify-between">
                    
                    {activeTab === "discover" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 py-0.5 px-2 rounded-full inline-block">
                          Explorar (Discover)
                        </span>
                        <p className="text-xs font-extrabold text-white">Visualiza y Sincroniza Perfiles</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          El corazón de TS Connect. Desliza cartas y mira los perfiles detallados en un feed elegante. Al dar me gusta sentirás un estallido físico de vibración sincronizada.
                        </p>
                        {getSponsorAd(0)}
                      </motion.div>
                    )}

                    {activeTab === "nearby" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full inline-block">
                          Cercanas (Nearby)
                        </span>
                        <p className="text-xs font-extrabold text-white">Radar de Cercanía Regional</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Visualiza qué perfiles están en tu misma ciudad o región. Perfecto para pactar encuentros o hacer amigas en tu entorno local.
                        </p>
                        {getSponsorAd(1)}
                      </motion.div>
                    )}

                    {activeTab === "rightnow" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-orange-500/10 border border-orange-500/20 text-orange-400 py-0.5 px-2 rounded-full inline-block">
                          Right Now (Estado Instantáneo)
                        </span>
                        <p className="text-xs font-extrabold text-white">¿Qué estás haciendo justo ahora?</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Comparte tu actividad en tiempo real con emojis y un estado corto. Puedes ver quiénes están listas para charlar, tomar café, jugar o salir de inmediato.
                        </p>
                        {getSponsorAd(2)}
                      </motion.div>
                    )}

                    {activeTab === "chats" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 py-0.5 px-2 rounded-full inline-block">
                          Chats (Conversaciones)
                        </span>
                        <p className="text-xs font-extrabold text-white">Canales Interactivos de Mensajería</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Entabla chats seguros e instantáneos. Comparte fotos, envía vibras directamente al móvil de la otra persona y experimenta un chat en tiempo real.
                        </p>
                        {getSponsorAd(3)}
                      </motion.div>
                    )}

                    {activeTab === "radar" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-pink-500/10 border border-pink-500/20 text-pink-400 py-0.5 px-2 rounded-full inline-block">
                          Juegos Interactivos
                        </span>
                        <p className="text-xs font-extrabold text-white">Radar de Compatibilidad de Vibras</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Un juego gráfico interactivo que analiza tus gustos y vibra junto a la de otra usuaria. Te muestra un gráfico de araña con compatibilidad en Humor, Intelecto, Estilo y Sensibilidad.
                        </p>
                        {getSponsorAd(0)}
                      </motion.div>
                    )}

                    {activeTab === "sponsors" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[9px] font-black uppercase bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 py-0.5 px-2 rounded-full inline-block">
                          Sponsoring de Modelos Reales
                        </span>
                        <p className="text-xs font-extrabold text-white">Sponsors y Trabajo de Modelaje</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Ofrecemos publicidad real para apoyar y brindar oportunidades laborales a modelos trans y creadoras de contenido. El administrador puede modificar esta publicidad en el Panel de Ajustes.
                        </p>
                        {getSponsorAd(1)}
                      </motion.div>
                    )}

                  </div>

                  {/* Simulated Navigation Bar Mockup */}
                  <div className="py-2.5 px-4 bg-zinc-950 rounded-2xl flex justify-around items-center border border-white/5 shadow-md">
                    <button 
                      onClick={() => handleTabClick("discover")}
                      className={`p-2 rounded-xl transition-all ${activeTab === "discover" ? "bg-white/10 text-pink-400 scale-105" : "text-zinc-500"}`}
                    >
                      <Compass size={18} />
                    </button>
                    <button 
                      onClick={() => handleTabClick("nearby")}
                      className={`p-2 rounded-xl transition-all ${activeTab === "nearby" ? "bg-white/10 text-pink-400 scale-105" : "text-zinc-500"}`}
                    >
                      <MapPin size={18} />
                    </button>
                    <button 
                      onClick={() => handleTabClick("rightnow")}
                      className={`p-2 rounded-xl transition-all ${activeTab === "rightnow" ? "bg-white/10 text-pink-400 scale-105" : "text-zinc-500"}`}
                    >
                      <Flame size={18} />
                    </button>
                    <button 
                      onClick={() => handleTabClick("chats")}
                      className={`p-2 rounded-xl transition-all ${activeTab === "chats" ? "bg-white/10 text-pink-400 scale-105" : "text-zinc-500"}`}
                    >
                      <MessageSquare size={18} />
                    </button>
                    <button 
                      onClick={() => handleTabClick("radar")}
                      className={`p-2 rounded-xl transition-all ${activeTab === "radar" ? "bg-white/10 text-pink-400 scale-105" : "text-zinc-500"}`}
                      title="Compatibilidad"
                    >
                      <Layers size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNextStep("welcome")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => handleNextStep("benefits")}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Siguiente: Beneficios</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE: Benefits */}
            {step === "benefits" && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1 flex flex-col justify-center py-2"
              >
                <div>
                  <h3 className="text-sm font-black uppercase text-pink-300 flex items-center gap-1.5">
                    <Sparkles size={16} />
                    Beneficios de TS Connect
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    ¿Por qué elegir nuestra plataforma trans-inclusiva?
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-start">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">Seguridad & Moderación Rigurosa</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                        Ofrecemos la opción de bloquear y reportar usuarios no deseados al instante. Protegemos activamente tu tranquilidad.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-start">
                    <div className="p-1.5 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-400 shrink-0">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">Canalización Háptica Única</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                        Nuestra tecnología permite probar la intensidad, duración e impulsos hápticos para simular la cercanía física.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-start">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 shrink-0">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">Apoyo Directo a la Comunidad</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                        Cada anuncio apoya directamente a modelos reales para que puedan monetizar y obtener visibilidad y patrocinio genuino.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNextStep("interactive")}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => handleNextStep("finish")}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>¡Entendido! Terminar</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE: Finish */}
            {step === "finish" && (
              <motion.div
                key="finish"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-center py-4 flex-1 flex flex-col justify-center"
              >
                <div className="mx-auto p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-16 h-16 flex items-center justify-center text-emerald-400 shadow-lg">
                  <Check size={32} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase text-white tracking-tight leading-tight">
                    ¡Todo Listo para tu Viaje!
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    Explora de forma auténtica e inclusiva
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed px-2">
                  Recuerda que si eres administradora, puedes modificar todas las fotos y descripciones de las modelos en cualquier momento desde la sección de Ajustes (icono de engranaje).
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleFinish}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Comenzar Experiencia TS Connect
                  </button>
                  <button
                    onClick={() => handleNextStep("benefits")}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-300 font-bold"
                  >
                    Ver beneficios de nuevo
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Bottom indicator progress bar */}
        <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex gap-1.5">
            <span className={`w-2.5 h-1 rounded-full transition-all duration-300 ${step === "welcome" ? "bg-pink-500 w-5" : "bg-zinc-750"}`} />
            <span className={`w-2.5 h-1 rounded-full transition-all duration-300 ${step === "interactive" ? "bg-pink-500 w-5" : "bg-zinc-750"}`} />
            <span className={`w-2.5 h-1 rounded-full transition-all duration-300 ${step === "benefits" ? "bg-pink-500 w-5" : "bg-zinc-750"}`} />
            <span className={`w-2.5 h-1 rounded-full transition-all duration-300 ${step === "finish" ? "bg-pink-500 w-5" : "bg-zinc-750"}`} />
          </div>
          <span className="text-[9px] font-mono text-zinc-500">
            {step === "welcome" && "1 / 4"}
            {step === "interactive" && "2 / 4"}
            {step === "benefits" && "3 / 4"}
            {step === "finish" && "4 / 4"}
          </span>
        </div>

      </div>
    </div>
  );
}
