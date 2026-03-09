"use client";
// components/ui/Lightbox.jsx
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  const isOpen = activeIndex != null;
  const active = isOpen ? images[activeIndex] : null;

  const onKey = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === "Escape")     onClose();
    if (e.key === "ArrowLeft")  onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && active && (
        <motion.div
          key="lb"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[200] lb-backdrop bg-charcoal/92 flex items-center justify-center"
          onClick={onClose}>

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 border border-ivory/20
                       text-ivory/50 hover:text-ivory hover:border-ivory/50 transition-all text-lg flex items-center justify-center">
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 md:left-6 w-12 h-12 border border-ivory/20
                           text-ivory/50 hover:text-gold hover:border-gold transition-all text-3xl flex items-center justify-center z-20">
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 md:right-6 w-12 h-12 border border-ivory/20
                           text-ivory/50 hover:text-gold hover:border-gold transition-all text-3xl flex items-center justify-center z-20">
                ›
              </button>
            </>
          )}

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-5xl w-full mx-14 md:mx-20">

            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
              <Image
                src={active.image_url || active.url}
                alt={active.title_en || active.caption || ""}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {(active.title_en || active.title_ar) && (
              <div className="mt-4 text-center">
                <p className="font-body text-[0.7rem] tracking-[0.2em] uppercase text-ivory/40">
                  {active.title_en || active.title_ar}
                </p>
              </div>
            )}

            <p className="absolute -bottom-7 left-1/2 -translate-x-1/2
                          font-body text-[0.58rem] tracking-[0.3em] text-ivory/25 uppercase">
              {activeIndex + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
