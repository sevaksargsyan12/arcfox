import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPartnersContent } from "@/lib/data/about";
import { Locale } from "@/lib/data/types";
import { PageHero } from "@/components/ui/PageHero";
import { CooperationTimeline } from "@/components/about/CooperationTimeline";

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [content, t] = await Promise.all([
    getPartnersContent(locale as Locale),
    getTranslations({ locale, namespace: "partners" }),
  ]);

  return (
    <>
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} imageUrl={content.hero.imageUrl} />

      <div className="container-max flex flex-col gap-16 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{content.intro.heading}</h2>
          <p className="mt-4 text-charcoal-600">{content.intro.body}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {content.partners.map((partner) => (
            <div key={partner.name} className="rounded-2xl bg-form-bg p-8">
              <h3 className="font-display text-xl font-semibold">{partner.name}</h3>
              <p className="mt-2 text-sm text-charcoal-600">{partner.description}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                {t("timelineTitle")}
              </p>
              <CooperationTimeline entries={partner.timeline} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
