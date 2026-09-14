import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getModelBySlug, getModelSlugs } from "@/lib/data/models";
import { Locale } from "@/lib/data/types";
import { Hero } from "@/components/models/detail/Hero";
import { ColorPicker } from "@/components/models/detail/ColorPicker";
import { SpecsGrid } from "@/components/models/detail/SpecsGrid";
import { ExteriorGallery } from "@/components/models/detail/ExteriorGallery";
import { InteriorGallery } from "@/components/models/detail/InteriorGallery";
import { FeatureHighlights } from "@/components/models/detail/FeatureHighlights";

export async function generateStaticParams() {
  const slugs = await getModelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const model = await getModelBySlug(slug, locale as Locale);
  if (!model) return {};
  return { title: model.name, description: model.description };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [model, t] = await Promise.all([
    getModelBySlug(slug, typedLocale),
    getTranslations({ locale, namespace: "models" }),
  ]);

  if (!model) {
    notFound();
  }

  return (
    <>
      <Hero
        images={model.hero.images}
        name={model.name}
        tagline={model.tagline}
        bodyType={model.bodyType}
      />

      <div className="container-max flex flex-col gap-16 py-16 md:gap-24 md:py-24">
        <p className="mx-auto max-w-2xl text-center text-charcoal-600">{model.description}</p>

        <ColorPicker
          colors={model.colors}
          modelName={model.name}
          colorsTitle={t("colorsTitle")}
          spinHint={t("spinHint")}
        />

        <SpecsGrid
          specs={model.specs}
          title={t("specsTitle")}
          labels={{
            length: t("specs.length"),
            width: t("specs.width"),
            height: t("specs.height"),
            wheelbase: t("specs.wheelbase"),
          }}
        />

        <FeatureHighlights features={model.featureHighlights} title={t("featuresTitle")} />

        <ExteriorGallery images={model.exteriorGallery} title={t("galleryTitle")} alt={model.name} />

        <InteriorGallery images={model.interiorGallery} title={t("interiorTitle")} alt={model.name} />

        <div className="flex flex-col items-center gap-4 text-center">
          {/* Plain anchor: a same-page hash link, not an internal route the
              locale-aware Link needs to resolve. */}
          <a href={model.specSheet.anchor} className="btn-outline">
            {t("specSheetCta")}
          </a>
        </div>
      </div>
    </>
  );
}
