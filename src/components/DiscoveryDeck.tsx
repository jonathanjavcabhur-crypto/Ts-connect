import React, { useState, useMemo } from "react";
import SwipeCard from "./SwipeCard";
import { MockUser } from "../types";
import { THEMES } from "../constants/themes";
import { Heart, X, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiscoveryDeckProps {
  users: MockUser[];
  themeId: string;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onSelectUser: (userId: string) => void;
}

export default function DiscoveryDeck({
  users,
  themeId,
  onLike,
  onPass,
  onSelectUser,
}: DiscoveryDeckProps) {
  const theme = THEMES[themeId];
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeUsers = useMemo(() => {
    // We could filter out already liked/passed users if we had that state here,
    // but for now we'll just show the deck from the current index.
    return users.slice(currentIndex, currentIndex + 5);
  }, [users, currentIndex]);

  const handleSwipeLeft = (userId: string) => {
    onPass(userId);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = (userId: string) => {
    onLike(userId);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  if (currentIndex >= users.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-2">
          <Sparkles size={40} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">No more vibes!</h2>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            You've explored everyone in your current radius. Try expanding your search filters or check back later for new connections.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Start Over</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* The Stack Container */}
      <div className="flex-1 relative m-4 mb-24">
        <AnimatePresence mode="popLayout">
          {users.slice(currentIndex, currentIndex + 2).reverse().map((user, index) => {
            const isTop = index === (users.slice(currentIndex, currentIndex + 2).length - 1);
            return (
              <SwipeCard
                key={user.id}
                user={user}
                theme={theme}
                onSwipeLeft={() => handleSwipeLeft(user.id)}
                onSwipeRight={() => handleSwipeRight(user.id)}
                onClick={() => onSelectUser(user.id)}
                active={isTop}
              />
            );
          })}
        </AnimatePresence>

        {/* Background Hint Card */}
        {currentIndex + 2 < users.length && (
           <div className="absolute inset-0 w-full h-full rounded-[32px] bg-zinc-900/50 border border-white/5 -z-10 scale-95 translate-y-4 opacity-50" />
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-6 z-50">
        <button
          onClick={() => handleSwipeLeft(users[currentIndex].id)}
          className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-90 transition-all shadow-xl"
        >
          <X size={24} />
        </button>
        
        <button
          onClick={() => onSelectUser(users[currentIndex].id)}
          className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:scale-110 active:scale-90 transition-all"
        >
          <Sparkles size={18} />
        </button>

        <button
          onClick={() => handleSwipeRight(users[currentIndex].id)}
          className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-500 hover:scale-110 active:scale-90 transition-all shadow-xl"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
