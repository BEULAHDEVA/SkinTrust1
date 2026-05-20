"use client";

import { useState, useEffect } from "react";

export type LanguageCode = "en-US" | "hi-IN" | "kn-IN" | "ta-IN";

export function setGlobalLanguage(lang: LanguageCode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kyc_lang", lang);
    window.dispatchEvent(new Event("lang_changed"));
  }
}

export function useLanguage(): [LanguageCode, (l: LanguageCode) => void] {
  const [lang, setLang] = useState<LanguageCode>("en-US");

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("kyc_lang") as LanguageCode;
      if (stored) setLang(stored);
    };
    handleStorage();
    window.addEventListener("lang_changed", handleStorage);
    return () => window.removeEventListener("lang_changed", handleStorage);
  }, []);

  return [lang, setGlobalLanguage];
}
