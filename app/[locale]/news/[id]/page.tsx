import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getNewsBySlug, getNewsList } from "@/lib/data/news";
import { Locale } from "@/lib/data/types";
import { routing } from "@/i18n/routing";
import { Link, redirect } from "@/i18n/navigation";
import { sanitizeHtml } from "@/lib/sanitize-html";

// The `[id]` segment holds a post's real WP `slug`, not a numeric id -- kept
// named "id" to avoid a route-folder rename, same value shape as models'
// `[slug]` segment elsewhere in this codebase.

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const items = await getNewsList(locale);
      return items.map((item) => ({ locale, id: item.slug }));
    })
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const item = await getNewsBySlug(id, locale as Locale);
  if (!item) return {};
  return { title: item.title, description: item.excerpt ?? undefined };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [item, t, tCommon] = await Promise.all([
    getNewsBySlug(id, locale as Locale),
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "common.buttons" }),
  ]);

  if (!item) {
    notFound();
  }

  // Requested slug resolved to a different (translated) one -- keep the URL
  // in sync with the canonical locale-specific slug, same convention as the
  // Model detail page.
  if (item.slug !== id) {
    redirect({ href: `/news/${item.slug}`, locale });
  }

  const publishedLabel = `${t("publishedOn")} ${new Date(item.date).toLocaleDateString(locale)}`;

  return (
    <article className="news-detail-page">
      {item.imageUrl ? (
        <div className="relative -mt-20 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt="" className="w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="container-max absolute inset-x-0 bottom-0 pb-10 text-white">
            <p className="text-xs uppercase tracking-wide text-white/75">{publishedLabel}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold md:text-5xl">{item.title}</h1>
          </div>
        </div>
      ) : (
        <div className="container-max max-w-3xl pt-16 md:pt-24">
          <p className="text-xs uppercase tracking-wide text-charcoal-500">{publishedLabel}</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{item.title}</h1>
        </div>
      )}

      <div className="container-max max-w-3xl py-10 md:py-16">
        <Link href="/news" className="text-sm font-medium text-brand-blue">
          &larr; {tCommon("backToList")}
        </Link>

        {item.contentHtml ? (
          <div
            className="g-html mt-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.contentHtml) }}
          />
        ) : (
          item.excerpt && <p className="mt-8 text-charcoal-600">{item.excerpt}</p>
        )}
      </div>
    </article>
  );
}
