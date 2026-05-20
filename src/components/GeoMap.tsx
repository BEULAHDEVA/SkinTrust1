"use client";

import { useState } from "react";

// Simplified paths for continents to keep code small but look good
const mapPaths = [
  // North America
  "M25.5,35.5 C25.5,35.5 35.5,25.5 45.5,30.5 C55.5,35.5 50.5,50.5 45.5,60.5 C40.5,70.5 35.5,65.5 35.5,65.5 C35.5,65.5 25.5,55.5 25.5,45.5 Z",
  // South America
  "M45.5,70.5 C45.5,70.5 55.5,65.5 60.5,75.5 C65.5,85.5 55.5,100.5 50.5,105.5 C45.5,110.5 40.5,95.5 40.5,85.5 Z",
  // Europe
  "M75.5,25.5 C85.5,25.5 95.5,20.5 105.5,25.5 C115.5,30.5 110.5,45.5 100.5,50.5 C90.5,55.5 80.5,50.5 75.5,45.5 Z",
  // Africa
  "M80.5,55.5 C90.5,55.5 100.5,60.5 105.5,70.5 C110.5,80.5 100.5,95.5 95.5,100.5 C90.5,105.5 80.5,90.5 75.5,80.5 Z",
  // Asia
  "M105.5,25.5 C125.5,20.5 145.5,25.5 160.5,35.5 C175.5,45.5 170.5,65.5 150.5,70.5 C130.5,75.5 115.5,65.5 105.5,55.5 Z",
  // Australia
  "M145.5,85.5 C155.5,80.5 165.5,85.5 170.5,95.5 C175.5,105.5 165.5,115.5 155.5,115.5 C145.5,115.5 140.5,105.5 145.5,95.5 Z",
];

const regions = [
  { id: "na", name: "North America", x: 40, y: 45, volume: "12,450", trend: "+14%" },
  { id: "eu", name: "Europe", x: 90, y: 35, volume: "8,320", trend: "+5%" },
  { id: "as", name: "Asia Pacific", x: 140, y: 50, volume: "15,890", trend: "+22%" },
  { id: "sa", name: "South America", x: 50, y: 85, volume: "3,100", trend: "-2%" },
];

export default function GeoMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[2/1] bg-[#030014]/50 rounded-xl overflow-hidden flex items-center justify-center">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}
      />
      
      <svg viewBox="0 0 200 130" className="w-full h-full opacity-60 drop-shadow-2xl">
        {/* Render simplified abstract continents */}
        {mapPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(99, 102, 241, 0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{ animationDuration: `${3 + i}s`, animationDelay: `${i * 0.5}s` }}
          />
        ))}

        {/* Render Region Nodes */}
        {regions.map((r) => (
          <g 
            key={r.id} 
            transform={`translate(${r.x}, ${r.y})`}
            onMouseEnter={() => setHovered(r.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            {/* Outer glow ring */}
            <circle 
              r="6" 
              fill="rgba(99, 102, 241, 0.2)" 
              className={`transition-all duration-300 ${hovered === r.id ? "animate-ping opacity-100" : "opacity-0"}`} 
            />
            {/* Inner dot */}
            <circle 
              r="2.5" 
              fill={hovered === r.id ? "#fff" : "#818cf8"} 
              className="transition-colors duration-300"
              style={{ filter: "drop-shadow(0 0 4px #818cf8)" }}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip HTML Overlay */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {regions.filter(r => r.id === hovered).map((r) => (
            <div 
              key={r.id} 
              className="absolute z-10 bg-[#0a0a1a]/90 backdrop-blur-md border border-indigo-500/30 p-3 rounded-lg shadow-2xl flex flex-col gap-1 transition-all animate-in fade-in zoom-in duration-200"
              style={{ left: `${(r.x / 200) * 100}%`, top: `${(r.y / 130) * 100}%`, transform: 'translate(-50%, -120%)' }}
            >
              <span className="text-xs font-bold text-white whitespace-nowrap">{r.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Vol:</span>
                <span className="text-xs text-indigo-300 font-mono">{r.volume}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Trend:</span>
                <span className={`text-xs font-mono ${r.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{r.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
