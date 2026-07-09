import React, { useState, useRef, useEffect } from "react";
import { Play, Volume2, VolumeX, Upload, RefreshCw } from "lucide-react";
import { triggerHaptic } from "../App";
import { motion, AnimatePresence } from "motion/react";
import { getGlobalIntroVideo, setGlobalIntroVideo } from "../lib/userService";

// IndexedDB constants for persistence
const DB_NAME = "IntroVideoDB";
const STORE_NAME = "videos";
const KEY = "intro_video";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveVideoToDB = async (blob: Blob): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(blob, KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getVideoFromDB = async (): Promise<Blob | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

const deleteVideoFromDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

interface IntroScreenProps {
  onEnter: () => void;
  vibeEnabled: boolean;
  vibeDuration: number;
  vibeIntensity: number;
}

export default function IntroScreen({
  onEnter,
  vibeEnabled,
  vibeDuration,
  vibeIntensity,
}: IntroScreenProps) {
  // Default cinematic video (Cyberpunk/Neon vibe)
  const DEFAULT_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-woman-with-neon-lights-42526-large.mp4";
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCinematicDone, setIsCinematicDone] = useState(false);
  const [pastedUrlInput, setPastedUrlInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load video from Firestore, localStorage cache, or IndexedDB on component mount
  useEffect(() => {
    const loadSavedVideo = async () => {
      try {
        // 1. Try local cache URL first for instant zero-latency playback
        const savedUrl = localStorage.getItem("ts_connect_intro_video_url");
        if (savedUrl) {
          setVideoSrc(savedUrl);
          setPastedUrlInput(savedUrl);
          setVideoError(false);
        }

        // 2. Fetch from Firestore for global synchronized database source
        const dbUrl = await getGlobalIntroVideo();
        if (dbUrl) {
          setVideoSrc(dbUrl);
          setPastedUrlInput(dbUrl);
          localStorage.setItem("ts_connect_intro_video_url", dbUrl);
          setVideoError(false);
          return;
        }

        // 3. Fallback to local DB blob if exists and no Firestore URL is set
        if (!savedUrl) {
          const blob = await getVideoFromDB();
          if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoSrc(url);
            setVideoError(false);
          }
        }
      } catch (err) {
        console.error("Error loading saved video:", err);
      }
    };
    loadSavedVideo();
  }, []);

  // 2.5 second timer for cinematic intro text (much more snappy and engaging)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCinematicDone(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Playback control for video
  useEffect(() => {
    if (videoRef.current && isCinematicDone) {
      if (isPlaying) {
        // Keep the video muted during autoplay to conform to browser autoplay policy
        videoRef.current.play().catch((err) => {
          console.warn("Autoplay block, playing muted", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {
              setIsPlaying(false);
            });
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoSrc, isCinematicDone]);

  // Handle Video Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      localStorage.removeItem("ts_connect_intro_video_url");
      setPastedUrlInput("");
      await saveVideoToDB(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoError(false);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error saving video file:", err);
      alert("Error al guardar el video. Intenta con uno más pequeño.");
    } finally {
      setIsSaving(false);
      setShowConfig(false);
    }
  };

  // Handle Video URL Save
  const handleSaveUrl = async () => {
    if (!pastedUrlInput.trim()) {
      alert("Por favor introduce una URL válida.");
      return;
    }
    setIsSaving(true);
    try {
      const cleanUrl = pastedUrlInput.trim();
      // Save permanently to Firestore config so it applies to all devices/sessions
      await setGlobalIntroVideo(cleanUrl);

      localStorage.setItem("ts_connect_intro_video_url", cleanUrl);
      deleteVideoFromDB().catch(console.error);
      setVideoSrc(cleanUrl);
      setVideoError(false);
      setIsPlaying(true);
      setShowConfig(false);
    } catch (err) {
      console.error("Error saving video URL to database:", err);
      alert("Error al guardar el video en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetVideo = async () => {
    setIsSaving(true);
    try {
      await deleteVideoFromDB();
      localStorage.removeItem("ts_connect_intro_video_url");
      // Reset Firestore config as well
      await setGlobalIntroVideo("");
      setPastedUrlInput("");
      setVideoSrc(DEFAULT_VIDEO);
      setVideoError(false);
    } catch (err) {
      console.error("Error deleting video:", err);
    } finally {
      setIsSaving(false);
      setShowConfig(false);
    }
  };

  // Handle Enter Action
  const handleEnterClick = () => {
    console.log("IntroScreen: Entering, setting appStage to login");
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");
    setHasEntered(true);
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <div
      onClick={() => {
        if (!isCinematicDone) {
          setIsCinematicDone(true);
        }
      }}
      className={`fixed inset-0 w-full h-full bg-[#020205] z-[9999] flex flex-col justify-between items-center transition-all duration-700 ease-in-out ${
        !isCinematicDone ? "cursor-pointer" : ""
      } ${
        hasEntered ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* 1. BACKGROUND VIDEO LAYER */}
      <div className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-1000 ${isCinematicDone ? "opacity-100" : "opacity-0"}`}>
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
            videoError ? "opacity-0" : "opacity-100"
          }`}
        />
        
        {/* Fallback Background if video fails */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-[#020204] flex flex-col items-center justify-center overflow-hidden z-0 select-none">
            <div 
              className="absolute w-[450px] h-[450px] rounded-full blur-[120px] opacity-25 mix-blend-screen"
              style={{
                background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(123, 44, 191, 0.1) 40%, rgba(0,0,0,0) 70%)"
              }}
            />
          </div>
        )}
      </div>

      {/* 2. CINEMATIC INTRO */}
      <AnimatePresence>
        {!isCinematicDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center z-30"
          >
            <motion.h1 
              className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase text-center relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                textShadow: [
                  "0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de",
                  "0 0 20px #ff00de, 0 0 40px #ff00de, 0 0 60px #ff00de",
                  "0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de"
                ]
              }}
              transition={{ 
                duration: 2, 
                ease: "easeOut",
                textShadow: { repeat: Infinity, duration: 2 }
              }}
              style={{
                color: "#fff",
                WebkitTextStroke: "2px #ff00de",
              }}
            >
              TS CONNECT
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. OVERLAYS & CONTROLS (only when cinematic done) */}
      {isCinematicDone && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

          {/* 4. DISCRETE CONTROLS */}
          <div className="absolute top-6 right-6 flex items-center space-x-2 z-50">
            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-3 rounded-full bg-black/40 backdrop-blur-xl text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 shadow-lg"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-pink-500" />}
            </button>
            <button
              onClick={() => {
                setPastedUrlInput(localStorage.getItem("ts_connect_intro_video_url") || "");
                setShowConfig(true);
              }}
              className="p-3 rounded-full bg-black/40 backdrop-blur-xl text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 shadow-lg"
            >
              <Upload size={18} />
            </button>
          </div>

          {/* 5. ENTER ACTION (Small) */}
          <div className="absolute bottom-6 right-6 z-20">
            <button
              onClick={handleEnterClick}
              className="py-2 px-6 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase cursor-pointer transition-all backdrop-blur-lg"
            >
              Entrar
            </button>
          </div>
        </>
      )}

      {/* 6. UPLOAD / LINK CONFIG MODAL */}
      {showConfig && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">Configurar Fondo</h2>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Personaliza la introducción con tu propio video cinematográfico. Puedes subir un archivo o pegar un enlace web.
              </p>
            </div>
            
            {/* OPCIÓN 1: Subir Archivo */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-pink-500">Opción 1: Archivo Local</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="w-full py-3 bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {isSaving ? "Guardando..." : "Subir Archivo de Video"}
              </button>
              <p className="text-[9px] text-white/30 text-center">
                (Almacenado localmente en tu navegador mediante IndexedDB)
              </p>
            </div>

            {/* Divisor */}
            <div className="flex items-center space-x-2 my-2">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">o</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            {/* OPCIÓN 2: Pegar Enlace */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Opción 2: Enlace de Video (Más Estable)</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  placeholder="https://ejemplo.com/video.mp4"
                  value={pastedUrlInput}
                  onChange={(e) => setPastedUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                />
                <button
                  onClick={handleSaveUrl}
                  disabled={isSaving || !pastedUrlInput.trim()}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  Guardar Enlace
                </button>
              </div>
              <p className="text-[9px] text-white/30 text-center">
                Soporta cualquier enlace directo a un archivo MP4 (ej: Discord, Imgur, Dropbox)
              </p>
            </div>

            {/* BOTONES DE CONTROL */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <button
                onClick={handleResetVideo}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all border border-white/5 cursor-pointer"
              >
                Restablecer al Original
              </button>
              
              <button
                onClick={() => setShowConfig(false)}
                className="w-full py-2 text-white/40 text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
