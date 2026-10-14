import { Locale } from "./types";
import {
  GET_MODEL_BY_SLUG,
  GET_MODELS_BY_LOCALE,
  GET_MODELS_WITH_COLORS_SPECS,
  mediaUrl,
  mediaUrls,
  videoMediaUrl,
  wpGraphqlRequest,
  WpModelBySlugResponse,
  WpModelsByLocaleResponse,
  WpModelsWithColorsSpecsResponse,
  WpPageBuilderRaw,
} from "./wpgraphql";

// All model content comes from the real WPGraphQL backend -- there is no
// mock/placeholder fallback. If the backend is unreachable, model listings
// come back empty and `/models/[slug]` 404s, rather than showing fake data.

export interface ModelSummary {
  slug: string;
  name: string;
  tagline: string;
  bodyType: string;
  heroImageUrl: string;
}

const FALLBACK_THUMBNAIL = "/images/models/placeholder.svg";

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

export interface ModelDetail extends ModelSummary {
  sections: PageBuilderSection[];
  /** Every locale this model has real content in, and its slug there. */
  translations: { locale: Locale; slug: string }[];
}

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
export function normalizeSection(raw: WpPageBuilderRaw): PageBuilderSection | null {
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
      const videoUrl = videoMediaUrl(raw.videoFile);
      if (!videoUrl) return null;
      return { type: "video", videoUrl, posterUrl: mediaUrl(raw.posterImage) };
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

function summaryFromModelBy(raw: NonNullable<WpModelBySlugResponse["modelBy"]>): ModelSummary {
  return {
    slug: raw.slug,
    name: raw.title,
    tagline: raw.modelMeta.tagline ?? "",
    bodyType: raw.modelMeta.bodyType ?? "",
    heroImageUrl: raw.modelMeta.listThumbnail?.node.sourceUrl ?? FALLBACK_THUMBNAIL,
  };
}

/** Shared by getModelsByLocale and getModelShowcaseEntries -- both start from
 *  the same list-query node shape (title/slug/modelMeta), sorted the same
 *  way by displayOrder (nulls last). */
function summariesFromListNodes<T extends { title: string; slug: string; modelMeta: WpModelsByLocaleResponse["models"]["nodes"][number]["modelMeta"] }>(
  nodes: T[]
): (ModelSummary & { node: T })[] {
  return nodes
    .map((node) => ({
      slug: node.slug,
      name: node.title,
      tagline: node.modelMeta.tagline ?? "",
      bodyType: node.modelMeta.bodyType ?? "",
      heroImageUrl: node.modelMeta.listThumbnail?.node.sourceUrl ?? FALLBACK_THUMBNAIL,
      displayOrder: node.modelMeta.displayOrder,
      node,
    }))
    .sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping displayOrder after sorting by it
    .map(({ displayOrder, ...rest }) => rest);
}

export type ModelShowcaseEntry = ModelSummary & {
  colorsSpecs: Extract<PageBuilderSection, { type: "colorsSpecs" }>;
};

function normalizeModel(raw: NonNullable<WpModelBySlugResponse["modelBy"]>): ModelDetail {
  const translations: { locale: Locale; slug: string }[] = [];
  const ownLocale = codeToLocale(raw.language.code);
  if (ownLocale) translations.push({ locale: ownLocale, slug: raw.slug });
  for (const t of raw.translations) {
    const l = codeToLocale(t.language.code);
    if (l) translations.push({ locale: l, slug: t.slug });
  }

  return {
    ...summaryFromModelBy(raw),
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
export async function getModelBySlug(slug: string, locale: Locale): Promise<ModelDetail | null> {
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

  return normalizeModel(modelBy);
}

/**
 * Every real model in `locale`. Powers /models, the header mega-menu, the
 * footer's vehicles column, and the home page. Never throws: if the local
 * WordPress backend isn't reachable, this returns an empty list.
 */
export async function getModelsByLocale(locale: Locale): Promise<ModelSummary[]> {
  const result = await wpGraphqlRequest<WpModelsByLocaleResponse>(GET_MODELS_BY_LOCALE, {
    language: locale.toUpperCase(),
  });
  if (!result) return [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` isn't needed here, only by getModelShowcaseEntries
  return summariesFromListNodes(result.models.nodes).map(({ node, ...summary }) => summary);
}

/**
 * Every real model in `locale` that has a usable colorsSpecs page-builder
 * section (color swatches + spin frames + specs) -- powers the Home page's
 * Model Showcase, which reuses the exact same ColorsSpecs component/UI as
 * the Model detail page, one model per slide. A model with no colorsSpecs
 * content is skipped entirely (nothing to show in this format), same
 * "drop what's genuinely empty" convention as normalizeSection. Never
 * throws: returns `[]` if the backend is unreachable.
 */
export async function getModelShowcaseEntries(locale: Locale): Promise<ModelShowcaseEntry[]> {
  const result = await wpGraphqlRequest<WpModelsWithColorsSpecsResponse>(GET_MODELS_WITH_COLORS_SPECS, {
    language: locale.toUpperCase(),
  });
  if (!result) return [];

  const entries: ModelShowcaseEntry[] = [];
  for (const { node, ...summary } of summariesFromListNodes(result.models.nodes)) {
    const colorsSpecs = node.modelPageBuilder.pageBuilder
      .map(normalizeSection)
      .find((s): s is Extract<PageBuilderSection, { type: "colorsSpecs" }> => s?.type === "colorsSpecs");
    if (colorsSpecs) entries.push({ ...summary, colorsSpecs });
  }
  return entries;
}
