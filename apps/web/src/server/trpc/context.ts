import type { Context } from "./init";

// For now, extract user info from headers (will be replaced by Clerk)
export async function createContext(opts: { headers: Headers }): Promise<Context> {
  // TODO: Replace with Clerk auth
  const userId = opts.headers.get("x-user-id");
  const orgId = opts.headers.get("x-org-id");

  return {
    userId,
    orgId,
  };
}
