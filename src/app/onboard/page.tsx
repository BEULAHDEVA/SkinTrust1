"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";

type Step = 1 | 2 | 3;
type Decision = "approved" | "pending" | "rejected" | null;

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileDropZone({
  id,
  label,
  hint,
  icon,
  file,
  onFile,
}: {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  file: UploadedFile | null;
  onFile: (f: UploadedFile) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (raw: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFile({ name: raw.name, size: raw.size, preview: e.target?.result as string });
    };
    reader.readAsDataURL(raw);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div
        id={id}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
          file
            ? "border-emerald-500/40 bg-emerald-500/5"
            : dragging
            ? "border-indigo-400/70 bg-indigo-500/10 scale-[1.01]"
            : "border-white/15 bg-white/3 hover:border-indigo-500/40 hover:bg-indigo-500/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />

        {file ? (
          <div className="flex items-center gap-4 p-4">
            {file.preview.startsWith("data:image") ? (
              <img src={file.preview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-white/40 mt-0.5">{formatBytes(file.size)}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs text-emerald-400 font-medium">Uploaded successfully</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFile({ name: "", size: 0, preview: "" }); }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 px-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              {icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/70">
                <span className="text-indigo-400">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-white/30 mt-1">{hint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step progress indicator
function StepBar({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Submit Identity" },
    { n: 2, label: "AI Verification" },
    { n: 3, label: "Decision" },
  ];
  return (
    <div className="flex items-center gap-0 w-full max-w-md mx-auto">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              current > s.n
                ? "bg-emerald-500 border-emerald-500 text-white"
                : current === s.n
                ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]"
                : "bg-white/5 border-white/10 text-white/30"
            }`}>
              {current > s.n ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : s.n}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
              current === s.n ? "text-indigo-400" : current > s.n ? "text-emerald-400" : "text-white/30"
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${current > s.n ? "bg-emerald-500" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Animated verification scan line
function VerificationScreen({ 
  data, 
  onComplete 
}: { 
  data: { fullName: string; docType: string; idFile: UploadedFile | null; selfieFile: UploadedFile | null };
  onComplete: (d: Decision, reason?: string) => void 
}) {
  const checks = [
    { label: "Document authenticity", icon: "🪪", delay: 600 },
    { label: "Biometric matching", icon: "🤳", delay: 1400 },
    { label: "Liveness detection", icon: "👁", delay: 2200 },
    { label: "Global watchlist check", icon: "🔍", delay: 3000 },
    { label: "Address verification", icon: "📍", delay: 3600 },
  ];

  const [done, setDone] = useState<number[]>([]);
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    checks.forEach((c, i) => {
      setTimeout(() => setDone((prev) => [...prev, i]), c.delay);
    });

    setTimeout(() => {
      const name = data.fullName.toLowerCase();
      let decision: Decision = "approved";
      let reason = "All checks passed";

      if (name.includes("fake") || name.includes("fraud") || name.includes("fail") || /\d/.test(name)) {
        decision = "rejected";
        reason = "Suspected fraudulent application or invalid name format";
      } else if (name.includes("review") || name.includes("pending") || name.length < 4) {
        decision = "pending";
        reason = "Manual review required due to low confidence score";
      } else if (data.idFile?.name.toLowerCase().includes("fake") || data.selfieFile?.name.toLowerCase().includes("fake")) {
        decision = "rejected";
        reason = "Document authenticity check failed";
      }

      onComplete(decision, reason);
    }, 4800);
  }, [checks, data, onComplete]);

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Scanning animation */}
      <div className="relative w-36 h-36">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 rounded-full border-2 border-indigo-500/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
        {/* Core */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse">
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
        </div>
        {/* Rotating arc */}
        <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 144 144">
          <circle cx="72" cy="72" r="68" fill="none" stroke="url(#arcGrad)" strokeWidth="2" strokeDasharray="80 350" strokeLinecap="round" />
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold font-['General_Sans']">Mithra is verifying…</p>
        <p className="text-white/40 text-sm mt-1">Please wait while we process your identity</p>
      </div>

      {/* Check list */}
      <div className="w-full flex flex-col gap-2.5">
        {checks.map((c, i) => {
          const isDone = done.includes(i);
          const isActive = !isDone && done.length === i;
          return (
            <div
              key={c.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                isDone
                  ? "bg-emerald-500/8 border-emerald-500/20 opacity-100"
                  : isActive
                  ? "bg-indigo-500/10 border-indigo-500/20 opacity-100"
                  : "bg-white/3 border-white/5 opacity-40"
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span className={`text-sm flex-1 font-medium ${isDone ? "text-emerald-300" : isActive ? "text-indigo-300" : "text-white/40"}`}>
                {c.label}
              </span>
              {isDone ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isActive ? (
                <div className="w-4 h-4 border-2 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-white/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Decision result screen
function DecisionScreen({ decision, name, reason }: { decision: Decision; name: string; reason?: string }) {
  const config = {
    approved: {
      icon: "✓",
      color: "from-emerald-500 to-teal-400",
      glow: "rgba(16,185,129,0.4)",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      title: "Identity Verified",
      subtitle: "Your identity has been successfully verified by Mithra.",
      badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      badgeText: "Auto-Approved",
      details: [
        { label: "Risk Score", value: "12 / 100", color: "text-emerald-400" },
        { label: "Decision", value: "Auto-Approved", color: "text-emerald-400" },
        { label: "Processing Time", value: "2.4 seconds", color: "text-white/60" },
        { label: "Verified By", value: "Mithra AI Engine", color: "text-white/60" },
      ],
    },
    pending: {
      icon: "⏳",
      color: "from-amber-500 to-orange-400",
      glow: "rgba(245,158,11,0.4)",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      title: "Under Manual Review",
      subtitle: "Your application needs a quick review by our compliance team.",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      badgeText: "Pending Review",
      details: [
        { label: "Risk Score", value: "58 / 100", color: "text-amber-400" },
        { label: "Decision", value: "Manual Review Required", color: "text-amber-400" },
        { label: "Est. Time", value: "2–4 hours", color: "text-white/60" },
        { label: "Assigned To", value: "Compliance Team", color: "text-white/60" },
      ],
    },
    rejected: {
      icon: "✕",
      color: "from-rose-500 to-red-400",
      glow: "rgba(244,63,94,0.4)",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
      title: "Verification Failed",
      subtitle: "We were unable to verify your identity at this time.",
      badge: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      badgeText: "Rejected",
      details: [
        { label: "Risk Score", value: "91 / 100", color: "text-rose-400" },
        { label: "Decision", value: "Auto-Rejected", color: "text-rose-400" },
        { label: "Reason", value: reason || "Document mismatch", color: "text-white/60" },
        { label: "Next Step", value: "Contact support", color: "text-white/60" },
      ],
    },
  };

  const c = config[decision ?? "approved"];

  return (
    <div className="flex flex-col items-center gap-7 py-4">
      {/* Result icon */}
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-tr ${c.color} flex items-center justify-center text-3xl text-white font-bold`}
          style={{ boxShadow: `0 0 50px ${c.glow}` }}
        >
          {c.icon}
        </div>
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: `radial-gradient(circle, ${c.glow}, transparent)`, animationDuration: "2s" }} />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold font-['General_Sans'] tracking-tight">{c.title}</h2>
        <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-xs mx-auto">{c.subtitle}</p>
        <span className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${c.badge}`}>
          {c.badgeText}
        </span>
      </div>

      {/* Details grid */}
      <div className={`w-full rounded-2xl border ${c.border} ${c.bg} overflow-hidden`}>
        {c.details.map((d, i) => (
          <div key={d.label} className={`flex items-center justify-between px-5 py-3.5 ${i < c.details.length - 1 ? "border-b border-white/5" : ""}`}>
            <span className="text-sm text-white/40">{d.label}</span>
            <span className={`text-sm font-semibold ${d.color}`}>{d.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {decision === "approved" && (
          <a
            href="/dashboard"
            className="flex-1 text-center py-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition-colors"
          >
            Go to Dashboard →
          </a>
        )}
        {decision === "pending" && (
          <a
            href="/customers"
            className="flex-1 text-center py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-sm transition-colors"
          >
            Check Status →
          </a>
        )}
        {decision === "rejected" && (
          <a
            href="/agent"
            className="flex-1 text-center py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-semibold text-sm transition-colors"
          >
            Talk to Mithra →
          </a>
        )}
        <a
          href="/"
          className="flex-1 text-center py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold text-sm transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  const [step, setStep] = useState<Step>(1);
  const [decision, setDecision] = useState<Decision>(null);
  const [decisionReason, setDecisionReason] = useState<string>("");

  // Step 1 form state
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [docType, setDocType] = useState("passport");
  const [idFile, setIdFile] = useState<UploadedFile | null>(null);
  const [selfieFile, setSelfieFile] = useState<UploadedFile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!dob) e.dob = "Date of birth is required";
    if (!country) e.country = "Country is required";
    if (!idFile || !idFile.name) e.idFile = "Please upload your ID document";
    if (!selfieFile || !selfieFile.name) e.selfieFile = "Please upload a selfie";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
  };

  const handleVerificationComplete = (d: Decision, reason?: string) => {
    setDecision(d);
    if (reason) setDecisionReason(reason);
    setStep(3);
  };

  const countries = [
    "United States", "United Kingdom", "India", "Singapore", "Germany",
    "Australia", "Canada", "France", "Japan", "UAE", "Brazil", "South Africa",
  ];

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <BackgroundVideo />

      {/* Back nav */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </a>
        <div className="flex items-center gap-2 text-sm font-semibold text-white/70 font-['General_Sans']">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          KYC Mithra
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 pb-12 pt-2">
        <div className="w-full max-w-lg flex flex-col gap-8">

          {/* Step progress */}
          <StepBar current={step} />

          {/* Card */}
          <div className="liquid-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

            {/* ── Step 1: Submit Identity ── */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-bold font-['General_Sans'] tracking-tight">Submit Identity</h1>
                  <p className="text-white/40 text-sm mt-1.5">
                    Upload a government-issued ID and a selfie. Any format, desktop or mobile.
                  </p>
                </div>

                {/* Personal info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })); }}
                      placeholder="As it appears on your ID"
                      className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: "" })); }}
                      className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 transition-all [color-scheme:dark] ${
                        errors.dob ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                      }`}
                    />
                    {errors.dob && <p className="text-xs text-rose-400">{errors.dob}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Country</label>
                    <select
                      value={country}
                      onChange={(e) => { setCountry(e.target.value); setErrors((p) => ({ ...p, country: "" })); }}
                      className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 transition-all [color-scheme:dark] ${
                        errors.country ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                      }`}
                    >
                      <option value="" disabled>Select country</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p className="text-xs text-rose-400">{errors.country}</p>}
                  </div>
                </div>

                {/* Document type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Document Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: "passport", label: "Passport", icon: "🛂" },
                      { value: "national_id", label: "National ID", icon: "🪪" },
                      { value: "drivers_license", label: "Driver's License", icon: "🚗" },
                    ].map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDocType(d.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          docType === d.value
                            ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                            : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{d.icon}</span> {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File uploads */}
                <FileDropZone
                  id="id-upload"
                  label="Government ID (front)"
                  hint="JPG, PNG, PDF — max 10 MB"
                  file={idFile}
                  onFile={(f) => { setIdFile(f.name ? f : null); setErrors((p) => ({ ...p, idFile: "" })); }}
                  icon={
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  }
                />
                {errors.idFile && <p className="text-xs text-rose-400 -mt-4">{errors.idFile}</p>}

                <FileDropZone
                  id="selfie-upload"
                  label="Selfie / Live photo"
                  hint="Clear face photo — JPG or PNG"
                  file={selfieFile}
                  onFile={(f) => { setSelfieFile(f.name ? f : null); setErrors((p) => ({ ...p, selfieFile: "" })); }}
                  icon={
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                    </svg>
                  }
                />
                {errors.selfieFile && <p className="text-xs text-rose-400 -mt-4">{errors.selfieFile}</p>}

                {/* Privacy note */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/8">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="text-xs text-white/30 leading-relaxed">
                    Your documents are encrypted end-to-end and processed solely for identity verification. We do not store raw images after verification is complete.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base font-['General_Sans'] shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all"
                >
                  Submit for Verification →
                </button>
              </form>
            )}

            {/* ── Step 2: AI Verification ── */}
            {step === 2 && (
              <div className="p-7">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold font-['General_Sans'] tracking-tight">AI Verification</h1>
                  <p className="text-white/40 text-sm mt-1.5">
                    Mithra is cross-referencing your identity against global databases
                  </p>
                </div>
                <VerificationScreen 
                  data={{ fullName, docType, idFile, selfieFile }} 
                  onComplete={handleVerificationComplete} 
                />
              </div>
            )}

            {/* ── Step 3: Decision ── */}
            {step === 3 && decision && (
              <div className="p-7">
                <DecisionScreen decision={decision} name={fullName} reason={decisionReason} />
              </div>
            )}
          </div>

          {/* Demo controls (step 3 only) */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-white/20">Demo: try different outcomes</p>
              <div className="flex gap-2">
                {(["approved", "pending", "rejected"] as Decision[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDecision(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                      decision === d
                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
