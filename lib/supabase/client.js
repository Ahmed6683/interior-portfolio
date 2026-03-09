// lib/supabase/client.js
"use client";
import { createBrowserClient as _create } from "@supabase/ssr";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Browser client — used everywhere in Client Components
export function createBrowserClient() {
  return _create(URL, ANON);
}

// Middleware client — called only from middleware.js
export function createMiddlewareClient(request, response) {
  const { createServerClient } = require("@supabase/ssr");
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
