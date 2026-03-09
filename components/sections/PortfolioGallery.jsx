"use client";
// components/sections/PortfolioGallery.jsx
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLang }       from "@/context/LanguageContext";
import { usePortfolio }  from "@/hooks/useSupabase";
import Lightbox          from "@/components/ui/Lightbox";

/* ── Fallback demo data before Supabase is connected ─────────────────── */
const DEMO = [
  { id:"d1", image_url:"/images/portfolio/p1.jpg", title_en:"Luxury Living Room",    title_ar:"غرفة معيشة فاخرة",  category:"residential" },
  { id:"d2", image_url:"/images/portfolio/p2.jpg", title_en:"Gourmet Kitchen",       title_ar:"مطبخ فاخر",        category:"residential" },
  { id:"d3", image_url:"/images/portfolio/p3.jpg", title_en:"Corporate Lobby",       title_ar:"بهو شركات",        category:"commercial"  },
  { id:"d4", image_url:"/images/portfolio/p4.jpg", title_en:"Boutique Hotel Suite",  title_ar:"جناح فندقي",       category:"hospitality" },
  { id:"d5", image_url:"/images/portfolio/p5.jpg", title_en:"Master Bedroom",        title_ar:"غرفة النوم الرئيسية",category:"residential"},
  { id:"d6", image_url:"/images/portfolio/p6.jpg", title_en:"Restaurant Interior",   title_ar:"ديكور مطعم",       category:"hospitality" },
  { id:"d7", image_url:"/images/portfolio/p7.jpg", title_en:"Open-Plan Office",      title_ar:"مكتب مفتوح",       category:"commercial"  },
  { id:"d8", image_url:"/images/portfolio/p8.jpg", title_en:"Penthouse Terrace",     title_ar:"تراس البنتهاوس",   category:"residential" },
  { id:"d9", image_url:"/images/portfolio/p9.jpg", title_en:"Spa & Wellness Centre", title_ar:"مركز سبا",         category:"hospitality" },
];

const CATS = (t) => [
  { key:"all",         label: t.portfolio.all          },
  { key:"residential", label: t.portfolio.residential  },
  { key:"commercial",  label: t.portfolio.commercial   },
  { key:"hospitality", label: t.portfolio.hospitality  },
];

export default function PortfolioGallery() {
  const { t, lang, isRTL }                = useLang();
  const { items, loading }                = usePortfolio();
  const [filter,     setFilter]           = useState("all");
  const [lightboxIdx, setLightboxIdx]     = useState(null);

  const source   = items.length ? items : DEMO;
  const filtered = useMemo(
    () => filter === "all" ? source : source.filter(i => i.category === filter),
    [source, filter]
  );

  return (
    <section id="portfolio" className="py-28 md:py-40 bg-ivory-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className={`mb-14 ${isRTL ? "text-right" : ""}`}>
          <motion.p initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="section-label mb-4">{t.portfolio.sectionLabel}</motion.p>
          <motion.h2 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.1 }} className="section-title mb-3">{t.portfolio.title}</motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }} className="font-body text-sm text-muted">{t.portfolio.subtitle}</motion.p>
        </div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className={`flex flex-wrap gap-2 mb-10 ${isRTL ? "justify-end" : ""}`}>
          {CATS(t).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`font-body text-[0.62rem] tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300
                ${filter === key ? "bg-charcoal text-ivory" : "border border-sand text-muted hover:border-gold hover:text-gold"}`}>
              {label}
            </button>
          ))}
        </motion.div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_,i) => <div key={i} className="aspect-[4/3] skeleton" />)}
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={filter}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay: idx * 0.055, ease:[0.16,1,0.3,1] }}
                onClick={() => setLightboxIdx(idx)}
                className={`group relative overflow-hidden cursor-pointer bg-sand-light
                            ${idx % 5 === 0 ? "sm:row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`}>

                {/* Next.js Image — optimised, lazy-loaded */}
                <Image
                  src={item.image_url}
                  alt={lang === "ar" ? item.title_ar : item.title_en}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                             group-hover:scale-[1.04]"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Wg8AAicBIobGLBIAAAAASUVORK5CYII="
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/55
                                transition-all duration-500 flex items-end p-5">
                  <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                                  transition-all duration-400">
                    <p className="font-body text-[0.58rem] tracking-[0.25em] uppercase text-gold mb-1">
                      {item.category}
                    </p>
                    <p className="font-display text-lg text-ivory">
                      {lang === "ar" ? item.title_ar : item.title_en}
                    </p>
                  </div>
                </div>

                {/* Expand icon */}
                <div className="absolute top-3 right-3 w-7 h-7 border border-ivory/0
                                group-hover:border-ivory/50 flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <svg className="w-3 h-3 text-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <Lightbox
        images={filtered}
        activeIndex={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onPrev={() => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length)}
        onNext={() => setLightboxIdx(i => (i + 1) % filtered.length)}
      />
    </section>
  );
}
