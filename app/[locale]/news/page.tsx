import { getTranslations, setRequestLocale } from "next-intl/server";
import { getNewsList } from "@/lib/data/news";
import { Locale } from "@/lib/data/types";
import { NewsCard } from "@/components/news/NewsCard";

export default async function NewsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [t, items] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getNewsList(typedLocale),
  ]);

  return (
    <div className="news-page container-max py-16 md:py-24">
      <h1 className="text-center font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-charcoal-500">{t("empty")}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
