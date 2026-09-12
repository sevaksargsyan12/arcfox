import legalFixture from "./fixtures/legal.json";
import { Locale, resolveLocalizedText } from "./types";

export async function getPrivacyStatementHtml(locale: Locale): Promise<string> {
  return resolveLocalizedText(legalFixture.privacy, locale);
}

export async function getOfficialStatementHtml(locale: Locale): Promise<string> {
  return resolveLocalizedText(legalFixture.official, locale);
}
