"use client";

import { useEffect } from "react";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: "review",
    title: "Manual Review Required",
    message: "Sarah Jenkins (CUS-8922) has been flagged for medium risk and needs manual ID review.",
    time: "2 min ago",
    icon: "⚠️",
    color: "amber",
  },
  {
    id: 2,
    type: "high-risk",
    title: "High Risk Alert",
    message: "Michael Chen (CUS-8923) was automatically rejected due to a high fraud score (91/100).",
    time: "14 min ago",
    icon: "🚨",
    color: "rose",
  },
  {
    id: 3,
    type: "review",
    title: "Pending Review — Expires Soon",
    message: "CUS-9011 (Priya Nair) review window closes in 1 hour. Action required.",
    time: "45 min ago",
    icon: "⏰",
    color: "amber",
  },
];

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        id="notification-panel"
        role="dialog"
        aria-label="Notifications"
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-[#0a0a1a]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <h2 className="font-semibold text-lg font-['General_Sans']">Notifications</h2>
              <p className="text-xs text-white/50 mt-0.5">{notifications.length} unread alerts</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              aria-label="Close notifications"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-xl p-4 border transition-colors cursor-pointer hover:bg-white/5 ${
                  notif.color === "amber"
                    ? "bg-amber-500/5 border-amber-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{notif.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-sm font-semibold ${
                        notif.color === "amber" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-white/30 mt-2">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <a
              href="/customers"
              className="block w-full text-center py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 text-sm font-medium transition-colors"
            >
              View All Pending Reviews →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
