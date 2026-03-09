"use client";
// components/admin/AdminSidebar.jsx
import Link       from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useSupabase";

const NAV = (t) => [
  { href:"/admin/dashboard", label: t.admin.dashboard.content,   icon: "✦" },
  { href:"/admin/gallery",   label: t.admin.dashboard.gallery,   icon: "⬡" },
  { href:"/admin/settings",  label: t.admin.dashboard.settings,  icon: "◈" },
];

export default function AdminSidebar() {
  const pathname       = usePathname();
  const router         = useRouter();
  const { t, isRTL }  = useLang();
  const { signOut }    = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/admin");
  };

  return (
    <aside className={`w-60 min-h-screen flex flex-col bg-charcoal-soft
                       ${isRTL ? "border-l border-ivory/8" : "border-r border-ivory/8"}`}>

      {/* Brand */}
      <div className="px-7 py-8 border-b border-ivory/8">
        <span className="font-display text-[1.6rem] text-ivory block leading-none">
          {isRTL ? "نور" : "Nour"}
        </span>
        <span className="font-body text-[0.55rem] tracking-[0.25em] uppercase text-gold mt-1 block">
          {isRTL ? "لوحة التحكم" : "Admin Panel"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV(t).map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`relative flex items-center gap-3 px-4 py-3 font-body text-[0.62rem]
                          tracking-[0.18em] uppercase transition-all duration-200 group
                          ${active
                            ? "text-gold bg-gold/10"
                            : "text-ivory/45 hover:text-ivory/80 hover:bg-ivory/4"}`}>
              {active && (
                <motion.div layoutId="sidebar-active"
                  className={`absolute top-0 bottom-0 w-0.5 bg-gold ${isRTL ? "right-0" : "left-0"}`}
                  transition={{ type:"spring", stiffness:380, damping:30 }} />
              )}
              <span className="text-base opacity-70">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4 border-t border-ivory/8 space-y-1">
        <a href="/" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 font-body text-[0.6rem]
                     tracking-widest uppercase text-ivory/28 hover:text-ivory/55 transition-colors">
          <span>↗</span> {isRTL ? "عرض الموقع" : "View Site"}
        </a>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 font-body text-[0.6rem]
                     tracking-widest uppercase text-red-400/55 hover:text-red-400 transition-colors w-full">
          <span>↩</span> {t.admin.dashboard.logout}
        </button>
      </div>
    </aside>
  );
}
