"use client";
// components/ui/BeforeAfterSlider.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Before", afterLabel = "After", alt = "" }) {
  const [pos,      setPos]      = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef                  = useRef(null);

  const calcPct = useCallback((clientX) => {
    const r = boxRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
  }, []);

  const onMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    setPos(calcPct(e.clientX ?? e.touches?.[0]?.clientX));
  }, [dragging, calcPct]);

  const onUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup",   onUp);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, [dragging, onMove, onUp]);

  return (
    <div
      ref={boxRef}
      className="ba-container relative w-full overflow-hidden select-none"
      style={{ aspectRatio: "16/9" }}
      onPointerDown={(e) => { setDragging(true); setPos(calcPct(e.clientX)); }}
    >
      {/* After (base) */}
      <div className="absolute inset-0">
        <Image src={afterSrc} alt={`${alt} — after`} fill className="object-cover" sizes="80vw" priority />
      </div>

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={beforeSrc} alt={`${alt} — before`} fill className="object-cover" sizes="80vw" />
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-[1.5px] bg-ivory/75 shadow-[0_0_16px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }} />

      {/* Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
                   w-11 h-11 rounded-full bg-ivory border-2 border-gold shadow-xl
                   flex items-center justify-center"
        style={{ left: `${pos}%` }}
        animate={{ scale: dragging ? 1.18 : 1 }}
        transition={{ type:"spring", stiffness:420, damping:28 }}
      >
        <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none" stroke="currentColor"
          strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 5l-5 6 5 6M15 5l5 6-5 6" stroke="var(--gold)" />
        </svg>
      </motion.div>

      {/* Labels */}
      <span className="absolute top-3 left-3 font-body text-[0.58rem] tracking-[0.28em] uppercase
                       text-ivory bg-charcoal/55 px-2.5 py-1 backdrop-blur-sm z-10">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 font-body text-[0.58rem] tracking-[0.28em] uppercase
                       text-ivory bg-charcoal/55 px-2.5 py-1 backdrop-blur-sm z-10">
        {afterLabel}
      </span>
    </div>
  );
}
