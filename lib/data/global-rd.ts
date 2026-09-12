import globalRdFixture from "./fixtures/global-rd.json";
import { Locale, resolveLocalizedText } from "./types";
import { Hero } from "./about";

export type GlobalRdKey = "design" | "capability" | "battery";

export interface GlobalRdSection {
  key: GlobalRdKey;
  hero: Hero;
  sections: { heading: string; body: string }[];
}

const RAW = globalRdFixture as Record<
  GlobalRdKey,
  {
    hero: { title: Record<Locale, string>; subtitle: Record<Locale, string>; imageUrl: string };
    sections: { heading: Record<Locale, string>; body: Record<Locale, string> }[];
  }
>;

export async function getGlobalRdSection(
  key: GlobalRdKey,
  locale: Locale
): Promise<GlobalRdSection> {
  const raw = RAW[key];
  return {
    key,
    hero: {
      title: resolveLocalizedText(raw.hero.title, locale),
      subtitle: resolveLocalizedText(raw.hero.subtitle, locale),
      imageUrl: raw.hero.imageUrl,
    },
    sections: raw.sections.map((s) => ({
      heading: resolveLocalizedText(s.heading, locale),
      body: resolveLocalizedText(s.body, locale),
    })),
  };
}

export async function getGlobalRdOverview(locale: Locale): Promise<GlobalRdSection[]> {
  return Promise.all(
    (["design", "capability", "battery"] as GlobalRdKey[]).map((key) =>
      getGlobalRdSection(key, locale)
    )
  );
}
