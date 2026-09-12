import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFeaturedNews, getNewsCategories, getNewsList } from "@/lib/data/news";
import { Locale } from "@/lib/data/types";
import { Link } from "@/i18n/navigation";
import { NewsCard } from "@/components/news/NewsCard";
import { Pagination } from "@/components/ui/Pagination";

export default async function NewsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const page = Number(pageParam) || 1;

  const [t, tPagination, categories, featured, list] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "common.pagination" }),
    getNewsCategories(typedLocale),
    getFeaturedNews(typedLocale, 3),
    getNewsList(typedLocale, { page, pageSize: 6, categoryId: category }),
  ]);

  const totalPages = Math.ceil(list.total / list.pageSize) || 1;

  return (
    <div className="container-max py-16 md:py-24">
      <h1 className="text-center font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>

      {!category && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">{t("featuredTitle")}</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {featured.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        <Link
          href="/news"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !category ? "bg-brand-blue text-white" : "bg-form-bg text-charcoal-600 hover:bg-charcoal-500/10"
          }`}
        >
          {t("filterAll")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/news?category=${c.id}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === c.id ? "bg-brand-blue text-white" : "bg-form-bg text-charcoal-600 hover:bg-charcoal-500/10"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        {list.items.length === 0 ? (
          <p className="text-center text-charcoal-500">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {list.items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/news"
          extraQuery={{ category }}
          prevLabel={tPagination("prev")}
          nextLabel={tPagination("next")}
        />
      </section>
    </div>
  );
}
