import modelsFixture from "./fixtures/models.json";
import { Locale, resolveLocalizedText } from "./types";
import {
  GET_MODEL_BY_SLUG,
  GET_MODELS_BY_LOCALE,
  mediaUrl,
  mediaUrls,
  wpGraphqlRequest,
  WpModelBySlugResponse,
  WpModelsByLocaleResponse,
  WpPageBuilderRaw,
} from "./wpgraphql";

// --- Types shared by both mock and CMS models ------------------------------

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
}

const FALLBACK_THUMBNAIL = "/images/models/placeholder.svg";

// --- Mock model detail (legacy shape, renders via the existing fixed
// component pipeline in components/models/detail/*) -------------------------

export interface MockModelDetail extends ModelSummary {
  source: "mock";
  description: string;
  hero: { images: string[] };
  colors: ModelColor[];
  specs: ModelSpecs;
  specSheet: { anchor: string; title: string; description: string };
  exteriorGallery: string[];
  interiorGallery: string[];
  featureHighlights: ModelFeatureHighlight[];
}

interface RawMockModel {
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

const rawMockModels = modelsFixture as RawMockModel[];

const SHARED_INTERIOR_GALLERY = ["/images/interior/1.svg", "/images/interior/2.svg", "/images/interior/3.svg"];

function toMockModelDetail(raw: RawMockModel, locale: Locale): MockModelDetail {
  const colors: ModelColor[] = raw.colors.map((color) => ({
    key: color.key,
    label: resolveLocalizedText(color.label, locale),
    hex: color.hex,
    spinFrames: Array.from({ length: 8 }, (_, i) => `/spin/${raw.slug}/${color.key}/${i}.svg`),
  }));

  return {
    source: "mock",
    slug: raw.slug,
    name: raw.name,
    tagline: resolveLocalizedText(raw.tagline, locale),
    bodyType: resolveLocalizedText(raw.bodyType, locale),
    heroImageUrl: `/images/models/${raw.slug}/hero.svg`,
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

function mockSummary(raw: RawMockModel, locale: Locale): ModelSummary {
  return {
    slug: raw.slug,
    name: raw.name,
    tagline: resolveLocalizedText(raw.tagline, locale),
    bodyType: resolveLocalizedText(raw.bodyType, locale),
    heroImageUrl: `/images/models/${raw.slug}/hero.svg`,
  };
}

// --- CMS model detail (real WPGraphQL content, renders via PageBuilder) ----

export type PageBuilderSection =
  | { type: "hero"; title: string | null; subtitle: string | null; imageDesktop: string | null; imageMobile: string | null }
  | {
      type: "colorsSpecs";
      title: string | null;
      subtitle: string | null;
      modelNameDisplay: string | null;
      colors: { label: string; hex: string; sectionBackgroundColor: string; spinFrames: string[] }[];
      specs: { label: string; value: string }[];
    }
  | { type: "video"; videoUrl: string; posterUrl: string | null }
  | {
      type: "exterior";
      title: string | null;
      subtitle: string | null;
      headingOnImage: string | null;
      imageDesktop: string | null;
      imageMobile: string | null;
      metrics: { label: string; value: string }[];
    }
  | {
      type: "appearanceSlider";
      title: string | null;
      subtitle: string | null;
      slides: { imageDesktop: string | null; imageMobile: string | null; textOnImage: string | null }[];
    }
  | {
      type: "interior";
      title: string | null;
      subtitle: string | null;
      variants: { colorSwatch: string; swatchIconUrl: string | null; imageDesktop: string | null; imageMobile: string | null }[];
    }
  | {
      type: "additionalCharacteristics";
      title: string | null;
      subtitle: string | null;
      slides: { imageDesktop: string | null; imageMobile: string | null; slideTitle: string; infoHtml: string }[];
    }
  | {
      type: "additionalCharacteristics2";
      title: string | null;
      subtitle: string | null;
      slides: { imageDesktop: string | null; imageMobile: string | null; slideTitle: string; infoHtml: string }[];
    }
  | {
      type: "metricsSlider";
      title: string | null;
      subtitle: string | null;
      slides: {
        imageDesktop: string | null;
        imageMobile: string | null;
        slideTitle: string;
        slideHeading: string;
        metrics: { label: string; value: string }[] | null;
      }[];
    };

export interface CmsModelDetail extends ModelSummary {
  source: "cms";
  sections: PageBuilderSection[];
  /** Every locale this model has real content in, and its slug there. */
  translations: { locale: Locale; slug: string }[];
}

export type ModelDetail = MockModelDetail | CmsModelDetail;

function codeToLocale(code: string): Locale | null {
  const lower = code.toLowerCase();
  return lower === "hy" || lower === "en" ? lower : null;
}

/**
 * Normalizes one raw pageBuilder array entry. Returns `null` when the
 * section's own essential content is missing, so it's skipped exactly like
 * an absent layout -- confirmed necessary from real data (e.g. a Video
 * layout entry can be present in the array with a null video file).
 */
function normalizeSection(raw: WpPageBuilderRaw): PageBuilderSection | null {
  switch (raw.__typename) {
    case "ModelPageBuilderPageBuilderHeroLayout": {
      const imageDesktop = mediaUrl(raw.imageDesktop);
      const imageMobile = mediaUrl(raw.imageMobile);
      if (!raw.title && !raw.subtitle && !imageDesktop && !imageMobile) return null;
      return { type: "hero", title: raw.title ?? null, subtitle: raw.subtitle ?? null, imageDesktop, imageMobile };
    }

    case "ModelPageBuilderPageBuilderColorsSpecsLayout": {
      const colors = (raw.colors ?? []).map((c) => ({
        label: c.colorLabel,
        hex: c.swatchHex,
        sectionBackgroundColor: c.sectionBackgroundColor,
        spinFrames: mediaUrls(c.spinFrames),
      }));
      if (colors.length === 0) return null;
      return {
        type: "colorsSpecs",
        title: raw.title ?? null,
        subtitle: raw.subtitle ?? null,
        modelNameDisplay: raw.modelNameDisplay ?? null,
        colors,
        specs: raw.specs ?? [],
      };
    }

    case "ModelPageBuilderPageBuilderVideoLayout": {
      const videoUrl = mediaUrl(raw.videoFile);
      if (!videoUrl) return null;
      return { type: "video", videoUrl, posterUrl: raw.posterImage ?? null };
    }

    case "ModelPageBuilderPageBuilderExteriorLayout": {
      const imageDesktop = mediaUrl(raw.imageDesktop);
      const imageMobile = mediaUrl(raw.imageMobile);
      const metrics = raw.metrics ?? [];
      if (!raw.title && !raw.subtitle && !imageDesktop && !imageMobile && !raw.headingOnImage && metrics.length === 0) {
        return null;
      }
      return {
        type: "exterior",
        title: raw.title ?? null,
        subtitle: raw.subtitle ?? null,
        headingOnImage: raw.headingOnImage ?? null,
        imageDesktop,
        imageMobile,
        metrics,
      };
    }

    case "ModelPageBuilderPageBuilderAppearanceSliderLayout": {
      const slides = (raw.slides ?? [])
        .map((s) => ({
          imageDesktop: mediaUrl(s.imageDesktop),
          imageMobile: mediaUrl(s.imageMobile),
          textOnImage: s.textOnImage ?? null,
        }))
        .filter((s) => s.imageDesktop || s.imageMobile || s.textOnImage);
      if (slides.length === 0) return null;
      return { type: "appearanceSlider", title: raw.title ?? null, subtitle: raw.subtitle ?? null, slides };
    }

    case "ModelPageBuilderPageBuilderInteriorLayout": {
      const variants = (raw.variants ?? []).map((v) => ({
        colorSwatch: v.colorSwatch,
        swatchIconUrl: mediaUrl(v.swatchIcon),
        imageDesktop: mediaUrl(v.imageDesktop),
        imageMobile: mediaUrl(v.imageMobile),
      }));
      if (variants.length === 0) return null;
      return { type: "interior", title: raw.title ?? null, subtitle: raw.subtitle ?? null, variants };
    }

    case "ModelPageBuilderPageBuilderAdditionalCharacteristicsLayout": {
      const slides = (raw.characteristicSlides ?? []).map((s) => ({
        imageDesktop: mediaUrl(s.imageDesktop),
        imageMobile: mediaUrl(s.imageMobile),
        slideTitle: s.slideTitle,
        infoHtml: s.info,
      }));
      if (slides.length === 0) return null;
      return { type: "additionalCharacteristics", title: raw.title ?? null, subtitle: raw.subtitle ?? null, slides };
    }

    case "ModelPageBuilderPageBuilderAdditionalCharacteristics2Layout": {
      const slides = (raw.characteristicSlides2 ?? []).map((s) => ({
        imageDesktop: mediaUrl(s.imageDesktop),
        imageMobile: mediaUrl(s.imageMobile),
        slideTitle: s.slideTitle,
        infoHtml: s.info,
      }));
      if (slides.length === 0) return null;
      return { type: "additionalCharacteristics2", title: raw.title ?? null, subtitle: raw.subtitle ?? null, slides };
    }

    case "ModelPageBuilderPageBuilderMetricsSliderLayout": {
      const slides = (raw.metricSlides ?? []).map((s) => ({
        imageDesktop: mediaUrl(s.imageDesktop),
        imageMobile: mediaUrl(s.imageMobile),
        slideTitle: s.slideTitle,
        slideHeading: s.slideHeading,
        metrics: s.metrics ?? null,
      }));
      if (slides.length === 0) return null;
      return { type: "metricsSlider", title: raw.title ?? null, subtitle: raw.subtitle ?? null, slides };
    }

    default:
      // Unrecognized __typename -- skip rather than guess.
      return null;
  }
}

function cmsSummary(raw: NonNullable<WpModelBySlugResponse["modelBy"]>): ModelSummary {
  return {
    slug: raw.slug,
    name: raw.title,
    tagline: raw.modelMeta.tagline ?? "",
    bodyType: raw.modelMeta.bodyType ?? "",
    heroImageUrl: raw.modelMeta.listThumbnail?.node.sourceUrl ?? FALLBACK_THUMBNAIL,
  };
}

function normalizeCmsModel(raw: NonNullable<WpModelBySlugResponse["modelBy"]>): CmsModelDetail {
  const translations: { locale: Locale; slug: string }[] = [];
  const ownLocale = codeToLocale(raw.language.code);
  if (ownLocale) translations.push({ locale: ownLocale, slug: raw.slug });
  for (const t of raw.translations) {
    const l = codeToLocale(t.language.code);
    if (l) translations.push({ locale: l, slug: t.slug });
  }

  return {
    ...cmsSummary(raw),
    source: "cms",
    sections: raw.modelPageBuilder.pageBuilder.map(normalizeSection).filter((s): s is PageBuilderSection => s !== null),
    translations,
  };
}

/**
 * Fetches a Model by slug from WPGraphQL and makes sure the returned content
 * is actually in `locale` -- resolving through `translations` (never
 * string-manipulating the slug) if the slug given belongs to the other
 * locale's post. Returns `null` if the backend is unreachable, the slug
 * doesn't exist there, or there's no translation in the requested locale.
 */
async function fetchCmsModelBySlug(slug: string, locale: Locale): Promise<CmsModelDetail | null> {
  const requestedCode = locale.toUpperCase();

  const first = await wpGraphqlRequest<WpModelBySlugResponse>(GET_MODEL_BY_SLUG, { slug });
  if (!first?.modelBy) return null;

  let modelBy = first.modelBy;
  if (modelBy.language.code !== requestedCode) {
    const match = modelBy.translations.find((t) => t.language.code === requestedCode);
    if (!match) return null;
    const second = await wpGraphqlRequest<WpModelBySlugResponse>(GET_MODEL_BY_SLUG, { slug: match.slug });
    if (!second?.modelBy) return null;
    modelBy = second.modelBy;
  }

  return normalizeCmsModel(modelBy);
}

async function fetchCmsModelSummaries(locale: Locale): Promise<ModelSummary[]> {
  const result = await wpGraphqlRequest<WpModelsByLocaleResponse>(GET_MODELS_BY_LOCALE, {
    language: locale.toUpperCase(),
  });
  if (!result) return [];

  return result.models.nodes
    .map((node) => ({
      slug: node.slug,
      name: node.title,
      tagline: node.modelMeta.tagline ?? "",
      bodyType: node.modelMeta.bodyType ?? "",
      heroImageUrl: node.modelMeta.listThumbnail?.node.sourceUrl ?? FALLBACK_THUMBNAIL,
      displayOrder: node.modelMeta.displayOrder,
    }))
    .sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping displayOrder after sorting by it
    .map(({ displayOrder, ...summary }) => summary);
}

// --- Public API --------------------------------------------------------

/**
 * Every model in `locale` -- real CMS models plus the mock placeholder
 * line-up, merged into one list. Powers /models, the header mega-menu, the
 * footer's vehicles column, and the home page. Never throws: if the local
 * WordPress backend isn't reachable, this just returns the mock list.
 */
export async function getModelsByLocale(locale: Locale): Promise<ModelSummary[]> {
  const cmsList = await fetchCmsModelSummaries(locale);
  const mockList = rawMockModels.map((raw) => mockSummary(raw, locale));
  return [...cmsList, ...mockList];
}

/**
 * One model's full detail, in `locale`. Tries the real CMS first (resolving
 * translations as needed); falls back to mock fixture data for any slug the
 * CMS doesn't have (including when the backend is unreachable).
 */
export async function getModelBySlug(slug: string, locale: Locale): Promise<ModelDetail | null> {
  const cms = await fetchCmsModelBySlug(slug, locale);
  if (cms) return cms;

  const raw = rawMockModels.find((m) => m.slug === slug);
  if (!raw) return null;
  return toMockModelDetail(raw, locale);
}
