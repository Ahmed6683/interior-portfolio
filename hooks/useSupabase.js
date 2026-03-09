// hooks/useSupabase.js
// ─────────────────────────────────────────────────────────────────────────────
// All client-side data hooks backed by Supabase.
// Real-time subscriptions via supabase.channel() replace onSnapshot().
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient }              from "@/lib/supabase/client";

/* ─── Shared singleton (browser only) ────────────────────────────────────── */
let _client = null;
function getClient() {
  if (!_client) _client = createBrowserClient();
  return _client;
}

/* ══════════════════════════════════════════════════════════════════════════
   1. Site Settings  (singleton row — id = 1)
═══════════════════════════════════════════════════════════════════════════ */
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const supabase = getClient();

    // Initial fetch
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else     setSettings(data);
        setLoading(false);
      });

    // Real-time subscription
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings", filter: "id=eq.1" },
        (payload) => setSettings(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updateSettings = useCallback(async (data) => {
    const supabase = getClient();
    const { error: err } = await supabase
      .from("site_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (err) throw err;
  }, []);

  return { settings, loading, error, updateSettings };
}

/* ══════════════════════════════════════════════════════════════════════════
   2. Portfolio Gallery
═══════════════════════════════════════════════════════════════════════════ */
export function usePortfolio() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const supabase = getClient();

    supabase
      .from("portfolio")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else     setItems(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel("portfolio_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio" },
        () => {
          // Re-fetch on any change (insert / update / delete)
          supabase
            .from("portfolio")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false })
            .then(({ data }) => setItems(data ?? []));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { items, loading, error };
}

/* ══════════════════════════════════════════════════════════════════════════
   3. Before/After pairs
═══════════════════════════════════════════════════════════════════════════ */
export function useBeforeAfter() {
  const [pairs,   setPairs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();

    supabase
      .from("before_after")
      .select("*")
      .order("sort_order")
      .then(({ data }) => { setPairs(data ?? []); setLoading(false); });

    const channel = supabase
      .channel("ba_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "before_after" },
        () => supabase.from("before_after").select("*").order("sort_order")
               .then(({ data }) => setPairs(data ?? []))
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { pairs, loading };
}

/* ══════════════════════════════════════════════════════════════════════════
   4. Image Upload  →  Storage  +  portfolio row insert
═══════════════════════════════════════════════════════════════════════════ */
export function useImageUpload() {
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState(null);

  /**
   * upload(file, { title_en, title_ar, category })
   * Returns the new portfolio row on success.
   */
  const upload = useCallback(async (file, meta = {}) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const supabase  = getClient();
      const ext       = file.name.split(".").pop();
      const filePath  = `portfolio/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      /* ── 1. Upload file to Supabase Storage ── */
      const { error: storageErr } = await supabase.storage
        .from("gallery")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert:       false,
          onUploadProgress: (evt) =>
            setProgress(Math.round((evt.loaded / evt.total) * 100)),
        });

      if (storageErr) throw storageErr;

      /* ── 2. Get the public URL ── */
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      /* ── 3. Insert row in portfolio table ── */
      const { data: row, error: dbErr } = await supabase
        .from("portfolio")
        .insert({
          image_url: publicUrl,
          title_en:  meta.title_en  || file.name.replace(/\.[^.]+$/, ""),
          title_ar:  meta.title_ar  || "",
          category:  meta.category  || "all",
          // store the storage path so we can delete later
          storage_path: filePath,
        })
        .select()
        .single();

      if (dbErr) throw dbErr;

      setProgress(100);
      return row;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, progress, uploading, error };
}

/* ══════════════════════════════════════════════════════════════════════════
   5. Delete portfolio item  (Storage + DB row)
═══════════════════════════════════════════════════════════════════════════ */
export async function deletePortfolioItem(id, storagePath) {
  const supabase = getClient();

  // Delete from Storage first
  if (storagePath) {
    const { error: storageErr } = await supabase.storage
      .from("gallery")
      .remove([storagePath]);
    if (storageErr) console.warn("Storage delete failed:", storageErr.message);
  }

  // Delete DB row
  const { error } = await supabase.from("portfolio").delete().eq("id", id);
  if (error) throw error;
}

/* ══════════════════════════════════════════════════════════════════════════
   6. Update portfolio item metadata
═══════════════════════════════════════════════════════════════════════════ */
export async function updatePortfolioItem(id, data) {
  const supabase = getClient();
  const { error } = await supabase.from("portfolio").update(data).eq("id", id);
  if (error) throw error;
}

/* ══════════════════════════════════════════════════════════════════════════
   7. Auth helpers (client-side)
═══════════════════════════════════════════════════════════════════════════ */
export function useAuth() {
  const [user,    setUser]    = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setUser(session?.user ?? null); setLoading(false); }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const supabase = getClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const supabase = getClient();
    await supabase.auth.signOut();
  };

  return { user, loading, signIn, signOut };
}
