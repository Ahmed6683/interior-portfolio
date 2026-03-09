// app/api/auth/callback/route.js
// Handles the OAuth / magic-link redirect from Supabase
import { createServerClient } from "@/lib/supabase/client";
import { NextResponse }        from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const supabase = createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
