import { defineRouting } from "next-intl/routing";

/**
 * Central locale configuration.
 *
 * `hy` (Armenian) is the default locale and is served with NO URL prefix
 * (e.g. `/models/one`). `en` is the secondary locale and is served under
 * an `/en` prefix (e.g. `/en/models/one`).
 *
 * This is the deliberate INVERSE of the reference Nuxt project, which
 * defaults to `en`. Do not "fix" this back — it's an explicit requirement.
 */
export const routing = defineRouting({
  locales: ["hy", "en"],
  defaultLocale: "hy",
  localePrefix: "as-needed",
  // Without this, next-intl negotiates a locale from the browser's
  // Accept-Language header and redirects "/" to "/en" for English-language
  // browsers -- which would silently defeat "hy is the default locale,
  // always served unprefixed at /".
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
