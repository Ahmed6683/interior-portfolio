"use client";
// components/Navbar.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function Navbar() {
  const { t, lang, toggleLang, isRTL } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { href: "#hero",      label: t.nav.home      },
    { href: "#about",     label: t.nav.about     },
    { href: "#portfolio", label: t.nav.portfolio  },
    { href: "#contact",   label: t.nav.contact   },
  ];

  const go = (href) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${scrolled ? "bg-ivory/95 backdrop-blur-md shadow-sm shadow-sand/30 py-3" : "bg-transparent py-6"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand */}
        <button onClick={() => go("#hero")} className="flex flex-col leading-none">
          <span className="font-display text-[1.6rem] text-charcoal tracking-tight">
            {isRTL ? "نور" : "Nour"}
          </span>
          <span className="font-body text-[0.6rem] text-gold tracking-[0.25em] uppercase">
            {isRTL ? "مصممة داخلية" : "Interior Design"}
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <button key={href} onClick={() => go(href)}
              className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-charcoal/60
                         hover:text-gold transition-colors duration-300">
              {label}
            </button>
          ))}
        </nav>

        {/* Language toggle + hamburger */}
        <div className="flex items-center gap-4">
          <button onClick={toggleLang}
            className="flex items-center gap-1.5 border border-sand px-3 py-1.5
                       font-body text-[0.6rem] tracking-[0.2em] uppercase hover:border-gold transition-colors">
            <span className={lang === "en" ? "text-gold" : "text-charcoal/40"}>EN</span>
            <span className="text-sand/60">|</span>
            <span className={lang === "ar" ? "text-gold" : "text-charcoal/40"}>AR</span>
          </button>

          <button onClick={() => setOpen(v => !v)} className="md:hidden p-1 flex flex-col gap-1.5">
            <motion.span animate={open ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-charcoal origin-center" />
            <motion.span animate={open ? { opacity: 0 }       : { opacity: 1 }}
              className="block w-5 h-px bg-charcoal" />
            <motion.span animate={open ? { rotate: -45, y: -7 }: { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-charcoal origin-center" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div key="mob"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full inset-x-0 bg-ivory/98 backdrop-blur-md
                       border-t border-sand/30 py-8 px-6 flex flex-col gap-5">
            {navLinks.map(({ href, label }) => (
              <button key={href} onClick={() => go(href)}
                className={`font-body text-xs tracking-[0.2em] uppercase text-charcoal/70
                            hover:text-gold transition-colors ${isRTL ? "text-right" : "text-left"}`}>
                {label}
              </button>
            ))}
            <Link href="/admin"
              className="font-body text-xs tracking-[0.2em] uppercase text-muted hover:text-gold
                         transition-colors border-t border-sand/30 pt-4">
              {t.nav.admin}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
