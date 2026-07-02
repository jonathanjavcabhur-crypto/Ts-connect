import React, { useState, useEffect } from "react";
import { MockUser } from "../types";
import { THEMES } from "../constants/themes";
import ProfileBadge from "./ProfileBadge";
import { CompatibilityRadar } from "./CompatibilityRadar";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Compass,
  Tag,
  Ban,
  ShieldCheck,
  Sparkles,
  Clock,
  Activity,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface ProfileViewProps {
  user: MockUser;
  onBack: () => void;
  onStartChat: (userId: string) => void;
  onBlock: (userId: string) => void;
  themeId: string;
}

interface DetailedBio {
  fullBio: string;
  myVibeDescription: string;
  dreamDate: string;
  verifiedStatus: "verified" | "unverified";
  verificationDetails: {
    method: string;
    date: string;
    trustScore: number;
  };
  deepInterests: { category: string; tags: string[] }[];
}

const getDetailedProfileData = (user: MockUser): DetailedBio => {
  if (user.id === "user-julian" || user.name === "Julian") {
    return {
      fullBio: "My visual design background feeds into how I experience the physical world, finding alignment in negative space, modern architecture, and rhythmic structures. In contemporary dance, I translate that abstract geometry into flow and raw emotion. I love underground clubs, gallery opening nights, and deep late-night talks over double espresso. Searching for a companion to explore sensory frontiers and sync creative wave patterns.",
      myVibeDescription: "Fluid, aesthetic-obsessed, highly kinetic, and warm-hearted beneath the sharp design layers.",
      dreamDate: "A walk through an experimental multimedia installation, followed by drinks at a hidden speakeasy and dancing till sunrise.",
      verifiedStatus: "verified",
      verificationDetails: {
        method: "Real-time 3D Biometric Liveness Selfie Scan",
        date: "Today, 10:42 AM",
        trustScore: 99
      },
      deepInterests: [
        { category: "Creative", tags: ["Visual Arts", "Choreography", "Typeface Design", "Exhibitions"] },
        { category: "Sonic", tags: ["Industrial Techno", "Lo-fi Beats", "Ambient Electro", "Synthesizers"] },
        { category: "Lifestyle", tags: ["Specialty Coffee", "Brutalist Spaces", "Midnight Runs", "Urban Exploring"] }
      ]
    };
  }
  
  if (user.id === "user-1" || user.name === "Maya") {
    return {
      fullBio: "Software engineering pays the bills, but fine arts and indie rock feed my soul. I'm a trans woman proud of the journey I've made, living authentically and finding beauty in transition. When I'm not writing React code or building complex APIs, you can find me covered in paint splatters in my studio, experimenting with deep textured watercolors. I have a major soft spot for local indie gigs, cozy coffee shops, and people who can hold a deep, intelligent conversation about everything and nothing.",
      myVibeDescription: "Intellectually curious, creative, gentle-natured, and endlessly expressive.",
      dreamDate: "Grabbing hot dirty chais, checking out a brand new local artist collective, and talking about our favorite albums in a quiet park.",
      verifiedStatus: "verified",
      verificationDetails: {
        method: "SMS & Photo Verification Match",
        date: "Yesterday, 4:15 PM",
        trustScore: 97
      },
      deepInterests: [
        { category: "Creative", tags: ["Watercolor", "Abstract Expressionism", "Indie Rock", "Vinyl Collecting"] },
        { category: "Tech & Geekery", tags: ["Frontend", "Self-hosting", "UX Prototyping", "Open Source"] },
        { category: "Leisure", tags: ["Dirty Chai", "Vintage Thrift", "Indie Cinemas", "Botanical Gardens"] }
      ]
    };
  }

  if (user.id === "user-2" || user.name === "Kaelen") {
    return {
      fullBio: "As a botanist, I live in sync with nature's natural rhythms. I study rare ferns and redwood ecosystems, which keeps me grounded and deeply patient. When off the field, my world revolves around physical literature, aromatic loose-leaf oolongs, and hunting for hidden gems at local vinyl record stores. I identify as non-binary and feel most comfortable with people who appreciate authenticity over performance. Let's share some tea and dive into the deep end of conversation.",
      myVibeDescription: "Grounded, introspective, gentle-tempered, and deeply connected to nature and art.",
      dreamDate: "A quiet morning hike through foggy redwood trails, followed by record-hunting and a warm, slow-brewed tea session.",
      verifiedStatus: "verified",
      verificationDetails: {
        method: "Government ID & Biometric Verification",
        date: "3 days ago",
        trustScore: 100
      },
      deepInterests: [
        { category: "Nature & Science", tags: ["Fern Botany", "Foliage Ecology", "Hiking Trails", "Mushroom Foraging"] },
        { category: "Literary & Audio", tags: ["Poetry Slams", "Vintage Paperbacks", "Warm Vinyl Acoustics", "Experimental Folk"] },
        { category: "Daily Rituals", tags: ["Gongfu Tea", "Quiet Journaling", "Incense Crafting", "Analog Photography"] }
      ]
    };
  }

  if (user.id === "user-3" || user.name === "Leo") {
    return {
      fullBio: "I breathe sound. Making ambient and cinematic electronic music is my way of communicating when words fail. I have a home studio overflowing with analog hardware and synthesizers. When my ears need a break, I find grounding in cooking complex, slow-simmered dishes for friends, or going on long park adventures with my golden retriever. Looking for someone spontaneous who doesn't mind late-night adventures, kitchen dance parties, or diner coffee at 2 AM.",
      myVibeDescription: "Spontaneous, auditory-sensitive, culinary-obsessed, and cozy.",
      dreamDate: "A casual home-cooked dinner where we make fresh pasta together, listening to synthesizers in the background, followed by a late-night drive.",
      verifiedStatus: "verified",
      verificationDetails: {
        method: "Vibe-match & Photo Selfie Verification",
        date: "Today, 1:12 AM",
        trustScore: 96
      },
      deepInterests: [
        { category: "Audio Craft", tags: ["Modular Synths", "Ambient Textures", "Sound Field Recording", "Tape Saturation"] },
        { category: "Culinary", tags: ["Handmade Pasta", "Slow-cooking", "Fermentation", "Natural Wines"] },
        { category: "Heart & Soul", tags: ["Golden Retrievers", "Midnight Diners", "Road Trips", "Cozy Sweaters"] }
      ]
    };
  }

  // Generic fallback for any other/randomized users
  return {
    fullBio: `${user.bio} I love finding small moments of magic in the everyday. Whether that's a perfectly pulled espresso shot, the way light filters through the trees during golden hour, or a song that makes you stop in your tracks. I consider myself a curious explorer of the city, always seeking out new perspectives, underground spots, and genuine connections. Let's sync up, share what makes us tick, and see where the wavelength takes us!`,
    myVibeDescription: "Curious, warm, authentic, and always ready for an unexpected adventure.",
    dreamDate: "Grabbing delicious street food, strolling through a vibrant neighborhood, and finding a cozy spot to talk about our favorite things.",
    verifiedStatus: "verified",
    verificationDetails: {
      method: "Secure Profile Selfie & Mobile Match",
      date: "Today, 12:05 AM",
      trustScore: 95
    },
    deepInterests: [
      { category: "Passions", tags: [...user.interests] },
      { category: "Connection", tags: [...user.lookingFor] },
      { category: "Aesthetics", tags: ["Atmospheric Lights", "City Walks", "Indie Playlists", "Deep Talks"] }
    ]
  };
};

export default function ProfileView({
  user,
  onBack,
  onStartChat,
  onBlock,
  themeId,
}: ProfileViewProps) {
  const theme = THEMES[themeId];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [playingClipIndex, setPlayingClipIndex] = useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount or user change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [user.id]);

  const togglePlay = (index: number, url: string) => {
    if (playingClipIndex === index) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingClipIndex(null);
    } else {
      // Play new
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.onended = () => setPlayingClipIndex(null);
      audioRef.current = audio;
      audio.play().catch(e => console.error("Playback failed", e));
      setPlayingClipIndex(index);
    }
  };

  // Stateful fetching simulator
  const [loadingBio, setLoadingBio] = useState(true);
  const [detailedData, setDetailedData] = useState<DetailedBio | null>(null);

  useEffect(() => {
    setLoadingBio(true);
    const timer = setTimeout(() => {
      setDetailedData(getDetailedProfileData(user));
      setLoadingBio(false);
    }, 850);
    return () => clearTimeout(timer);
  }, [user.id]);

  const photos = [user.photo, ...(user.additionalPhotos || [])].slice(0, 3);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formattedDistance = user.distance < 1
    ? `${Math.round(user.distance * 1000)}m`
    : `${user.distance.toFixed(1)}km`;

  return (
    <div className="w-full flex flex-col min-h-full bg-transparent">
      {/* Top Navbar: Liquid Glass styled */}
      <div 
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 border-b transition-colors bg-black/40 backdrop-blur-xl border-white/10"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-90"
          style={{ color: theme.textPrimary }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center flex-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold block" style={{ color: theme.primary }}>
            Profile Details
          </span>
          <span className="text-sm font-black block leading-tight">{user.name}'s Vibe</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={() => setLiked(!liked)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-90"
            style={{ color: liked ? "#ef4444" : theme.textPrimary }}
            title="Like Profile"
          >
            <Heart size={18} fill={liked ? "#ef4444" : "none"} className="transition-transform duration-200 active:scale-130" />
          </button>
          <button 
            onClick={() => {
              if (confirm(`Block ${user.name}? This will hide them from all views.`)) {
                onBlock(user.id);
              }
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-90 text-red-500 hover:text-red-400"
            title="Block User"
          >
            <Ban size={18} />
          </button>
        </div>
      </div>

      {/* Profile Details scroll area */}
      <div className="flex-1 overflow-y-auto pb-28 space-y-5 px-4 py-4 scrollbar-none">
        
        {/* Photo Gallery with 3D tilt style */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-900 group card-3d">
          <AnimatePresence mode="wait">
            <motion.img 
              key={photoIndex}
              src={photos[photoIndex]} 
              alt={`${user.name} photo`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {/* Liquid Glass Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 pointer-events-none" />

          {/* Gallery navigation controls */}
          {photos.length > 1 && (
            <>
              <button 
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-80 group-hover:opacity-100 duration-200 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-80 group-hover:opacity-100 duration-200 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Indicators at the bottom center */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
              {photos.map((_, idx) => (
                <div 
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: idx === photoIndex ? theme.primary : "rgba(255,255,255,0.4)",
                    transform: idx === photoIndex ? "scale(1.25)" : "scale(1)"
                  }}
                />
              ))}
            </div>
          )}

          {/* Boosted lightning badge */}
          {user.boosted && (
            <div 
              className="absolute top-4 left-4 p-2 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse"
              style={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 0 15px ${theme.primary}`
              }}
            >
              <Zap size={14} fill="#fff" />
            </div>
          )}

          {/* Online status indicator with ping glow */}
          {user.online && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.onlineDotColor }} />
                <span className="relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ backgroundColor: theme.onlineDotColor }} />
              </span>
              <span className="text-[9px] text-white font-mono uppercase tracking-widest pl-1">Online</span>
            </div>
          )}

          {/* Image Floating Name & Age Title card overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h2 className="text-2xl font-black tracking-tight">{user.name}, {user.age}</h2>
                  
                  {user.badges && user.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge) => (
                        <ProfileBadge key={badge.id} badge={badge} size="md" />
                      ))}
                    </div>
                  )}

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/15 border border-white/10 backdrop-blur-md">
                    {user.pronouns}
                  </span>
                </div>
                <p className="text-zinc-300 text-xs flex items-center mt-0.5">
                  <MapPin size={12} className="mr-1" style={{ color: theme.primary }} />
                  {user.locationName} • {formattedDistance} away
                </p>
              </div>
              <div 
                className="px-3 py-1.5 rounded-2xl text-center shadow-lg border border-white/10 backdrop-blur-md flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: `${theme.primary}B3`,
                  boxShadow: `0 0 15px ${theme.primary}50`
                }}
              >
                <div className="text-[8px] uppercase tracking-wider font-extrabold opacity-90 leading-none">Match</div>
                <div className="text-base font-black leading-none mt-1">{user.matchPct}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline Callout in Liquid Glass Frame */}
        <div 
          className="p-4 rounded-2xl border text-sm text-center font-medium bg-white/5 border-white/10 text-zinc-100 italic"
          style={{ 
            boxShadow: `inset 0 0 15px rgba(255,255,255,0.02)`
          }}
        >
          "{user.tagline}"
        </div>

        {/* Compatibility Radar Chart */}
        <CompatibilityRadar user={user} />

        {/* Profile Stats Grid with Liquid Glass cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[10px] uppercase tracking-wider opacity-60 mb-1" style={{ color: theme.textMuted }}>Gender Identity</span>
            <span className="font-bold text-sm text-zinc-100">{user.genderIdentity}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[10px] uppercase tracking-wider opacity-60 mb-1" style={{ color: theme.textMuted }}>Pronouns</span>
            <span className="font-bold text-sm text-zinc-100">{user.pronouns}</span>
          </div>
        </div>

        {/* Recent Visitors section */}
        {user.recentVisitors && user.recentVisitors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider pl-1" style={{ color: theme.textMuted }}>
              Recent Visitors
            </h3>
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              {user.recentVisitors.map((visitor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={visitor.photo} alt={visitor.name} className="w-10 h-10 rounded-full object-cover" />
                      {visitor.isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse border-2 border-zinc-900" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{visitor.name}</p>
                      <p className="text-[10px] text-zinc-400">{visitor.time}</p>
                    </div>
                  </div>
                  {visitor.isNew && (
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">NEW</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Fetched Biography & Verification Trust Section */}
        {loadingBio ? (
          /* High-end Holographic Scanning Skeleton */
          <div className="space-y-4 p-4 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            {/* Pulsing scan line */}
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[bounce_2s_infinite]" 
              style={{
                background: `linear-gradient(to right, transparent, ${theme.primary}30, transparent)`
              }}
            />
            
            <div className="flex items-center space-x-2">
              <RefreshCw size={14} className="animate-spin" style={{ color: theme.primary }} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: theme.primary }}>
                Decrypting detailed aura credentials...
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded-md w-[90%] animate-pulse" />
              <div className="h-4 bg-white/5 rounded-md w-[95%] animate-pulse" />
              <div className="h-4 bg-white/5 rounded-md w-[60%] animate-pulse" />
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="h-3 bg-white/5 rounded-md w-[40%] animate-pulse" />
              <div className="h-3 bg-white/5 rounded-md w-[20%] animate-pulse" />
            </div>
          </div>
        ) : (
          detailedData && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Biography Section */}
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles size={13} style={{ color: theme.primary }} className="animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-100">
                      Detailed Biography
                    </h3>
                  </div>
                  
                  {/* Small connection indicator */}
                  <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                    <span>BIOMETRICS SECURE</span>
                  </span>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-zinc-200">
                  <p className="font-medium text-zinc-100">
                    {detailedData.fullBio}
                  </p>
                  
                  {/* Aura descriptor helper */}
                  <div className="pt-3 border-t border-white/5 space-y-1">
                    <span className="block text-[8px] uppercase tracking-widest font-extrabold opacity-60" style={{ color: theme.textMuted }}>
                      Aura Waveform Match
                    </span>
                    <p className="text-xs text-zinc-300 italic">
                      "{detailedData.myVibeDescription}"
                    </p>
                  </div>

                  {/* Dream Connection scenario */}
                  <div className="space-y-1 pt-2">
                    <span className="block text-[8px] uppercase tracking-widest font-extrabold opacity-60" style={{ color: theme.textMuted }}>
                      The Perfect Connection Experience
                    </span>
                    <p className="text-xs text-zinc-300">
                      {detailedData.dreamDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Status Section & Vibe Verification details */}
              <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/15 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-tight">
                      Vibe-Match Verified
                    </h4>
                    <p className="text-[8px] text-zinc-400 font-mono leading-none mt-0.5">
                      Verified Identity & Community Trust Account
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-white/5 font-mono text-zinc-400">
                  <div>
                    <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-0.5">Verification Scan</span>
                    <span className="font-bold text-zinc-300">{detailedData.verificationDetails.method}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-0.5">Vibe Integrity Index</span>
                    <span className="font-bold text-emerald-400 flex items-center">
                      ⚡ {detailedData.verificationDetails.trustScore}% Score
                    </span>
                  </div>
                </div>

                <div className="text-[8px] text-zinc-500 font-mono flex items-center space-x-1 justify-end">
                  <Clock size={8} />
                  <span>Synchronized: {detailedData.verificationDetails.date}</span>
                </div>
              </div>

              {/* Deep-Dive Interests categorized */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-wider pl-1" style={{ color: theme.textMuted }}>
                  Bespoke Interest Categories
                </h3>
                
                <div className="space-y-3">
                  {detailedData.deepInterests.map((group, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block border-b border-white/5 pb-1">
                        {group.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {group.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 text-zinc-200 transition-all duration-300 hover:bg-white/10 flex items-center space-x-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )
        )}

        {/* Connection Goals in Liquid Glass Pills */}
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Looking For
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {user.lookingFor.map((goal, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 bg-white/5 border-white/10 text-zinc-100 transition-all duration-300 hover:bg-white/10"
              >
                <Compass size={12} style={{ color: theme.primary }} />
                <span>{goal}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Vibe Clips Section */}
        {user.vibeClips && user.vibeClips.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Vibe Clips
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {user.vibeClips.map((clip, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-zinc-200">Clip {i + 1}</span>
                  <button 
                    onClick={() => togglePlay(i, clip)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-xs font-black" style={{ color: theme.primary }}>
                      {playingClipIndex === i ? '⏸ PAUSE' : '▶ PLAY'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety & Moderation Actions */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-red-500/80">
            Safety & Controls
          </h3>
          <button
            onClick={() => {
              if (confirm(`Block ${user.name}? This will hide them from all views and prevent any further interactions.`)) {
                onBlock(user.id);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Ban size={13} />
            <span>Block {user.name}</span>
          </button>
        </div>
      </div>

      {/* Floating Active Send Message bar at the very bottom: Glass Panel */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-4 border-t z-20 flex justify-center backdrop-blur-lg border-white/10 bg-black/40"
      >
        <button 
          onClick={() => onStartChat(user.id)}
          className="w-full py-3 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 text-white shadow-xl transition-all duration-300 cursor-pointer hover:brightness-110 active:scale-98"
          style={{ 
            backgroundColor: theme.primary,
            boxShadow: `0 8px 25px ${theme.primary}40, inset 0 0 10px rgba(255,255,255,0.2)`
          }}
        >
          <MessageSquare size={16} fill="#fff" />
          <span>Message {user.name}</span>
        </button>
      </div>
    </div>
  );
}

