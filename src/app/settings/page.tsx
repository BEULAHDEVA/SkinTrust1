"use client";

import { useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/useRole";

type Tab = "profile" | "notifications" | "team";

export default function SettingsPage() {
  const [role] = useRole();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Only Admins should see the full settings page realistically, 
  // but we can render a restricted view for Support if they somehow land here.
  if (role !== "admin") {
    return (
      <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
        <BackgroundVideo />
        <Navbar />
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <div className="liquid-glass rounded-2xl p-8 border border-rose-500/30 flex flex-col items-center gap-4 text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-sm text-white/50">Your current role ({role}) does not have permission to view or edit workspace settings.</p>
            <a href="/dashboard">
              <Button variant="heroSecondary" className="mt-2">Return to Dashboard</Button>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* Settings Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#06060f]/60 backdrop-blur-md hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-lg font-bold font-['General_Sans']">Settings</h2>
            <p className="text-xs text-white/40 mt-1">Manage workspace preferences</p>
          </div>
          <div className="flex-1 px-4 flex flex-col gap-2">
            {[
              { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
              { id: "notifications", label: "Notifications", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" },
              { id: "team", label: "Team & Roles", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {t.icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : `M${d}`} />)}
                </svg>
                {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="md:hidden w-full flex overflow-x-auto p-4 gap-2 border-b border-white/10 flex-shrink-0">
          {["profile", "notifications", "team"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as Tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                activeTab === t ? "bg-indigo-500 text-white" : "bg-white/5 text-white/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-2xl font-bold font-['General_Sans'] tracking-tight">Profile</h3>
                  <p className="text-white/50 text-sm mt-1">Manage your personal account details.</p>
                </div>

                <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      CT
                    </div>
                    <div>
                      <Button variant="heroSecondary" className="text-sm px-4 py-2">Change Avatar</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Full Name</label>
                      <input type="text" defaultValue="Compliance Team" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                      <input type="email" defaultValue="admin@kycmithra.com" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button variant="heroSecondary" className="bg-indigo-500/20 border-indigo-500/40 text-indigo-300">Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-2xl font-bold font-['General_Sans'] tracking-tight">Notifications</h3>
                  <p className="text-white/50 text-sm mt-1">Configure when and how you receive alerts.</p>
                </div>

                <div className="liquid-glass rounded-2xl border border-white/5 divide-y divide-white/5">
                  {[
                    { title: "High Risk Alerts", desc: "Get notified immediately when a high-risk application is flagged.", on: true },
                    { title: "Daily Digest", desc: "Receive a daily summary of verifications and auto-approval rates.", on: false },
                    { title: "Agent Mentions", desc: "Notify me when Mithra suggests manual review for an edge case.", on: true },
                    { title: "Weekly Report", desc: "Detailed CSV export sent every Monday morning.", on: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="font-medium text-white text-sm">{item.title}</span>
                        <span className="text-xs text-white/40">{item.desc}</span>
                      </div>
                      <button className={`w-11 h-6 rounded-full relative transition-colors ${item.on ? "bg-indigo-500" : "bg-white/10"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${item.on ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold font-['General_Sans'] tracking-tight">Team & Roles</h3>
                    <p className="text-white/50 text-sm mt-1">Manage workspace members and their access levels.</p>
                  </div>
                  <Button variant="heroSecondary" className="text-sm px-4 py-2">Invite Member</Button>
                </div>

                <div className="liquid-glass rounded-2xl border border-white/5 overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02] text-xs font-semibold text-white/40 uppercase tracking-wider">
                    <div className="col-span-6">Member</div>
                    <div className="col-span-3">Role</div>
                    <div className="col-span-3 text-right">Status</div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {[
                      { name: "Compliance Team", email: "admin@kycmithra.com", role: "Admin", status: "Active" },
                      { name: "Sarah Jenkins", email: "s.jenkins@kycmithra.com", role: "Support", status: "Active" },
                      { name: "Michael Chen", email: "m.chen@kycmithra.com", role: "Support", status: "Pending" },
                    ].map((member, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{member.name[0]}</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{member.name}</span>
                            <span className="text-xs text-white/40">{member.email}</span>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${member.role === "Admin" ? "bg-indigo-500/20 text-indigo-300" : "bg-white/10 text-white/60"}`}>
                            {member.role}
                          </span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className={`text-xs flex items-center justify-end gap-1.5 ${member.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
