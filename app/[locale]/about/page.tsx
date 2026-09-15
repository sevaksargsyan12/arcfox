import { setRequestLocale } from "next-intl/server";
import { getAboutContent } from "@/lib/data/about";
import { Locale } from "@/lib/data/types";
import { PageHero } from "@/components/ui/PageHero";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getAboutContent(locale as Locale);

  return (
    <>
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} imageUrl={content.hero.imageUrl} />

      <div className="about-page container-max flex flex-col gap-16 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {content.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-form-bg p-8 text-center">
              <p className="font-display text-4xl font-bold text-brand-blue">{stat.value}</p>
              <p className="mt-2 text-sm text-charcoal-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {content.sections.map((section, i) => (
          <div
            key={section.heading}
            className={`flex flex-col items-center gap-8 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">{section.heading}</h2>
              <p className="mt-4 text-charcoal-600">{section.body}</p>
            </div>
            <div className="aspect-[4/3] w-full flex-1 overflow-hidden rounded-2xl bg-charcoal-800/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about/map.svg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
