"use client";

import { useState, useEffect } from "react";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) return null;

  // SVG parameters
  const svgWidth = 500;
  const svgHeight = 280;
  
  const stageHeight = 38;
  const gap = 12;
  const paddingY = 15;

  // Colors for each stage representing progressive filtering
  const colors = [
    { fill: "url(#funnelGrad0)", border: "#818cf8" }, // Submissions (indigo)
    { fill: "url(#funnelGrad1)", border: "#a78bfa" }, // OCR (violet)
    { fill: "url(#funnelGrad2)", border: "#ec4899" }, // Face (pink)
    { fill: "url(#funnelGrad3)", border: "#f43f5e" }, // Fraud (rose)
    { fill: "url(#funnelGrad4)", border: "#10b981" }, // Approved (emerald)
  ];

  // Calculate coordinates for the trapezoids
  const totalStages = data.length;
  
  const getTrapezoidPoints = (index: number) => {
    const yTop = paddingY + index * (stageHeight + gap);
    const yBottom = yTop + stageHeight;

    const currentPct = data[index].percentage;
    // Map percentage to width (from min 160px up to max 420px)
    const baseMaxWidth = 420;
    const baseMinWidth = 160;
    const getWidth = (pct: number) => {
      const scale = animated ? (pct / 100) : 0;
      return baseMinWidth + scale * (baseMaxWidth - baseMinWidth);
    };

    // Calculate top and bottom width
    const wTop = getWidth(currentPct);
    
    // Taper bottom width slightly towards the next stage's top width
    const nextPct = index < totalStages - 1 ? data[index + 1].percentage : currentPct;
    const wBottom = getWidth(nextPct);

    // X positions centered
    const xTopLeft = (svgWidth - wTop) / 2;
    const xTopRight = xTopLeft + wTop;
    const xBottomLeft = (svgWidth - wBottom) / 2;
    const xBottomRight = xBottomLeft + wBottom;

    return {
      points: `${xTopLeft},${yTop} ${xTopRight},${yTop} ${xBottomRight},${yBottom} ${xBottomLeft},${yBottom}`,
      yMid: yTop + stageHeight / 2,
      wTop,
      wBottom,
      yTop,
      yBottom
    };
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floating Hover Card */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div 
          className="absolute z-20 pointer-events-none bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl flex flex-col gap-1 transition-all duration-200"
          style={{
            top: `${paddingY + hoveredIdx * (stageHeight + gap) + stageHeight}px`,
            transform: "translateY(5px)",
          }}
        >
          <span className="text-xs font-bold text-white">{data[hoveredIdx].stage}</span>
          <div className="flex justify-between items-center gap-4 text-xs">
            <span className="text-white/50">Volume:</span>
            <span className="font-mono text-indigo-300 font-semibold">
              {data[hoveredIdx].count.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 text-xs">
            <span className="text-white/50">Conversion:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {data[hoveredIdx].percentage}%
            </span>
          </div>
          {hoveredIdx > 0 && (
            <div className="flex justify-between items-center gap-4 text-xs border-t border-white/5 pt-1 mt-1">
              <span className="text-white/40">Drop-off:</span>
              <span className="font-mono text-rose-400">
                -{Math.round((data[hoveredIdx - 1].percentage - data[hoveredIdx].percentage) * 10) / 10}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* SVG Funnel */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="funnelGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="funnelGrad0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="funnelGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="funnelGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#db2777" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="funnelGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="funnelGrad4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Dynamic Funnel Layers */}
        {data.map((stage, i) => {
          const { points, yMid, wTop, wBottom, yTop, yBottom } = getTrapezoidPoints(i);
          const isHovered = hoveredIdx === i;
          const style = colors[i % colors.length];

          return (
            <g 
              key={stage.stage}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Glass Underlay (static placeholder size) */}
              <polygon
                points={points}
                fill="rgba(255, 255, 255, 0.02)"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />

              {/* Glowing Active Trapezoid Segment */}
              <polygon
                points={points}
                fill={style.fill}
                stroke={isHovered ? "#fff" : style.border}
                strokeWidth={isHovered ? "2.5" : "1.5"}
                className="transition-all duration-500 ease-out origin-center"
                style={{
                  filter: isHovered ? "url(#funnelGlowFilter)" : "none",
                }}
              />

              {/* Stage Name (Left Aligned inside) */}
              <text
                x={svgWidth / 2 - Math.max(wTop, wBottom) / 2 + 15}
                y={yMid + 4}
                fill="#fff"
                fontSize="11"
                fontWeight="600"
                className="opacity-90 font-sans pointer-events-none"
              >
                {stage.stage}
              </text>

              {/* Stage Value (Right Aligned inside) */}
              <text
                x={svgWidth / 2 + Math.max(wTop, wBottom) / 2 - 15}
                y={yMid + 4}
                fill="#fff"
                fontSize="11"
                fontWeight="700"
                textAnchor="end"
                className="font-mono pointer-events-none"
                style={{ fill: isHovered ? "#fff" : style.border }}
              >
                {stage.percentage}%
              </text>

              {/* Connection drop-off percentage arrow */}
              {i < totalStages - 1 && animated && (
                <g className="opacity-40">
                  <line
                    x1={svgWidth / 2}
                    y1={yBottom}
                    x2={svgWidth / 2}
                    y2={yBottom + gap}
                    stroke="#fff"
                    strokeWidth="1.0"
                    strokeDasharray="2 2"
                  />
                  <polygon
                    points={`${svgWidth / 2 - 3},${yBottom + gap - 4} ${svgWidth / 2 + 3},${yBottom + gap - 4} ${svgWidth / 2},${yBottom + gap}`}
                    fill="#fff"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
