import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { MockUser } from "../types";
import { THEMES } from "../constants/themes";
import { Sparkles, MapPin, Zap, Info } from "lucide-react";

interface VibeGraphProps {
  users: MockUser[];
  onSelectUser: (userId: string) => void;
  themeId: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: "hub" | "user";
  name: string;
  emoji?: string;
  color: string;
  description?: string;
  keywords?: string[];
  radius: number;
  user?: MockUser;
  matchedInterests?: string[];
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

// 4 main vibe clusters with associated keywords and icons
const VIBE_HUBS = [
  {
    id: "hub-creative",
    name: "Art & Design",
    emoji: "🎨",
    color: "#E2E8F0", // Styled with custom neon borders later
    description: "Creative minds, visual artists, and design enthusiasts.",
    keywords: ["Design", "Art", "Minimalism", "Architecture", "Pottery", "Indie Films", "Museums", "UX Design", "Sketching", "Thrifting", "Vintage", "Galleries", "Light Design"]
  },
  {
    id: "hub-tech",
    name: "Tech & Geekery",
    emoji: "👾",
    color: "#00F5D4",
    description: "Coders, strategy gamers, sci-fi buffs, and triviologists.",
    keywords: ["Coding", "Generative Art", "Sci-Fi", "Board Games", "Trivia", "Gaming", "Pixel Art", "RPG", "Arcades"]
  },
  {
    id: "hub-music",
    name: "Music & Nightlife",
    emoji: "🎛️",
    color: "#FF2985",
    description: "Vinyl curators, sonic creators, and late-night festival dancers.",
    keywords: ["Music", "Live Shows", "Music Production", "Synthesizers", "Vinyl", "Audio", "Nightlife", "Clubbing", "Dance", "Choreography", "Jazz"]
  },
  {
    id: "hub-lifestyle",
    name: "Outdoors & Lifestyle",
    emoji: "🌿",
    color: "#10B981",
    description: "Nature adventurers, cozy cafe lovers, and culinary creators.",
    keywords: ["Coffee", "Plants", "Hiking", "Tea", "Writing", "Dogs", "Animals", "Gardening", "Baking", "Cooking", "Boba", "Cozy Cafes", "Travel", "Camping", "Farmers Markets", "Fitness", "History", "Biographies", "Weightlifting", "Outdoors", "Spontaneous", "Diners"]
  }
];

export default function VibeGraph({ users, onSelectUser, themeId }: VibeGraphProps) {
  const theme = THEMES[themeId];
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeHubStats, setActiveHubStats] = useState<{ [key: string]: number }>({});

  // SVG Size matching the original radar map
  const size = 310;

  // Process data for the graph
  const { nodes, links, hubMemberCounts } = useMemo(() => {
    // 1. Initialize Hub nodes
    const graphNodes: GraphNode[] = VIBE_HUBS.map(hub => ({
      id: hub.id,
      type: "hub",
      name: hub.name,
      emoji: hub.emoji,
      color: hub.color,
      description: hub.description,
      keywords: hub.keywords,
      radius: 26,
      x: size / 2, // start center
      y: size / 2
    }));

    const graphLinks: GraphLink[] = [];
    const counts: { [key: string]: number } = {
      "hub-creative": 0,
      "hub-tech": 0,
      "hub-music": 0,
      "hub-lifestyle": 0
    };

    // 2. Map users to hubs based on overlapping interests
    users.forEach(user => {
      // Find matches for each hub
      const matchesByHub = VIBE_HUBS.map(hub => {
        const matches = user.interests.filter(interest => 
          hub.keywords.some(kw => kw.toLowerCase() === interest.toLowerCase())
        );
        return { hubId: hub.id, matches };
      });

      // Sort by number of matches to find the primary hub
      matchesByHub.sort((a, b) => b.matches.length - a.matches.length);

      const primaryMatch = matchesByHub[0];
      const primaryHubId = primaryMatch.matches.length > 0 ? primaryMatch.hubId : "hub-lifestyle"; // fallback to lifestyle if 0 matches
      
      // Keep track of which interests matched this vibe
      const matchedInterests = primaryMatch.matches.length > 0 
        ? primaryMatch.matches 
        : [user.interests[0] || "Lifestyle"];

      counts[primaryHubId]++;

      // Add user node
      graphNodes.push({
        id: user.id,
        type: "user",
        name: user.name,
        color: theme.primary,
        radius: 18,
        user,
        matchedInterests,
        x: size / 2 + (Math.random() - 0.5) * 80,
        y: size / 2 + (Math.random() - 0.5) * 80
      });

      // Add primary link
      graphLinks.push({
        source: user.id,
        target: primaryHubId,
        value: 1.5
      });

      // If user has matches with another hub, draw a secondary lighter link to stretch them between hubs!
      matchesByHub.slice(1).forEach(m => {
        if (m.matches.length > 0) {
          graphLinks.push({
            source: user.id,
            target: m.hubId,
            value: 0.5 // weaker strength
          });
        }
      });
    });

    return { nodes: graphNodes, links: graphLinks, hubMemberCounts: counts };
  }, [users, theme.primary]);

  // Keep track of statistics
  useEffect(() => {
    setActiveHubStats(hubMemberCounts);
  }, [hubMemberCounts]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render

    // Create defs for image patterns
    const defs = svg.append("defs");

    // Add glowing filter definitions for cluster hubs
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "blur");

    filter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // Defs for each user profile image pattern
    nodes.forEach(node => {
      if (node.type === "user" && node.user?.photo) {
        defs.append("pattern")
          .attr("id", `pattern-${node.id}`)
          .attr("x", 0)
          .attr("y", 0)
          .attr("height", 1)
          .attr("width", 1)
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("x", 0)
          .attr("y", 0)
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("href", node.user.photo);
      }
    });

    // Create a simulation with force parameters designed for nice boundaries
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(l => {
          const targetNode = typeof l.target === "string" ? null : (l.target as GraphNode);
          return targetNode?.type === "user" ? 45 : 70;
        })
        .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-40))
      .force("center", d3.forceCenter(size / 2, size / 2))
      .force("collide", d3.forceCollide<GraphNode>().radius(d => d.radius + 3).strength(0.7))
      .force("boundary", () => {
        // Keeps elements strictly inside our circular map area!
        nodes.forEach(node => {
          const r = node.radius;
          const cx = size / 2;
          const cy = size / 2;
          const maxR = size / 2 - 10;
          
          const dx = node.x! - cx;
          const dy = node.y! - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist + r > maxR) {
            const angle = Math.atan2(dy, dx);
            node.x = cx + (maxR - r) * Math.cos(angle);
            node.y = cy + (maxR - r) * Math.sin(angle);
          }
        });
      });

    // Container group
    const g = svg.append("g");

    // Draw link lines
    const link = g.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.08)")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(links)
      .join("line")
      .attr("stroke-dasharray", (d: GraphLink) => (d.value < 1 ? "3,3" : "none"))
      .attr("stroke-width", (d: GraphLink) => (d.value < 1 ? 0.8 : 1.2));

    // Draw nodes
    const node = g.append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Render node representations
    node.each(function (this: SVGGElement, d: GraphNode) {
      const el = d3.select(this);

      if (d.type === "hub") {
        // Draw hub glowing circles
        el.append("circle")
          .attr("r", d.radius)
          .attr("fill", "rgba(10, 10, 18, 0.8)")
          .attr("stroke", d.color)
          .attr("stroke-width", 2.5)
          .style("filter", "url(#glow)")
          .style("cursor", "grab");

        // Overlay transparent interaction zone
        el.append("circle")
          .attr("r", d.radius + 4)
          .attr("fill", "transparent")
          .style("cursor", "grab");

        // Display hub emoji
        el.append("text")
          .text(d.emoji || "")
          .attr("text-anchor", "middle")
          .attr("dy", "0.33em")
          .style("font-size", "14px")
          .style("pointer-events", "none")
          .style("user-select", "none");
      } else {
        // Draw user profile circular nodes
        el.append("circle")
          .attr("r", d.radius)
          .attr("fill", `url(#pattern-${d.id})`)
          .attr("stroke", d.user?.online ? theme.onlineDotColor : "rgba(255,255,255,0.3)")
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .style("transition", "stroke 0.2s");

        // Interactive outer hover ring
        el.append("circle")
          .attr("r", d.radius + 3)
          .attr("fill", "none")
          .attr("stroke", theme.primary)
          .attr("stroke-width", 1.5)
          .attr("opacity", 0)
          .attr("class", "hover-ring")
          .style("cursor", "pointer");

        // Boosted lightning badge overlay if user is boosted
        if (d.user?.boosted) {
          const badgeG = el.append("g")
            .attr("transform", "translate(-12, -12)");

          badgeG.append("circle")
            .attr("r", 6)
            .attr("fill", theme.primary);

          badgeG.append("text")
            .text("⚡")
            .attr("text-anchor", "middle")
            .attr("dy", "0.33em")
            .style("font-size", "6.5px")
            .attr("fill", "white");
        }
      }
    });

    // Hover & Click Interactions
    node.on("mouseenter", function (this: SVGGElement, event: MouseEvent, d: GraphNode) {
      setHoveredNode(d);
      
      // Place tooltip close to cursor
      const containerRect = svgRef.current?.getBoundingClientRect();
      if (containerRect) {
        setTooltipPos({
          x: event.clientX - containerRect.left + 15,
          y: event.clientY - containerRect.top + 15
        });
      }

      // Visual highlighting on hover
      if (d.type === "hub") {
        // Light up connected link routes & connected nodes
        link.attr("stroke", (l: GraphLink) => {
          const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
          const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
          return s === d.id || t === d.id ? theme.primary : "rgba(255, 255, 255, 0.04)";
        }).attr("stroke-width", (l: GraphLink) => {
          const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
          const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
          return s === d.id || t === d.id ? 2 : 0.8;
        });

        node.attr("opacity", (n: GraphNode) => {
          if (n.id === d.id) return 1;
          // Check if user node is linked to this hub
          const isLinked = links.some((l: GraphLink) => {
            const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
            const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
            return (s === n.id && t === d.id) || (s === d.id && t === n.id);
          });
          return isLinked ? 1 : 0.25;
        });
      } else {
        // Highlight single user node hover rings
        d3.select(this).select(".hover-ring").attr("opacity", 1);
      }
    })
    .on("mousemove", function (event: MouseEvent) {
      const containerRect = svgRef.current?.getBoundingClientRect();
      if (containerRect) {
        setTooltipPos({
          x: event.clientX - containerRect.left + 15,
          y: event.clientY - containerRect.top + 15
        });
      }
    })
    .on("mouseleave", function (this: SVGGElement, event: MouseEvent, d: GraphNode) {
      setHoveredNode(null);
      
      // Reset highlights
      link.attr("stroke", "rgba(255, 255, 255, 0.08)").attr("stroke-width", (l: GraphLink) => (l.value < 1 ? 0.8 : 1.2));
      node.attr("opacity", 1);
      d3.select(this).select(".hover-ring").attr("opacity", 0);
    })
    .on("click", function (event: MouseEvent, d: GraphNode) {
      if (d.type === "user" && d.user) {
        onSelectUser(d.user.id);
      }
    });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: GraphLink) => {
          const s = typeof d.source === "string" ? null : (d.source as GraphNode);
          return s?.x ?? 0;
        })
        .attr("y1", (d: GraphLink) => {
          const s = typeof d.source === "string" ? null : (d.source as GraphNode);
          return s?.y ?? 0;
        })
        .attr("x2", (d: GraphLink) => {
          const t = typeof d.target === "string" ? null : (d.target as GraphNode);
          return t?.x ?? 0;
        })
        .attr("y2", (d: GraphLink) => {
          const t = typeof d.target === "string" ? null : (d.target as GraphNode);
          return t?.y ?? 0;
        });

      node.attr("transform", (d: GraphNode) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, theme.primary, theme.onlineDotColor]);

  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-[36px] border border-white/10 overflow-hidden bg-zinc-950/40 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-center">
      
      {/* Header Info Overlay */}
      <div className="absolute top-4 left-5 right-5 flex justify-between items-center text-[9px] font-mono font-bold tracking-wider text-zinc-500 z-10 pointer-events-none">
        <span className="flex items-center">
          <Sparkles size={10} className="text-pink-500 mr-1 animate-pulse" />
          VIBE INTEREST GRAPH
        </span>
        <span className="flex items-center gap-1">
          <Info size={9} />
          DRAG NODES
        </span>
      </div>

      {/* Actual SVG Canvas */}
      <svg 
        ref={svgRef} 
        width={size} 
        height={size} 
        className="overflow-visible select-none z-10"
      />

      {/* Concentric helper grids */}
      <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute inset-28 rounded-full border border-white/5 pointer-events-none" />

      {/* HTML Tooltip Overlay inside relative container */}
      {hoveredNode && (
        <div 
          className="absolute z-50 pointer-events-none p-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-white/10 shadow-2xl w-48 animate-fadeIn text-left"
          style={{ 
            left: `${Math.min(tooltipPos.x, size - 170)}px`, 
            top: `${Math.min(tooltipPos.y, size - 120)}px` 
          }}
        >
          {hoveredNode.type === "hub" ? (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">{hoveredNode.emoji}</span>
                <span className="text-xs font-black text-white">{hoveredNode.name}</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal font-medium">
                {hoveredNode.description}
              </p>
              <div className="pt-1.5 border-t border-white/5 flex justify-between items-center text-[9px] font-mono">
                <span className="text-zinc-500">CLUSTERED:</span>
                <span className="text-white font-extrabold" style={{ color: theme.primary }}>
                  {activeHubStats[hoveredNode.id] || 0} active {activeHubStats[hoveredNode.id] === 1 ? "user" : "users"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img 
                  src={hoveredNode.user?.photo} 
                  alt={hoveredNode.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-white/20"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white truncate">
                    {hoveredNode.name}, {hoveredNode.user?.age}
                  </h4>
                  <p className="text-[9px] text-zinc-400 font-bold tracking-tight">
                    {hoveredNode.user?.pronouns}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-300 italic truncate">
                "{hoveredNode.user?.tagline}"
              </p>
              <div className="space-y-1 pt-1.5 border-t border-white/5">
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider block">
                  Cluster Match:
                </span>
                <div className="flex flex-wrap gap-1">
                  {hoveredNode.matchedInterests?.map((interest, i) => (
                    <span 
                      key={i}
                      className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider text-white"
                      style={{ backgroundColor: `${theme.primary}30`, border: `1px solid ${theme.primary}40` }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
