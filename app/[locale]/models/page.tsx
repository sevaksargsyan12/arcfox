import { getTranslations, setRequestLocale } from "next-intl/server";
import { getModelsByLocale } from "@/lib/data/models";
import { Locale } from "@/lib/data/types";
import { ModelCard } from "@/components/models/list/ModelCard";

export default async function ModelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [t, models] = await Promise.all([
    getTranslations({ locale, namespace: "models" }),
    getModelsByLocale(typedLocale),
  ]);

  return (
    <div className="models-page container-max py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("listTitle")}</h1>
        <p className="mt-4 text-charcoal-600">{t("listSubtitle")}</p>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {models.map((model) => (
          <div key={model.slug} className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.125rem)]">
            <ModelCard model={model} />
          </div>
        ))}
      </div>
    </div>
  );
}
