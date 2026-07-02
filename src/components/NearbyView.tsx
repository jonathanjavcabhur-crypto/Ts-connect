import React, { useState, useMemo, useEffect } from "react";
import { MockUser } from "../types";
import { THEMES } from "../constants/themes";
import VibeGraph from "./VibeGraph";
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  MessageSquare, 
  Compass, 
  Radio, 
  Sliders, 
  Activity,
  Maximize2,
  Minimize2,
  Flame,
  UserCheck,
  Sparkles
} from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface NearbyViewProps {
  users: MockUser[];
  onBack: () => void;
  onSelectUser: (userId: string) => void;
  onStartChat: (userId: string) => void;
  themeId: string;
}

// Simple deterministic angle generator using string hashing to keep user map coordinates stable
const getDeterministicAngle = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert map hash code to angle in radians (0 to 2*PI)
  return (Math.abs(hash) % 360) * (Math.PI / 180);
};

export default function NearbyView({
  users,
  onBack,
  onSelectUser,
  onStartChat,
  themeId,
}: NearbyViewProps) {
  const theme = THEMES[themeId];

  // Map controls
  const [mapMode, setMapMode] = useState<"map" | "clusters">("map");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [maxRadius, setMaxRadius] = useState<number>(10);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);

  // Fallback states for when key is invalid/unauthorized or loading fails
  const [apiError, setApiError] = useState<boolean>(false);
  const [useGoogleMap, setUseGoogleMap] = useState<boolean>(hasValidKey);
  const [showKeyInstructions, setShowKeyInstructions] = useState<boolean>(false);

  useEffect(() => {
    // Intercept Google Maps authorization failure (e.g., InvalidKeyMapError)
    const win = window as any;
    const originalAuthFailure = win.gm_authFailure;
    win.gm_authFailure = () => {
      console.warn("Google Maps InvalidKeyMapError or Auth Failure detected. Swapping to Holographic Radar view.");
      setApiError(true);
      setUseGoogleMap(false);
      if (originalAuthFailure) {
        try {
          originalAuthFailure();
        } catch (e) {
          // ignore
        }
      }
    };
    return () => {
      win.gm_authFailure = originalAuthFailure;
    };
  }, []);

  // Filter users based on max distance
  const filteredNearbyUsers = useMemo(() => {
    return users.filter((u) => {
      // Basic distance constraint
      if (u.distance > maxRadius) return false;
      // Online filter
      if (onlineOnly && !u.online) return false;
      return true;
    });
  }, [users, maxRadius, onlineOnly]);

  // Find currently active user in detail card
  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId) || null;
  }, [users, selectedUserId]);

  // Handle map interaction
  const handleMapNodeClick = (userId: string) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  // Dimensions & scaling variables for simulated map viewport
  const MAP_SIZE = 310; // Width & height of the radar map container
  const CENTER = MAP_SIZE / 2;
  const RADAR_R = MAP_SIZE / 2 - 15; // Outer circle radius

  // Calculate coordinates for each user node
  const userPositions = useMemo(() => {
    return filteredNearbyUsers.map((user) => {
      const angle = getDeterministicAngle(user.id);
      
      // Calculate radius proportional to user's distance
      // Limit to max radius bounds, and apply a non-linear scaling so close users are easier to tap
      const ratio = Math.pow(user.distance / maxRadius, 0.85); 
      const radiusPx = ratio * RADAR_R;

      // Center offset
      const x = CENTER + radiusPx * Math.cos(angle);
      const y = CENTER + radiusPx * Math.sin(angle);

      return {
        user,
        x,
        y,
        angle
      };
    });
  }, [filteredNearbyUsers, maxRadius, RADAR_R, CENTER]);

  // Estimate visual high-density "hotspot" coordinates for our heat overlay
  const clusters = useMemo(() => {
    if (userPositions.length < 2) return [];
    
    // Group users by general quadrants to show cool abstract heatmap glowing coordinates
    const quadrants = [
      { x: CENTER - 45, y: CENTER - 45, count: 0, color: "rgba(239, 68, 68, 0.18)" }, // Northwest
      { x: CENTER + 55, y: CENTER - 35, count: 0, color: "rgba(207, 160, 96, 0.18)" }, // Northeast
      { x: CENTER - 35, y: CENTER + 55, count: 0, color: "rgba(6, 182, 212, 0.18)" },  // Southwest
      { x: CENTER + 45, y: CENTER + 45, count: 0, color: "rgba(168, 85, 247, 0.18)" }  // Southeast
    ];

    userPositions.forEach((pos) => {
      if (pos.x < CENTER && pos.y < CENTER) quadrants[0].count++;
      else if (pos.x >= CENTER && pos.y < CENTER) quadrants[1].count++;
      else if (pos.x < CENTER && pos.y >= CENTER) quadrants[2].count++;
      else quadrants[3].count++;
    });

    return quadrants.filter(q => q.count > 0);
  }, [userPositions, CENTER]);


  const viewContent = (
    <div className="w-full flex flex-col min-h-full bg-transparent pb-16">
      {/* Top sticky Navbar: Liquid Glass */}
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
          <div className="flex items-center justify-center space-x-1.5">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold block" style={{ color: theme.primary }}>
              {useGoogleMap && !apiError ? "Live 3D Map" : "Live Radar Scan"}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsScanning(!isScanning)}
          className={`p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer active:scale-90 ${
            isScanning ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-white/5 border-white/10 text-zinc-400"
          }`}
        >
          <Activity size={16} className={isScanning ? "animate-pulse" : ""} />
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        
        {/* Sliding Segmented Tab Mode Control */}
        <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl max-w-[340px] mx-auto">
          <button
            onClick={() => setMapMode("map")}
            className={`py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mapMode === "map"
                ? "bg-white/10 text-white shadow-md border border-white/10 font-black"
                : "text-zinc-500 hover:text-zinc-300 font-bold"
            }`}
          >
            <Radio size={12} className={mapMode === "map" ? "text-emerald-400" : ""} />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setMapMode("clusters")}
            className={`py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mapMode === "clusters"
                ? "bg-white/10 text-white shadow-md border border-white/10 font-black"
                : "text-zinc-500 hover:text-zinc-300 font-bold"
            }`}
          >
            <Sparkles size={12} className={mapMode === "clusters" ? "text-pink-400 animate-pulse" : ""} />
            <span>Vibe Clusters</span>
          </button>
        </div>

        {mapMode === "map" ? (
          <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-[36px] border border-white/10 overflow-hidden shadow-2xl animate-fadeIn bg-[#030308]">
            {useGoogleMap && !apiError ? (
              <Map
                defaultCenter={{lat: 37.7749, lng: -122.4194}} // San Francisco
                defaultZoom={15}
                defaultHeading={45}
                defaultTilt={45}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{width: '100%', height: '100%'}}
                disableDefaultUI={true}
              >
                {filteredNearbyUsers.map((user) => (
                  <AdvancedMarker 
                    key={user.id} 
                    position={{lat: 37.7749 + (Math.random() - 0.5) * 0.01, lng: -122.4194 + (Math.random() - 0.5) * 0.01}}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <Pin background={user.id === selectedUserId ? theme.primary : "#fff"} />
                  </AdvancedMarker>
                ))}
              </Map>
            ) : (
              /* Interactive Holographic Radar Fallback */
              <div className="relative w-full h-full bg-[#030308] overflow-hidden flex items-center justify-center select-none">
                {/* Concentric Radar Rings */}
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-cyan-500/10 rounded-full pointer-events-none" />
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-cyan-500/10 rounded-full pointer-events-none" />
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] border border-cyan-500/10 rounded-full pointer-events-none" />
                
                {/* Crosshairs */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/10 pointer-events-none" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/10 pointer-events-none" />

                {/* Radar Sweeper */}
                {isScanning && (
                  <div 
                    className="absolute top-1/2 left-1/2 w-[150px] h-[150px] bg-gradient-to-tr from-cyan-500/15 via-transparent to-transparent rounded-full origin-bottom-left animate-spin pointer-events-none" 
                    style={{ 
                      transformOrigin: "bottom left",
                      marginTop: "-150px",
                      marginLeft: "0px",
                      animationDuration: "5s"
                    }}
                  />
                )}

                {/* Outer glowing frame indicator */}
                <div className="absolute inset-4 border border-cyan-500/5 rounded-full pointer-events-none" />

                {/* Plot user nodes */}
                {userPositions.map(({ user, x, y }) => {
                  const isSelected = user.id === selectedUserId;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleMapNodeClick(user.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10 cursor-pointer group focus:outline-none"
                      style={{ 
                        left: `${(x / MAP_SIZE) * 100}%`, 
                        top: `${(y / MAP_SIZE) * 100}%` 
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Pulsing ring indicator */}
                        <span 
                          className={`absolute w-12 h-12 rounded-full border-2 border-cyan-500/25 transition-opacity ${
                            isSelected ? "animate-ping opacity-100" : "opacity-0 group-hover:opacity-40"
                          }`}
                        />
                        
                        {/* Inner soft glow */}
                        <span 
                          className={`absolute w-10 h-10 rounded-full blur-sm opacity-30 transition-all ${
                            isSelected ? "scale-125 opacity-60" : "scale-100 group-hover:opacity-40"
                          }`}
                          style={{ backgroundColor: isSelected ? theme.primary : "#4ade80" }}
                        />
                        
                        {/* Profile Avatar Image */}
                        <img 
                          src={user.photo} 
                          alt={user.name} 
                          className={`w-9 h-9 rounded-full object-cover border-2 relative z-10 transition-transform ${
                            isSelected ? "scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "group-hover:scale-105"
                          }`}
                          style={{ borderColor: isSelected ? theme.primary : "#4ade80" }}
                          referrerPolicy="no-referrer"
                        />

                        {/* Match Percentage Indicator */}
                        <span 
                          className="absolute -top-1 -right-1 text-[8px] font-black px-1 py-0.5 rounded-md text-white z-20 shadow-md scale-90 leading-none select-none"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {user.matchPct}%
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Radar central hub core */}
                <div className="w-5 h-5 rounded-full bg-zinc-950 border-2 border-cyan-400/40 relative flex items-center justify-center z-10 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>
            )}

            {/* Float settings/toggle overlay inside the map area */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
              {/* Active engine description */}
              <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${useGoogleMap && !apiError ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}`} />
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-300">
                  {useGoogleMap && !apiError ? "3D Satellite Mode" : "Holo Radar Active"}
                </span>
              </div>

              {/* Map toggle controls */}
              <div className="flex space-x-1.5">
                {/* Key setup info button */}
                {(!hasValidKey || apiError) && (
                  <button
                    onClick={() => setShowKeyInstructions(true)}
                    className="p-2 rounded-full bg-zinc-900/90 border border-white/10 hover:bg-zinc-800 transition-colors text-yellow-400 flex items-center justify-center cursor-pointer shadow-lg"
                    title="Add Google Maps Key"
                  >
                    <Compass size={12} className="animate-pulse" />
                  </button>
                )}

                {hasValidKey && !apiError && (
                  <button
                    onClick={() => setUseGoogleMap(!useGoogleMap)}
                    className="px-2.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 hover:bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer shadow-lg"
                  >
                    {useGoogleMap ? "Radar" : "3D Map"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <VibeGraph
            users={users}
            onSelectUser={(userId) => setSelectedUserId(userId)}
            themeId={themeId}
          />
        )}

        {/* Selected profile floating info drawer */}
        <div className="relative">
          {selectedUser ? (
            <div 
              onClick={() => onSelectUser(selectedUser.id)}
              className="p-4 rounded-3xl border flex items-center space-x-4 transition-all duration-300 cursor-pointer shadow-2xl relative overflow-hidden bg-white/5 border-white/15 hover:bg-white/10 card-3d glass-shine animate-fadeIn"
              style={{
                boxShadow: `0 10px 25px rgba(0,0,0,0.6), 0 0 15px ${theme.primary}20`
              }}
            >
              {/* Highlight active corner badge */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 pointer-events-none translate-x-12 -translate-y-12 rotate-45 opacity-20"
                style={{ backgroundColor: theme.primary }}
              />

              <div className="relative flex-shrink-0">
                <img 
                  src={selectedUser.photo} 
                  alt={selectedUser.name} 
                  className="w-16 h-16 rounded-2xl object-cover border"
                  style={{ borderColor: theme.primary }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-950 border border-zinc-950">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedUser.online ? theme.onlineDotColor : "rgba(255,255,255,0.4)" }} />
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-sm text-zinc-100 leading-none truncate">
                    {selectedUser.name}, {selectedUser.age}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/10 text-zinc-300 font-extrabold">
                    {selectedUser.pronouns}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 italic font-medium truncate">
                  "{selectedUser.tagline}"
                </p>

                <div className="flex items-center space-x-3 text-[10px] font-bold text-zinc-400">
                  <span className="flex items-center">
                    <MapPin size={9} className="mr-0.5" style={{ color: theme.primary }} />
                    {selectedUser.distance < 1 ? `${Math.round(selectedUser.distance * 1000)}m` : `${selectedUser.distance.toFixed(1)}km`}
                  </span>
                  <span>•</span>
                  <span style={{ color: theme.primary }}>{selectedUser.matchPct}% Vibe-Match</span>
                </div>
              </div>

              {/* Action buttons drawer */}
              <div className="flex flex-col space-y-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onStartChat(selectedUser.id)}
                  className="p-3.5 rounded-2xl text-white transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer shadow-md"
                  style={{ 
                    backgroundColor: theme.primary,
                    boxShadow: `0 4px 12px ${theme.primary}40`
                  }}
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-2 py-8 bg-zinc-950/20">
              <Compass size={24} className="text-zinc-500 animate-spin" style={{ animationDuration: "10s" }} />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Select an Avatar Pin</p>
                <p className="text-[10px] text-zinc-500 font-semibold mt-1">
                  Tap any nearby online connection on the 3D map above to visualize their match, tagline, and message instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Maps Key Setup Modal */}
      {showKeyInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-[#080810] border border-white/10 rounded-[32px] p-6 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                <Compass size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">
                Configure 3D Maps
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Unlock full 3D satellite visualization
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  <strong className="text-white block mb-1">Step 1: Get your API Key</strong>
                  Visit the <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="text-pink-400 hover:underline font-bold">Google Cloud Console</a> to generate a Maps Platform API Key.
                </p>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  <strong className="text-white block mb-1">Step 2: Add to AI Studio Secrets</strong>
                  Follow these steps to activate the 3D map:
                </p>
                
                <ul className="text-[10px] text-zinc-500 space-y-1.5 list-none font-bold uppercase tracking-widest pl-2">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Open <strong className="text-zinc-300">Settings</strong> (⚙️ icon in top-right)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Select <strong className="text-zinc-300">Secrets</strong> panel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Name: <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400 font-mono font-bold">GOOGLE_MAPS_PLATFORM_KEY</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Paste your key and press Enter</span>
                  </li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => setShowKeyInstructions(false)}
              className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5 active:scale-95"
            >
              Continue in Radar Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (useGoogleMap && !apiError) {
    return (
      <APIProvider apiKey={API_KEY} version="weekly">
        {viewContent}
      </APIProvider>
    );
  }

  return viewContent;
}
