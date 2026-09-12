import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ModelSummary } from "@/lib/data/models";

export function ModelCard({ model }: { model: ModelSummary }) {
  const t = useTranslations("common.buttons");

  return (
    <Link
      href={`/models/${model.slug}`}
      className="group block overflow-hidden rounded-2xl bg-form-bg transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={model.heroImageUrl}
          alt={model.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-charcoal-500">{model.bodyType}</p>
        <h3 className="mt-1 font-display text-xl font-semibold">{model.name}</h3>
        <p className="mt-1 text-sm text-charcoal-600">{model.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
          {t("viewDetails")}
        </span>
      </div>
    </Link>
  );
}
