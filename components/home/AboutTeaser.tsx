import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/lib/data/types";

export async function AboutTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.aboutSection" });

  return (
    <section className="container-max py-16 text-center md:py-24">
      <h2 className="font-display text-3xl font-bold md:text-4xl">{t("title")}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-charcoal-600">{t("body")}</p>
      <Link href="/about" className="btn mt-6 inline-flex">
        {t("cta")}
      </Link>
    </section>
  );
}
