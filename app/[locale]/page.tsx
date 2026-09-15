import { setRequestLocale } from "next-intl/server";
import { getModelsByLocale } from "@/lib/data/models";
import { getFeaturedNews } from "@/lib/data/news";
import { Locale } from "@/lib/data/types";
import { Hero } from "@/components/home/Hero";
import { ModelsSection } from "@/components/home/ModelsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [models, news] = await Promise.all([
    getModelsByLocale(typedLocale),
    getFeaturedNews(typedLocale, 3),
  ]);

  return (
    <>
      <Hero models={models.slice(0, 3)} />
      <ModelsSection models={models} locale={typedLocale} />
      <NewsSection items={news} locale={typedLocale} />
      <AboutTeaser locale={typedLocale} />
    </>
  );
}
