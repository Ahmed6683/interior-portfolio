"use client";
// app/admin/page.js — Login
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion }    from "framer-motion";
import { useLang }   from "@/context/LanguageContext";
import { useAuth }   from "@/hooks/useSupabase";

export default function AdminLoginPage() {
  const router        = useRouter();
  const { t, isRTL } = useLang();
  const at            = t.admin.login;
  const { signIn }    = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signIn(email, password);
      router.push("/admin/dashboard");
    } catch {
      setError(at.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-6 relative overflow-hidden">
      {/* Diagonal lines bg */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:"repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 0,transparent 40%)", backgroundSize:"24px 24px" }} />

      {/* Gold corner accent */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-gold/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-gold/20" />

      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        className={`relative w-full max-w-[420px] bg-charcoal-soft border border-ivory/8 p-10 md:p-14
                    ${isRTL ? "text-right" : "text-left"}`}
      >
        {/* Wordmark */}
        <div className="mb-10">
          <span className="font-display text-3xl text-ivory">
            {isRTL ? "نور الرشيدي" : "Nour"}
          </span>
          <div className={`w-7 h-px bg-gold mt-1.5 ${isRTL ? "mr-0 ml-auto" : ""}`} />
        </div>

        <p className="section-label mb-2">{at.title}</p>
        <p className="font-body text-sm text-ivory/35 mb-10 tracking-wide">{at.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          {/* Email */}
          <div>
            <label className="font-body text-[0.58rem] tracking-[0.25em] uppercase text-ivory/40 block mb-2">
              {at.email}
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
              className="w-full bg-transparent border-b border-ivory/18 focus:border-gold
                         text-ivory font-body text-sm py-2.5 outline-none transition-colors duration-300
                         placeholder:text-ivory/15"
              dir="ltr" />
          </div>

          {/* Password */}
          <div>
            <label className="font-body text-[0.58rem] tracking-[0.25em] uppercase text-ivory/40 block mb-2">
              {at.password}
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password"
              className="w-full bg-transparent border-b border-ivory/18 focus:border-gold
                         text-ivory font-body text-sm py-2.5 outline-none transition-colors duration-300" />
          </div>

          {error && (
            <p className="font-body text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gold text-ivory font-body text-[0.62rem] tracking-[0.3em] uppercase
                       py-4 mt-2 transition-all duration-300 hover:bg-gold-dark disabled:opacity-40">
            {loading ? "…" : at.button}
          </button>
        </form>

        <a href="/" className="block mt-8 font-body text-[0.6rem] tracking-widest uppercase
                               text-ivory/25 hover:text-ivory/55 transition-colors">
          {isRTL ? "← العودة للموقع" : "← Back to site"}
        </a>
      </motion.div>
    </main>
  );
}
