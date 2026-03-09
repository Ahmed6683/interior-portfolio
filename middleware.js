// middleware.js  (root of project — Next.js picks this up automatically)
// ─────────────────────────────────────────────────────────────────────────────
// Protects every route under /admin/* except /admin (the login page itself).
// Refreshes the Supabase session on every request so JWTs never go stale.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }          from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/client";

export async function middleware(request) {

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createMiddlewareClient(request, response);

  // Refresh session — this is required for Server Components to read auth state
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Protect /admin/* (but not /admin itself — that's the login page)
  const isAdminSubRoute = pathname.startsWith("/admin/");

  if (isAdminSubRoute && !session) {
    const loginUrl = new URL("/admin", request.url);
    loginUrl.searchParams.set("redirected", "1");
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting the login page → redirect to dashboard
  if (pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match /admin and all sub-routes, skip static assets & API routes that
    // don't need auth (auth/callback must be public)
    "/admin",
    "/admin/:path((?!auth).*)",
  ],
};
