import { Locale, resolveLocalizedText } from "./types";

export interface SiteConfig {
  siteName: string;
  contactEmail: string;
  /** Both numbers shown in the footer, in display order. */
  phones: string[];
  address: string;
  socialLinks: { platform: "facebook" | "instagram"; url: string }[];
  legalLine: string;
}

const ADDRESS: Record<Locale, string> = {
  hy: "Դավիթ Բեկ փողոց 138/4 | Ռուբինյանց 40/3 | Երևան, Հայաստան",
  en: "Davit-Bek Street 138/4 | Rubinyants 40/3 | Yerevan, Armenia",
};

const LEGAL_LINE: Record<Locale, string> = {
  hy: "© 2026 Veylor Motors։ Բոլոր իրավունքները պաշտպանված են։",
  en: "© 2026 Veylor Motors. All rights reserved.",
};

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  return {
    siteName: "Veylor",
    contactEmail: "info@e-auto.am",
    phones: ["+374 10 330 330", "+374 91 330 330"],
    address: resolveLocalizedText(ADDRESS, locale),
    socialLinks: [
      { platform: "facebook", url: "https://www.facebook.com/arcfox.am" },
      { platform: "instagram", url: "https://www.instagram.com/arcfox.armenia/" },
    ],
    legalLine: resolveLocalizedText(LEGAL_LINE, locale),
  };
}
