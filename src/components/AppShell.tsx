"use client";

import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "transparent" | "glass";
}

export default function AppShell({ children, variant = "glass" }: AppShellProps) {
  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />
      <div className="relative z-10 flex flex-col min-h-screen flex-1">
        <Navbar variant={variant} />
        {children}
      </div>
    </main>
  );
}
