import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Next.js 16 renamed the `middleware.ts` file/export convention to
 * `proxy.ts` / `proxy`. `middleware.ts` still works but is deprecated, so
 * we use the new name directly rather than porting the old one.
 */
export function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip Next.js internals, API routes (none exist yet, kept for Phase 2),
  // and any request for a file with an extension (images, favicon, etc.).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
