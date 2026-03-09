"use client";
// app/admin/dashboard/page.js — Content Editor
import { useState, useEffect } from "react";
import { motion }               from "framer-motion";
import { useLang }              from "@/context/LanguageContext";
import { useSiteSettings }      from "@/hooks/useSupabase";

function Field({ label, value, onChange, multiline = false, dir = "ltr" }) {
  const cls = `w-full bg-transparent border-b border-ivory/18 focus:border-gold
               text-ivory font-body text-sm py-2.5 outline-none transition-colors
               placeholder:text-ivory/15 resize-none`;
  return (
    <div>
      <label className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ivory/40 block mb-2">
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={cls} dir={dir} />
        : <input    value={value} onChange={e => onChange(e.target.value)} className={cls} dir={dir} />
      }
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-ivory/10 p-6 md:p-8 space-y-6">
      <h3 className="font-display text-xl text-ivory/70">{title}</h3>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { t, isRTL }                         = useLang();
  const at                                    = t.admin.content;
  const { settings, loading, updateSettings } = useSiteSettings();

  const init = {
    hero_name_en:"", hero_name_ar:"",
    hero_headline_en:"", hero_headline_ar:"",
    hero_description_en:"", hero_description_ar:"",
    about_bio1_en:"", about_bio1_ar:"",
    about_bio2_en:"", about_bio2_ar:"",
  };
  const [form,   setForm]   = useState(init);
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        hero_name_en:         settings.hero_name_en         || "",
        hero_name_ar:         settings.hero_name_ar         || "",
        hero_headline_en:     settings.hero_headline_en     || "",
        hero_headline_ar:     settings.hero_headline_ar     || "",
        hero_description_en:  settings.hero_description_en  || "",
        hero_description_ar:  settings.hero_description_ar  || "",
        about_bio1_en:        settings.about_bio1_en        || "",
        about_bio1_ar:        settings.about_bio1_ar        || "",
        about_bio2_en:        settings.about_bio2_en        || "",
        about_bio2_ar:        settings.about_bio2_ar        || "",
      });
    }
  }, [settings]);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try { await updateSettings(form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  return (
    <div className={`p-8 md:p-12 ${isRTL ? "text-right" : ""}`}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>

        <p className="section-label mb-2">{isRTL ? "لوحة التحكم" : "Dashboard"}</p>
        <h1 className="font-display text-4xl text-ivory mb-10">{at.title}</h1>

        {loading ? (
          <div className="space-y-5 max-w-2xl">
            {[...Array(6)].map((_,i) => <div key={i} className="h-10 skeleton" />)}
          </div>
        ) : (
          <div className="max-w-2xl space-y-8">

            {/* Hero */}
            <Section title={at.heroSection}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={at.heroNameEn}    value={form.hero_name_en}        onChange={set("hero_name_en")}      dir="ltr" />
                <Field label={at.heroNameAr}    value={form.hero_name_ar}        onChange={set("hero_name_ar")}      dir="rtl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={at.heroHeadlineEn} value={form.hero_headline_en}   onChange={set("hero_headline_en")}  dir="ltr" />
                <Field label={at.heroHeadlineAr} value={form.hero_headline_ar}   onChange={set("hero_headline_ar")}  dir="rtl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={at.heroDescEn} value={form.hero_description_en}    onChange={set("hero_description_en")} multiline dir="ltr" />
                <Field label={at.heroDescAr} value={form.hero_description_ar}    onChange={set("hero_description_ar")} multiline dir="rtl" />
              </div>
            </Section>

            {/* About */}
            <Section title={at.aboutSection}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={at.bio1En} value={form.about_bio1_en} onChange={set("about_bio1_en")} multiline dir="ltr" />
                <Field label={at.bio1Ar} value={form.about_bio1_ar} onChange={set("about_bio1_ar")} multiline dir="rtl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={at.bio2En} value={form.about_bio2_en} onChange={set("about_bio2_en")} multiline dir="ltr" />
                <Field label={at.bio2Ar} value={form.about_bio2_ar} onChange={set("about_bio2_ar")} multiline dir="rtl" />
              </div>
            </Section>

            {/* Save */}
            <button onClick={handleSave} disabled={saving}
              className="w-full btn-primary justify-center py-4 disabled:opacity-40">
              {saved ? `✓ ${at.saved}` : saving ? "…" : at.save}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
