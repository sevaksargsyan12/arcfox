"use client";

import { Suspense } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

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

  return (
    <div className="flex items-center gap-1 text-sm font-medium" aria-label={label}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-40">/</span>}
          <Link
            href={href}
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
