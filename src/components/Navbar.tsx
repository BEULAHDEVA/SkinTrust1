"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import NotificationPanel from "./NotificationPanel";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
  { href: "/agent", label: "AI Agent" },
];

interface NavbarProps {
  variant?: "transparent" | "glass";
}

export default function Navbar({ variant = "glass" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isTransparent = variant === "transparent";

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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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
                  {link.label}
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

            {/* Sign In (desktop) */}
            <div className="hidden md:block">
              <a href="/signin">
                <Button
                  variant="heroSecondary"
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Sign In
                </Button>
              </a>
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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
                  {link.label}
                </a>
              );
            })}
            <a href="/signin" className="mt-2">
              <Button
                variant="heroSecondary"
                className="w-full rounded-xl py-3 text-sm font-semibold"
              >
                Sign In
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Notification Panel Overlay */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
