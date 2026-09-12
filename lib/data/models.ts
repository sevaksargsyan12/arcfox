import modelsFixture from "./fixtures/models.json";
import { Locale, resolveLocalizedText } from "./types";

export interface ModelColor {
  key: string;
  label: string;
  hex: string;
  /** Ordered frame URLs for the 360deg spin viewer, one per drag position. */
  spinFrames: string[];
}

export interface ModelSpecs {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
}

/**
 * Icon key rendered via lucide-react at the component layer. A simplification
 * over the brief's `imageUrl`-per-highlight shape -- avoids needing bespoke
 * photography for every feature callout while a real design/photo pipeline
 * doesn't exist yet. Swap for `imageUrl` in Phase 2 if real assets arrive.
 */
export type FeatureIconKey =
  | "battery"
  | "zap"
  | "shield-check"
  | "wind"
  | "volume-x"
  | "boxes"
  | "gauge"
  | "sparkles";

export interface ModelFeatureHighlight {
  icon: FeatureIconKey;
  title: string;
  description: string;
}

export interface ModelSummary {
  slug: string;
  name: string;
  tagline: string;
  bodyType: string;
  heroImageUrl: string;
  primaryColorHex: string;
}

export interface ModelDetail extends ModelSummary {
  description: string;
  hero: { images: string[] };
  colors: ModelColor[];
  specs: ModelSpecs;
  specSheet: { anchor: string; title: string; description: string };
  exteriorGallery: string[];
  interiorGallery: string[];
  featureHighlights: ModelFeatureHighlight[];
}

interface RawModel {
  slug: string;
  name: string;
  tagline: Record<Locale, string>;
  description: Record<Locale, string>;
  bodyType: Record<Locale, string>;
  colors: { key: string; label: Record<Locale, string>; hex: string }[];
  specs: ModelSpecs;
  featureHighlights: {
    icon: FeatureIconKey;
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }[];
}

const rawModels = modelsFixture as RawModel[];

const SHARED_INTERIOR_GALLERY = ["/images/interior/1.svg", "/images/interior/2.svg", "/images/interior/3.svg"];

function toModelDetail(raw: RawModel, locale: Locale): ModelDetail {
  const colors: ModelColor[] = raw.colors.map((color) => ({
    key: color.key,
    label: resolveLocalizedText(color.label, locale),
    hex: color.hex,
    spinFrames: Array.from(
      { length: 8 },
      (_, i) => `/spin/${raw.slug}/${color.key}/${i}.svg`
    ),
  }));

  return {
    slug: raw.slug,
    name: raw.name,
    tagline: resolveLocalizedText(raw.tagline, locale),
    bodyType: resolveLocalizedText(raw.bodyType, locale),
    heroImageUrl: `/images/models/${raw.slug}/hero.svg`,
    primaryColorHex: raw.colors[0].hex,
    description: resolveLocalizedText(raw.description, locale),
    hero: { images: [`/images/models/${raw.slug}/hero.svg`] },
    colors,
    specs: raw.specs,
    specSheet: {
      anchor: "#specs",
      title: locale === "hy" ? "Տեխնիկական բնութագրեր" : "Technical specifications",
      description:
        locale === "hy"
          ? "Ամբողջական տեխնիկական տվյալները հասանելի կլինեն վաճառքի կենտրոններում։"
          : "Full technical documentation is available through our sales centers.",
    },
    exteriorGallery: [1, 2, 3].map((i) => `/images/models/${raw.slug}/exterior-${i}.svg`),
    interiorGallery: SHARED_INTERIOR_GALLERY,
    featureHighlights: raw.featureHighlights.map((f) => ({
      icon: f.icon,
      title: resolveLocalizedText(f.title, locale),
      description: resolveLocalizedText(f.description, locale),
    })),
  };
}

export async function getModelSlugs(): Promise<string[]> {
  return rawModels.map((m) => m.slug);
}

export async function getModelSummaries(locale: Locale): Promise<ModelSummary[]> {
  return rawModels.map((raw) => {
    const detail = toModelDetail(raw, locale);
    return {
      slug: detail.slug,
      name: detail.name,
      tagline: detail.tagline,
      bodyType: detail.bodyType,
      heroImageUrl: detail.heroImageUrl,
      primaryColorHex: detail.primaryColorHex,
    };
  });
}

export async function getModelBySlug(
  slug: string,
  locale: Locale
): Promise<ModelDetail | null> {
  const raw = rawModels.find((m) => m.slug === slug);
  if (!raw) return null;
  return toModelDetail(raw, locale);
}
