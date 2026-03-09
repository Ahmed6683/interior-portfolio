"use client";
// components/ui/WhatsAppButton.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings }         from "@/hooks/useSupabase";
import { useLang }                 from "@/context/LanguageContext";

export default function WhatsAppButton() {
  const { settings, loading } = useSiteSettings();
  const { t, isRTL }          = useLang();

  if (loading) return null;

  const visible = settings?.show_whatsapp !== false;
  const number  = settings?.whatsapp_number || "966501234567";
  const href    = `https://wa.me/${number.replace(/\D/g, "")}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div id="contact"
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          exit={{ scale:0, opacity:0 }}
          transition={{ type:"spring", stiffness:380, damping:24, delay:2 }}
          className={`fixed bottom-8 ${isRTL ? "left-8" : "right-8"} z-[100]`}>

          <a href={href} target="_blank" rel="noopener noreferrer"
            aria-label={t.contact.whatsapp}
            className="group relative flex items-center gap-3 bg-[#22C55E] text-white
                       shadow-lg shadow-green-500/25 px-4 py-3
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/30
                       transition-all duration-300">

            {/* WhatsApp icon */}
            <svg viewBox="0 0 32 32" className="w-6 h-6 flex-shrink-0 fill-white">
              <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.72.7 5.28 1.94 7.5L.5 31.5l8.22-1.9A15.45 15.45 0 0 0 16 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5Zm0 28.3a12.73 12.73 0 0 1-6.48-1.77l-.46-.28-4.88 1.13 1.16-4.77-.3-.49A12.74 12.74 0 0 1 3.2 16C3.2 9.47 8.47 4.2 16 4.2S28.8 9.47 28.8 16 23.53 28.8 16 28.8ZM23.2 19.4c-.38-.19-2.24-1.1-2.59-1.23-.35-.12-.6-.18-.86.19-.25.37-.97 1.22-1.19 1.47-.22.25-.44.28-.82.09-.38-.19-1.6-.59-3.04-1.88-1.12-1-1.88-2.24-2.1-2.62-.22-.38-.02-.58.17-.77.17-.17.38-.44.56-.67.19-.22.25-.38.38-.63.12-.25.06-.47-.03-.65-.09-.19-.86-2.07-1.18-2.83-.31-.74-.63-.64-.87-.65H10.1c-.25 0-.66.09-1 .47-.35.37-1.32 1.29-1.32 3.14 0 1.85 1.35 3.64 1.54 3.89.19.25 2.66 4.06 6.44 5.7.9.39 1.6.62 2.15.79.9.28 1.73.24 2.38.15.73-.11 2.24-.92 2.56-1.8.31-.88.31-1.63.22-1.79-.1-.16-.35-.25-.73-.44Z"/>
            </svg>

            <span className="font-body text-[0.62rem] tracking-widest uppercase
                             max-w-0 overflow-hidden opacity-0
                             group-hover:max-w-xs group-hover:opacity-100
                             transition-all duration-400 whitespace-nowrap">
              {t.contact.whatsapp}
            </span>
          </a>

          {/* Pulse ring */}
          <span className="absolute inset-0 bg-green-400 opacity-25 animate-ping pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
