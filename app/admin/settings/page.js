"use client";
// app/admin/settings/page.js
import { useState, useEffect } from "react";
import { motion }               from "framer-motion";
import { useLang }              from "@/context/LanguageContext";
import { useSiteSettings }      from "@/hooks/useSupabase";

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="font-body text-sm text-ivory/70 tracking-wide">{label}</p>
          {hint && <p className="font-body text-[0.6rem] text-ivory/30 mt-0.5 tracking-wide">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0
                      ${checked ? "bg-gold" : "bg-ivory/15"}`}
        >
          <motion.span
            animate={{ x: checked ? 26 : 2 }}
            transition={{ type:"spring", stiffness:500, damping:32 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-ivory shadow"
          />
        </button>
      </div>
      <div className="w-full h-px bg-ivory/8" />
    </div>
  );
}

export default function SettingsPage() {
  const { t, isRTL }                         = useLang();
  const at                                    = t.admin.settings;
  const { settings, loading, updateSettings } = useSiteSettings();

  const [phone,   setPhone]   = useState("");
  const [show,    setShow]    = useState(true);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (settings) {
      setPhone(settings.whatsapp_number || "");
      setShow(settings.show_whatsapp   !== false);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ whatsapp_number: phone, show_whatsapp: show });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const testLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null;

  return (
    <div className={`p-8 md:p-12 ${isRTL ? "text-right" : ""}`}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <p className="section-label mb-2">{isRTL ? "لوحة التحكم" : "Dashboard"}</p>
        <h1 className="font-display text-4xl text-ivory mb-10">{at.title}</h1>

        <div className="max-w-lg space-y-8">

          {/* WhatsApp panel */}
          <div className="border border-ivory/10 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[#22C55E]/20 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-[#22C55E]">
                  <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.72.7 5.28 1.94 7.5L.5 31.5l8.22-1.9A15.45 15.45 0 0016 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5z"/>
                </svg>
              </div>
              <span className="font-display text-2xl text-ivory">WhatsApp</span>
            </div>

            {/* Phone number */}
            <div className="mb-6">
              <label className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ivory/40 block mb-2">
                {at.whatsapp}
              </label>
              <div className="flex items-center border-b border-ivory/18 focus-within:border-gold transition-colors gap-2">
                <span className="font-body text-sm text-ivory/35 select-none">+</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="966501234567"
                  className="flex-1 bg-transparent text-ivory font-body text-sm py-2.5 outline-none
                             placeholder:text-ivory/15"
                  dir="ltr"
                />
              </div>
              <p className="font-body text-[0.58rem] text-ivory/28 mt-1.5 tracking-wide">{at.hint}</p>
              {testLink && (
                <a href={testLink} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-2 font-body text-[0.6rem] text-gold tracking-wider underline underline-offset-2">
                  {isRTL ? "اختبر الرابط ↗" : "Test link ↗"}
                </a>
              )}
            </div>

            <Toggle checked={show} onChange={setShow} label={at.showBtn}
              hint={isRTL
                ? (show ? "الزر ظاهر على الموقع" : "الزر مخفي عن الموقع")
                : (show ? "Button is visible on site" : "Button is hidden from site")} />

            {/* Live preview */}
            <div className="mt-6 p-4 bg-ivory/4 flex items-center gap-3">
              <div className={`w-9 h-9 flex items-center justify-center transition-colors
                              ${show ? "bg-[#22C55E]" : "bg-ivory/10"}`}>
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                  <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.72.7 5.28 1.94 7.5L.5 31.5l8.22-1.9A15.45 15.45 0 0016 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5z"/>
                </svg>
              </div>
              <p className="font-body text-xs text-ivory/40 tracking-wide">
                {show
                  ? (isRTL ? "الزر نشط ومرئي للزوار" : "Button is active and visible to visitors")
                  : (isRTL ? "الزر مخفي حاليًا"       : "Button is currently hidden")}
              </p>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving || loading}
            className="w-full btn-primary justify-center py-4 disabled:opacity-40">
            {saved   ? `✓ ${at.saved}`
             : saving ? "…"
             : at.save}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
