import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NewsListItem } from "@/lib/data/news";
import { NewsCard } from "@/components/news/NewsCard";
import { Locale } from "@/lib/data/types";

export async function NewsSection({ items, locale }: { items: NewsListItem[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.newsSection" });

  return (
    <section className="home-news bg-form-bg py-16 md:py-24">
      <div className="container-max">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <Link href="/news" className="hidden text-sm font-semibold text-brand-blue md:block">
            {t("cta")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
