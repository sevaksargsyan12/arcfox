import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ModelSummary } from "@/lib/data/models";
import { ModelCard } from "@/components/models/list/ModelCard";
import { Locale } from "@/lib/data/types";

export async function ModelsSection({ models, locale }: { models: ModelSummary[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.modelsSection" });

  return (
    <section className="container-max py-16 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl font-bold md:text-4xl">{t("title")}</h2>
        <Link href="/models" className="hidden text-sm font-semibold text-brand-blue md:block">
          {t("cta")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {models.map((model) => (
          <ModelCard key={model.slug} model={model} />
        ))}
      </div>
      <Link href="/models" className="mt-8 block text-center text-sm font-semibold text-brand-blue md:hidden">
        {t("cta")}
      </Link>
    </section>
  );
}
