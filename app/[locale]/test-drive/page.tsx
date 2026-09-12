import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCountryOptions, getGenderOptions } from "@/lib/data/options";
import { getModelSummaries } from "@/lib/data/models";
import { Locale } from "@/lib/data/types";
import { TestDriveForm } from "@/components/test-drive/TestDriveForm";

export default async function TestDrivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [t, countries, genders, models] = await Promise.all([
    getTranslations({ locale, namespace: "testDrive" }),
    getCountryOptions(typedLocale),
    getGenderOptions(typedLocale),
    getModelSummaries(typedLocale),
  ]);

  return (
    <div className="container-max py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-4 text-charcoal-600">{t("subtitle")}</p>
      </div>

      <div className="mt-14">
        <TestDriveForm countries={countries} genders={genders} models={models} />
      </div>
    </div>
  );
}
