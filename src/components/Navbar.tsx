"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import NotificationPanel from "./NotificationPanel";
import { useRole } from "@/lib/useRole";
import { useLanguage, LanguageCode } from "@/lib/useLanguage";
import { useTranslation } from "@/lib/translations";

const navLinks = [
  { href: "/", tKey: "nav.home" },
  { href: "/dashboard", tKey: "nav.dashboard" },
  { href: "/customers", tKey: "nav.customers" },
  { href: "/agent", tKey: "nav.agent" },
];

interface NavbarProps {
  variant?: "transparent" | "glass";
}

export default function Navbar({ variant = "glass" }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [role, setRole] = useRole();
  const [lang, setLang] = useLanguage();
  const t = useTranslation(lang);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic navlinks based on role
  const links = [{ href: "/", tKey: "nav.home" }];
  if (role === "analyst") {
    links.push({ href: "/customers", tKey: "nav.customers" });
  } else if (role === "compliance") {
    links.push(
      { href: "/dashboard", tKey: "nav.dashboard" },
      { href: "/customers", tKey: "nav.customers" },
      { href: "/audit", tKey: "nav.audit" }
    );
  } else if (role === "admin") {
    links.push(
      { href: "/dashboard", tKey: "nav.dashboard" },
      { href: "/customers", tKey: "nav.customers" },
      { href: "/agent", tKey: "nav.agent" },
      { href: "/audit", tKey: "nav.audit" },
      { href: "/settings", tKey: "nav.settings" }
    );
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close user and role menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isTransparent = variant === "transparent";

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      <div
        className={`relative z-20 w-full flex flex-col transition-all duration-300 ${
          isTransparent && !scrolled
            ? ""
            : "border-b border-white/10 bg-[#030014]/60 backdrop-blur-md"
        }`}
      >
        <nav className="w-full py-4 px-6 md:px-8 flex flex-row items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex-shrink-0 flex items-center gap-2 font-['General_Sans'] font-semibold text-xl tracking-tight text-white"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              <span className="text-white text-xs font-bold">M</span>
            </span>
            KYC Mithra
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white border-b border-indigo-400 pb-0.5"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {t(link.tKey as string)}
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              id="notification-bell"
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {/* Badge */}
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                3
              </span>
            </button>

            {/* Role Switcher Dropdown (Demo Only) */}
            <div className="relative hidden md:block" ref={roleMenuRef}>
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all shadow-inner"
              >
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  role === "admin" ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" :
                  role === "compliance" ? "bg-indigo-400 shadow-[0_0_8px_#818cf8]" :
                  "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                }`} />
                <span className="capitalize">{role}</span>
                <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 text-white/40 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              
              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {(["admin", "compliance", "analyst"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors flex items-center gap-2.5 ${
                        role === r 
                          ? "bg-white/10 text-white" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r === "admin" ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" :
                        r === "compliance" ? "bg-indigo-400 shadow-[0_0_6px_#818cf8]" :
                        "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                      }`} />
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Toggler */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="hidden md:block bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors [color-scheme:dark]"
            >
              <option value="en-US">English</option>
              <option value="hi-IN">हिंदी (HI)</option>
              <option value="kn-IN">ಕನ್ನಡ (KN)</option>
              <option value="ta-IN">தமிழ் (TA)</option>
            </select>

            {/* Auth: Sign In / User Menu (desktop) */}
            <div className="hidden md:block">
              {session?.user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 rounded-full px-1.5 py-1.5 hover:bg-white/5 transition-colors"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                        <span className="text-white text-xs font-bold">{userInitial}</span>
                      </div>
                    )}
                    <span className="text-sm text-white/80 font-medium max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                    <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 text-white/40 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{session.user.name || "User"}</p>
                        <p className="text-xs text-white/40 truncate">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/signin">
                  <Button
                    variant="heroSecondary"
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    {t("nav.signin")}
                  </Button>
                </a>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col gap-1.5 w-4">
                <span
                  className={`block h-0.5 bg-white/80 transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white/80 transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white/80 transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 flex flex-col gap-1 border-t border-white/10">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-indigo-500/20 border border-indigo-500/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(link.tKey as string)}
                </a>
              );
            })}
            
            {/* Mobile Role Selector */}
            <div className="flex items-center justify-between px-3 py-3 mt-2 border-t border-white/10">
              <span className="text-sm text-white/70">Role (Demo)</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 [color-scheme:dark]"
              >
                <option value="admin">Admin</option>
                <option value="compliance">Compliance</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>

            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between px-3 py-3 mt-2 border-t border-white/10">
              <span className="text-sm text-white/70">Language</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as LanguageCode)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 [color-scheme:dark]"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">हिंदी</option>
                <option value="kn-IN">ಕನ್ನಡ</option>
                <option value="ta-IN">தமிழ்</option>
              </select>
            </div>

            {/* Mobile Auth */}
            {session?.user ? (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/20">
                    <span className="text-white text-xs font-bold">{userInitial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-white/40 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full py-3 px-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <a href="/signin" className="mt-2">
                <Button
                  variant="heroSecondary"
                  className="w-full rounded-xl py-3 text-sm font-semibold"
                >
                  {t("nav.signin")}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel Overlay */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
