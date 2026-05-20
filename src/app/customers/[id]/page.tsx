"use client";

import { useParams, useRouter } from "next/navigation";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

type Status = "Verified" | "Pending" | "Rejected";
type Risk = "Low" | "Medium" | "High";

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  dob: string;
  status: Status;
  risk: Risk;
  riskScore: number;
  date: string;
  documents: { label: string; status: "Verified" | "Pending" | "Failed"; icon: string }[];
  riskBreakdown: { label: string; score: number; color: string }[];
  timeline: { event: string; time: string; detail: string; done: boolean }[];
}

const customers: Record<string, CustomerDetail> = {
  "CUS-8921": {
    id: "CUS-8921", name: "Alex Mercer", email: "alex.m@example.com", phone: "+1 (555) 234-7890",
    country: "United States", dob: "1991-03-14", status: "Verified", risk: "Low", riskScore: 12,
    date: "2026-05-08",
    documents: [
      { label: "Passport", status: "Verified", icon: "🪪" },
      { label: "Selfie / Liveness", status: "Verified", icon: "🤳" },
      { label: "Proof of Address", status: "Verified", icon: "📄" },
    ],
    riskBreakdown: [
      { label: "Identity Confidence", score: 97, color: "#10b981" },
      { label: "Address Match", score: 94, color: "#10b981" },
      { label: "Device Trust", score: 88, color: "#10b981" },
      { label: "Watchlist Clear", score: 100, color: "#10b981" },
    ],
    timeline: [
      { event: "Submitted", time: "2026-05-08 09:14", detail: "Customer uploaded documents", done: true },
      { event: "Under Review", time: "2026-05-08 09:14", detail: "AI processing initiated", done: true },
      { event: "Auto-Approved", time: "2026-05-08 09:14", detail: "Risk score 12/100 — Low risk", done: true },
    ],
  },
  "CUS-8922": {
    id: "CUS-8922", name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+44 7700 900345",
    country: "United Kingdom", dob: "1988-07-22", status: "Pending", risk: "Medium", riskScore: 58,
    date: "2026-05-08",
    documents: [
      { label: "Driver's License", status: "Verified", icon: "🪪" },
      { label: "Selfie / Liveness", status: "Pending", icon: "🤳" },
      { label: "Proof of Address", status: "Pending", icon: "📄" },
    ],
    riskBreakdown: [
      { label: "Identity Confidence", score: 74, color: "#f59e0b" },
      { label: "Address Match", score: 61, color: "#f59e0b" },
      { label: "Device Trust", score: 82, color: "#10b981" },
      { label: "Watchlist Clear", score: 100, color: "#10b981" },
    ],
    timeline: [
      { event: "Submitted", time: "2026-05-08 11:30", detail: "Customer uploaded documents", done: true },
      { event: "Under Review", time: "2026-05-08 11:30", detail: "AI processing initiated", done: true },
      { event: "Flagged for Manual Review", time: "2026-05-08 11:31", detail: "Medium risk — liveness check inconclusive", done: true },
      { event: "Awaiting Reviewer", time: "Pending", detail: "Assigned to compliance team", done: false },
    ],
  },
  "CUS-8923": {
    id: "CUS-8923", name: "Michael Chen", email: "m.chen@example.com", phone: "+65 9123 4567",
    country: "Singapore", dob: "1979-11-05", status: "Rejected", risk: "High", riskScore: 91,
    date: "2026-05-07",
    documents: [
      { label: "National ID", status: "Failed", icon: "🪪" },
      { label: "Selfie / Liveness", status: "Failed", icon: "🤳" },
      { label: "Proof of Address", status: "Verified", icon: "📄" },
    ],
    riskBreakdown: [
      { label: "Identity Confidence", score: 22, color: "#f43f5e" },
      { label: "Address Match", score: 38, color: "#f43f5e" },
      { label: "Device Trust", score: 45, color: "#f59e0b" },
      { label: "Watchlist Clear", score: 15, color: "#f43f5e" },
    ],
    timeline: [
      { event: "Submitted", time: "2026-05-07 14:02", detail: "Customer uploaded documents", done: true },
      { event: "Under Review", time: "2026-05-07 14:02", detail: "AI processing initiated", done: true },
      { event: "Flagged — High Risk", time: "2026-05-07 14:03", detail: "Watchlist match detected", done: true },
      { event: "Auto-Rejected", time: "2026-05-07 14:04", detail: "Risk score 91/100 — automatic rejection", done: true },
    ],
  },
};

// Fallback for IDs not in the mock
const fallbackCustomer = (id: string): CustomerDetail => ({
  id, name: "Unknown Customer", email: "unknown@example.com", phone: "—",
  country: "Unknown", dob: "—", status: "Pending", risk: "Medium", riskScore: 50,
  date: "2026-05-01",
  documents: [
    { label: "ID Document", status: "Pending", icon: "🪪" },
    { label: "Selfie", status: "Pending", icon: "🤳" },
    { label: "Proof of Address", status: "Pending", icon: "📄" },
  ],
  riskBreakdown: [
    { label: "Identity Confidence", score: 50, color: "#f59e0b" },
    { label: "Address Match", score: 50, color: "#f59e0b" },
    { label: "Device Trust", score: 70, color: "#10b981" },
    { label: "Watchlist Clear", score: 100, color: "#10b981" },
  ],
  timeline: [
    { event: "Submitted", time: "2026-05-01", detail: "Customer uploaded documents", done: true },
    { event: "Under Review", time: "Pending", detail: "Awaiting AI processing", done: false },
  ],
});

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const customer = customers[id] || fallbackCustomer(id);

  const statusColors: Record<Status, string> = {
    Verified: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/20 text-amber-400 border-amber-500/20",
    Rejected: "bg-rose-500/20 text-rose-400 border-rose-500/20",
  };

  const riskGradient: Record<Risk, string> = {
    Low: "from-emerald-500 to-teal-400",
    Medium: "from-amber-500 to-orange-400",
    High: "from-rose-500 to-red-400",
  };

  const docStatusColor: Record<string, string> = {
    Verified: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    Failed: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  // Risk ring radius
  const ringR = 38;
  const ringC = 2 * Math.PI * ringR;
  const riskDash = (customer.riskScore / 100) * ringC;

  const riskColor = customer.risk === "Low" ? "#10b981" : customer.risk === "Medium" ? "#f59e0b" : "#f43f5e";

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-8 max-w-5xl mx-auto w-full gap-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40">
          <button onClick={() => router.push("/customers")} className="hover:text-white transition-colors">
            ← Customers
          </button>
          <span>/</span>
          <span className="text-white/70 font-mono">{customer.id}</span>
        </div>

        {/* Customer Header Card */}
        <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-300 font-['General_Sans']">
              {customer.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold font-['General_Sans'] tracking-tight">{customer.name}</h1>
              <p className="text-white/50 text-sm">{customer.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[customer.status]}`}>
                  {customer.status}
                </span>
                <span className="font-mono text-xs text-white/30">{customer.id}</span>
              </div>
            </div>
          </div>

          {/* Risk Score Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                <circle cx="44" cy="44" r={ringR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="44" cy="44" r={ringR}
                  fill="none" stroke={riskColor} strokeWidth="8"
                  strokeDasharray={`${riskDash} ${ringC}`}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${riskColor}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-['General_Sans']" style={{ color: riskColor }}>{customer.riskScore}</span>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">Risk</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Risk Level</p>
              <p className={`text-lg font-semibold font-['General_Sans'] bg-gradient-to-r ${riskGradient[customer.risk]} bg-clip-text text-transparent`}>
                {customer.risk}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {customer.status === "Pending" && (
              <>
                <Button variant="heroSecondary" className="rounded-xl py-2.5 bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 w-full">
                  ✓ Approve
                </Button>
                <Button variant="heroSecondary" className="rounded-xl py-2.5 bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500/30 w-full">
                  ✕ Reject
                </Button>
              </>
            )}
            {customer.status === "Rejected" && (
              <Button variant="heroSecondary" className="rounded-xl py-2.5 bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30 w-full">
                ↑ Escalate
              </Button>
            )}
            <Button
              variant="heroSecondary"
              className="rounded-xl py-2.5 bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30 w-full"
              onClick={() => router.push("/agent")}
            >
              Ask Mithra
            </Button>
          </div>
        </div>

        {/* Two-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer Info */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h2 className="font-semibold font-['General_Sans']">Customer Information</h2>
            <div className="grid grid-cols-2 gap-y-4">
              {[
                { label: "Full Name", value: customer.name },
                { label: "Date of Birth", value: customer.dob },
                { label: "Email", value: customer.email },
                { label: "Phone", value: customer.phone },
                { label: "Country", value: customer.country },
                { label: "Added", value: customer.date },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">{row.label}</p>
                  <p className="text-sm text-white/80 font-medium">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Status */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h2 className="font-semibold font-['General_Sans']">Document Verification</h2>
            <div className="flex flex-col gap-3">
              {customer.documents.map((doc) => (
                <div key={doc.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <span className="text-sm font-medium text-white/80">{doc.label}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${docStatusColor[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Score Breakdown */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h2 className="font-semibold font-['General_Sans']">Risk Score Breakdown</h2>
            <div className="flex flex-col gap-4">
              {customer.riskBreakdown.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h2 className="font-semibold font-['General_Sans']">Audit Trail</h2>
            <div className="flex flex-col gap-0">
              {customer.timeline.map((event, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Vertical line */}
                  {i < customer.timeline.length - 1 && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-px bg-white/10" />
                  )}
                  {/* Dot */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mt-1 z-10 ${
                    event.done
                      ? "bg-indigo-500/20 border-indigo-500/50"
                      : "bg-white/5 border-white/10"
                  }`}>
                    {event.done && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-medium text-white/90">{event.event}</p>
                    <p className="text-xs text-white/40 mt-0.5">{event.time}</p>
                    <p className="text-xs text-white/50 mt-1">{event.detail}</p>
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
