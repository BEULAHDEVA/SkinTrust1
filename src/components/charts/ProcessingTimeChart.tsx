"use client";

import { useState, useRef, useEffect } from "react";

interface ProcessingTimePoint {
  date: string;
  avgTime: number;
  details?: {
    ocr: number;
    face: number;
    fraud: number;
    compliance: number;
  };
}

interface ProcessingTimeChartProps {
  data: ProcessingTimePoint[];
  range: "7" | "30";
}

export default function ProcessingTimeChart({ data, range }: ProcessingTimeChartProps) {
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

  const maxVal = Math.max(...chartData.map((d) => d.avgTime), 1);
  const maxAxisVal = Math.ceil(maxVal * 1.2 * 10) / 10; // Pad top by 20%
  const minVal = 0;

  // Coordinate conversion
  const getCoordinates = () => {
    return chartData.map((d, i) => {
      const x = paddingX + (i / (chartData.length - 1)) * (width - 2 * paddingX);
      const valRatio = d.avgTime / maxAxisVal;
      const animRatio = animated ? valRatio : 0;
      const y = height - paddingY - animRatio * (height - 2 * paddingY);
      return { x, y, avgTime: d.avgTime, date: d.date, details: d.details };
    });
  };

  const points = getCoordinates();

  // Draw smooth spline curve (Catmull-Rom midpoint formula)
  const getSplinePath = () => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const cpY2 = next.y;

      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const splinePath = getSplinePath();

  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
  };

  const xGridTicks = range === "7" 
    ? points 
    : points.filter((_, i) => i % 5 === 0 || i === points.length - 1);

  // Y-axis grid ticks (seconds)
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
    const val = (i / (yTicksCount - 1)) * maxAxisVal;
    const y = height - paddingY - (i / (yTicksCount - 1)) * (height - 2 * paddingY);
    return { val: val.toFixed(1) + "s", y };
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col select-none">
      {/* Floating Hover Tooltip with Multi-Agent detail breakdown */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="absolute z-30 pointer-events-none bg-black/85 backdrop-blur-md border border-indigo-500/30 p-3.5 rounded-xl shadow-2xl flex flex-col gap-2 transition-all duration-200"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 15}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="flex justify-between items-center gap-6 border-b border-white/10 pb-1.5">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
              {new Date(points[hoveredIdx].date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs font-bold text-cyan-400 font-mono">
              Avg: {points[hoveredIdx].avgTime}s
            </span>
          </div>

          {/* Multi-Agent Breakdown */}
          {points[hoveredIdx].details ? (
            <div className="flex flex-col gap-1 text-[10px]">
              {[
                { label: "OCR Extract", val: points[hoveredIdx].details?.ocr, color: "bg-indigo-400" },
                { label: "Face verification", val: points[hoveredIdx].details?.face, color: "bg-fuchsia-400" },
                { label: "Fraud Check", val: points[hoveredIdx].details?.fraud, color: "bg-rose-400" },
                { label: "Regulatory Check", val: points[hoveredIdx].details?.compliance, color: "bg-cyan-400" },
              ].map((agent) => (
                <div key={agent.label} className="flex justify-between items-center gap-8">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.color}`} />
                    <span>{agent.label}</span>
                  </div>
                  <span className="font-mono text-white font-semibold">{agent.val}s</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-white/40 italic">Breakdown unavailable</span>
          )}
        </div>
      )}

      {/* SVG Line Graph */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Cyan/Blue Gradient */}
          <linearGradient id="timeLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="timeGlow" x="-20%" y="-20%" width="140%" height="140%">
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

        {/* Spline Path */}
        {splinePath && (
          <path
            d={splinePath}
            fill="none"
            stroke="url(#timeLineGrad)"
            strokeWidth="3.0"
            strokeLinecap="round"
            filter="url(#timeGlow)"
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

        {/* Hover reference vertical dashed line */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <line
            x1={points[hoveredIdx].x}
            y1={paddingY}
            x2={points[hoveredIdx].x}
            y2={height - paddingY}
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Interactive nodes */}
        {points.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g key={i}>
              {/* Invisible interactive zone */}
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

              {/* Glowing ripple on hover */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="rgba(6, 182, 212, 0.4)"
                  className="animate-ping"
                  pointerEvents="none"
                />
              )}

              {/* Node Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "3.5"}
                fill={isHovered ? "#fff" : "url(#timeLineGrad)"}
                stroke={isHovered ? "#06b6d4" : "rgba(255, 255, 255, 0.15)"}
                strokeWidth={isHovered ? "2.5" : "1"}
                className="transition-all duration-150 ease-out pointer-events-none"
                style={{
                  filter: isHovered ? "drop-shadow(0 0 6px #06b6d4)" : "none",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
