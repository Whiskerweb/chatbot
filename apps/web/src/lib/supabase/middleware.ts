import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = "helloclaudia.fr";
const AUTH_HOST = `login.${ROOT_DOMAIN}`;
const APP_HOST = `app.${ROOT_DOMAIN}`;
const WWW_HOST = `www.${ROOT_DOMAIN}`;
const COOKIE_DOMAIN = `.${ROOT_DOMAIN}`;

const AUTH_ALLOWED_PREFIXES = ["/sign-in", "/sign-up", "/auth/"];

function isHelloClaudia(host: string) {
  return host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`);
}

function isAuthPath(pathname: string) {
  return AUTH_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;
  const onHelloClaudia = isHelloClaudia(host);

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            const opts: Record<string, unknown> = { ...(options ?? {}) };
            if (onHelloClaudia) opts.domain = COOKIE_DOMAIN;
            supabaseResponse.cookies.set(name, value, opts as any);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // API & static — never gate
  if (pathname.startsWith("/api/") || pathname.startsWith("/widget")) {
    return supabaseResponse;
  }

  // Dev (localhost, vercel preview): original behaviour with relative redirects
  if (!onHelloClaudia) {
    if (!user && pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
    if (user && (pathname === "/sign-in" || pathname === "/sign-up")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Prod host routing
  const signInUrl = new URL("/sign-in", `https://${AUTH_HOST}`);
  const dashboardUrl = new URL("/dashboard", `https://${APP_HOST}`);

  if (host === AUTH_HOST) {
    if (user && (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/")) {
      return NextResponse.redirect(dashboardUrl);
    }
    if (!isAuthPath(pathname)) {
      return NextResponse.redirect(signInUrl);
    }
    return supabaseResponse;
  }

  if (host === APP_HOST) {
    if (!user) {
      return NextResponse.redirect(signInUrl);
    }
    if (isAuthPath(pathname)) {
      return NextResponse.redirect(dashboardUrl);
    }
    return supabaseResponse;
  }

  // www or apex — marketing host
  if (host === WWW_HOST || host === ROOT_DOMAIN) {
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL(pathname, `https://${AUTH_HOST}`));
    }
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(pathname, `https://${APP_HOST}`));
    }
  }

  return supabaseResponse;
}
