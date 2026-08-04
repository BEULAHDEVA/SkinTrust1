"use client";

import { useState, useEffect } from "react";

interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

interface RiskDonutChartProps {
  distribution: RiskDistribution;
}

export default function RiskDonutChart({ distribution }: RiskDonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<"low" | "medium" | "high" | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [distribution]);

  const { low = 86, medium = 11, high = 3 } = distribution;

  const total = low + medium + high || 100;
  const lowPct = Math.round((low / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const highPct = Math.round((high / total) * 100);

  // SVG parameters
  const size = 160;
  const center = size / 2;
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // 314.16

  // Dash array calculations (with a slight gap between segments if needed, but solid is clean)
  const lowDash = (lowPct / 100) * circumference;
  const medDash = (medPct / 100) * circumference;
  const highDash = (highPct / 100) * circumference;

  // Accumulated offsets
  const lowOffset = 0;
  const medOffset = -lowDash;
  const highOffset = -(lowDash + medDash);

  const segments = [
    {
      key: "low" as const,
      name: "Low Risk",
      pct: lowPct,
      color: "#10b981", // Emerald
      glowColor: "rgba(16, 185, 129, 0.4)",
      dashArray: `${animated ? lowDash : 0} ${circumference}`,
      dashOffset: lowOffset,
    },
    {
      key: "medium" as const,
      name: "Medium Risk",
      pct: medPct,
      color: "#f59e0b", // Amber
      glowColor: "rgba(245, 158, 11, 0.4)",
      dashArray: `${animated ? medDash : 0} ${circumference}`,
      dashOffset: medOffset,
    },
    {
      key: "high" as const,
      name: "High Risk",
      pct: highPct,
      color: "#f43f5e", // Rose
      glowColor: "rgba(244, 63, 94, 0.4)",
      dashArray: `${animated ? highDash : 0} ${circumference}`,
      dashOffset: highOffset,
    },
  ];

  // Active display info in the center
  const activeName = hoveredSegment 
    ? segments.find(s => s.key === hoveredSegment)?.name 
    : "Low Risk";
  const activePct = hoveredSegment 
    ? segments.find(s => s.key === hoveredSegment)?.pct 
    : lowPct;
  const activeColor = hoveredSegment 
    ? segments.find(s => s.key === hoveredSegment)?.color 
    : "#10b981";

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full">
      {/* SVG Donut */}
      <div className="relative w-40 h-40">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90 overflow-visible"
        >
          <defs>
            <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map((seg) => {
            const isHovered = hoveredSegment === seg.key;
            return (
              <circle
                key={seg.key}
                cx={center}
                cy={center}
                r={isHovered ? radius + 2.5 : radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredSegment(seg.key)}
                onMouseLeave={() => setHoveredSegment(null)}
                className="cursor-pointer transition-all duration-300 ease-out origin-center"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 6px ${seg.color})` : "none",
                }}
              />
            );
          })}
        </svg>

        {/* Central Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span 
            className="text-2xl font-bold font-['General_Sans'] transition-colors duration-200"
            style={{ color: activeColor, textShadow: `0 0 10px ${activeColor}40` }}
          >
            {activePct}%
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mt-0.5">
            {activeName}
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {segments.map((seg) => {
          const isHovered = hoveredSegment === seg.key;
          return (
            <div
              key={seg.key}
              className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "bg-white/5 border-white/10 shadow-[0_4px_12px_rgba(255,255,255,0.03)] scale-[1.03]"
                  : "bg-white/0 border-transparent hover:bg-white/3"
              }`}
              onMouseEnter={() => setHoveredSegment(seg.key)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: seg.color,
                    boxShadow: `0 0 6px ${seg.color}`,
                  }}
                />
                <span className="text-[10px] text-white/50 font-medium whitespace-nowrap">
                  {seg.name.split(" ")[0]}
                </span>
              </div>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: seg.color }}
              >
                {seg.pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
