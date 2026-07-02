import React from "react";
import { CheckCircle2, Star, Moon, Sun, Heart, Sparkles, Trophy } from "lucide-react";
import { Badge as BadgeType } from "../types";

interface ProfileBadgeProps {
  badge: BadgeType;
  size?: "sm" | "md";
  key?: string;
}

export default function ProfileBadge({ badge, size = "sm" }: ProfileBadgeProps) {
  const getBadgeStyles = () => {
    switch (badge.type) {
      case "verified":
        return {
          icon: <CheckCircle2 size={size === "sm" ? 10 : 12} />,
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          text: "text-cyan-400",
        };
      case "contributor":
        return {
          icon: <Trophy size={size === "sm" ? 10 : 12} />,
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
        };
      case "personality":
        return {
          icon: badge.label.toLowerCase().includes("night") ? <Moon size={size === "sm" ? 10 : 12} /> : <Sun size={size === "sm" ? 10 : 12} />,
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          text: "text-purple-400",
        };
      case "vibe":
        return {
          icon: <Sparkles size={size === "sm" ? 10 : 12} />,
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          text: "text-pink-400",
        };
      default:
        return {
          icon: <Star size={size === "sm" ? 10 : 12} />,
          bg: "bg-white/5",
          border: "border-white/10",
          text: "text-white/60",
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text} whitespace-nowrap`}>
      <span className="flex-shrink-0">{styles.icon}</span>
      <span className={`${size === "sm" ? "text-[9px]" : "text-[10px]"} font-black uppercase tracking-wider`}>
        {badge.label}
      </span>
    </div>
  );
}
