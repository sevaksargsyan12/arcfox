import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGlobalRdOverview } from "@/lib/data/global-rd";
import { Locale } from "@/lib/data/types";
import { Link } from "@/i18n/navigation";

export default async function GlobalRdOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [sections, t] = await Promise.all([
    getGlobalRdOverview(locale as Locale),
    getTranslations({ locale, namespace: "globalRd" }),
  ]);

  return (
    <div className="global-rd-page container-max py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-4 text-charcoal-600">{t("overviewSubtitle")}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.key}
            href={`/global-rd/${section.key}`}
            className="group block overflow-hidden rounded-2xl bg-form-bg"
          >
            <div className="aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.hero.imageUrl}
                alt={section.hero.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-charcoal-500">{section.hero.subtitle}</p>
              <h2 className="mt-1 font-display text-xl font-semibold">{section.hero.title}</h2>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-blue">{t("cardCta")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
