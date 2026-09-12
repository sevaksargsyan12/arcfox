import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getNewsById, getNewsIds } from "@/lib/data/news";
import { Locale } from "@/lib/data/types";
import { Link } from "@/i18n/navigation";

export async function generateStaticParams() {
  const ids = await getNewsIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const item = await getNewsById(id, locale as Locale);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [item, t, tCommon] = await Promise.all([
    getNewsById(id, locale as Locale),
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "common.buttons" }),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <article className="container-max max-w-3xl py-16 md:py-24">
      <Link href="/news" className="text-sm font-medium text-brand-blue">
        &larr; {tCommon("backToList")}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wide text-charcoal-500">
        {t("publishedOn")} {new Date(item.publishedAt).toLocaleDateString(locale)}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{item.title}</h1>

      <div className="mt-8 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.title} className="aspect-[16/9] w-full object-cover" />
      </div>

      <div className="g-html mt-10" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
    </article>
  );
}
