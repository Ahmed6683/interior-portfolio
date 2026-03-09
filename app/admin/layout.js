// app/admin/layout.js
// The middleware already guards all /admin/* routes.
// This layout provides the dark admin shell + sidebar for sub-pages.
"use client";
import { usePathname } from "next/navigation";
import AdminSidebar    from "@/components/admin/AdminSidebar";
import { useLang }     from "@/context/LanguageContext";

export default function AdminLayout({ children }) {
  const pathname       = usePathname();
  const { isRTL }      = useLang();
  const isLoginPage    = pathname === "/admin";

  // Login page gets a plain charcoal full-screen layout
  if (isLoginPage) return <>{children}</>;

  return (
    <div className={`flex min-h-screen bg-charcoal text-ivory ${isRTL ? "flex-row-reverse" : ""}`}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
