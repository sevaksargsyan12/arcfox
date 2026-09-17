import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsListItem } from "@/lib/data/news";

export function NewsCard({ item }: { item: NewsListItem }) {
  const t = useTranslations("common.buttons");
  const locale = useLocale();

  return (
    <Link href={`/news/${item.slug}`} className="news-card group block">
      {item.imageUrl && (
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <p className="mt-3 text-xs uppercase tracking-wide text-charcoal-500">
        {new Date(item.date).toLocaleDateString(locale)}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{item.title}</h3>
      {item.excerpt && <p className="mt-1 text-sm text-charcoal-600">{item.excerpt}</p>}
      <span className="mt-2 inline-block text-sm font-semibold text-brand-blue">{t("readMore")}</span>
    </Link>
  );
}
