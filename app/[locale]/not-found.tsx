import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container-max flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-bold text-brand-blue">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-charcoal-600">{t("body")}</p>
      <Link href="/" className="btn mt-6">
        {t("backHome")}
      </Link>
    </div>
  );
}
