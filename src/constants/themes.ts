import { UserTheme } from "../types";

export const THEMES: Record<string, UserTheme> = {
  sophisticated: {
    id: "sophisticated",
    name: "Sophisticated Dark",
    headerBg: "#000000",
    primary: "#CFA060", // gold
    primaryHover: "#b88e50",
    brandText: "#CFA060",
    background: "#000000",
    cardBg: "#0a0a0a",
    filterActive: "#CFA060",
    filterInactive: "#0a0a0a",
    filterActiveBorder: "#000000",
    filterInactiveBorder: "#27272a", // zinc-800
    onlineDotColor: "#10b981", // emerald-500
    textMuted: "#a1a1aa", // zinc-400
    textPrimary: "#ffffff",
    accent: "#CFA060",
    accentBg: "rgba(207, 160, 96, 0.12)",
  },
  slate: {
    id: "slate",
    name: "Classic Slate",
    headerBg: "#0f172a", // slate-900
    primary: "#3b82f6", // blue-500
    primaryHover: "#2563eb",
    brandText: "#f8fafc", // slate-50
    background: "#020617", // slate-950
    cardBg: "#1e293b", // slate-800
    filterActive: "#3b82f6",
    filterInactive: "#1e293b",
    filterActiveBorder: "#f8fafc",
    filterInactiveBorder: "#334155",
    onlineDotColor: "#10b981", // emerald-500
    textMuted: "#94a3b8", // slate-400
    textPrimary: "#f1f5f9", // slate-100
    accent: "#60a5fa", // blue-400
    accentBg: "rgba(59, 130, 246, 0.15)",
  },
  lavender: {
    id: "lavender",
    name: "Lavender Sunset",
    headerBg: "#2e1065", // violet-950
    primary: "#a855f7", // purple-500
    primaryHover: "#9333ea",
    brandText: "#fdf4ff", // fuchsia-50
    background: "#1e1b4b", // indigo-950
    cardBg: "#3b0764", // purple-950
    filterActive: "#a855f7",
    filterInactive: "#2e1065",
    filterActiveBorder: "#fdf4ff",
    filterInactiveBorder: "#581c87",
    onlineDotColor: "#10b981",
    textMuted: "#c084fc", // purple-400
    textPrimary: "#fae8ff", // purple-100
    accent: "#e9d5ff", // purple-200
    accentBg: "rgba(168, 85, 247, 0.18)",
  },
  cyber: {
    id: "cyber",
    name: "Neon Cyberpunk",
    headerBg: "#000000",
    primary: "#06b6d4", // cyan-500
    primaryHover: "#0891b2",
    brandText: "#ec4899", // pink-500
    background: "#080710",
    cardBg: "#111827", // gray-900
    filterActive: "#ec4899",
    filterInactive: "#111827",
    filterActiveBorder: "#00ffff",
    filterInactiveBorder: "#ec4899",
    onlineDotColor: "#39ff14", // neon green
    textMuted: "#9ca3af", // gray-400
    textPrimary: "#ffffff",
    accent: "#00ffff",
    accentBg: "rgba(6, 182, 212, 0.15)",
  },
  emerald: {
    id: "emerald",
    name: "Soft Emerald (Light)",
    headerBg: "#f4f3f0", // warm ivory
    primary: "#0f766e", // teal-700
    primaryHover: "#115e59",
    brandText: "#0d9488", // teal-600
    background: "#faf9f6", // warm soft white
    cardBg: "#ffffff",
    filterActive: "#0f766e",
    filterInactive: "#f1f0ea",
    filterActiveBorder: "#faf9f6",
    filterInactiveBorder: "#cbd5e1",
    onlineDotColor: "#10b981",
    textMuted: "#64748b", // slate-500
    textPrimary: "#0f172a", // slate-900
    accent: "#0d9488",
    accentBg: "rgba(15, 118, 110, 0.1)",
  },
  ruby: {
    id: "ruby",
    name: "Velvet Ruby",
    headerBg: "#4c0519", // rose-950
    primary: "#f43f5e", // rose-500
    primaryHover: "#e11d48",
    brandText: "#ffe4e6", // rose-100
    background: "#1c0008", // dark black-rose
    cardBg: "#31000e", // very deep rose
    filterActive: "#f43f5e",
    filterInactive: "#31000e",
    filterActiveBorder: "#ffe4e6",
    filterInactiveBorder: "#9f1239",
    onlineDotColor: "#34d399",
    textMuted: "#fb7185", // rose-400
    textPrimary: "#ffe4e6",
    accent: "#fda4af", // rose-300
    accentBg: "rgba(244, 63, 94, 0.15)",
  },
  iridescent_silk: {
    id: "iridescent_silk",
    name: "iOS 27 Liquid Glass",
    headerBg: "#050510",
    primary: "#d946ef", // neon magenta
    primaryHover: "#f472b6",
    brandText: "#00ffff", // neon cyan
    background: "#030208",
    cardBg: "rgba(255, 255, 255, 0.05)",
    filterActive: "#d946ef",
    filterInactive: "rgba(255, 255, 255, 0.03)",
    filterActiveBorder: "#00ffff",
    filterInactiveBorder: "rgba(255, 255, 255, 0.08)",
    onlineDotColor: "#00ffff", // vibrant cyan active dot
    textMuted: "#a78bfa", // lavender-purple
    textPrimary: "#ffffff",
    accent: "#00ffff",
    accentBg: "rgba(0, 255, 255, 0.12)",
  },
};
