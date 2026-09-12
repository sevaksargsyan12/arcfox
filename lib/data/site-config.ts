import { Locale, resolveLocalizedText } from "./types";

export interface SiteConfig {
  siteName: string;
  contactEmail: string;
  address: string;
  socialLinks: { platform: "facebook" | "instagram" | "linkedin" | "youtube"; url: string }[];
  legalLine: string;
}

const ADDRESS: Record<Locale, string> = {
  hy: "Վեյլոր Մոթորս, Կենտրոնական պուրակ 12, Երևան",
  en: "Veylor Motors, 12 Central Park Avenue, Yerevan",
};

const LEGAL_LINE: Record<Locale, string> = {
  hy: "© 2026 Veylor Motors։ Բոլոր իրավունքները պաշտպանված են։",
  en: "© 2026 Veylor Motors. All rights reserved.",
};

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  return {
    siteName: "Veylor",
    contactEmail: "hello@veylor-motors.example",
    address: resolveLocalizedText(ADDRESS, locale),
    socialLinks: [
      { platform: "facebook", url: "#" },
      { platform: "instagram", url: "#" },
      { platform: "linkedin", url: "#" },
      { platform: "youtube", url: "#" },
    ],
    legalLine: resolveLocalizedText(LEGAL_LINE, locale),
  };
}
