import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getModelBySlug, getModelsByLocale } from "@/lib/data/models";
import { Locale } from "@/lib/data/types";
import { routing } from "@/i18n/routing";
import { redirect } from "@/i18n/navigation";
import { PageBuilder } from "@/components/models/pageBuilder/PageBuilder";
import { ModelTranslationsRegistrar } from "@/components/layout/ModelTranslationsContext";

export async function generateStaticParams() {
  // Slugs are NOT locale-invariant (e.g. `kaola-s` vs `kaola-s-hy`), so this
  // returns the full { locale, slug } combination itself rather than bare
  // `{ slug }` relying on Next's cross-product with the parent layout's
  // locale-only params.
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const models = await getModelsByLocale(locale);
      return models.map((m) => ({ locale, slug: m.slug }));
    })
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const model = await getModelBySlug(slug, locale as Locale);
  if (!model) return {};
  return { title: model.name, description: model.tagline };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const model = await getModelBySlug(slug, locale as Locale);

  if (!model) {
    notFound();
  }

  // The requested slug might have belonged to the other locale's post (it
  // was resolved via `translations`, not string manipulation) -- keep
  // exactly one canonical URL per locale per model rather than rendering
  // under both.
  if (model.slug !== slug) {
    redirect({ href: `/models/${model.slug}`, locale });
  }

  return (
    <div className="model-detail-page">
      <ModelTranslationsRegistrar currentSlug={model.slug} translations={model.translations} />
      <PageBuilder sections={model.sections} />
    </div>
  );
}
