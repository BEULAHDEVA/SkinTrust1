"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import GeoMap from "@/components/GeoMap";
import { useLanguage } from "@/lib/useLanguage";
import { useTranslation } from "@/lib/translations";

type Range = "7" | "30";

const chartData: Record<Range, { value: number; label: string }[]> = {
  "7": [
    { value: 65, label: "14 May" },
    { value: 80, label: "15 May" },
    { value: 55, label: "16 May" },
    { value: 90, label: "17 May" },
    { value: 70, label: "18 May" },
    { value: 85, label: "19 May" },
    { value: 100, label: "20 May" },
  ],
  "30": [
    { value: 45, label: "2 May" },
    { value: 30, label: "4 May" },
    { value: 60, label: "6 May" },
    { value: 40, label: "8 May" },
    { value: 75, label: "10 May" },
    { value: 55, label: "12 May" },
    { value: 85, label: "14 May" },
    { value: 70, label: "16 May" },
    { value: 90, label: "18 May" },
    { value: 65, label: "19 May" },
    { value: 80, label: "19 May" },
    { value: 100, label: "20 May" },
  ],
};

const kpis: Record<Range, { total: string; totalDelta: string; approval: string; approvalDelta: string; pending: number; pendingDelta: string; highRisk: string }> = {
  "7": { total: "5,841", totalDelta: "+8.2%", approval: "87.1%", approvalDelta: "+1.4%", pending: 142, pendingDelta: "-14 from yesterday", highRisk: "3.2%" },
  "30": { total: "24,892", totalDelta: "+12.5%", approval: "86.4%", approvalDelta: "+2.1%", pending: 142, pendingDelta: "-14 from yesterday", highRisk: "3.2%" },
};

export default function AnalyticsDashboardPage() {
  const [lang] = useLanguage();
  const t = useTranslation(lang);
  
  const [range, setRange] = useState<Range>("7");
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);

  // Trigger animation on mount and on range change
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [range]);

  const data = chartData[range];
  const kpi = kpis[range];

  // Donut chart for risk distribution
  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const lowPct = 86, medPct = 11, highPct = 3;
  const lowDash = (lowPct / 100) * donutCircumference;
  const medDash = (medPct / 100) * donutCircumference;
  const highDash = (highPct / 100) * donutCircumference;

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-8 max-w-6xl mx-auto w-full gap-8 overflow-y-auto">

        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold font-['General_Sans'] tracking-tight">{t("dash.title")}</h1>
            <p className="text-white/40 text-sm mt-1">{t("dash.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button
              id="range-7days"
              variant="heroSecondary"
              onClick={() => setRange("7")}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${range === "7" ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-200" : "bg-white/5"}`}
            >
              Last 7 Days
            </Button>
            <Button
              id="range-30days"
              variant="heroSecondary"
              onClick={() => setRange("30")}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${range === "30" ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-200" : "bg-white/5"}`}
            >
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t("dash.kpi.total"), value: kpi.total, delta: kpi.totalDelta, color: "text-white", deltaColor: "text-emerald-400" },
            { label: t("dash.kpi.auto"), value: kpi.approval, delta: kpi.approvalDelta, color: "text-indigo-400", deltaColor: "text-emerald-400" },
            { label: t("dash.kpi.pending"), value: String(kpi.pending), delta: kpi.pendingDelta, color: "text-amber-400", deltaColor: "text-amber-400" },
            { label: t("dash.kpi.risk"), value: kpi.highRisk, delta: "Stable", color: "text-rose-400", deltaColor: "text-white/40" },
          ].map((card) => (
            <div key={card.label} className="liquid-glass rounded-2xl p-5 border border-white/5 flex flex-col gap-2">
              <span className="text-xs font-medium text-white/50">{card.label}</span>
              <span className={`text-3xl md:text-4xl font-bold font-['General_Sans'] ${card.color}`}>{card.value}</span>
              <span className={`text-xs font-medium ${card.deltaColor}`}>{card.delta}</span>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bar Chart */}
          <div className="col-span-2 liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg font-['General_Sans']">Verification Volume</h3>
              <span className="text-xs text-white/30 font-mono">{range === "7" ? "Past 7 days" : "Past 30 days"}</span>
            </div>
            <div
              className="flex items-end justify-between gap-1.5 md:gap-2 h-48 relative"
              onMouseLeave={() => setTooltip(null)}
            >
              {data.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col gap-1.5 items-center group cursor-pointer relative"
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    setTooltip({ index: i, x: rect.left, y: rect.top });
                  }}
                >
                  {/* Tooltip */}
                  {tooltip?.index === i && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap shadow-xl pointer-events-none">
                      <span className="font-semibold text-indigo-300">{bar.value}%</span>
                      <span className="text-white/40 ml-1">capacity</span>
                    </div>
                  )}

                  {/* Bar container */}
                  <div className="w-full h-full relative flex items-end" style={{ height: "192px" }}>
                    {/* Background track */}
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-t-md group-hover:bg-indigo-500/10 transition-colors" />
                    {/* Animated fill */}
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      style={{ height: animated ? `${bar.value}%` : "0%" }}
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] text-white/30 whitespace-nowrap">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart — Risk Distribution */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
            <h3 className="font-semibold text-lg font-['General_Sans']">Risk Distribution</h3>

            {/* SVG Donut */}
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Low risk */}
                  <circle
                    cx="60" cy="60" r={donutRadius}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14"
                  />
                  <circle
                    cx="60" cy="60" r={donutRadius}
                    fill="none" stroke="#10b981" strokeWidth="14"
                    strokeDasharray={`${animated ? lowDash : 0} ${donutCircumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease-out" }}
                  />
                  {/* Medium risk (offset after low) */}
                  <circle
                    cx="60" cy="60" r={donutRadius}
                    fill="none" stroke="#f59e0b" strokeWidth="14"
                    strokeDasharray={`${animated ? medDash : 0} ${donutCircumference}`}
                    strokeDashoffset={-lowDash}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease-out 0.2s" }}
                  />
                  {/* High risk */}
                  <circle
                    cx="60" cy="60" r={donutRadius}
                    fill="none" stroke="#f43f5e" strokeWidth="14"
                    strokeDasharray={`${animated ? highDash : 0} ${donutCircumference}`}
                    strokeDashoffset={-(lowDash + medDash)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease-out 0.4s" }}
                  />
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white font-['General_Sans']">{lowPct}%</span>
                  <span className="text-[10px] text-white/40">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Low Risk", pct: `${lowPct}%`, color: "bg-emerald-500", text: "text-emerald-400" },
                { label: "Medium Risk", pct: `${medPct}%`, color: "bg-amber-500", text: "text-amber-400" },
                { label: "High Risk", pct: `${highPct}%`, color: "bg-rose-500", text: "text-rose-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-white/70">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.text}`}>{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map & Recent Activity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* GeoMap Widget */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg font-['General_Sans']">{t("dash.map.title")}</h3>
              <span className="text-xs text-white/30 font-mono">Live hotspots</span>
            </div>
            <div className="flex-1 min-h-[250px] relative">
              <GeoMap />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="liquid-glass rounded-2xl border border-white/5 flex flex-col">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold font-['General_Sans']">{t("dash.recent")}</h3>
            <a href="/customers" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">{t("dash.viewall")}</a>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { name: "Alex Mercer", id: "CUS-8921", status: "Verified", risk: "Low", time: "2 min ago" },
              { name: "Sarah Jenkins", id: "CUS-8922", status: "Pending", risk: "Medium", time: "14 min ago" },
              { name: "Michael Chen", id: "CUS-8923", status: "Rejected", risk: "High", time: "28 min ago" },
            ].map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-white/40 font-mono">{r.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    r.status === "Verified" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" :
                    r.status === "Pending" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                  }`}>{r.status}</span>
                  <span className="text-xs text-white/30">{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
    </main>
  );
}
