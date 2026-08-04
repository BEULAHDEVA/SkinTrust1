"use client";

import { usePathname } from "next/navigation";
import { useRole } from "@/lib/useRole";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role] = useRole();

  // Role authorization logic
  let isAuthorized = true;
  let requiredClearance = "";

  if (role === "analyst") {
    // Analyst is only allowed to view customer list / customer details
    const isAllowed = pathname.startsWith("/customers");
    if (!isAllowed) {
      isAuthorized = false;
      requiredClearance = "Compliance Officer or Admin";
    }
  } else if (role === "compliance") {
    // Compliance is allowed to view dashboard, customers, and audit logs. Blocked from settings.
    const isBlocked = pathname.startsWith("/settings") || pathname.startsWith("/agent");
    if (isBlocked) {
      isAuthorized = false;
      requiredClearance = "Admin Root Access";
    }
  } else if (role === "admin") {
    // Admin is completely unrestricted
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return (
      <AppShell variant="glass">
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
          {/* Glassmorphic 403 Lock Card */}
          <div className="relative z-10 w-full max-w-md liquid-glass rounded-3xl p-8 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Concentric radar locks */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-2 rounded-full border-2 border-rose-500/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-['General_Sans'] text-white tracking-tight uppercase">Clearance Required</h2>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                <span>Required:</span>
                <span className="capitalize">{requiredClearance}</span>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              Your active authorization tier (<span className="text-rose-400 font-semibold uppercase">{role}</span>) does not possess permission to open <span className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{pathname}</span>.
            </p>

            {/* Demo Switcher Help Box */}
            <div className="w-full bg-[#030014]/50 border border-white/5 rounded-2xl p-4 text-xs text-white/50 text-left flex gap-3">
              <span className="text-indigo-400 text-lg">💡</span>
              <p className="leading-normal">
                <strong className="text-indigo-300 block mb-0.5">Demo Simulation Info:</strong>
                You can instantly elevate your clearance levels by using the <strong className="text-white">Role Switcher Dropdown</strong> in the header above.
              </p>
            </div>

            <div className="flex gap-3 w-full mt-2">
              <a href="/" className="flex-1">
                <Button variant="heroSecondary" className="w-full py-3.5 text-xs">
                  Home
                </Button>
              </a>
              <a href="/customers" className="flex-1">
                <Button variant="heroSecondary" className="w-full py-3.5 bg-indigo-500/10 border-indigo-500/20 text-indigo-300 text-xs">
                  View Queue
                </Button>
              </a>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell variant="glass">{children}</AppShell>;
}
