"use client";
// context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getT } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = getT(lang);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dir  = t.dir;
    document.documentElement.lang = t.lang;
    // Load Arabic web font on demand
    if (lang === "ar") {
      const link = document.createElement("link");
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600&display=swap";
      if (!document.head.querySelector(`link[href="${link.href}"]`))
        document.head.appendChild(link);
    }
  }, [lang, t]);

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
};
