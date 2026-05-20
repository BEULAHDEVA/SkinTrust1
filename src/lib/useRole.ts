"use client";

import { useState, useEffect } from "react";

export type Role = "admin" | "support";

export function setGlobalRole(role: Role) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kyc_role", role);
    window.dispatchEvent(new Event("role_changed"));
  }
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRole] = useState<Role>("admin");

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("kyc_role") as Role;
      if (stored) setRole(stored);
    };
    handleStorage();
    window.addEventListener("role_changed", handleStorage);
    return () => window.removeEventListener("role_changed", handleStorage);
  }, []);

  return [role, setGlobalRole];
}
