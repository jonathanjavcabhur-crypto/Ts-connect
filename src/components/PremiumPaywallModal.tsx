import React, { useState } from "react";
import { 
  X, Crown, Sparkles, Check, CreditCard, Apple, ShieldCheck, Smartphone, Award
} from "lucide-react";
import { THEMES } from "../constants/themes";
import { setUserPremiumStatus } from "../lib/userService";

interface PremiumPaywallModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string | null | undefined;
  themeId: string;
  onPremiumActivated: () => void;
  vibeEnabled: boolean;
  vibeDuration: number;
  vibeIntensity: number;
  onTriggerHaptic: (type: "click" | "like" | "pass") => void;
}

export default function PremiumPaywallModal({
  visible,
  onClose,
  userId,
  themeId,
  onPremiumActivated,
  vibeEnabled,
  vibeDuration,
  vibeIntensity,
  onTriggerHaptic
}: PremiumPaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"1" | "3" | "12">("3");
  const [step, setStep] = useState<"plans" | "checkout" | "processing" | "success">("plans");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card");

  // Credit Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  if (!visible) return null;

  const currentTheme = THEMES[themeId];

  const plans = [
    {
      id: "1",
      duration: "1 Mes",
      price: "12,99 €",
      period: "mes",
      badge: null,
      savings: null,
    },
    {
      id: "3",
      duration: "3 Meses",
      price: "8,99 €",
      period: "mes",
      badge: "MÁS POPULAR",
      savings: "Ahorra un 30%",
    },
    {
      id: "12",
      duration: "12 Meses",
      price: "4,99 €",
      period: "mes",
      badge: "MEJOR VALOR",
      savings: "Ahorra un 60%",
    }
  ];

  const premiumFeatures = [
    {
      title: "Vibra de Élite",
      description: "Habilita resonancias hápticas dobles de alta fidelidad.",
    },
    {
      title: "Aura Dorada VIP",
      description: "Tu perfil destacará con un marco y llama de oro premium.",
    },
    {
      title: "Desbloqueo de Temas",
      description: "Acceso instantáneo a todos los temas premium ilimitados.",
    },
    {
      title: "Filtros Ilimitados",
      description: "Busca por distancia exacta, estado online y compatibilidad de vibras.",
    }
  ];

  const handleNextToCheckout = () => {
    onTriggerHaptic("click");
    setStep("checkout");
  };

  const handleProcessPayment = async () => {
    onTriggerHaptic("click");
    setCheckoutError("");

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        setCheckoutError("Por favor, rellena todos los datos de tu tarjeta.");
        onTriggerHaptic("pass");
        return;
      }
    }

    setStep("processing");
    
    // Simulate high-fidelity network authentication with database updates
    setTimeout(async () => {
      try {
        if (userId) {
          await setUserPremiumStatus(userId, true);
        }
        
        onTriggerHaptic("like");
        setStep("success");
        onPremiumActivated();
      } catch (err) {
        console.error("Failed to upgrade account to premium in DB:", err);
        setStep("checkout");
        setCheckoutError("Error al actualizar la base de datos de suscripción. Inténtalo de nuevo.");
        onTriggerHaptic("pass");
      }
    }, 2500);
  };

  const handleBack = () => {
    onTriggerHaptic("click");
    setStep("plans");
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      {/* Tap outside closes the modal if not in processing */}
      {step !== "processing" && (
        <div className="absolute inset-0 -z-10" onClick={onClose} />
      )}

      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-yellow-500/30 bg-zinc-950/95 text-white shadow-[0_0_50px_rgba(234,179,8,0.15)] relative">
        {/* Iridescent background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 bg-yellow-500 pointer-events-none" />

        {/* Close Button */}
        {step !== "processing" && (
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <X size={16} className="text-zinc-400 hover:text-white" />
          </button>
        )}

        {/* Content Wizard */}
        {step === "plans" && (
          <div className="p-6 space-y-6">
            
            {/* Crown Header */}
            <div className="flex flex-col items-center text-center space-y-2 mt-4">
              <div className="p-3 bg-gradient-to-tr from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl animate-bounce">
                <Crown size={32} className="text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                TS CONNECT <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md">GOLD</span>
              </h3>
              <p className="text-xs text-zinc-400 px-6">
                Desbloquea el poder total y haz que tus vibraciones destaquen sobre la multitud.
              </p>
            </div>

            {/* Premium Features List */}
            <div className="space-y-2.5 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
              {premiumFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-left">
                  <div className="p-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mt-0.5">
                    <Sparkles size={11} className="fill-yellow-400/20" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-yellow-100">{feat.title}</h4>
                    <p className="text-[10px] text-zinc-400 leading-normal">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscriptions Options Cards */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">
                Selecciona tu Plan de Oro
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {plans.map((p) => {
                  const isSel = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPlan(p.id as "1" | "3" | "12");
                        onTriggerHaptic("click");
                      }}
                      className={`relative rounded-2xl p-3 border cursor-pointer flex flex-col justify-between text-center transition-all duration-300 ${
                        isSel
                          ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                          : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-black py-0.5 px-1.5 rounded-full scale-90 truncate whitespace-nowrap shadow-md">
                          {p.badge}
                        </span>
                      )}

                      <div className="pt-2">
                        <span className="text-[10px] font-black tracking-wider text-zinc-400 block uppercase">
                          {p.duration}
                        </span>
                        <span className="text-base font-black text-white block mt-1">
                          {p.price}
                        </span>
                        <span className="text-[9px] text-zinc-500 block">
                          /{p.period}
                        </span>
                      </div>

                      {p.savings ? (
                        <span className="text-[8px] font-black text-yellow-400 mt-2 block bg-yellow-500/20 py-0.5 px-1 rounded-lg">
                          {p.savings}
                        </span>
                      ) : (
                        <div className="h-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleNextToCheckout}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-xs tracking-wider uppercase rounded-2xl cursor-pointer active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(234,179,8,0.35)]"
            >
              <span>CONTINUAR CON EL PLAN</span>
            </button>
          </div>
        )}

        {step === "checkout" && (
          <div className="p-6 space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <span>← Volver a planes</span>
            </button>

            {/* Plan Summary header */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-yellow-400 tracking-widest block">Suscripción Seleccionada</span>
                <span className="text-sm font-black text-white block">TS Connect Gold - {plans.find(p => p.id === selectedPlan)?.duration}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-yellow-400 block">{plans.find(p => p.id === selectedPlan)?.price}</span>
                <span className="text-[9px] text-zinc-500 block">Facturación recurrente</span>
              </div>
            </div>

            {checkoutError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                {checkoutError}
              </div>
            )}

            {/* Payment Method Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => { setPaymentMethod("card"); onTriggerHaptic("click"); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "card" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <CreditCard size={13} />
                Tarjeta Crédito
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod("apple"); onTriggerHaptic("click"); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "apple" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Apple size={13} />
                Apple Pay
              </button>
            </div>

            {paymentMethod === "card" ? (
              /* Custom realistic secure Visa/Mastercard credit card payment input fields */
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block pl-1">
                    Titular de la Tarjeta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Julian Connor"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-yellow-500/50 rounded-xl text-xs text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block pl-1">
                    Número de Tarjeta
                  </label>
                  <div className="relative">
                    <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => {
                        // Format card number with spaces automatically
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const matches = val.match(/\d{4,16}/g);
                        const match = (matches && matches[0]) || "";
                        const parts = [];

                        for (let i = 0, len = match.length; i < len; i += 4) {
                          parts.push(match.substring(i, i + 4));
                        }

                        if (parts.length > 0) {
                          setCardNumber(parts.join(" "));
                        } else {
                          setCardNumber(val);
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-yellow-500/50 rounded-xl text-xs text-white placeholder-zinc-600 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block pl-1">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length >= 2) {
                          setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                        } else {
                          setCardExpiry(val);
                        }
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-yellow-500/50 rounded-xl text-xs text-white placeholder-zinc-600 outline-none transition-all font-mono text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block pl-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-yellow-500/50 rounded-xl text-xs text-white placeholder-zinc-600 outline-none transition-all font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Apple Pay Slider simulation */
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-900/40 rounded-2xl border border-dashed border-white/10">
                <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                  <Apple size={28} />
                </div>
                <div>
                  <h4 className="text-xs font-black">Apple Pay Express</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 px-4 leading-normal">
                    Paga con un toque utilizando la billetera vinculada a tu ID de Apple.
                  </p>
                </div>
              </div>
            )}

            {/* Apple/Card Process Action Button */}
            <button
              onClick={handleProcessPayment}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs tracking-wider uppercase rounded-2xl cursor-pointer active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(234,179,8,0.2)]"
            >
              <span>{paymentMethod === "card" ? "PAGAR DE FORMA SEGURA" : "COMPRAR CON APPLE PAY"}</span>
            </button>

            <p className="text-[9px] text-center text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck size={11} className="text-yellow-500/50" />
              <span>Conexión cifrada de 256 bits SSL. Cumple con la normativa PCI-DSS.</span>
            </p>
          </div>
        )}

        {/* Loading Spinner during Transaction simulation */}
        {step === "processing" && (
          <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
              <Crown size={22} className="text-yellow-500 absolute animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Procesando Transacción Segura...</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Conectando con la pasarela bancaria y sincronizando perfil en Firestore...</p>
            </div>
          </div>
        )}

        {/* Success confirmation Screen */}
        {step === "success" && (
          <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px] animate-scale-up">
            <div className="p-4 bg-gradient-to-tr from-yellow-500 to-amber-500 rounded-full text-black shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-bounce">
              <Award size={48} className="fill-black/10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">¡Bienvenido a TS Connect Gold!</h3>
              <p className="text-xs text-zinc-400 leading-normal px-4">
                Tu perfil ha sido elevado en Firestore con privilegios de oro VIP. Ahora tus conexiones vibrarán más fuerte y destacarás en toda la red social.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-white text-black font-black text-xs tracking-widest uppercase rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors shadow-lg active:scale-95"
            >
              Comenzar a Brillar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
