import React from "react";
import { MockUser } from "../types";
import { THEMES } from "../constants/themes";
import { ArrowLeft, Zap, MessageSquare, Flame, MapPin } from "lucide-react";

interface RightNowVibeProps {
  users: MockUser[];
  onBack: () => void;
  onSelectUser: (userId: string) => void;
  onStartChat: (userId: string) => void;
  themeId: string;
}

export default function RightNowVibe({
  users,
  onBack,
  onSelectUser,
  onStartChat,
  themeId,
}: RightNowVibeProps) {
  const theme = THEMES[themeId];

  // Filter users looking for "Right Now" or "Hookup"
  const rightNowUsers = users.filter(
    (u) => u.lookingFor.includes("Right Now") || u.lookingFor.includes("Hookup")
  );

  return (
    <div className="w-full flex flex-col min-h-full bg-transparent pb-20">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center px-4 py-3.5 border-b transition-colors bg-black/40 backdrop-blur-xl border-white/10"
      >
        <button
          onClick={onBack}
          className="p-2 mr-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-90"
          style={{ color: theme.textPrimary }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <div className="flex items-center space-x-1.5 justify-center">
            <Flame size={15} className="animate-pulse text-red-500 fill-red-500" />
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: theme.brandText }}>RIGHT NOW</h3>
          </div>
          <p className="text-[9px] uppercase tracking-wider font-bold mt-0.5" style={{ color: theme.textMuted }}>
            Spontaneous connections matching your vibe today
          </p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-none">
        <div 
          className="p-4 rounded-2xl border flex items-center space-x-3 text-xs mb-2 bg-red-500/10 border-red-500/15"
          style={{ boxShadow: `0 0 15px rgba(239, 68, 68, 0.15)` }}
        >
          <Flame size={20} className="text-red-500 fill-red-500 animate-pulse" />
          <p className="text-zinc-200 font-medium leading-relaxed">
            These members are currently seeking immediate, direct conversations, spontaneous outings, or direct connect meetups!
          </p>
        </div>

        {rightNowUsers.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold" style={{ color: theme.textMuted }}>
              No one is actively searching right now.
            </p>
            <p className="text-xs opacity-60">Check back in a bit or try another filter!</p>
          </div>
        ) : (
          <div className="space-y-3 card-3d-wrapper">
            {rightNowUsers.map((user) => {
              const goals = user.lookingFor.filter(
                (g) => g === "Right Now" || g === "Hookup" || g === "Coffee Dates"
              );

              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="p-3.5 rounded-2xl border flex items-center space-x-4 transition-all duration-300 cursor-pointer shadow-lg card-3d bg-white/5 border-white/10 hover:bg-white/10"
                >
                  {/* Photo with dynamic glows */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2"
                      style={{ 
                        borderColor: user.boosted ? theme.primary : "rgba(255,255,255,0.15)",
                        boxShadow: user.boosted ? `0 0 12px ${theme.primary}50` : "none"
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {user.online && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 rounded-full border-2 border-zinc-950 items-center justify-center bg-zinc-900/90 backdrop-blur-md">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75" style={{ backgroundColor: theme.onlineDotColor }} />
                        <span 
                          className="relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                          style={{ backgroundColor: theme.onlineDotColor }}
                        />
                      </span>
                    )}
                    {user.boosted && (
                      <div
                        className="absolute -top-1.5 -left-1.5 p-1 rounded-full text-white shadow-md animate-bounce"
                        style={{ 
                          backgroundColor: theme.primary,
                          boxShadow: `0 0 8px ${theme.primary}`
                        }}
                      >
                        <Zap size={8} fill="#fff" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info block */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-sm text-zinc-100 truncate">
                        {user.name}, {user.age}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 border border-white/5 font-extrabold text-zinc-300">
                        {user.pronouns}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-zinc-400 truncate italic">
                      "{user.tagline}"
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {goals.map((g, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] flex items-center text-zinc-400 pt-0.5">
                      <MapPin size={9} className="mr-1" style={{ color: theme.primary }} />
                      {user.locationName} • {user.distance.toFixed(1)} km
                    </p>
                  </div>

                  {/* Message Launch Button with glow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartChat(user.id);
                    }}
                    className="p-3 rounded-xl text-white transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer shadow-md"
                    style={{ 
                      backgroundColor: theme.primary,
                      boxShadow: `0 4px 15px ${theme.primary}40`
                    }}
                  >
                    <MessageSquare size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
