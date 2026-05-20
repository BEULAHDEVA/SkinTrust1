"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/useLanguage";
import { useTranslation } from "@/lib/translations";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "Real-Time AI Verification",
    description: "Mithra's neural engine analyzes identity documents, selfies, and behavioral signals in under 2 seconds — 24/7, at any scale.",
    color: "indigo",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "99.97% Uptime SLA",
    description: "Mission-critical infrastructure backed by a globally distributed network. Your verification pipeline never goes down.",
    color: "purple",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Compliance-Ready",
    description: "Built-in KYC/AML compliance for GDPR, FATF, and regional frameworks. Audit trails generated automatically.",
    color: "yellow",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "AI Agent Assistance",
    description: "Ask Mithra anything. Get instant answers about risk scores, customer status, and compliance decisions in plain language.",
    color: "emerald",
  },
];

const steps = [
  { step: "01", title: "Submit Identity", description: "Customer uploads a government ID and takes a selfie — desktop or mobile, any format." },
  { step: "02", title: "AI Verification", description: "Mithra cross-references biometrics, document authenticity, liveness detection, and global watchlists." },
  { step: "03", title: "Instant Decision", description: "86% of cases are auto-approved in < 3 seconds. Edge cases are flagged for human review with full context." },
];

export default function Home() {
  const [lang] = useLanguage();
  const t = useTranslation(lang);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden" ref={containerRef}>
      <BackgroundVideo />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar variant="transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-['General_Sans'] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {t("hero.title1")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <a href="/onboard">
              <Button
                variant="heroSecondary"
                className="px-7 py-6 rounded-full text-base font-semibold bg-gradient-to-r from-indigo-600/40 to-purple-600/40 hover:from-indigo-600/60 hover:to-purple-600/60 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              >
                {t("hero.btn.verify")}
              </Button>
            </a>
            <a href="/agent">
              <Button
                variant="heroSecondary"
                className="px-7 py-6 rounded-full text-base font-semibold shadow-sm border-foreground/5"
              >
                {t("hero.btn.agent")}
              </Button>
            </a>
            <a href="/dashboard">
              <Button
                variant="heroSecondary"
                className="px-7 py-6 rounded-full text-base font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40"
              >
                {t("hero.btn.dashboard")}
              </Button>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="text-xs text-white uppercase tracking-widest">Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white to-transparent animate-bounce" />
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="relative z-10 bg-[#030014]/80 backdrop-blur-sm border-t border-white/5 px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-semibold font-['General_Sans'] tracking-tight text-white">
                Verification in three steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <a
                  href="/onboard"
                  key={s.step}
                  className="liquid-glass rounded-2xl p-8 border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                >
                  {/* Large step number watermark */}
                  <span className="absolute -top-4 -right-2 text-8xl font-black text-white/[0.03] select-none font-['General_Sans']">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm group-hover:bg-indigo-500/30 transition-colors">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-white text-lg font-['General_Sans']">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>
                  <span className="text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Try it → 
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <div className="relative z-10 px-6 py-20 bg-gradient-to-b from-[#030014]/0 to-[#030014]/90">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Features</p>
              <h2 className="text-3xl md:text-4xl font-semibold font-['General_Sans'] tracking-tight text-white">
                Built for enterprise-grade KYC
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map((feature) => {
                const colorMap: Record<string, string> = {
                  indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
                  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
                  yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
                  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
                };
                const cls = colorMap[feature.color];

                return (
                  <div
                    key={feature.title}
                    className={`rounded-2xl p-6 border bg-gradient-to-br ${cls} flex gap-5 hover:scale-[1.01] transition-transform duration-200`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-current/10 border border-current/20 flex items-center justify-center ${cls.split(" ").pop()}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-['General_Sans'] mb-1">{feature.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="relative z-10 px-6 py-16 border-t border-white/5 bg-[#030014]/90 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-semibold font-['General_Sans'] tracking-tight text-white">
              Ready to eliminate fraud?
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-lg">
              Join thousands of fintechs and banks running identity verification on Mithra. Start in minutes — no integration headaches.
            </p>
            <a href="/agent">
              <Button
                variant="heroSecondary"
                className="px-8 py-6 rounded-full text-base font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40"
              >
                Talk to Mithra →
              </Button>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-xs text-white/20">
          © 2026 KYC Mithra. All rights reserved.
        </div>
      </div>
    </main>
  );
}
