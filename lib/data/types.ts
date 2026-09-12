/**
 * Shared types for the mock data layer.
 *
 * Every function in `lib/data/*` is deliberately `async`, even though it
 * currently just reads a local fixture, so call sites already look exactly
 * like they will once these bodies become WPGraphQL requests in Phase 2 --
 * only the function bodies change, never the call sites.
 */

export type Locale = "hy" | "en";

/** A piece of content authored in both supported locales. */
export interface LocalizedText {
  hy: string;
  en: string;
}

export function resolveLocalizedText(value: LocalizedText, locale: Locale): string {
  return value[locale] ?? value.hy;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
