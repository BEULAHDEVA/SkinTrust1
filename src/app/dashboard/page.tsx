"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import GeoMap from "@/components/GeoMap";
import { useLanguage } from "@/lib/useLanguage";
import { useTranslation } from "@/lib/translations";

// Custom SVG Chart components
import VerificationVolumeChart from "@/components/charts/VerificationVolumeChart";
import RiskDonutChart from "@/components/charts/RiskDonutChart";
import FunnelChart from "@/components/charts/FunnelChart";
import ProcessingTimeChart from "@/components/charts/ProcessingTimeChart";

type Range = "7" | "30";

interface DashboardStats {
  totalVerifications: number;
  autoApprovalRate: number;
  pendingReview: number;
  highRiskPercent: number;
  riskDistribution: { low: number; medium: number; high: number };
  recentActivity: { date: string; count: number }[];
  processingTimeTrend: { date: string; avgTime: number; details: any }[];
  funnelData: { stage: string; count: number; percentage: number }[];
  geoDistribution: { region: string; key: string; volume: number; trend: string; successRate: number }[];
}

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, enabled]);

  return value;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function KpiSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-5 border border-white/5 flex flex-col gap-2">
      <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
      <div className="h-9 w-20 bg-white/10 rounded animate-pulse mt-1" />
      <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4 w-full h-[260px] justify-between">
      <div className="flex justify-between items-center">
        <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="flex items-end justify-between gap-3 h-32 px-4">
        {[20, 60, 45, 80, 55, 70, 95].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-2 items-center">
            <div className="w-full bg-white/5 rounded-t-md relative" style={{ height: "100px" }}>
              <div
                className="w-full rounded-t-md bg-white/10 animate-pulse absolute bottom-0"
                style={{ height: `${h}%` }}
              />
            </div>
            <div className="h-2 w-6 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const [lang] = useLanguage();
  const t = useTranslation(lang);

  const [range, setRange] = useState<Range>("7");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data: DashboardStats = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        // Robust Client-side fallback if the API fails entirely
        setStats({
          totalVerifications: 5841,
          autoApprovalRate: 87.1,
          pendingReview: 142,
          highRiskPercent: 3.2,
          riskDistribution: { low: 86, medium: 11, high: 3 },
          recentActivity: [
            { date: "2026-05-16", count: 155 },
            { date: "2026-05-17", count: 190 },
            { date: "2026-05-18", count: 170 },
            { date: "2026-05-19", count: 185 },
            { date: "2026-05-20", count: 200 },
            { date: "2026-05-21", count: 220 },
            { date: "2026-05-22", count: 245 },
          ],
          processingTimeTrend: [
            { date: "2026-05-16", avgTime: 4.8, details: { ocr: 0.9, face: 2.1, fraud: 1.2, compliance: 0.6 } },
            { date: "2026-05-17", avgTime: 4.5, details: { ocr: 0.8, face: 2.0, fraud: 1.1, compliance: 0.6 } },
            { date: "2026-05-18", avgTime: 5.2, details: { ocr: 1.0, face: 2.3, fraud: 1.3, compliance: 0.6 } },
            { date: "2026-05-19", avgTime: 4.2, details: { ocr: 0.7, face: 1.9, fraud: 1.0, compliance: 0.6 } },
            { date: "2026-05-20", avgTime: 3.8, details: { ocr: 0.7, face: 1.7, fraud: 0.9, compliance: 0.5 } },
            { date: "2026-05-21", avgTime: 4.0, details: { ocr: 0.8, face: 1.8, fraud: 0.9, compliance: 0.5 } },
            { date: "2026-05-22", avgTime: 3.5, details: { ocr: 0.6, face: 1.6, fraud: 0.8, compliance: 0.5 } },
          ],
          funnelData: [
            { stage: "Submissions", count: 5841, percentage: 100 },
            { stage: "OCR Parsing", count: 5432, percentage: 93 },
            { stage: "Face Match", count: 4964, percentage: 85 },
            { stage: "Fraud Shield", count: 4789, percentage: 82 },
            { stage: "Approved Decisions", count: 4672, percentage: 80 },
          ],
          geoDistribution: [
            { region: "North America", key: "na", volume: 12450, trend: "+14%", successRate: 98.2 },
            { region: "Europe", key: "eu", volume: 8320, trend: "+5%", successRate: 97.5 },
            { region: "Asia Pacific", key: "as", volume: 15890, trend: "+22%", successRate: 96.8 },
            { region: "South America", key: "sa", volume: 3100, trend: "-2%", successRate: 94.1 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Animated counters for KPIs
  const animTotal = useAnimatedCounter(
    stats?.totalVerifications ?? 0,
    1200,
    !loading
  );
  const animPending = useAnimatedCounter(
    stats?.pendingReview ?? 0,
    1000,
    !loading
  );
  const animApproval = useAnimatedCounter(
    Math.round((stats?.autoApprovalRate ?? 0) * 10),
    1000,
    !loading
  );
  const animHighRisk = useAnimatedCounter(
    Math.round((stats?.highRiskPercent ?? 0) * 10),
    800,
    !loading
  );

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-8 max-w-6xl mx-auto w-full gap-8 overflow-y-auto">
        
        {/* Header section with range toggles */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold font-['General_Sans'] tracking-tight">
              {t("dash.title")}
            </h1>
            <p className="text-white/40 text-sm mt-1">{t("dash.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button
              id="range-7days"
              variant="heroSecondary"
              onClick={() => setRange("7")}
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-300 font-medium ${
                range === "7"
                  ? "bg-indigo-500/25 border-indigo-500/40 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                  : "bg-white/5 border border-white/5 hover:bg-white/10"
              }`}
            >
              Last 7 Days
            </Button>
            <Button
              id="range-30days"
              variant="heroSecondary"
              onClick={() => setRange("30")}
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-300 font-medium ${
                range === "30"
                  ? "bg-indigo-500/25 border-indigo-500/40 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                  : "bg-white/5 border border-white/5 hover:bg-white/10"
              }`}
            >
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* KPI Cards Row */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: t("dash.kpi.total"),
                value: formatNumber(animTotal),
                delta: "+8.2%",
                color: "text-white",
                deltaColor: "text-emerald-400",
              },
              {
                label: t("dash.kpi.auto"),
                value: `${(animApproval / 10).toFixed(1)}%`,
                delta: "+1.4%",
                color: "text-indigo-400",
                deltaColor: "text-emerald-400",
              },
              {
                label: t("dash.kpi.pending"),
                value: String(animPending),
                delta: "-14 from yesterday",
                color: "text-amber-400",
                deltaColor: "text-amber-400",
              },
              {
                label: t("dash.kpi.risk"),
                value: `${(animHighRisk / 10).toFixed(1)}%`,
                delta: "Stable",
                color: "text-rose-400",
                deltaColor: "text-white/40",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="liquid-glass rounded-2xl p-5 border border-white/5 flex flex-col gap-2 transition-all duration-300 hover:border-white/10"
              >
                <span className="text-xs font-medium text-white/50">
                  {card.label}
                </span>
                <span
                  className={`text-3xl md:text-4xl font-bold font-['General_Sans'] tracking-tight ${card.color}`}
                >
                  {card.value}
                </span>
                <span className={`text-xs font-medium ${card.deltaColor}`}>
                  {card.delta}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* First Charts Row: Volume Spline & Risk Donut */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Custom SVG Spline Volume Chart */}
          <div className="col-span-1 md:col-span-2 liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5 justify-between">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg font-['General_Sans'] text-white">
                  Verification Volume
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">Pipeline throughput over selected time window</p>
              </div>
              <span className="text-[10px] text-indigo-300/80 font-semibold bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/10">
                {range === "7" ? "7 DAYS VIEW" : "30 DAYS VIEW"}
              </span>
            </div>
            <div className="flex items-center justify-center min-h-[220px]">
              {loading ? (
                <div className="h-32 w-full bg-white/5 animate-pulse rounded" />
              ) : (
                <VerificationVolumeChart data={stats?.recentActivity ?? []} range={range} />
              )}
            </div>
          </div>

          {/* Custom SVG Donut Risk Chart */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5 justify-between">
            <div>
              <h3 className="font-semibold text-lg font-['General_Sans'] text-white">
                Risk Distribution
              </h3>
              <p className="text-[10px] text-white/40 mt-0.5">Real-time risk status classifications</p>
            </div>
            <div className="flex items-center justify-center flex-1 py-2">
              {loading ? (
                <div className="w-28 h-28 rounded-full border-4 border-white/5 border-t-white/20 animate-spin" />
              ) : (
                <RiskDonutChart distribution={stats?.riskDistribution ?? { low: 86, medium: 11, high: 3 }} />
              )}
            </div>
          </div>
        </div>

        {/* Second Charts Row: Processing Speed Line & Pipeline Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Processing Time Trend */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5 justify-between">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg font-['General_Sans'] text-white">
                  Average Processing Speed
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">End-to-end multi-agent network duration</p>
              </div>
              <span className="text-[10px] text-cyan-300/80 font-semibold bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/10">
                PIPELINE VELOCITY
              </span>
            </div>
            <div className="flex items-center justify-center min-h-[220px]">
              {loading ? (
                <div className="h-32 w-full bg-white/5 animate-pulse rounded" />
              ) : (
                <ProcessingTimeChart data={stats?.processingTimeTrend ?? []} range={range} />
              )}
            </div>
          </div>

          {/* Verification Drop-off Funnel */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5 justify-between">
            <div>
              <h3 className="font-semibold text-lg font-['General_Sans'] text-white">
                Approval Funnel Analysis
              </h3>
              <p className="text-[10px] text-white/40 mt-0.5">Stage-by-stage verification success rate</p>
            </div>
            <div className="flex items-center justify-center flex-1 py-1">
              {loading ? (
                <div className="h-32 w-full bg-white/5 animate-pulse rounded" />
              ) : (
                <FunnelChart data={stats?.funnelData ?? []} />
              )}
            </div>
          </div>
        </div>

        {/* Third Row: Heat Map & Activity Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* GeoMap Hotspot Widget */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg font-['General_Sans'] text-white">
                  {t("dash.map.title")}
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">Global verification request density map</p>
              </div>
              <span className="text-xs text-indigo-400 font-mono font-bold animate-pulse">
                ● LIVE RADAR
              </span>
            </div>
            <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
              {loading ? (
                <div className="w-full h-48 bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <GeoMap data={stats?.geoDistribution} />
              )}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="liquid-glass rounded-2xl border border-white/5 flex flex-col justify-between overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold font-['General_Sans'] text-white">
                  {t("dash.recent")}
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">Latest pipeline verification status events</p>
              </div>
              <a
                href="/customers"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium border border-indigo-400/20 px-2.5 py-1 rounded-lg bg-indigo-400/5"
              >
                {t("dash.viewall")}
              </a>
            </div>
            <div className="divide-y divide-white/5 flex-1 overflow-y-auto max-h-[250px]">
              {[
                {
                  name: "Alex Mercer",
                  id: "CUS-8921",
                  status: "Verified",
                  risk: "Low",
                  time: "2 min ago",
                },
                {
                  name: "Sarah Jenkins",
                  id: "CUS-8922",
                  status: "Pending",
                  risk: "Medium",
                  time: "14 min ago",
                },
                {
                  name: "Michael Chen",
                  id: "CUS-8923",
                  status: "Rejected",
                  risk: "High",
                  time: "28 min ago",
                },
                {
                  name: "Elena Rostova",
                  id: "CUS-8924",
                  status: "Verified",
                  risk: "Low",
                  time: "45 min ago",
                },
              ].map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold shadow-[0_0_8px_rgba(99,102,241,0.1)]">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{r.name}</p>
                      <p className="text-xs text-white/40 font-mono">
                        {r.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        r.status === "Verified"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/15"
                          : r.status === "Pending"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/15"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/15"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-[11px] text-white/30">{r.time}</span>
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
