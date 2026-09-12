import { getTranslations, setRequestLocale } from "next-intl/server";
import { getContactProblemTypes, getCountryOptions, getGenderOptions } from "@/lib/data/options";
import { Locale } from "@/lib/data/types";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [t, genders, countries, problemTypes] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getGenderOptions(typedLocale),
    getCountryOptions(typedLocale),
    getContactProblemTypes(typedLocale),
  ]);

  return (
    <div className="container-max py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-4 text-charcoal-600">{t("subtitle")}</p>
      </div>

      <div className="mt-14">
        <ContactForm genders={genders} countries={countries} problemTypes={problemTypes} />
      </div>
    </div>
  );
}
