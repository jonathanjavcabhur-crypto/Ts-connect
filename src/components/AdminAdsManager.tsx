import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  Image as ImageIcon, 
  Globe, 
  Tag, 
  X, 
  Sparkles, 
  User, 
  ChevronDown, 
  ChevronUp,
  FileText
} from "lucide-react";
import { ModelAd, getModelAds, saveModelAds, DEFAULT_MODEL_ADS } from "../lib/userService";
import { triggerHaptic } from "../App";

interface AdminAdsManagerProps {
  themeId: string;
  theme: any;
  onClose?: () => void;
  onAdsUpdated?: (ads: ModelAd[]) => void;
}

// Recommended gorgeous model portrait presets from Unsplash for easy replacement
const PHOTO_PRESETS = [
  { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600", label: "Retrato Clásico Sofía" },
  { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600", label: "Retrato Urbano Elena" },
  { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600", label: "Retrato Glamour Valentina" },
  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600", label: "Modelo Moda Masculina/Andrógino" },
  { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600", label: "Retrato Artístico Neón" },
  { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600", label: "Retrato Sonriente Colorido" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600", label: "Retrato Casual Studio" }
];

export default function AdminAdsManager({ themeId, theme, onClose, onAdsUpdated }: AdminAdsManagerProps) {
  const [ads, setAds] = useState<ModelAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for creating/editing
  const [formData, setFormData] = useState<Partial<ModelAd>>({});
  const [presetOpen, setPresetOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getModelAds();
      setAds(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStartEdit = (ad: ModelAd) => {
    setEditingId(ad.id);
    setFormData(ad);
    setPresetOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.photoUrl || !formData.description) {
      alert("Por favor completa los campos obligatorios: Nombre, Foto y Descripción.");
      return;
    }

    setSaving(true);
    let updatedAds: ModelAd[] = [];
    if (editingId === "new") {
      const newAd: ModelAd = {
        id: `model-${Date.now()}`,
        name: formData.name || "Nueva Modelo",
        photoUrl: formData.photoUrl || "",
        description: formData.description || "",
        contactUrl: formData.contactUrl || "https://instagram.com",
        vibeTag: formData.vibeTag || "Glamour"
      };
      updatedAds = [...ads, newAd];
    } else {
      updatedAds = ads.map(item => item.id === editingId ? { ...item, ...formData } as ModelAd : item);
    }

    await saveModelAds(updatedAds);
    setAds(updatedAds);
    if (onAdsUpdated) {
      onAdsUpdated(updatedAds);
    }
    
    setEditingId(null);
    setFormData({});
    setSaving(false);
    
    // Show temporary success feedback
    setSuccessMsg("¡Cambios guardados con éxito en la nube!");
    setTimeout(() => setSuccessMsg(""), 3000);
    
    // Trigger haptic if applicable
    navigator.vibrate?.(50);
  };

  const handleCreateNew = () => {
    setEditingId("new");
    setFormData({
      id: "new",
      name: "",
      photoUrl: PHOTO_PRESETS[0].url,
      description: "",
      vibeTag: "Estilo Libre",
      contactUrl: "https://instagram.com"
    });
    setPresetOpen(false);
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("¿Estás segura de que quieres eliminar este slot publicitario?")) {
      return;
    }

    const updated = ads.filter(item => item.id !== id);
    await saveModelAds(updated);
    setAds(updated);
    if (onAdsUpdated) {
      onAdsUpdated(updated);
    }
    
    setSuccessMsg("Slot publicitario eliminado con éxito.");
    setTimeout(() => setSuccessMsg(""), 3000);
    navigator.vibrate?.([40, 30, 40]);
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("¿Quieres restaurar los slots de modelos y publicidad predeterminados?")) {
      return;
    }
    setSaving(true);
    await saveModelAds(DEFAULT_MODEL_ADS);
    setAds(DEFAULT_MODEL_ADS);
    if (onAdsUpdated) {
      onAdsUpdated(DEFAULT_MODEL_ADS);
    }
    setEditingId(null);
    setFormData({});
    setSaving(false);
    setSuccessMsg("¡Modelos iniciales restauradas con éxito!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header and Control Row */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
            <Sparkles size={14} className="animate-spin" />
            Panel de Patrocinio & Modelos
          </h4>
          <p className="text-[10px] text-zinc-400">
            Modifica las fotos, descripciones e ingresos publicitarios de modelos trans/sponsors
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          disabled={editingId !== null}
          className="py-1.5 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-[10px] font-black tracking-tight flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-45"
        >
          <Plus size={12} />
          <span>Nuevo Slot</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold text-center animate-pulse">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-xs text-zinc-500">
          Cargando slots publicitarios...
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
          {/* Form for Editing/Creating */}
          <AnimatePresence mode="wait">
            {editingId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-bold text-pink-300 uppercase text-[10px]">
                    {editingId === "new" ? "✨ Crear Nuevo Slot" : "✏️ Editar Modelo / Publicidad"}
                  </span>
                  <button 
                    onClick={handleCancelEdit}
                    className="p-1 rounded-full hover:bg-white/10 text-zinc-400"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1">
                      <User size={10} /> Nombre de Modelo
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Sofía Rivera"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/10 text-xs focus:border-pink-500 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1">
                      <Tag size={10} /> Tag de Estilo / Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.vibeTag || ""}
                      onChange={(e) => setFormData({ ...formData, vibeTag: e.target.value })}
                      placeholder="Ej. Alta Costura, Neón, Alternativo"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/10 text-xs focus:border-pink-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1">
                    <ImageIcon size={10} /> URL de Fotografía Real
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={formData.photoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="Pega la URL de imagen de la modelo"
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] focus:border-pink-500 outline-none font-mono"
                    />
                    <button
                      onClick={() => setPresetOpen(!presetOpen)}
                      className="py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold hover:bg-white/10 text-zinc-300 flex items-center gap-0.5"
                    >
                      <span>Predeterminados</span>
                      {presetOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  </div>

                  {presetOpen && (
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5 grid grid-cols-1 gap-1 max-h-[120px] overflow-y-auto scrollbar-none">
                      {PHOTO_PRESETS.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFormData({ ...formData, photoUrl: preset.url });
                            setPresetOpen(false);
                          }}
                          className="text-left py-1 px-2 rounded hover:bg-white/10 text-[9px] flex items-center justify-between text-zinc-300"
                        >
                          <span className="truncate">{preset.label}</span>
                          <span className="text-[7px] text-zinc-500 font-mono shrink-0">Seleccionar</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {formData.photoUrl && (
                    <div className="mt-1.5 flex items-center gap-2.5 p-1.5 rounded-xl bg-black/20 border border-white/5">
                      <img 
                        src={formData.photoUrl} 
                        alt="Preview" 
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600";
                        }}
                      />
                      <span className="text-[8px] text-zinc-500 italic">Vista previa en tiempo real de la modelo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1">
                    <FileText size={10} /> Descripción / Pitch Publicitario o de Patrocinio
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el trabajo, patrocinio o mensaje de esta modelo..."
                    rows={3}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/10 text-xs focus:border-pink-500 outline-none resize-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1">
                    <Globe size={10} /> Enlace de Contacto (Redes o Email)
                  </label>
                  <input
                    type="text"
                    value={formData.contactUrl || ""}
                    onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
                    placeholder="https://instagram.com/nombre_modelo"
                    className="w-full py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] focus:border-pink-500 outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-xl bg-pink-500 text-black text-[11px] font-black flex items-center justify-center gap-1 hover:bg-pink-400 transition-colors disabled:opacity-50"
                  >
                    <Save size={12} />
                    <span>{saving ? "Guardando..." : "Guardar Slot"}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-zinc-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List of Models */}
          <div className="space-y-2">
            {ads.map(ad => (
              <div 
                key={ad.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={ad.photoUrl} 
                    alt={ad.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600";
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white truncate">{ad.name}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono shrink-0 uppercase">
                        {ad.vibeTag}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{ad.description}</p>
                    <p className="text-[8px] text-zinc-500 font-mono truncate mt-0.5">{ad.contactUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(ad)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/15 text-zinc-300 transition-colors"
                    title="Editar Slot"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Eliminar Slot"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}

            {ads.length === 0 && (
              <div className="py-6 text-center text-[10px] text-zinc-500">
                No hay modelos o publicidad configurada. Pulsa "Nuevo Slot" arriba.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-500">
        <span>Publicidad en tiempo real por Firestore</span>
        <button
          onClick={handleResetDefaults}
          className="text-pink-400/80 hover:text-pink-400 underline font-semibold cursor-pointer"
        >
          Restaurar Modelos Iniciales
        </button>
      </div>
    </div>
  );
}
