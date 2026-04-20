"use client";

import { createBrowserClient } from "@supabase/ssr";

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    COOKIE_DOMAIN ? { cookieOptions: { domain: COOKIE_DOMAIN } } : undefined
  );
}
