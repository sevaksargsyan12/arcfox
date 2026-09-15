import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPartnersContent } from "@/lib/data/about";
import { Locale } from "@/lib/data/types";
import { PageHero } from "@/components/ui/PageHero";
import { CooperationTimeline } from "@/components/about/CooperationTimeline";
import { Reveal } from "@/components/ui/Reveal";

// Real partner names + a placeholder banner per deep-dive partner, keyed the
// same way as lib/data/fixtures/about.json's `cooperationHistory`.
const DEEP_DIVE_BANNERS: Record<string, string> = {
  HUAWEI: "/images/partners/huawei-banner.svg",
  MAGNA: "/images/partners/magna-banner.svg",
};

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

  const deepDivePartners = content.partners.filter((p) => p.timeline.length > 0);

  return (
    <>
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} imageUrl={content.hero.imageUrl} />

      <div className="partners-page container-max flex flex-col gap-20 py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{content.intro.heading}</h2>
          <p className="mt-4 text-charcoal-600">{content.intro.body}</p>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-center font-display text-2xl font-semibold">{t("gridTitle")}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {content.partners.map((partner, i) => (
              <Reveal key={partner.name} delayMs={(i % 4) * 80} className="rounded-2xl bg-form-bg p-6">
                <p className="font-display text-lg font-bold tracking-wide">{partner.name}</p>
                <p className="mt-2 text-sm text-charcoal-600">{partner.description}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {deepDivePartners.map((partner) => (
          <Reveal key={partner.name} className="overflow-hidden rounded-2xl bg-form-bg">
            <div className="relative flex h-56 items-end overflow-hidden md:h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEEP_DIVE_BANNERS[partner.name]}
                alt={partner.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="relative z-10 p-6 font-display text-2xl font-bold text-white md:text-3xl">
                {partner.name}
              </p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm text-charcoal-600">{partner.description}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                {t("timelineTitle")}
              </p>
              <CooperationTimeline entries={partner.timeline} />
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
