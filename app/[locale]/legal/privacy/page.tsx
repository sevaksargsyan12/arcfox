import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPrivacyStatementHtml } from "@/lib/data/legal";
import { Locale } from "@/lib/data/types";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, html] = await Promise.all([
    getTranslations({ locale, namespace: "legal" }),
    getPrivacyStatementHtml(locale as Locale),
  ]);

  return (
    <div className="legal-privacy-page container-max max-w-3xl py-16 md:py-24">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{t("privacyTitle")}</h1>
      <div className="g-html mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
