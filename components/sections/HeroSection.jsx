"use client";
// components/sections/HeroSection.jsx
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang }         from "@/context/LanguageContext";
import { useSiteSettings } from "@/hooks/useSupabase";

export default function HeroSection() {
  const { t, isRTL, lang }     = useLang();
  const { settings, loading }  = useSiteSettings();
  const ref                    = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fadeOut= useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const name      = lang === "ar" ? (settings?.hero_name_ar      || "نور الرشيدي")     : (settings?.hero_name_en      || "Nour Al-Rashidi");
  const headline  = lang === "ar" ? (settings?.hero_headline_ar  || "التصميم الداخلي الخالد") : (settings?.hero_headline_en  || "Timeless Interior Design");
  const subline   = lang === "ar" ? (settings?.hero_description_ar || t.about.defaultBio1) : (settings?.hero_description_en || "Where luxury meets living. Transforming spaces into curated experiences.");

  const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: yImg }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Interior Design"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/88 via-charcoal/55 to-charcoal/10" />
      </motion.div>

      {/* Vertical gold accent */}
      <div className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent z-10
                       ${isRTL ? "right-16" : "left-16"}`} />

      {/* Content */}
      <motion.div style={{ opacity: fadeOut }}
        className={`relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-20 pt-28 pb-24
                    ${isRTL ? "text-right" : ""}`}>
        <div className="max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-body text-[0.62rem] tracking-[0.4em] uppercase text-gold mb-5">
            {t.hero.greeting}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-display text-xl text-ivory mb-1 font-light">
            {name}
          </motion.h2>

          {/* Headline clip reveal */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }} animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.8rem,7vw,5.5rem)] text-ivory leading-none">
              {headline}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-body text-[0.95rem] text-ivory/55 leading-relaxed max-w-md mb-10">
            {subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={`flex flex-wrap gap-4 ${isRTL ? "justify-end" : ""}`}>
            <button onClick={() => go("#portfolio")} className="btn-primary">{t.hero.cta}</button>
            <button onClick={() => go("#contact")}   className="btn-ghost">{t.hero.cta2}</button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-body text-[0.55rem] tracking-[0.35em] uppercase text-ivory/35">Scroll</span>
          <motion.div animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-9 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
