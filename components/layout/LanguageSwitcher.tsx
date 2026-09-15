"use client";

import { Suspense } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useModelTranslations } from "./ModelTranslationsContext";

const MODEL_DETAIL_PATTERN = /^\/models\/([^/]+)$/;

const LOCALE_LABELS: Record<string, string> = { hy: "ՀԱՅ", en: "EN" };

/**
 * Locale toggle that round-trips from the current page: switching from
 * `/models/one` lands on `/en/models/one`, not `/en`.
 *
 * `useSearchParams()` opts a client component out of static rendering
 * unless wrapped in Suspense, so the actual implementation is isolated in
 * `LanguageSwitcherInner` and only that is suspended -- the rest of the
 * page (built with `generateStaticParams`) still prerenders normally.
 */
export function LanguageSwitcher({ label }: { label: string }) {
  return (
    <Suspense fallback={<span className="text-sm font-medium opacity-60">{LOCALE_LABELS.hy}</span>}>
      <LanguageSwitcherInner label={label} />
    </Suspense>
  );
}

function LanguageSwitcherInner({ label }: { label: string }) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;
  const modelTranslations = useModelTranslations();

  // On a model detail page whose CMS translations we know about, resolve
  // the *other* locale's real slug instead of assuming the path is
  // locale-invariant (it isn't, for real CMS models -- e.g. kaola-s vs
  // kaola-s-hy). Falls through to the generic path-preserving behavior for
  // every other page, and for mock models (which never register here).
  const modelSlugMatch = MODEL_DETAIL_PATTERN.exec(pathname);
  const isCurrentModel = modelSlugMatch && modelTranslations?.currentSlug === modelSlugMatch[1];

  function hrefForLocale(locale: string): string {
    if (isCurrentModel) {
      const translated = modelTranslations!.translations.find((t) => t.locale === locale);
      if (translated) return `/models/${translated.slug}`;
    }
    return href;
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium" aria-label={label}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-40">/</span>}
          <Link
            href={hrefForLocale(locale)}
            locale={locale}
            aria-current={locale === activeLocale}
            className={locale === activeLocale ? "font-semibold" : "opacity-60 hover:opacity-100"}
          >
            {LOCALE_LABELS[locale] ?? locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
