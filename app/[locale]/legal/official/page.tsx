import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOfficialStatementHtml } from "@/lib/data/legal";
import { Locale } from "@/lib/data/types";

export default async function OfficialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, html] = await Promise.all([
    getTranslations({ locale, namespace: "legal" }),
    getOfficialStatementHtml(locale as Locale),
  ]);

  return (
    <div className="legal-official-page container-max max-w-3xl py-16 md:py-24">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{t("officialTitle")}</h1>
      <div className="g-html mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
