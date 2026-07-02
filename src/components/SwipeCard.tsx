import React from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "motion/react";
import { Heart, X, Sparkles, MapPin } from "lucide-react";
import { MockUser } from "../types";
import ProfileBadge from "./ProfileBadge";

interface SwipeCardProps {
  user: MockUser;
  theme: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onClick: () => void;
  active: boolean;
  key?: string;
}

export default function SwipeCard({
  user,
  theme,
  onSwipeLeft,
  onSwipeRight,
  onClick,
  active,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);
  
  // Indicators for Like/Pass
  const likeOpacity = useTransform(x, [10, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, -10], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  if (!active) return null;

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div 
        className="w-full h-full rounded-[32px] overflow-hidden relative shadow-2xl border border-white/10 bg-zinc-900 group"
        onClick={onClick}
      >
        {/* Profile Image */}
        <img 
          src={user.photo} 
          alt={user.name} 
          className="w-full h-full object-cover select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        
        {/* Swipe Overlays */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 border-4 border-emerald-500 rounded-xl px-4 py-2 rotate-[-20deg] z-50 pointer-events-none"
        >
          <span className="text-3xl font-black text-emerald-500 uppercase tracking-widest">LIKE</span>
        </motion.div>

        <motion.div 
          style={{ opacity: passOpacity }}
          className="absolute top-10 right-10 border-4 border-rose-500 rounded-xl px-4 py-2 rotate-[20deg] z-50 pointer-events-none"
        >
          <span className="text-3xl font-black text-rose-500 uppercase tracking-widest">PASS</span>
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-black tracking-tight">{user.name}, {user.age}</h2>
            {user.online && (
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            )}
          </div>

          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.badges.map((badge) => (
                <ProfileBadge key={badge.id} badge={badge} size="md" />
              ))}
            </div>
          )}
          
          <p className="text-sm font-medium text-zinc-300 italic">"{user.tagline}"</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {user.interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/5">
                {interest}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-zinc-400 text-xs">
                <MapPin size={12} className="mr-1" style={{ color: theme.primary }} />
                {user.distance.toFixed(1)} mi
              </div>
              <div className="flex items-center text-pink-400 text-xs font-black">
                <Sparkles size={12} className="mr-1" />
                {user.matchPct}% Match
              </div>
            </div>
            
            <button className="p-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
