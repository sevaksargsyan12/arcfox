import { Locale, resolveLocalizedText, SelectOption } from "./types";
import { getModelSummaries } from "./models";

export interface Country {
  id: string;
  name: string;
}

const COUNTRIES: Record<Locale, string>[] = [
  { hy: "Հայաստան", en: "Armenia" },
  { hy: "Գերմանիա", en: "Germany" },
  { hy: "Ֆրանսիա", en: "France" },
  { hy: "Իսպանիա", en: "Spain" },
  { hy: "Իտալիա", en: "Italy" },
  { hy: "Միացյալ Թագավորություն", en: "United Kingdom" },
  { hy: "Միացյալ Արաբական Էմիրություններ", en: "United Arab Emirates" },
  { hy: "Սաուդյան Արաբիա", en: "Saudi Arabia" },
  { hy: "Կատար", en: "Qatar" },
  { hy: "Սինգապուր", en: "Singapore" },
  { hy: "Ճապոնիա", en: "Japan" },
  { hy: "Ամերիկայի Միացյալ Նահանգներ", en: "United States" },
  { hy: "Կանադա", en: "Canada" },
  { hy: "Այլ", en: "Other" },
];

const GENDER_OPTIONS: Record<Locale, string>[] = [
  { hy: "Պրն.", en: "Mr." },
  { hy: "Տկն.", en: "Ms." },
  { hy: "Այլ", en: "Other" },
];

const PROBLEM_TYPES: { value: string; label: Record<Locale, string> }[] = [
  { value: "general", label: { hy: "Ընդհանուր հարցում", en: "General inquiry" } },
  { value: "sales", label: { hy: "Վաճառք", en: "Sales" } },
  { value: "after-sales", label: { hy: "Հետավաճառքային սպասարկում", en: "After Sales" } },
  { value: "media", label: { hy: "Մամուլ", en: "Media" } },
  { value: "other", label: { hy: "Այլ", en: "Other" } },
];

export async function getCountries(locale: Locale): Promise<Country[]> {
  return COUNTRIES.map((c, i) => ({ id: String(i), name: resolveLocalizedText(c, locale) }));
}

export async function getCountryOptions(locale: Locale): Promise<SelectOption[]> {
  return (await getCountries(locale)).map((c) => ({ value: c.name, label: c.name }));
}

export async function getGenderOptions(locale: Locale): Promise<SelectOption[]> {
  return GENDER_OPTIONS.map((g) => {
    const label = resolveLocalizedText(g, locale);
    return { value: label, label };
  });
}

export async function getContactProblemTypes(locale: Locale): Promise<SelectOption[]> {
  return PROBLEM_TYPES.map((p) => ({ value: p.value, label: resolveLocalizedText(p.label, locale) }));
}

export async function getTestDriveModelOptions(locale: Locale): Promise<SelectOption[]> {
  const models = await getModelSummaries(locale);
  return models.map((m) => ({ value: m.slug, label: m.name }));
}
