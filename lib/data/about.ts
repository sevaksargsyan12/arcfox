import aboutFixture from "./fixtures/about.json";
import { Locale, resolveLocalizedText } from "./types";
import { GET_ABOUT_PAGE, mediaUrl, wpGraphqlRequest, WpAboutPageResponse } from "./wpgraphql";

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

// --- About page (real WPGraphQL "aboutPage" ACF group) ----------------------
// Comes entirely from the real WPGraphQL backend -- there is no mock/
// placeholder fallback, same convention as lib/data/home.ts. If the backend
// is unreachable, `getAboutPage` returns `null` and the page simply doesn't
// render (see app/[locale]/about/page.tsx) rather than showing fake content.

export interface AboutBrandPhilosophyItem {
  title: string | null;
  content: string | null;
  imageUrl: string | null;
}

export interface AboutMetric {
  title: string | null;
  content: string | null;
}

export interface AboutPageContent {
  heroImageUrl: string | null;
  heroImageMobileUrl: string | null;
  heroText: string | null;

  biTitle: string | null;
  biSubtitle: string | null;
  biText: string | null;
  biImageUrl: string | null;

  bpTitle: string | null;
  bpItems: AboutBrandPhilosophyItem[];

  gpTitle: string | null;
  gpSubtitle: string | null;
  gpContent: string | null;
  gpImageUrl: string | null;
  metrics: AboutMetric[];

  footerTitle: string | null;
  // Renamed from the raw `footerContent` field: this is the one WYSIWYG
  // field on this page (everything else is plain text) -- the `Html` suffix
  // makes it obvious at every call site that it must go through
  // sanitizeHtml(), never be treated like the plain-text fields above it.
  footerContentHtml: string | null;
  footerImageUrl: string | null;
  footerImageMobileUrl: string | null;
}

// The one confirmed-reachable starting slug -- resolved to whichever real
// locale it happens to be via `translations[]`, same as getHomePage/
// getModelBySlug. Never hardcode which locale "about" itself maps to, even
// though "about"/"about-hy" happens to follow the same convention observed
// on Models and Home.
const ABOUT_SLUG = "about";

function normalizeAboutPage(
  raw: NonNullable<WpAboutPageResponse["page"]>["aboutPage"]
): AboutPageContent {
  return {
    heroImageUrl: mediaUrl(raw.heroImage),
    heroImageMobileUrl: mediaUrl(raw.heroImageMobile),
    heroText: raw.heroText,

    biTitle: raw.biTitle,
    biSubtitle: raw.biSubtitle,
    biText: raw.biText,
    biImageUrl: mediaUrl(raw.biImage),

    bpTitle: raw.bpTitle,
    bpItems: (raw.bpItems ?? []).map((item) => ({
      title: item.itemTitle,
      content: item.itemContent,
      imageUrl: mediaUrl(item.itemImage),
    })),

    gpTitle: raw.gpTitle,
    gpSubtitle: raw.gpSubtitle,
    gpContent: raw.gpContent,
    gpImageUrl: mediaUrl(raw.gpImage),
    metrics: (raw.metrics ?? []).map((m) => ({
      title: m.metricTitle,
      content: m.metricContent,
    })),

    footerTitle: raw.footerTitle,
    footerContentHtml: raw.footerContent,
    footerImageUrl: mediaUrl(raw.footerImage),
    footerImageMobileUrl: mediaUrl(raw.footerImageMobile),
  };
}

export async function getAboutPage(locale: Locale): Promise<AboutPageContent | null> {
  const result = await wpGraphqlRequest<WpAboutPageResponse>(GET_ABOUT_PAGE, { slug: ABOUT_SLUG });
  const page = result?.page;
  if (!page) return null;

  if (page.language.code.toLowerCase() === locale) {
    return normalizeAboutPage(page.aboutPage);
  }

  // Wrong locale -- resolve the correct slug via `translations[]` (never
  // string-manipulate the slug) and re-query.
  const match = page.translations.find((t) => t.language.code.toLowerCase() === locale);
  if (!match) return null;

  const translated = await wpGraphqlRequest<WpAboutPageResponse>(GET_ABOUT_PAGE, { slug: match.slug });
  if (!translated?.page) return null;
  return normalizeAboutPage(translated.page.aboutPage);
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
