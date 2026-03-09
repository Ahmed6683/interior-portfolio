"use client";
// components/sections/AboutSection.jsx
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useLang }         from "@/context/LanguageContext";
import { useSiteSettings } from "@/hooks/useSupabase";

const STATS = (t) => [
  { value: "120+", label: t.about.stats.projects },
  { value: "12",   label: t.about.stats.years    },
  { value: "18",   label: t.about.stats.awards   },
  { value: "200+", label: t.about.stats.clients  },
];

export default function AboutSection() {
  const { t, lang, isRTL } = useLang();
  const { settings }        = useSiteSettings();
  const ref                 = useRef(null);
  const inView              = useInView(ref, { once: true, margin: "-80px" });

  const bio1 = lang === "ar"
    ? (settings?.about_bio1_ar || t.about.defaultBio1)
    : (settings?.about_bio1_en || t.about.defaultBio1);
  const bio2 = lang === "ar"
    ? (settings?.about_bio2_ar || t.about.defaultBio2)
    : (settings?.about_bio2_en || t.about.defaultBio2);
  const name = lang === "ar" ? (settings?.hero_name_ar || "نور الرشيدي") : (settings?.hero_name_en || "Nour Al-Rashidi");

  const stats = STATS(t);

  return (
    <section id="about" className="relative py-28 md:py-40 bg-ivory overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.022]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,var(--charcoal) 0,var(--charcoal) 1px,transparent 1px,transparent 56px),repeating-linear-gradient(90deg,var(--charcoal) 0,var(--charcoal) 1px,transparent 1px,transparent 56px)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid lg:grid-cols-2 gap-14 lg:gap-28 items-center ${isRTL ? "lg:flex-row-reverse" : ""}`}>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/about.jpg" alt="Designer portrait" fill
                className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
            {/* Offset frame */}
            <div className={`absolute -bottom-5 ${isRTL ? "-left-5" : "-right-5"} w-3/5 h-3/5
                             border border-gold/35 -z-10`} />
            {/* Exp badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`absolute -bottom-10 ${isRTL ? "left-0" : "right-0"} bg-charcoal p-7`}>
              <span className="font-display text-5xl text-gold">12</span>
              <p className="font-body text-[0.58rem] tracking-[0.2em] uppercase text-ivory/50 mt-1">
                {isRTL ? "سنة خبرة" : "Years\nExpertise"}
              </p>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <div ref={ref} className={isRTL ? "text-right" : ""}>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }} className="section-label mb-4">
              {t.about.sectionLabel}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }} className="section-title mb-8">
              {t.about.title}
            </motion.h2>
            <div className={`w-10 h-px bg-gold mb-8 ${isRTL ? "ml-auto" : ""}`} />

            {[bio1, bio2].map((text, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
                className="font-body text-[0.93rem] text-charcoal/65 leading-relaxed mb-6">
                {text}
              </motion.p>
            ))}

            {/* Signature */}
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`flex items-center gap-4 mt-10 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
              <div className="w-10 h-px bg-gold" />
              <span className="font-display text-2xl text-charcoal italic">{name}</span>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 pt-12 border-t border-sand grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => {
            const ref2   = useRef(null);
            const show   = useInView(ref2, { once: true });
            return (
              <motion.div key={label} ref={ref2}
                initial={{ opacity: 0, y: 18 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="flex flex-col items-center text-center">
                <span className="font-display text-5xl text-charcoal">{value}</span>
                <div className="w-5 h-px bg-gold my-2" />
                <span className="font-body text-[0.62rem] tracking-[0.18em] uppercase text-muted">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
