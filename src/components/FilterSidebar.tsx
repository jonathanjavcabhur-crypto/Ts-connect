import React from "react";
import { THEMES } from "../constants/themes";
import { FilterState } from "../types";
import { X, Sliders, Check } from "lucide-react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  themeId: string;
}

const GENDERS = ["All", "Trans Woman", "Trans Man", "Non-Binary", "Genderqueer", "Genderfluid"];
const LOOKING_FOR_OPTIONS = ["Chatting", "Relationship", "Right Now", "Hookup", "Friends", "Coffee Dates"];

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  themeId,
}: FilterSidebarProps) {
  if (!isOpen) return null;

  const theme = THEMES[themeId];

  const handleGenderChange = (gender: string) => {
    onChangeFilters({ ...filters, gender });
  };

  const handleLookingForToggle = (option: string) => {
    const lookingFor = filters.lookingFor.includes(option)
      ? filters.lookingFor.filter((o) => o !== option)
      : [...filters.lookingFor, option];
    onChangeFilters({ ...filters, lookingFor });
  };

  const handleReset = () => {
    onChangeFilters({
      ageMin: 18,
      ageMax: 50,
      distanceMax: 30,
      gender: "All",
      lookingFor: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md">
      {/* Backdrop tap zone */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Panel container: Liquid Glass */}
      <div
        className="w-full max-w-md h-full flex flex-col shadow-2xl transition-all duration-300 transform translate-x-0 liquid-glass border-l border-white/10"
        style={{
          color: theme.textPrimary,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-white/10"
        >
          <div className="flex items-center space-x-2">
            <Sliders size={18} style={{ color: theme.primary }} />
            <h3 className="text-base font-black tracking-tight">Filter Connections</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            style={{ color: theme.textMuted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7 scrollbar-none">
          {/* Gender Identity */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Gender Identity
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((gender) => {
                const isSelected = filters.gender === gender;
                return (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(gender)}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all duration-150 active:scale-98 cursor-pointer ${
                      isSelected ? "bg-white/15 border-white/25 text-white" : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 10px ${theme.primary}30` : "none"
                    }}
                  >
                    {gender}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
                Age Range
              </h4>
              <span className="text-xs font-mono font-bold" style={{ color: theme.primary }}>
                {filters.ageMin} - {filters.ageMax} yrs
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: theme.textMuted }}>Min Age</label>
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={filters.ageMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onChangeFilters({ ...filters, ageMin: Math.min(val, filters.ageMax) });
                    }}
                    className="w-full accent-current cursor-pointer"
                    style={{ color: theme.primary }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: theme.textMuted }}>Max Age</label>
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={filters.ageMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onChangeFilters({ ...filters, ageMax: Math.max(val, filters.ageMin) });
                    }}
                    className="w-full accent-current cursor-pointer"
                    style={{ color: theme.primary }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Maximum Distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
                Distance Limit
              </h4>
              <span className="text-xs font-mono font-bold" style={{ color: theme.primary }}>
                {filters.distanceMax === 50 ? "Anywhere" : `Within ${filters.distanceMax} km`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.distanceMax}
              onChange={(e) => onChangeFilters({ ...filters, distanceMax: parseInt(e.target.value) })}
              className="w-full accent-current cursor-pointer"
              style={{ color: theme.primary }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: theme.textMuted }}>
              <span>1 km</span>
              <span>25 km</span>
              <span>Anywhere</span>
            </div>
          </div>

          {/* Looking For */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Connection Goals
            </h4>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR_OPTIONS.map((option) => {
                const isSelected = filters.lookingFor.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleLookingForToggle(option)}
                    className={`py-1.5 px-3.5 rounded-full border flex items-center space-x-1.5 transition-all duration-150 cursor-pointer active:scale-95 text-xs font-semibold ${
                      isSelected ? "bg-white/15 border-white/25 text-white" : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 10px ${theme.primary}20` : "none"
                    }}
                  >
                    <span>{option}</span>
                    {isSelected && <Check size={12} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="p-6 border-t border-white/10 flex space-x-3 bg-black/20"
        >
          <button
            onClick={handleReset}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 text-center text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors active:scale-98 cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-center text-white transition-all duration-300 active:scale-98 cursor-pointer shadow-md"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 4px 15px ${theme.primary}40`
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
