export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
export const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL?.replace(/\/$/, "") ?? "";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";

function join(base: string, path: string) {
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function signInHref(next?: string) {
  const path = next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in";
  return AUTH_URL ? join(AUTH_URL, path) : path;
}

export function signUpHref(next?: string) {
  const path = next ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up";
  return AUTH_URL ? join(AUTH_URL, path) : path;
}

export function dashboardHref(path: string = "") {
  const full = path ? `/dashboard${path.startsWith("/") ? path : `/${path}`}` : "/dashboard";
  return APP_URL ? join(APP_URL, full) : full;
}
