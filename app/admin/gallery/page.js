"use client";
// app/admin/gallery/page.js — Gallery Manager
import { useState, useRef, useCallback } from "react";
import Image  from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLang }              from "@/context/LanguageContext";
import { usePortfolio, useImageUpload, deletePortfolioItem, updatePortfolioItem }
  from "@/hooks/useSupabase";

const CATS = ["all", "residential", "commercial", "hospitality"];

/* ── Upload zone ──────────────────────────────────────────────────────── */
function UploadZone({ onFiles, isRTL }) {
  const [drag, setDrag] = useState(false);
  const input           = useRef(null);

  const handle = (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imgs.length) onFiles(imgs);
  };

  return (
    <div
      onDragOver  ={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave ={() => setDrag(false)}
      onDrop      ={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick     ={() => input.current?.click()}
      className={`relative border-2 border-dashed cursor-pointer p-12 text-center
                  transition-all duration-300 group
                  ${drag ? "border-gold bg-gold/5" : "border-ivory/18 hover:border-gold/35"}`}
    >
      <input ref={input} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handle(e.target.files)} />

      <motion.div animate={{ y: drag ? -4 : 0 }} transition={{ type:"spring", stiffness:300 }}
        className="text-4xl mb-3 opacity-40 group-hover:opacity-70 transition-opacity">↑</motion.div>

      <p className="font-body text-sm text-ivory/45 tracking-wide">
        {isRTL ? "اسحب وأفلت أو " : "Drag & drop or "}
        <span className="text-gold underline underline-offset-2">
          {isRTL ? "تصفح" : "browse"}
        </span>
      </p>
      <p className="font-body text-[0.58rem] tracking-[0.2em] uppercase text-ivory/25 mt-2">
        JPG · PNG · WEBP · max 10 MB
      </p>
    </div>
  );
}

/* ── Upload form modal ────────────────────────────────────────────────── */
function UploadModal({ files, onSubmit, onCancel, uploading, progress, isRTL, t }) {
  const [metas, setMetas] = useState(
    () => files.map(f => ({ title_en: f.name.replace(/\.[^.]+$/, ""), title_ar: "", category: "all" }))
  );
  const setMeta = (i, key, val) =>
    setMetas(m => m.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  return (
    <div className="fixed inset-0 z-[150] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        className="bg-charcoal-soft border border-ivory/10 p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto">

        <p className="font-display text-2xl text-ivory mb-6">{t.admin.gallery.upload}</p>

        <div className="space-y-6">
          {files.map((f, i) => (
            <div key={i} className="border border-ivory/8 p-4 space-y-3">
              <p className="font-body text-xs text-ivory/40 tracking-wide truncate">{f.name}</p>
              <input type="text" value={metas[i].title_en} onChange={e => setMeta(i,"title_en",e.target.value)}
                placeholder={t.admin.gallery.titleEn}
                className="w-full bg-transparent border-b border-ivory/18 focus:border-gold
                           text-ivory text-xs font-body py-1.5 outline-none" dir="ltr" />
              <input type="text" value={metas[i].title_ar} onChange={e => setMeta(i,"title_ar",e.target.value)}
                placeholder={t.admin.gallery.titleAr}
                className="w-full bg-transparent border-b border-ivory/18 focus:border-gold
                           text-ivory text-xs font-body py-1.5 outline-none" dir="rtl" />
              <select value={metas[i].category} onChange={e => setMeta(i,"category",e.target.value)}
                className="bg-charcoal-mid border border-ivory/15 text-ivory/70 text-xs font-body
                           py-1.5 px-2 outline-none focus:border-gold w-full">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          ))}
        </div>

        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-ivory/10 h-0.5">
              <motion.div animate={{ width:`${progress}%` }} className="h-full bg-gold transition-all" />
            </div>
            <p className="font-body text-[0.58rem] text-ivory/35 mt-1 tracking-wide">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={() => onSubmit(metas)} disabled={uploading}
            className="flex-1 btn-primary justify-center py-3 disabled:opacity-40">
            {uploading ? t.admin.gallery.saving : t.admin.gallery.upload}
          </button>
          <button onClick={onCancel} disabled={uploading}
            className="px-6 border border-ivory/20 text-ivory/50 hover:border-ivory/40 hover:text-ivory/80
                       font-body text-[0.6rem] tracking-widest uppercase transition-all">
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Gallery item card ────────────────────────────────────────────────── */
function GalleryCard({ item, lang, t, onDelete }) {
  const [titleEn, setTitleEn] = useState(item.title_en || "");
  const [titleAr, setTitleAr] = useState(item.title_ar || "");
  const [cat,     setCat]     = useState(item.category || "all");
  const [saving,  setSaving]  = useState(false);
  const [confirm, setConfirm] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await updatePortfolioItem(item.id, { title_en: titleEn, title_ar: titleAr, category: cat }); }
    finally { setSaving(false); }
  };

  return (
    <motion.div layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.92 }}
      className="bg-charcoal-mid border border-ivory/8 overflow-hidden">

      {/* Thumbnail — Next.js Image optimisation */}
      <div className="relative aspect-video">
        <Image
          src={item.image_url}
          alt={item.title_en || ""}
          fill
          sizes="(max-width:640px) 100vw, 300px"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Wg8AAicBIobGLBIAAAAASUVORK5CYII="
        />
      </div>

      {/* Controls */}
      <div className="p-4 space-y-2.5">
        <input type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)}
          placeholder="Title EN"
          className="w-full bg-transparent border-b border-ivory/12 focus:border-gold
                     text-ivory/80 text-[0.72rem] font-body py-1 outline-none" dir="ltr" />
        <input type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)}
          placeholder="Title AR"
          className="w-full bg-transparent border-b border-ivory/12 focus:border-gold
                     text-ivory/80 text-[0.72rem] font-body py-1 outline-none" dir="rtl" />
        <select value={cat} onChange={e => setCat(e.target.value)}
          className="w-full bg-charcoal-soft border border-ivory/12 text-ivory/60 text-[0.7rem]
                     font-body py-1.5 px-2 outline-none focus:border-gold">
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex gap-2 pt-1">
          <button onClick={save} disabled={saving}
            className="flex-1 bg-gold/18 text-gold hover:bg-gold hover:text-ivory font-body
                       text-[0.58rem] tracking-widest uppercase py-2 transition-all disabled:opacity-40">
            {saving ? "…" : t.admin.gallery.save}
          </button>
          {!confirm
            ? <button onClick={() => setConfirm(true)}
                className="flex-1 border border-red-500/25 text-red-400/60 hover:border-red-400
                           hover:text-red-400 font-body text-[0.58rem] tracking-widest uppercase py-2 transition-all">
                {t.admin.gallery.delete}
              </button>
            : <button onClick={() => onDelete(item.id, item.storage_path)}
                className="flex-1 bg-red-500 text-white font-body text-[0.58rem]
                           tracking-widest uppercase py-2 transition-all">
                {lang === "ar" ? "تأكيد" : "Confirm"}
              </button>
          }
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const { t, lang, isRTL }                    = useLang();
  const { items, loading }                     = usePortfolio();
  const { upload, uploading, progress, error } = useImageUpload();
  const [pendingFiles, setPendingFiles]        = useState(null);

  const handleFiles  = useCallback((files) => setPendingFiles(files), []);
  const handleCancel = useCallback(() => setPendingFiles(null), []);

  const handleSubmit = async (metas) => {
    for (let i = 0; i < pendingFiles.length; i++) {
      await upload(pendingFiles[i], metas[i]);
    }
    setPendingFiles(null);
  };

  const handleDelete = async (id, storagePath) => {
    await deletePortfolioItem(id, storagePath);
  };

  return (
    <div className={`p-8 md:p-12 ${isRTL ? "text-right" : ""}`}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <p className="section-label mb-2">{isRTL ? "لوحة التحكم" : "Dashboard"}</p>
        <h1 className="font-display text-4xl text-ivory mb-8">{t.admin.gallery.title}</h1>

        <div className="max-w-5xl">
          <UploadZone onFiles={handleFiles} isRTL={isRTL} />
          {error && <p className="mt-3 font-body text-xs text-red-400">{error}</p>}
        </div>

        {/* Grid */}
        <div className="mt-10 max-w-5xl">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_,i) => <div key={i} className="aspect-video skeleton" />)}
            </div>
          ) : items.length === 0 ? (
            <p className="font-body text-sm text-ivory/25 tracking-wide text-center py-20">
              {isRTL ? "لا توجد صور. ارفع صورًا أعلاه." : "No images yet. Upload some above."}
            </p>
          ) : (
            <motion.div layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {items.map(item => (
                  <GalleryCard key={item.id} item={item} lang={lang} t={t} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Upload modal */}
      <AnimatePresence>
        {pendingFiles && (
          <UploadModal
            files={pendingFiles}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            uploading={uploading}
            progress={progress}
            isRTL={isRTL}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
