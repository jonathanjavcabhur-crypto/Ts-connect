import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Analytics } from '@vercel/analytics/react';
import { CheckCircle2 } from "lucide-react";
import { VibeCardItem } from "./components/VibeCardItem";
import { VibeSound } from "./components/VibeSound";
import ThemedBackground from "./components/ThemedBackground";
import ThemePicker from "./components/ThemePicker";
import FilterSidebar from "./components/FilterSidebar";
import SettingsModal from "./components/SettingsModal";
import ProfileView from "./components/ProfileView";
import ChatWindow from "./components/ChatWindow";
import RightNowVibe from "./components/RightNowVibe";
import NearbyView from "./components/NearbyView";
import IntroScreen from "./components/IntroScreen";
import LoginScreen from "./components/LoginScreen";
import SplashScreen from "./components/SplashScreen";
import { MOCK_USERS } from "./data/mockUsers";
import { THEMES } from "./constants/themes";
import DiscoveryDeck from "./components/DiscoveryDeck";
import ProfileBadge from "./components/ProfileBadge";
import { FilterState, MockUser } from "./types";
import { 
  Layers, 
  Sliders, 
  Zap, 
  Flame, 
  Compass, 
  Heart, 
  MessageSquare, 
  Sparkles,
  Info,
  Check,
  RefreshCw,
  Search,
  MapPin,
  Wifi,
  Signal,
  Battery,
  X,
  Settings,
  Grid
} from "lucide-react";

export function triggerHaptic(enabled: boolean, duration: number, intensity: number, type: "click" | "like" | "pass") {
  if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;

  // intensity 0: Soft Pulse, 1: Vibrant Buzz, 2: Deep Resonance
  const intensities = [
    { click: Math.max(4, Math.round(duration * 0.4)), like: [Math.max(4, Math.round(duration * 0.4)), 30, Math.max(4, Math.round(duration * 0.4))] }, // 0
    { click: duration, like: [duration, 40, Math.round(duration * 1.25)] }, // 1
    { click: Math.round(duration * 1.8), like: [Math.round(duration * 1.8), 30, Math.round(duration * 2.2)] }, // 2
  ];

  const settings = intensities[intensity] || intensities[1];

  if (type === "click") {
    navigator.vibrate(settings.click);
  } else if (type === "like") {
    navigator.vibrate(settings.like);
  } else if (type === "pass") {
    navigator.vibrate(10);
  }
}

const FILTERS = ["All", "Online", "Right Now", "Fresh", "For You", "Popular"];

interface UnicornSpotlightCardProps {
  user: MockUser;
  theme: any;
  navigateToProfile: (id: string) => void;
  navigateToChat: (id: string) => void;
  vibeEnabled: boolean;
  vibeDuration: number;
  vibeIntensity: number;
  onDismiss?: () => void;
}

function UnicornSpotlightCard({ 
  user, 
  theme, 
  navigateToProfile, 
  navigateToChat,
  vibeEnabled,
  vibeDuration,
  vibeIntensity,
  onDismiss
}: UnicornSpotlightCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isLiked, setIsLiked] = useState(false);
  const [appreciationCount, setAppreciationCount] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const [hearts, setHearts] = useState<{
    id: number;
    x: number;
    y: number;
    emoji: string;
    sway: number;
    rotEnd: number;
    duration: number;
    scale: number;
  }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillProgress(user.matchPct);
    }, 200);
    return () => clearTimeout(timer);
  }, [user.matchPct]);

  const HEART_EMOJIS = ["❤️", "💖", "💕", "✨", "🔥", "🥰", "🦄", "🌸"];

  const spawnHeart = (x: number, y: number, count = 1) => {
    const newHearts = Array.from({ length: count }).map((_, index) => {
      const sway = (Math.random() - 0.5) * 140; // horizontal movement dispersion
      const rotEnd = (Math.random() - 0.5) * 120; // final rotation angle
      const duration = 1000 + Math.random() * 600; // 1s to 1.6s
      const scale = 0.8 + Math.random() * 0.9; // scale variation
      const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      return {
        id: Date.now() + Math.random() + index,
        x: x + (Math.random() - 0.5) * 30, // slight cluster offset
        y: y - 15,
        emoji,
        sway,
        rotEnd,
        duration,
        scale,
      };
    });

    setHearts((prev) => [...prev, ...newHearts]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of mouse relative to card's center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Max tilt angles: 12 degrees for standard natural feel
    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;
    
    // Percentage for shine gradient position
    const sX = ((e.clientX - rect.left) / width) * 100;
    const sY = ((e.clientY - rect.top) / height) * 100;

    setTilt({ x: rX, y: rY });
    setShine({ x: sX, y: sY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering navigation if user clicks buttons inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    // Trigger customizable haptic tap
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "click");

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spawnHeart(x, y, 1);

    // Satisfying brief tactile delay before sliding screens
    setTimeout(() => {
      navigateToProfile(user.id);
    }, 350);
  };

  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    holdTimer.current = setTimeout(() => {
      // Trigger Love Blast
      const cardRect = (e.currentTarget as HTMLElement).closest('.unicorn-profile-card')?.getBoundingClientRect();
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      
      if (cardRect) {
        const x = (btnRect.left + btnRect.width / 2) - cardRect.left;
        const y = (btnRect.top + btnRect.height / 2) - cardRect.top;
        spawnHeart(x, y, 15); // Larger heart shower
      } else {
        spawnHeart(270, 40, 15);
      }
      
      triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");
      setIsLiked(true);
      setAppreciationCount((prev) => prev + 5); // Bigger count for blast
      holdTimer.current = null;
    }, 500);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      // Trigger normal like
      handleLikeClick(e as any);
    }
  };

  const handleLikeClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    setIsLiked(true);
    setAppreciationCount((prev) => prev + 1);

    // Trigger customizable haptic burst
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");

    // Get exact heart position relative to the parent card
    const cardRect = (e.currentTarget as HTMLElement).closest('.unicorn-profile-card')?.getBoundingClientRect();
    const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    if (cardRect) {
      const x = (btnRect.left + btnRect.width / 2) - cardRect.left;
      const y = (btnRect.top + btnRect.height / 2) - cardRect.top;
      spawnHeart(x, y, 6); // Multi-heart burst!
    } else {
      spawnHeart(270, 40, 6);
    }
  };

  const getInterestGradient = (interest: string) => {
    switch(interest) {
      case 'Music': return '#f43f5e, #fb7185, #f43f5e';
      case 'Art': return '#8b5cf6, #a78bfa, #8b5cf6';
      case 'Tech': return '#06b6d4, #22d3ee, #06b6d4';
      case 'Travel': return '#f59e0b, #fbbf24, #f59e0b';
      case 'Food': return '#10b981, #34d399, #10b981';
      case 'Sports': return '#3b82f6, #60a5fa, #3b82f6';
      default: return '#FF2985, #7B2CBF, #00F5D4, #FF2985';
    }
  };

  const gradientColors = getInterestGradient(user.interests[0] || 'General');

  const cardStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: isHovered ? "transform 0.05s linear" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    transformStyle: "preserve-3d" as const,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="unicorn-card-wrapper" 
      style={{ perspective: "1000px" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onDismiss?.();
        }
      }}
    >
      <div 
        className={`unicorn-profile-card cursor-pointer relative ${(user.online || user.boosted) ? 'is-active-vibe' : ''}`}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
      >
        {/* Dynamic Specular Sheen Shine Layer */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-[28px] pointer-events-none mix-blend-color-dodge z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%)`,
            }}
          />
        )}

        {/* Floating Heart Elements Rendering */}
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="unicorn-floating-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              animation: `floatUpAndFade ${heart.duration}ms cubic-bezier(0.15, 0.85, 0.35, 1) forwards`,
              "--heart-sway": `${heart.sway}px`,
              "--heart-scale": heart.scale,
              "--heart-rot-end": `${heart.rotEnd}deg`,
            } as React.CSSProperties}
            onAnimationEnd={() => {
              setHearts((prev) => prev.filter((h) => h.id !== heart.id));
            }}
          >
            {heart.emoji}
          </span>
        ))}

        {/* The Border & Glow Overlay */}
        <div 
          className={`unicorn-card-border-overlay ${(user.online || user.boosted) ? 'is-active' : ''}`}
          style={{ '--gradient-colors': gradientColors } as React.CSSProperties}
        />
        
        {/* ZStack Image Container */}
        <div className="unicorn-image-container relative">
          <img 
            src={user.photo} 
            alt={user.name}
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          
          {/* Glass-morphic Heart Appreciation Overlay Button */}
          <button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md group"
            style={{ transform: "translateZ(30px)" }}
            title="Appreciate profile"
          >
            <Heart 
              size={18} 
              className={`transition-all duration-300 ${isLiked ? 'fill-pink-500 text-pink-500 scale-115' : 'text-zinc-200 group-hover:text-pink-400'}`} 
            />
            {appreciationCount > 0 && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-pink-500 text-white leading-none scale-90 border border-black/20">
                {appreciationCount}
              </span>
            )}
          </button>

          {/* Tag Flotante de Distancia (Liquid Glass) */}
          <div className="unicorn-floating-tag">
            {user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance.toFixed(1)} mi`} • {user.locationName}
          </div>
        </div>
        
        {/* Información del Perfil */}
        <div className="unicorn-info-container">
          <h2 className="unicorn-title">{user.name}, {user.age}</h2>
          
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {user.badges.map((badge) => (
                <ProfileBadge key={badge.id} badge={badge} />
              ))}
            </div>
          )}

          <p className="unicorn-subtitle">{user.tagline}</p>
          
          {/* Action Row */}
          <div className="flex flex-col mt-3 pt-3 border-t border-white/5" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 flex items-center">
                <Sparkles size={10} className="mr-1 text-pink-500 animate-pulse" />
                {user.matchPct}% Match Vibe
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToChat(user.id);
                }}
                className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-white flex items-center space-x-1 hover:brightness-110 active:scale-95 cursor-pointer shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                <MessageSquare size={10} />
                <span>Chat</span>
              </button>
            </div>
            
            {/* Dynamic Match Vibe Progress Bar */}
            <div className="mt-2.5 w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ 
                  width: `${fillProgress}%`,
                  background: 'linear-gradient(90deg, #FF2985, #7B2CBF, #00F5D4)',
                  boxShadow: '0 0 8px rgba(0, 245, 212, 0.6)'
                }}
              >
                {/* Visual moving sheen reflection across the fill */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  // Navigation & View state
  const [currentScreen, setCurrentScreen] = useState<"grid" | "profile" | "chat" | "right-now" | "nearby">("grid");
  const [discoveryMode, setDiscoveryMode] = useState<"grid" | "swipe">("grid");
  const [appStage, setAppStage] = useState<"splash" | "intro" | "login" | "main">("splash");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Simulated live clock for iOS status bar
  const [timeString, setTimeString] = useState(() => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      setTimeString(`${hours}:${minutes}`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Theme states
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem("ts_connect_theme") || "iridescent_silk";
  });
  const [showPicker, setShowPicker] = useState(false);

  // Advanced Filters Sidebar states
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [vibeEnabled, setVibeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("ts_connect_vibe_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [vibeDuration, setVibeDuration] = useState<number>(() => {
    const saved = localStorage.getItem("ts_connect_vibe_duration");
    return saved !== null ? parseInt(saved, 10) : 15;
  });
  const [vibeIntensity, setVibeIntensity] = useState<number>(() => {
    const saved = localStorage.getItem("ts_connect_vibe_intensity");
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  const handleVibeEnabledChange = (enabled: boolean) => {
    setVibeEnabled(enabled);
    localStorage.setItem("ts_connect_vibe_enabled", enabled ? "true" : "false");
  };

  const handleVibeDurationChange = (duration: number) => {
    setVibeDuration(duration);
    localStorage.setItem("ts_connect_vibe_duration", duration.toString());
  };

  const handleVibeIntensityChange = (intensity: number) => {
    setVibeIntensity(intensity);
    localStorage.setItem("ts_connect_vibe_intensity", intensity.toString());
  };

  const handleTestVibe = (type: "click" | "like") => {
    triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, type);
  };

  const [filters, setFilters] = useState<FilterState>({
    ageMin: 18,
    ageMax: 50,
    distanceMax: 40,
    gender: "All",
    lookingFor: [],
  });

  // Home filter pill state (matches their case logic)
  const [activeFilter, setActiveFilter] = useState("All");

  // Debug appStage
  useEffect(() => {
    console.log("Current appStage:", appStage);
  }, [appStage]);

  // Search bar query for name or interest tags
  const [searchQuery, setSearchQuery] = useState("");

  // Favorites state for quick local interaction
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("ts_connect_liked");
    return saved ? JSON.parse(saved) : [];
  });

  // Track high compatibility match notification
  const [highMatchFound, setHighMatchFound] = useState(false);

  // Blocked users state
  const [blockedIds, setBlockedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("ts_connect_blocked");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [dismissedSpotlightIds, setDismissedSpotlightIds] = useState<string[]>([]);

  // Dynamic list of user profiles (enables real-time pull-to-refresh updates)
  const [customUsers, setCustomUsers] = useState<MockUser[]>(MOCK_USERS);

  // Pull-to-refresh states
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullState, setPullState] = useState<"idle" | "pulling" | "can-release" | "refreshing">("idle");

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const touchStartY = React.useRef<number | null>(null);
  const isPullingRef = React.useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Only start pulling if scrolled to the very top and not already refreshing
    if (container.scrollTop <= 1 && !isRefreshing) {
      touchStartY.current = e.clientY;
      isPullingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPullingRef.current || touchStartY.current === null || isRefreshing) return;

    const deltaY = e.clientY - touchStartY.current;
    
    if (pullY === 0 && deltaY <= 3) {
      return;
    }

    if (deltaY > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const resistance = 0.55;
      const dampedPull = Math.pow(deltaY, 0.85) * resistance;
      const finalPull = Math.min(120, dampedPull);
      
      setPullY(finalPull);
      if (finalPull >= 70) {
        setPullState("can-release");
      } else {
        setPullState("pulling");
      }
    } else {
      setPullY(0);
      setPullState("idle");
    }
  };

  const animatePullBack = (target: number, onComplete?: () => void) => {
    let current = pullY;
    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        setPullY(target);
        if (onComplete) onComplete();
      } else {
        current += diff * 0.25;
        setPullY(current);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullState("refreshing");
    setPullY(64);

    // Play feedback vibe
    handleTestVibe("click");

    setTimeout(() => {
      handleRefreshProfiles();
    }, 1500);
  };

  const handleRefreshProfiles = () => {
    const shuffleArray = (arr: MockUser[]): MockUser[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const refreshed = shuffleArray(customUsers).map(u => {
      const isJulian = u.id === "user-julian";
      const randomOnline = isJulian ? true : Math.random() > 0.4;
      const distDelta = (Math.random() - 0.5) * 1.8;
      const newDistance = Math.max(0.1, Number((u.distance + distDelta).toFixed(1)));
      const matchDelta = Math.floor((Math.random() - 0.5) * 8);
      const newMatchPct = Math.min(100, Math.max(70, u.matchPct + matchDelta));
      const newBoosted = isJulian ? true : Math.random() > 0.8;

      return {
        ...u,
        online: randomOnline,
        distance: newDistance,
        matchPct: newMatchPct,
        boosted: newBoosted
      };
    });

    setCustomUsers(refreshed);
    
    animatePullBack(0, () => {
      setIsRefreshing(false);
      setPullState("idle");
      
      setActiveNotification({
        userId: refreshed[Math.floor(Math.random() * refreshed.length)].id,
        text: "⚡ Vibe frequencies synced! Feed refreshed.",
        id: `refresh-success-${Date.now()}`
      });

      setTimeout(() => {
        setActiveNotification(current => {
          if (current && current.id.startsWith("refresh-success-")) {
            return null;
          }
          return current;
        });
      }, 4000);
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    touchStartY.current = null;
    
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    if (pullY >= 70 && !isRefreshing) {
      triggerRefresh();
    } else {
      animatePullBack(0);
    }
  };

  // Track active non-blocked users
  const activeUsers = useMemo(() => {
    return customUsers.filter((u) => !blockedIds.includes(u.id) && !dismissedSpotlightIds.includes(u.id));
  }, [blockedIds, customUsers, dismissedSpotlightIds]);

  useEffect(() => {
    const hasHighMatch = activeUsers.some(u => u.matchPct >= 90);
    setHighMatchFound(hasHighMatch);
  }, [activeUsers]);

  // Track selected theme configuration
  const theme = THEMES[themeId];

  // Selected User lookup
  const selectedUser = useMemo(() => {
    return activeUsers.find((u) => u.id === selectedUserId) || activeUsers[0];
  }, [selectedUserId, activeUsers]);

  const onlineCount = useMemo(() => {
    return activeUsers.filter((u) => u.online).length;
  }, [activeUsers]);

  // Update theme setting
  const handleSelectTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem("ts_connect_theme", id);
  };

  // Unread chats count state
  const [unreadChats, setUnreadChats] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("ts_connect_unread");
    return saved ? JSON.parse(saved) : {};
  });

  // Active top-banner notification state
  const [activeNotification, setActiveNotification] = useState<{
    userId: string;
    text: string;
    id: string;
  } | null>(null);

  // Mark all chats with a user as read
  const handleMarkAsRead = (userId: string) => {
    setUnreadChats((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      localStorage.setItem("ts_connect_unread", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate total unreads for the bottom bar navigation
  const totalUnreads = useMemo(() => {
    return Object.keys(unreadChats).reduce((sum, key) => sum + (unreadChats[key] || 0), 0);
  }, [unreadChats]);

  // Periodic notification simulation trigger
  useEffect(() => {
    const triggerSimulatedMessage = () => {
      const eligibleSenders = activeUsers.filter(u => 
        u.online && 
        !(currentScreen === "chat" && selectedUserId === u.id)
      );
      if (eligibleSenders.length === 0) return;

      const sender = eligibleSenders[Math.floor(Math.random() * eligibleSenders.length)];

      const TEMPLATES: Record<string, string[]> = {
        "user-julian": [
          "Hey! Just finished a new contemporary choreography piece. Want to see? 🕺",
          "Working on a fresh minimalist layout. What are your favorite fonts? 🖋️",
          "Hope you're having a warm evening inside your glow. Down for a drink sometime? ✨"
        ],
        "user-1": [
          "Hey! Are you going to any live shows this weekend? 🎸",
          "I just finished a watercolor painting, would love to know what you think! 🎨",
          "Hey! Down for a quick coffee date sometime soon? ☕",
          "What kind of music are you listening to right now?"
        ],
        "user-2": [
          "Hey! Just hiked the Berkeleys, the sunset was absolutely magical! 🌅",
          "I found some super rare ferns at the nursery today! 🌿",
          "Do you have any book recommendations for me? I need a new read. 📚"
        ],
        "user-3": [
          "Just made a really warm synthesizer drone track! Want to hear? 🎹",
          "Spontaneous midnight diner run? I need a waffle. 🥞",
          "What's your ultimate comfort food late at night?"
        ],
        "user-4": [
          "Hey! Ready to check out that cool new dessert spot in town? 🍰",
          "Do you like graphic novels or indie films? 🎬"
        ],
        "user-5": [
          "Hey there! Down for boba and chatting about sci-fi books? 🧋",
          "Have you ever played any cool cooperative board games? 🎲"
        ]
      };

      const msgs = TEMPLATES[sender.id] || [
        "Hey! I really like your vibe. Let's chat! ✨",
        "What are you up to today? Down to meet up? ☕",
        "Hope you are having a wonderful day! Let's get to know each other."
      ];

      const randomText = msgs[Math.floor(Math.random() * msgs.length)];

      const storageKey = `ts_connect_chat_${sender.id}`;
      let history: any[] = [];
      try {
        const saved = localStorage.getItem(storageKey);
        history = saved ? JSON.parse(saved) : [
          {
            id: "msg-init",
            sender: "profile",
            text: `Hey! I'm ${sender.name}. ${sender.tagline}`,
            timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      } catch (e) {
        // ignore
      }

      const newMsg = {
        id: `msg-incoming-${Date.now()}`,
        sender: "profile",
        text: randomText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [...history, newMsg];
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));

      setUnreadChats((prev) => {
        const updated = { ...prev, [sender.id]: (prev[sender.id] || 0) + 1 };
        localStorage.setItem("ts_connect_unread", JSON.stringify(updated));
        return updated;
      });

      setActiveNotification({
        userId: sender.id,
        text: randomText,
        id: `notif-${Date.now()}`
      });

      setTimeout(() => {
        setActiveNotification(current => {
          if (current && current.id.startsWith("notif-")) {
            return null;
          }
          return current;
        });
      }, 6000);
    };

    // Wait 12 seconds after launch, then simulate every 45 seconds
    const initialDelay = setTimeout(() => {
      triggerSimulatedMessage();
    }, 12000);

    const interval = setInterval(() => {
      triggerSimulatedMessage();
    }, 45000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [currentScreen, selectedUserId, blockedIds, activeUsers]);

  // Block a user and redirect to grid
  const handleBlockUser = (userId: string) => {
    const updated = [...blockedIds, userId];
    setBlockedIds(updated);
    localStorage.setItem("ts_connect_blocked", JSON.stringify(updated));
    setCurrentScreen("grid");
    setSelectedUserId(null);
  };

  // Toggle profile like
  const handleToggleLike = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedIds.includes(userId);
    const updated = isLiked 
      ? likedIds.filter((id) => id !== userId)
      : [...likedIds, userId];
    setLikedIds(updated);
    localStorage.setItem("ts_connect_liked", JSON.stringify(updated));
  };

  // Reset all chats and likes helper
  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset all simulated chat histories, likes, and blocks?")) {
      MOCK_USERS.forEach((u) => {
        localStorage.removeItem(`ts_connect_chat_${u.id}`);
      });
      setLikedIds([]);
      setBlockedIds([]);
      setCustomUsers(MOCK_USERS);
      setSearchQuery("");
      localStorage.removeItem("ts_connect_liked");
      localStorage.removeItem("ts_connect_blocked");
      setActiveFilter("All");
      setFilters({
        ageMin: 18,
        ageMax: 50,
        distanceMax: 40,
        gender: "All",
        lookingFor: [],
      });
      setCurrentScreen("grid");
      alert("App data reset successfully!");
    }
  };

  // Advanced compound filtering process
  const filteredUsers = useMemo(() => {
    // 1. First apply primary screen pills matching the exact Expo code case logic
    let tempUsers = [...activeUsers];
    switch (activeFilter) {
      case "Online":
        tempUsers = activeUsers.filter((u) => u.online);
        break;
      case "Right Now":
        tempUsers = activeUsers.filter(
          (u) => u.lookingFor.includes("Right Now") || u.lookingFor.includes("Hookup")
        );
        break;
      case "Fresh":
        tempUsers = [...activeUsers].reverse().slice(0, 12);
        break;
      case "For You":
        tempUsers = [...activeUsers].sort((a, b) => b.matchPct - a.matchPct).slice(0, 9);
        break;
      case "Popular":
        tempUsers = [...activeUsers].sort((a, b) => b.matchPct - a.matchPct);
        break;
      default:
        tempUsers = activeUsers;
    }

    // 2. Next apply advanced sidebar properties
    let result = tempUsers.filter((u) => {
      // Gender identity filter
      if (filters.gender !== "All" && u.genderIdentity !== filters.gender) {
        return false;
      }
      // Age range filter
      if (u.age < filters.ageMin || u.age > filters.ageMax) {
        return false;
      }
      // Distance limit
      if (filters.distanceMax < 50 && u.distance > filters.distanceMax) {
        return false;
      }
      // Looking for options (match any)
      if (filters.lookingFor.length > 0) {
        const hasMatch = u.lookingFor.some((option) => filters.lookingFor.includes(option));
        if (!hasMatch) return false;
      }
      return true;
    });

    // 3. Apply search query for name or interest tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.interests.some((interest) => interest.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeFilter, filters, activeUsers, searchQuery]);

  // Transition helper for routing
  const navigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen("profile");
  };

  const navigateToChat = (userId: string) => {
    setSelectedUserId(userId);
    handleMarkAsRead(userId);
    setCurrentScreen("chat");
  };

  return (
    <>
      <Analytics />
      {appStage === "splash" ? (
        <SplashScreen onComplete={() => setAppStage("intro")} />
      ) : appStage === "intro" ? (
        <IntroScreen
          onEnter={() => setAppStage("login")}
          vibeEnabled={vibeEnabled}
          vibeDuration={vibeDuration}
          vibeIntensity={vibeIntensity}
        />
      ) : appStage === "login" ? (
        <LoginScreen
          onLoginSuccess={() => setAppStage("main")}
          vibeEnabled={vibeEnabled}
          vibeDuration={vibeDuration}
          vibeIntensity={vibeIntensity}
        />
      ) : (
        <ThemedBackground themeId={themeId}>
          {/* Dynamic desktop bento layout: columns for context on wide viewports, phone simulator in the middle */}
          <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:p-6 xl:p-8 max-w-[1440px] mx-auto">
          
          {/* Left column sidebar for desktop (aesthetic introduction) */}
          <div 
            className={`hidden lg:flex flex-col justify-between w-80 p-6 rounded-3xl border text-slate-100 shrink-0 self-start transition-all duration-500 ${
              themeId === "iridescent_silk" 
                ? "ios27-glass border-white/20" 
                : "border-white/10"
            }`}
            style={{ 
              backgroundColor: themeId === "iridescent_silk" ? "rgba(12, 8, 24, 0.45)" : theme.headerBg, 
              borderColor: themeId === "iridescent_silk" ? "rgba(255,255,255,0.2)" : theme.filterInactiveBorder,
              color: theme.textPrimary
            }}
          >
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Flame size={22} className="animate-pulse" style={{ color: theme.primary, fill: theme.primary }} />
                <h1 className="text-xl font-bold tracking-[0.25em]" style={{ fontFamily: "'Georgia', serif", color: theme.brandText }}>
                  TS CONNECT
                </h1>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mt-1" style={{ color: theme.primary }}>
                Find your authentic vibe
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5" style={{ color: theme.primary }}>
                <Sparkles size={13} />
                About Platform
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-300 opacity-90">
                Welcome to <strong>TS Connect</strong>, a highly curated social grid and community discovery environment designed exclusively for trans, non-binary, and queer peers to connect authentically.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Theme</h3>
              <div 
                className="p-3 rounded-xl flex items-center justify-between text-xs font-semibold border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.filterInactiveBorder }}
              >
                <span>{theme.name}</span>
                <button 
                  onClick={() => setShowPicker(true)}
                  className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  style={{ color: theme.primary }}
                >
                  Change
                </button>
              </div>
            </div>

            {/* Quick stats panel */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Activity Overview</h3>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="block text-lg font-black" style={{ color: theme.primary }}>{onlineCount}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-65">Online Now</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="block text-lg font-black text-rose-400">{likedIds.length}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-65">Your Likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar bottom control */}
          <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={handleResetApp}
              className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 border border-red-500/15 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset Chat Simulators</span>
            </button>
            <p className="text-[9px] text-center opacity-40 font-mono">
              Designed for Web & Responsive Touch • 2026
            </p>
          </div>
        </div>

        {/* Central interactive viewport (Adaptive Smartphone Preview for Desktop, full screen for mobile) */}
        <div className="flex-1 flex justify-center items-center relative lg:py-6 lg:px-4 p-0 w-full h-[100dvh] lg:h-auto">
          
          {/* Simulated hardware buttons for iPhone look (visible only on desktop) */}
          <div className="hidden lg:block absolute left-1.5 top-28 w-[3px] h-8 bg-zinc-700 rounded-l-md z-0 shadow-lg" /> {/* Action Button */}
          <div className="hidden lg:block absolute left-1.5 top-40 w-[3px] h-14 bg-zinc-700 rounded-l-md z-0 shadow-lg" /> {/* Vol Up */}
          <div className="hidden lg:block absolute left-1.5 top-58 w-[3px] h-14 bg-zinc-700 rounded-l-md z-0 shadow-lg" /> {/* Vol Down */}
          <div className="hidden lg:block absolute right-1.5 top-48 w-[3px] h-20 bg-zinc-700 rounded-r-md z-0 shadow-lg" /> {/* Side Button */}

          {/* Premium Glassmorphic iPhone Chassis with customizable gold/silver/neon boundary */}
          <div 
            className={`w-full h-full lg:h-[840px] lg:max-w-md lg:rounded-[48px] overflow-hidden flex flex-col relative transition-all duration-500 ${
              themeId === "iridescent_silk" 
                ? "screen-container border-none lg:p-[3px] p-0" 
                : "bg-[#07070b]/80 backdrop-blur-2xl lg:border border-none"
            }`}
            style={{ 
              boxShadow: themeId === "iridescent_silk"
                ? `0 35px 80px -10px rgba(0,0,0,0.95), 0 0 50px rgba(217, 70, 239, 0.25), inset 0 0 20px rgba(6, 182, 212, 0.25)`
                : `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px ${theme.primary}20`,
              borderColor: themeId === "iridescent_silk" ? "transparent" : `${theme.primary}25`
            }}
          >
            
            {/* Dynamic Island / Notch area with glass glossy shine */}
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#000000] rounded-b-2xl z-50 pointer-events-none border-b border-x border-white/5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] absolute left-5 top-2 border border-white/5 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-900/60" />
              </div> {/* Camera lens */}
              <div className="w-12 h-1 bg-zinc-900 rounded-full absolute left-1/2 -translate-x-1/2 top-2.5" /> {/* Speaker grill */}
            </div>

            {/* High fidelity Native iOS Status Bar */}
            <div className="hidden lg:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-white/85 z-50 select-none bg-black/10 backdrop-blur-xs">
              <div className="flex items-center space-x-1">
                <span>{timeString}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Signal size={11} className="text-white/90" />
                <Wifi size={11} className="text-white/90" />
                <div className="flex items-center space-x-0.5">
                  <Battery size={13} className="text-white/90" />
                  <span className="text-[9px] font-bold text-white/70">87%</span>
                </div>
              </div>
            </div>

            {/* Inner App Container with proper layout limits */}
            <div className="flex-1 flex flex-col overflow-hidden relative h-full lg:pt-1">
              
              <style>{`
                @keyframes slideDown {
                  from { transform: translateY(-40px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-down {
                  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes vibePulse {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 222, 0.3); }
                  50% { box-shadow: 0 0 15px 5px rgba(255, 0, 222, 0.6); }
                }
                .animate-vibe-pulse {
                  animation: vibePulse 2s infinite ease-in-out;
                }
              `}</style>

              {/* Dynamic Notification Banner Overlay */}
              {activeNotification && (
                <div 
                  onClick={() => {
                    const senderId = activeNotification.userId;
                    setActiveNotification(null);
                    navigateToChat(senderId);
                  }}
                  className="absolute top-2 left-3 right-3 z-[60] p-3 rounded-2xl border cursor-pointer shadow-2xl transition-all duration-300 hover:scale-102 flex items-center space-x-3 text-white animate-slide-down"
                  style={{
                    background: "rgba(10, 5, 20, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    boxShadow: `0 12px 36px rgba(0,0,0,0.6), 0 0 20px ${theme.primary}20`
                  }}
                >
                  {/* Sender Photo */}
                  {(() => {
                    const sender = activeUsers.find(u => u.id === activeNotification.userId);
                    return sender ? (
                      <div className="relative shrink-0">
                        <img 
                          src={sender.photo} 
                          alt={sender.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black" style={{ backgroundColor: theme.onlineDotColor }} />
                      </div>
                    ) : null;
                  })()}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[11px] text-zinc-100">
                        {activeUsers.find(u => u.id === activeNotification.userId)?.name || "New Message"}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10" style={{ color: theme.primary }}>
                        Just Now
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-300 truncate mt-0.5 font-medium">
                      {activeNotification.text}
                    </p>
                  </div>

                  {/* Close button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNotification(null);
                    }}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-90 shrink-0"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
              
              {/* SCREEN ROUTER */}

              {/* SCREEN 1: Photo Grid Screen */}
              {currentScreen === "grid" && (
                <div className="flex flex-col h-full flex-1 overflow-hidden">
                  
                  {/* Header */}
                  <div 
                    className="flex items-center justify-between px-4 py-3.5 border-b shrink-0 transition-colors"
                    style={{ backgroundColor: theme.headerBg, borderColor: theme.filterInactiveBorder }}
                  >
                    <div className="flex items-center justify-start w-20">
                      <button 
                        onClick={() => setShowPicker(true)} 
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:opacity-80"
                        style={{ 
                          borderColor: `${theme.primary}50`, 
                          backgroundColor: `${theme.primary}18`,
                          color: theme.primary 
                        }}
                        title="Select App Theme"
                      >
                        <Layers size={16} />
                      </button>
                    </div>

                    <div className="text-center flex-1">
                      <h1 className="text-base font-bold tracking-[0.25em]" style={{ fontFamily: "'Georgia', serif", color: theme.brandText }}>
                        TS CONNECT
                      </h1>
                      <span className="text-[9px] font-bold tracking-[0.18em] uppercase block mt-0.5" style={{ color: theme.primary }}>
                        Find your vibe
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 w-auto">
                      {highMatchFound && (
                        <div className="w-9 h-9 rounded-full border flex items-center justify-center animate-pulse"
                          style={{
                            borderColor: `${theme.primary}50`,
                            backgroundColor: `${theme.primary}18`,
                            color: theme.primary,
                            boxShadow: `0 0 10px ${theme.primary}`
                          }}
                        >
                          <Sparkles size={16} />
                        </div>
                      )}

                      <button 
                        onClick={() => setDiscoveryMode(discoveryMode === "grid" ? "swipe" : "grid")} 
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:opacity-80"
                        style={{ 
                          borderColor: `${theme.primary}50`, 
                          backgroundColor: `${theme.primary}18`,
                          color: theme.primary 
                        }}
                        title={discoveryMode === "grid" ? "Switch to Swipe Mode" : "Switch to Grid Mode"}
                      >
                        {discoveryMode === "grid" ? <Sparkles size={16} /> : <Grid size={16} />}
                      </button>

                      <button 
                        onClick={() => setShowFilters(true)} 
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:opacity-80"
                        style={{ 
                          borderColor: `${theme.primary}50`, 
                          backgroundColor: `${theme.primary}18`,
                          color: theme.primary 
                        }}
                        title="Filter Connections"
                      >
                        <Sliders size={16} />
                      </button>

                      <button 
                        onClick={() => setShowSettings(true)} 
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:opacity-80"
                        style={{ 
                          borderColor: `${theme.primary}50`, 
                          backgroundColor: `${theme.primary}18`,
                          color: theme.primary 
                        }}
                        title="Tactile Settings"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Header Search Bar */}
                  <div 
                    className="px-4 py-2 shrink-0 border-b flex flex-col space-y-1.5"
                    style={{ 
                      backgroundColor: theme.headerBg, 
                      borderColor: theme.filterInactiveBorder 
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={13} style={{ color: theme.primary }} className="opacity-75" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search connections by name or interests..."
                          className="w-full pl-8 pr-8 py-1.5 text-xs rounded-full border bg-black/30 text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all duration-200"
                          style={{ 
                            borderColor: searchQuery ? theme.primary : "rgba(255,255,255,0.08)",
                            boxShadow: searchQuery ? `0 0 10px ${theme.primary}20` : "none"
                          }}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200 active:scale-90 transition-all"
                            title="Clear search"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      
                      {/* Interactive results count */}
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        {filteredUsers.length} found
                      </span>
                    </div>

                    {/* Quick popular search tags */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500 whitespace-nowrap mr-0.5">
                        Suggest:
                      </span>
                      {["Techno", "Botany", "Indie Rock", "Watercolor", "Coffee", "Hiking"].map((tag) => {
                        const isSelected = searchQuery.toLowerCase().trim() === tag.toLowerCase();
                        return (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(isSelected ? "" : tag)}
                            className="px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all duration-150 whitespace-nowrap cursor-pointer hover:bg-white/5"
                            style={{
                              backgroundColor: isSelected ? `${theme.primary}25` : "rgba(0,0,0,0.15)",
                              borderColor: isSelected ? theme.primary : "rgba(255,255,255,0.06)",
                              color: isSelected ? theme.primary : theme.textMuted
                            }}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Pills list container */}
                  <div className="py-2.5 shrink-0 overflow-x-auto scrollbar-none flex items-center space-x-2 px-3 border-b border-white/5">
                    {FILTERS.map((f) => {
                      const isActive = activeFilter === f;
                      return (
                        <button
                          key={f}
                          onClick={() => {
                            if (f === "Right Now") {
                              setCurrentScreen("right-now");
                              return;
                            }
                            setActiveFilter(f);
                          }}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap cursor-pointer active:scale-95"
                          style={{
                            backgroundColor: isActive ? theme.filterActive : theme.filterInactive,
                            borderColor: isActive ? theme.filterActiveBorder : theme.filterInactiveBorder,
                            color: isActive ? theme.filterActiveBorder : theme.textMuted,
                          }}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>

                  {/* Online status count bar */}
                  <div 
                    className="px-4 py-2.5 flex items-center space-x-2 shrink-0 border-b transition-colors"
                    style={{ backgroundColor: themeId === "sophisticated" ? "#0a0a0a" : "rgba(0,0,0,0.1)", borderColor: theme.filterInactiveBorder }}
                  >
                    <span className="w-2 h-2 rounded-full relative flex">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.onlineDotColor }} />
                      <span 
                        className={`relative inline-flex rounded-full h-2 w-2 ${themeId === "sophisticated" ? "shadow-[0_0_8px_rgba(16,185,129,0.6)]" : ""}`} 
                        style={{ backgroundColor: theme.onlineDotColor }} 
                      />
                    </span>
                    <span className="text-xs font-medium" style={{ color: themeId === "sophisticated" ? "#71717a" : theme.textMuted }}>
                      {onlineCount} people active in the community now
                    </span>
                  </div>

                  {/* Pull to Refresh Reveal Panel */}
                  {pullY > 0 && (
                    <div 
                      className="relative overflow-hidden shrink-0 transition-colors flex flex-col justify-end pb-3 select-none"
                      style={{ 
                        height: `${pullY}px`,
                        background: themeId === "sophisticated" 
                          ? "radial-gradient(circle at center bottom, rgba(207, 160, 96, 0.12) 0%, transparent 80%)" 
                          : `radial-gradient(circle at center bottom, ${theme.primary}15 0%, transparent 75%)`,
                        borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(0.08, pullY / 700)})`
                      }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-1.5 px-4">
                        {/* Dynamic Vibe Ring Indicator */}
                        <div 
                          className="relative flex items-center justify-center w-8 h-8 rounded-full border"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                            borderColor: pullState === "can-release" ? theme.primary : "rgba(255,255,255,0.1)",
                            boxShadow: pullState === "can-release" ? `0 0 10px ${theme.primary}50` : "none"
                          }}
                        >
                          {pullState === "refreshing" ? (
                            <RefreshCw 
                              size={14} 
                              className="animate-spin" 
                              style={{ color: theme.primary }} 
                            />
                          ) : (
                            <Compass 
                              size={14} 
                              style={{ 
                                color: pullState === "can-release" ? theme.primary : theme.textMuted,
                                transform: `rotate(${pullY * 4.5}deg)`,
                                transition: pullState === "can-release" ? "color 0.2s" : "none"
                              }} 
                            />
                          )}
                          
                          {/* Sparkles / Pulse waves */}
                          {pullState === "can-release" && (
                            <span className="absolute inset-0 rounded-full border border-pink-500 animate-ping opacity-60" />
                          )}
                        </div>

                        {/* State Text labels */}
                        <div className="text-center space-y-0.5 select-none">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-200">
                            {pullState === "idle" && "↓ Pull to scan nearby"}
                            {pullState === "pulling" && `Scan depth: ${Math.round(pullY * 1.5)}m`}
                            {pullState === "can-release" && "⚡ Release to Sync Vibes"}
                            {pullState === "refreshing" && "✨ Refreshing Community Feed..."}
                          </p>
                          <p className="text-[8px] font-mono font-medium opacity-65 text-zinc-400">
                            {pullState === "pulling" && "Checking active trans-peer channels..."}
                            {pullState === "can-release" && "Perfect connection signal locked!"}
                            {pullState === "refreshing" && "Re-aligning regional vibe frequencies..."}
                          </p>
                        </div>
                      </div>

                      {/* Elegant bottom glowing scanline */}
                      <div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-[80%] blur-xs"
                        style={{
                          backgroundColor: pullState === "can-release" ? theme.primary : `${theme.primary}40`,
                          boxShadow: `0 0 8px ${theme.primary}`
                        }}
                      />
                    </div>
                  )}

                  {/* Active Content: Swipe Mode or Grid Mode */}
                  {discoveryMode === "swipe" ? (
                    <DiscoveryDeck
                      users={filteredUsers}
                      themeId={themeId}
                      onLike={(userId) => {
                        handleToggleLike(userId, { stopPropagation: () => {} } as any);
                        triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "like");
                      }}
                      onPass={() => {
                        triggerHaptic(vibeEnabled, vibeDuration, vibeIntensity, "pass");
                      }}
                      onSelectUser={navigateToProfile}
                    />
                  ) : (
                    <div 
                      ref={scrollContainerRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className="flex-1 overflow-y-auto px-2 py-2 select-none"
                      style={{ touchAction: pullY > 0 ? "none" : "pan-y" }}
                    >
                      
                      {/* Premium Iridescent Spotlight Card based on user's exact SwiftUI specifications */}
                      {filteredUsers.length > 0 && activeFilter === "All" && (
                      <div className="flex flex-col items-center my-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-2.5 flex items-center gap-1.5 self-center" style={{ color: theme.primary }}>
                          <Sparkles size={11} className="animate-pulse" style={{ color: theme.primary }} />
                          Featured Vibe Spotlight
                        </span>
                        
                        {/* Unicorn Profile Card (SwiftUI Translation) Container */}
                        <UnicornSpotlightCard 
                          user={filteredUsers[0]} 
                          theme={theme} 
                          navigateToProfile={navigateToProfile} 
                          navigateToChat={navigateToChat} 
                          vibeEnabled={vibeEnabled}
                          vibeDuration={vibeDuration}
                          vibeIntensity={vibeIntensity}
                          onDismiss={() => setDismissedSpotlightIds(prev => [...prev, filteredUsers[0].id])}
                        />

                        <div className="w-full h-[1px] bg-white/5 my-5" />
                      </div>
                    )}

                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-20 space-y-3 px-4">
                        <Search className="mx-auto opacity-30" size={36} style={{ color: theme.primary }} />
                        <p className="text-sm font-bold" style={{ color: theme.textMuted }}>
                          No profiles match your active criteria
                        </p>
                        <p className="text-xs opacity-60">
                          Try adjusting your advanced filter limits or resetting selection.
                        </p>
                        <button 
                          onClick={() => {
                            setActiveFilter("All");
                            setFilters({
                              ageMin: 18,
                              ageMax: 50,
                              distanceMax: 40,
                              gender: "All",
                              lookingFor: [],
                            });
                          }}
                          className="px-4 py-2 mt-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:scale-101"
                          style={{ backgroundColor: theme.primary }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 px-1 pb-20 card-3d-wrapper">
                        {filteredUsers.map((item: MockUser, index: number) => {
                          const isLiked = likedIds.includes(item.id);
                          const nextUser = filteredUsers[index + 1];
                          const isVibeAligned = item.matchPct > 80 && nextUser?.matchPct > 80 && (index % 3 !== 2);
                          
                          // Determine glow class based on theme and booster status
                          let boosterGlowStyle = {};
                          if (item.boosted) {
                            const colors: Record<string, string> = {
                              sophisticated: "rgba(207, 160, 96, 0.45)",
                              slate: "rgba(59, 130, 246, 0.45)",
                              lavender: "rgba(168, 85, 247, 0.45)",
                              cyber: "rgba(6, 182, 212, 0.6)",
                              emerald: "rgba(15, 118, 110, 0.45)",
                              ruby: "rgba(244, 63, 94, 0.6)"
                            };
                            const glowColor = colors[themeId] || "rgba(255,255,255,0.3)";
                            boosterGlowStyle = {
                              boxShadow: `0 0 15px ${glowColor}`,
                              border: `1px solid ${theme.primary}60`
                            };
                          }

                          return (
                            <div
                              key={item.id}
                              onClick={() => navigateToProfile(item.id)}
                              className={`relative aspect-4/5 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-lg active:scale-97 card-3d glass-shine border border-white/5 bg-zinc-900/40 backdrop-blur-xs ${isVibeAligned ? 'animate-vibe-pulse bg-pink-900/20' : ''}`}
                              style={boosterGlowStyle}
                            >
                              {/* Profile photo with subtle zoom and high-fidelity load referrer */}
                              <img
                                src={item.photo}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />

                              {/* Elegant glassmorphic color gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5" />

                              {/* Glowing Active Status indicator */}
                              {item.online && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.onlineDotColor }} />
                                  <span 
                                    className="relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                                    style={{ backgroundColor: theme.onlineDotColor }}
                                  />
                                </span>
                              )}

                              {/* Boost lightning emblem with neon color ring */}
                              {item.boosted && (
                                <div 
                                  className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md"
                                  style={{ 
                                    backgroundColor: theme.primary,
                                    boxShadow: `0 0 10px ${theme.primary}`
                                  }}
                                >
                                  <Zap size={9} fill="#fff" className="animate-pulse" />
                                </div>
                              )}

                              {/* Favorites heart selector with touch feedback */}
                              <button
                                onClick={(e) => handleToggleLike(item.id, e)}
                                className="absolute top-2 right-5 p-1 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-130 border border-white/5"
                              >
                                <Heart 
                                  size={10} 
                                  fill={isLiked ? "#ef4444" : "none"} 
                                  className={`${isLiked ? "text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "text-white/90"}`} 
                                />
                              </button>

                              {/* Diagonal high-fidelity glass reflection lines */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                              {/* Information layer overlay with crisp modern typography */}
                              <div className="absolute bottom-2 left-2.5 right-2.5 text-white space-y-0.5 pointer-events-none">
                                <p className="text-[11px] font-bold truncate tracking-wide text-zinc-100 flex items-center">
                                  {item.name}
                                  {item.badges?.some(b => b.type === "verified") && (
                                    <CheckCircle2 size={11} className="text-cyan-400 ml-1" />
                                  )}
                                  <span className="text-zinc-400 font-medium ml-1">, {item.age}</span>
                                </p>
                                
                                {item.badges && item.badges.length > 0 && (
                                  <div className="flex flex-wrap gap-0.5 pt-0.5">
                                    {item.badges.slice(0, 2).map((badge) => (
                                      <ProfileBadge key={badge.id} badge={badge} size="sm" />
                                    ))}
                                  </div>
                                )}

                                <p className="text-[9px] text-zinc-400 font-medium flex items-center truncate">
                                  <MapPin size={8} className="mr-0.5" style={{ color: theme.primary }} />
                                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                  {/* Micro Footer bar (looks like mobile UI layout) */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 py-3.5 px-6 border-t flex justify-around items-center backdrop-blur-md z-10"
                    style={{ backgroundColor: `${theme.headerBg}E6`, borderColor: theme.filterInactiveBorder }}
                  >
                    <button 
                      onClick={() => {
                        setCurrentScreen("grid");
                        setActiveFilter("All");
                      }}
                      className="flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200"
                      style={{ 
                        color: currentScreen === "grid" ? theme.primary : theme.textMuted,
                        opacity: currentScreen === "grid" ? 1 : 0.6
                      }}
                    >
                      <Compass size={18} />
                      <span className="text-[8px] font-black uppercase tracking-wider">Discover</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentScreen("nearby");
                      }}
                      className="flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200"
                      style={{ 
                        color: currentScreen === "nearby" ? theme.primary : theme.textMuted,
                        opacity: currentScreen === "nearby" ? 1 : 0.6
                      }}
                    >
                      <MapPin size={18} />
                      <span className="text-[8px] font-black uppercase tracking-wider">Nearby</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentScreen("right-now");
                      }}
                      className="flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200"
                      style={{ 
                        color: currentScreen === "right-now" ? theme.primary : theme.textMuted,
                        opacity: currentScreen === "right-now" ? 1 : 0.6
                      }}
                    >
                      <Flame size={18} />
                      <span className="text-[8px] font-black uppercase tracking-wider">Right Now</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedUserId(null);
                        setCurrentScreen("chat");
                      }}
                      className="flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200 relative"
                      style={{ 
                        color: currentScreen === "chat" ? theme.primary : theme.textMuted,
                        opacity: currentScreen === "chat" ? 1 : 0.6
                      }}
                    >
                      <div className="relative">
                        <MessageSquare size={18} />
                        {totalUnreads > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-red-500 text-[8px] font-black flex items-center justify-center text-white px-1 border border-zinc-950 shadow-lg">
                            {totalUnreads}
                          </span>
                        )}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-wider">Chats</span>
                    </button>
                  </div>

                </div>
              )}

              {/* SCREEN 2: Profile View Detail Screen */}
              {currentScreen === "profile" && (
                <div className="flex-1 overflow-hidden h-full">
                  <ProfileView 
                    user={selectedUser}
                    onBack={() => setCurrentScreen("grid")}
                    onStartChat={(userId) => navigateToChat(userId)}
                    onBlock={handleBlockUser}
                    themeId={themeId}
                  />
                </div>
              )}

              {/* SCREEN 3: Chat Message Screen */}
              {currentScreen === "chat" && (
                <div className="flex-1 overflow-hidden h-full">
                  <ChatWindow 
                    user={selectedUserId ? selectedUser : null}
                    users={activeUsers}
                    onBack={() => {
                      if (selectedUserId) {
                        setSelectedUserId(null);
                      } else {
                        setCurrentScreen("grid");
                      }
                    }}
                    themeId={themeId}
                    onSelectUser={(userId) => {
                      setSelectedUserId(userId);
                      handleMarkAsRead(userId);
                    }}
                    unreadChats={unreadChats}
                  />
                </div>
              )}

              {/* SCREEN 4: Right Now immediate connect screen */}
              {currentScreen === "right-now" && (
                <div className="flex-1 overflow-hidden h-full">
                  <RightNowVibe 
                    users={activeUsers}
                    onBack={() => setCurrentScreen("grid")}
                    onSelectUser={(userId) => navigateToProfile(userId)}
                    onStartChat={(userId) => navigateToChat(userId)}
                    themeId={themeId}
                  />
                </div>
              )}

              {/* SCREEN 5: Interactive Proximity Map Radar screen */}
              {currentScreen === "nearby" && (
                <div className="flex-1 overflow-hidden h-full">
                  <NearbyView 
                    users={activeUsers}
                    onBack={() => setCurrentScreen("grid")}
                    onSelectUser={(userId) => navigateToProfile(userId)}
                    onStartChat={(userId) => navigateToChat(userId)}
                    themeId={themeId}
                  />
                </div>
              )}

            </div>
            
            {/* Native iPhone Home Indicator bar at the very bottom */}
            <div className="hidden lg:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
          </div>
        </div>

        {/* Right column sidebar for desktop (aesthetic introduction and community guides) */}
        <div 
          className="hidden xl:flex flex-col justify-between w-80 p-6 rounded-3xl border shrink-0 self-start"
          style={{ 
            backgroundColor: theme.headerBg, 
            borderColor: theme.filterInactiveBorder,
            color: theme.textPrimary
          }}
        >
          <div className="space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5" style={{ color: theme.primary }}>
              <Info size={14} />
              Platform Guidelines
            </h2>

            <div className="space-y-4 text-[11px] leading-relaxed">
              <div className="space-y-1">
                <span className="font-extrabold text-white block">Respect and Safety</span>
                <p className="opacity-80">This space is explicitly built to nurture trans and queer safety. Direct, consensual conversation is fully encouraged.</p>
              </div>

              <div className="space-y-1">
                <span className="font-extrabold text-white block">Aesthetic Themes</span>
                <p className="opacity-80">Click the layers icon in the top left to change visual palettes anytime. It swaps the branding, online dots, filters, and cards instantly.</p>
              </div>

              <div className="space-y-1">
                <span className="font-extrabold text-white block">Preset Quick Replies</span>
                <p className="opacity-80">Open a chat and tap suggested options! Profiles reply in real time using conversational triggers tailored to their hobbies and passions.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Trans & Queer Symbols</h3>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest block font-bold" style={{ color: theme.primary }}>Identity Pride</span>
                  <span className="text-xs font-black">🏳️‍⚧️ 🏳️‍🌈 ✊</span>
                </div>
                <Heart size={18} fill="#ef4444" className="text-red-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center opacity-50 space-y-1">
            <p>Made with love & extreme pride.</p>
            <p className="font-mono">v1.2.0 (Stable)</p>
          </div>
        </div>

      </div>

      {/* GLOBAL FLOATING THEME AND FILTER COMPONENT OVERLAYS */}

      {/* GLOBAL FLOATING THEME AND FILTER COMPONENT OVERLAYS */}

      <ThemePicker 
        visible={showPicker} 
        onClose={() => setShowPicker(false)} 
        activeThemeId={themeId}
        onSelectTheme={handleSelectTheme}
      />

      <FilterSidebar 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChangeFilters={setFilters}
        themeId={themeId}
      />

      <SettingsModal 
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        themeId={themeId}
        vibeEnabled={vibeEnabled}
        onVibeEnabledChange={handleVibeEnabledChange}
        vibeDuration={vibeDuration}
        onVibeDurationChange={handleVibeDurationChange}
        vibeIntensity={vibeIntensity}
        onVibeIntensityChange={handleVibeIntensityChange}
        onTestVibe={handleTestVibe}
      />
        </ThemedBackground>
      )}
    </>
  );
}
