import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const opts: Record<string, unknown> = { ...(options ?? {}) };
              if (COOKIE_DOMAIN) opts.domain = COOKIE_DOMAIN;
              cookieStore.set(name, value, opts as any);
            });
          } catch {
            // setAll was called from a Server Component — noop.
          }
        },
      },
    }
  );
}
