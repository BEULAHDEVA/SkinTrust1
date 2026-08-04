"use client";

import { useState, useRef, useEffect } from "react";

interface DataPoint {
  date: string;
  count: number;
}

interface VerificationVolumeChartProps {
  data: DataPoint[];
  range: "7" | "30";
}

export default function VerificationVolumeChart({ data, range }: VerificationVolumeChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [range, data]);

  if (!data || data.length === 0) return null;

  // Filter data based on range (take last N items)
  const limit = range === "7" ? 7 : 30;
  const chartData = data.slice(-limit);

  // SVG parameters
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...chartData.map((d) => d.count), 1);
  // Pad the max value so the line doesn't touch the top
  const maxAxisVal = Math.ceil(maxVal * 1.15);
  const minVal = 0;

  // Coordinate conversion
  const getCoordinates = () => {
    return chartData.map((d, i) => {
      const x = paddingX + (i / (chartData.length - 1)) * (width - 2 * paddingX);
      const valRatio = (d.count - minVal) / (maxAxisVal - minVal);
      // If animated is false, start line at the bottom
      const animRatio = animated ? valRatio : 0;
      const y = height - paddingY - animRatio * (height - 2 * paddingY);
      return { x, y, count: d.count, date: d.date };
    });
  };

  const points = getCoordinates();

  // Draw smooth curve using cubic bezier splines
  const getSplinePath = () => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      // Simple smooth interpolation (midpoint control points)
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const cpY2 = next.y;

      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const splinePath = getSplinePath();
  
  // Filled area path
  const areaPath = points.length >= 2 
    ? `${splinePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z` 
    : "";

  // Date labels to display on X-axis (avoid crowding for 30 days)
  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
  };

  const xGridTicks = range === "7" 
    ? points 
    : points.filter((_, i) => i % 5 === 0 || i === points.length - 1);

  // Y-axis grid ticks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
    const val = Math.round(minVal + (i / (yTicksCount - 1)) * (maxAxisVal - minVal));
    const y = height - paddingY - (i / (yTicksCount - 1)) * (height - 2 * paddingY);
    return { val, y };
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col select-none">
      {/* Tooltip Overlay */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="absolute z-30 pointer-events-none bg-black/80 backdrop-blur-md border border-indigo-500/30 p-3 rounded-xl shadow-2xl flex flex-col gap-1 transition-all duration-200 ease-out"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 15}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
            {new Date(points[hoveredIdx].date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="text-sm font-bold text-white font-mono">
              {points[hoveredIdx].count.toLocaleString()}
            </span>
            <span className="text-xs text-white/40">verifications</span>
          </div>
        </div>
      )}

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Glowing Area Gradient */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.00" />
          </linearGradient>
          {/* Line stroke gradient */}
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y Gridlines */}
        {yTicks.map((tick, i) => (
          <g key={i} className="opacity-15">
            <line
              x1={paddingX}
              y1={tick.y}
              x2={width - paddingX}
              y2={tick.y}
              stroke="#fff"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <text
              x={paddingX - 10}
              y={tick.y + 3}
              fill="#fff"
              fontSize="9"
              textAnchor="end"
              className="font-mono font-medium opacity-50"
            >
              {tick.val}
            </text>
          </g>
        ))}

        {/* Filled Area */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#areaGrad)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Glowing Spline Line */}
        {splinePath && (
          <path
            d={splinePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.0"
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* X Axis Labels */}
        {xGridTicks.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={height - paddingY + 18}
            fill="#fff"
            fontSize="9"
            textAnchor="middle"
            className="opacity-40 font-medium"
          >
            {formatLabel(pt.date)}
          </text>
        ))}

        {/* Hover vertical reference line */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <line
            x1={points[hoveredIdx].x}
            y1={paddingY}
            x2={points[hoveredIdx].x}
            y2={height - paddingY}
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Hover and interactive node markers */}
        {points.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g key={i}>
              {/* Invisible interactive hover rect zone */}
              <rect
                x={pt.x - (width - 2 * paddingX) / (points.length * 2)}
                y={0}
                width={(width - 2 * paddingX) / points.length}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Pulsing indicator node */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="rgba(139, 92, 246, 0.4)"
                  className="animate-ping"
                  pointerEvents="none"
                />
              )}

              {/* Core Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "3.5"}
                fill={isHovered ? "#fff" : "url(#lineGrad)"}
                stroke={isHovered ? "#8b5cf6" : "rgba(255, 255, 255, 0.15)"}
                strokeWidth={isHovered ? "2.5" : "1"}
                className="transition-all duration-150 ease-out pointer-events-none"
                style={{
                  filter: isHovered ? "drop-shadow(0 0 6px #8b5cf6)" : "none",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
