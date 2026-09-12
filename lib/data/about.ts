import aboutFixture from "./fixtures/about.json";
import { Locale, resolveLocalizedText } from "./types";

interface HeroRaw {
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  imageUrl: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  imageUrl: string;
}

function resolveHero(raw: HeroRaw, locale: Locale): Hero {
  return {
    title: resolveLocalizedText(raw.title, locale),
    subtitle: resolveLocalizedText(raw.subtitle, locale),
    imageUrl: raw.imageUrl,
  };
}

export interface AboutSection {
  heading: string;
  body: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutContent {
  hero: Hero;
  sections: AboutSection[];
  stats: AboutStat[];
}

export async function getAboutContent(locale: Locale): Promise<AboutContent> {
  const raw = aboutFixture.overview;
  return {
    hero: resolveHero(raw.hero, locale),
    sections: raw.sections.map((s) => ({
      heading: resolveLocalizedText(s.heading, locale),
      body: resolveLocalizedText(s.body, locale),
    })),
    stats: raw.stats.map((s) => ({ value: s.value, label: resolveLocalizedText(s.label, locale) })),
  };
}

export interface PartnerTimelineEntry {
  year: string;
  label: string;
}

export interface Partner {
  name: string;
  description: string;
  timeline: PartnerTimelineEntry[];
}

export interface PartnersContent {
  hero: Hero;
  intro: AboutSection;
  partners: Partner[];
}

export async function getPartnersContent(locale: Locale): Promise<PartnersContent> {
  const raw = aboutFixture.partners;
  const history = raw.cooperationHistory as Record<
    string,
    { year: string; label: Record<Locale, string> }[]
  >;

  return {
    hero: resolveHero(raw.hero, locale),
    intro: {
      heading: resolveLocalizedText(raw.intro.heading, locale),
      body: resolveLocalizedText(raw.intro.body, locale),
    },
    partners: raw.list.map((p) => ({
      name: p.name,
      description: resolveLocalizedText(p.description, locale),
      timeline: (history[p.name] ?? []).map((entry) => ({
        year: entry.year,
        label: resolveLocalizedText(entry.label, locale),
      })),
    })),
  };
}
