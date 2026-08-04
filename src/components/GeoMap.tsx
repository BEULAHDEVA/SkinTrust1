"use client";

import { useState, useEffect } from "react";

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

// Region node absolute position mapping
const regionCoordinates: Record<string, { x: number; y: number }> = {
  na: { x: 40, y: 45 },
  eu: { x: 90, y: 35 },
  as: { x: 140, y: 50 },
  sa: { x: 50, y: 85 },
};

interface GeoDistributionItem {
  region: string;
  key: string;
  volume: number;
  trend: string;
  successRate: number;
}

interface GeoMapProps {
  data?: GeoDistributionItem[];
}

export default function GeoMap({ data }: GeoMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  // Standard fallback regions if no API data is passed
  const activeData: GeoDistributionItem[] = data || [
    { region: "North America", key: "na", volume: 12450, trend: "+14%", successRate: 98.2 },
    { region: "Europe", key: "eu", volume: 8320, trend: "+5%", successRate: 97.5 },
    { region: "Asia Pacific", key: "as", volume: 15890, trend: "+22%", successRate: 96.8 },
    { region: "South America", key: "sa", volume: 3100, trend: "-2%", successRate: 94.1 },
  ];

  const maxVolume = Math.max(...activeData.map((r) => r.volume), 1);

  return (
    <div className="relative w-full aspect-[2/1] bg-[#030014]/50 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center backdrop-blur-sm select-none">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* SVG Map Layout */}
      <svg
        viewBox="0 0 200 130"
        className="w-full h-full opacity-70 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Abstract futuristic continent contours */}
        {mapPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{
              animationDuration: `${4 + i}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Volume Heatmap Node Rings & Ripples */}
        {activeData.map((r) => {
          const coords = regionCoordinates[r.key];
          if (!coords) return null;

          // Scale radius (from min 3px to max 9px based on heat map volume)
          const baseRadius = 3.0 + (r.volume / maxVolume) * 6.0;
          const isHovered = hovered === r.key;

          return (
            <g
              key={r.key}
              transform={`translate(${coords.x}, ${coords.y})`}
              onMouseEnter={() => setHovered(r.key)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Heat gradient glow halo */}
              <circle
                r={baseRadius * 3.5}
                fill="url(#hotspotGlow)"
                className="opacity-70"
                pointerEvents="none"
              />

              {/* Multiple concentric animated radar rings for large nodes */}
              {animated && (
                <>
                  <circle
                    r={baseRadius * 2.2}
                    fill="none"
                    stroke={r.volume > 10000 ? "#ec4899" : "#6366f1"}
                    strokeWidth="0.5"
                    className="animate-ping opacity-35"
                    style={{ animationDuration: "2.4s" }}
                    pointerEvents="none"
                  />
                  {r.volume > 10000 && (
                    <circle
                      r={baseRadius * 3.5}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="0.3"
                      className="animate-ping opacity-20"
                      style={{ animationDuration: "3.6s", animationDelay: "0.8s" }}
                      pointerEvents="none"
                    />
                  )}
                </>
              )}

              {/* Steady outer glow border */}
              <circle
                r={isHovered ? baseRadius + 3 : baseRadius + 1.2}
                fill="none"
                stroke={isHovered ? "#fff" : "rgba(99, 102, 241, 0.4)"}
                strokeWidth="1.0"
                className="transition-all duration-300"
              />

              {/* Solid core indicator node */}
              <circle
                r={isHovered ? baseRadius * 0.8 : baseRadius * 0.5}
                fill={isHovered ? "#fff" : r.volume > 10000 ? "#ec4899" : "#818cf8"}
                className="transition-all duration-300"
                style={{
                  filter: `drop-shadow(0 0 5px ${r.volume > 10000 ? "#ec4899" : "#818cf8"})`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Glassmorphic Tooltip Overlay */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {activeData
            .filter((r) => r.key === hovered)
            .map((r) => {
              const coords = regionCoordinates[r.key];
              if (!coords) return null;

              return (
                <div
                  key={r.key}
                  className="absolute z-30 bg-black/90 backdrop-blur-md border border-indigo-500/35 p-3.5 rounded-xl shadow-2xl flex flex-col gap-1.5 transition-all animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    left: `${(coords.x / 200) * 100}%`,
                    top: `${(coords.y / 130) * 100}%`,
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {r.region}
                  </span>
                  
                  <div className="flex flex-col gap-0.5 text-[10px]">
                    <div className="flex justify-between items-center gap-6">
                      <span className="text-white/40 uppercase tracking-widest font-semibold">Volume:</span>
                      <span className="text-white font-bold font-mono">
                        {r.volume.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-6">
                      <span className="text-white/40 uppercase tracking-widest font-semibold">Trend:</span>
                      <span
                        className={`font-bold font-mono ${
                          r.trend.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {r.trend}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-6">
                      <span className="text-white/40 uppercase tracking-widest font-semibold">Success:</span>
                      <span className="text-cyan-400 font-bold font-mono">
                        {r.successRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
