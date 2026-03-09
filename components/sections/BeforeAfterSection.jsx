"use client";
// components/sections/BeforeAfterSection.jsx
import { useState } from "react";
import { motion }   from "framer-motion";
import { useLang }        from "@/context/LanguageContext";
import { useBeforeAfter } from "@/hooks/useSupabase";
import BeforeAfterSlider  from "@/components/ui/BeforeAfterSlider";

const DEMO_PAIRS = [
  { id:"b1", title_en:"Urban Living Room",    title_ar:"غرفة معيشة عصرية",  before_url:"/images/ba/living-before.jpg",  after_url:"/images/ba/living-after.jpg"  },
  { id:"b2", title_en:"Gourmet Kitchen",      title_ar:"مطبخ فاخر",         before_url:"/images/ba/kitchen-before.jpg", after_url:"/images/ba/kitchen-after.jpg" },
  { id:"b3", title_en:"Master Suite Retreat", title_ar:"جناح النوم الرئيسي",before_url:"/images/ba/master-before.jpg",  after_url:"/images/ba/master-after.jpg"  },
];

export default function BeforeAfterSection() {
  const { t, lang, isRTL } = useLang();
  const { pairs, loading } = useBeforeAfter();
  const [active, setActive]= useState(0);

  const source = pairs.length ? pairs : DEMO_PAIRS;
  const cur    = source[active];

  return (
    <section id="transformations" className="py-28 md:py-40 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className={`mb-14 ${isRTL ? "text-right" : ""}`}>
          <motion.p initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="font-body text-[0.62rem] tracking-[0.35em] uppercase text-gold mb-4">
            {t.beforeAfter.sectionLabel}
          </motion.p>
          <motion.h2 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.1 }} className="section-title-light mb-3">
            {t.beforeAfter.title}
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }} className="font-body text-sm text-ivory/35 max-w-lg">
            {t.beforeAfter.subtitle}
          </motion.p>
        </div>

        {/* Tabs */}
        {!loading && (
          <div className={`flex flex-wrap gap-2 mb-8 ${isRTL ? "justify-end" : ""}`}>
            {source.map((p, i) => (
              <button key={p.id} onClick={() => setActive(i)}
                className={`font-body text-[0.62rem] tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300
                  ${active === i ? "bg-gold text-ivory" : "border border-ivory/18 text-ivory/40 hover:border-gold hover:text-gold"}`}>
                {lang === "ar" ? p.title_ar : p.title_en}
              </button>
            ))}
          </div>
        )}

        {/* Slider */}
        {loading ? (
          <div className="w-full aspect-video skeleton" />
        ) : cur ? (
          <motion.div key={active}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            className="border border-ivory/8">
            <BeforeAfterSlider
              beforeSrc={cur.before_url}
              afterSrc={cur.after_url}
              beforeLabel={t.beforeAfter.before}
              afterLabel={t.beforeAfter.after}
              alt={lang === "ar" ? cur.title_ar : cur.title_en}
            />
          </motion.div>
        ) : null}

        {cur && (
          <p className={`mt-4 font-body text-[0.6rem] tracking-[0.25em] uppercase text-ivory/25
                         ${isRTL ? "text-right" : ""}`}>
            {lang === "ar" ? cur.title_ar : cur.title_en}
          </p>
        )}
      </div>
    </section>
  );
}
