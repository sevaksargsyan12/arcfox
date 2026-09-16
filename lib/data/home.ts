import { Locale } from "./types";
import {
  GET_HOME_PAGE,
  mediaUrl,
  videoMediaUrl,
  wpGraphqlRequest,
  WpHomePageResponse,
} from "./wpgraphql";

// The Home page's content comes entirely from the real WPGraphQL backend --
// there is no mock/placeholder fallback, same convention as
// lib/data/models.ts. If the backend is unreachable, `getHomePage` returns
// `null` and the Hero/Video sections simply don't render (see
// app/[locale]/page.tsx) rather than showing fake content.

export interface HeroSlide {
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
  imageDesktop: string | null;
  imageMobile: string | null;
}

export interface HomePageContent {
  heroSlides: HeroSlide[];
  videoUrl: string | null;
  posterUrl: string | null;
  videoTitle: string | null;
  videoSubtitle: string | null;
  videoButtonText: string | null;
  buttonLink: string | null;
  newsTitle: string | null;
}

// The one confirmed-reachable starting slug -- resolved to whichever real
// locale it happens to be (confirmed EN, but that's deliberately not
// hardcoded here) via `translations[]`, same as getModelBySlug.
const HOME_SLUG = "home";

function normalize(raw: NonNullable<WpHomePageResponse["page"]>["homePage"]): HomePageContent {
  return {
    // Hero slides are never dropped for having a null title/subtitle --
    // confirmed real case (the first slide is image+button only) -- unlike
    // the Model page's page-builder sections, which do get dropped when
    // genuinely empty.
    heroSlides: (raw.heroSlider?.heroSlides ?? []).map((slide) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      link: slide.link,
      imageDesktop: mediaUrl(slide.imageDesktop),
      imageMobile: mediaUrl(slide.imageMobile),
    })),
    videoUrl: videoMediaUrl(raw.video),
    posterUrl: mediaUrl(raw.poster),
    videoTitle: raw.videoTitle,
    videoSubtitle: raw.videoSubtitle,
    videoButtonText: raw.videoButtonText,
    buttonLink: raw.buttonLink,
    newsTitle: raw.newsTitle,
  };
}

export async function getHomePage(locale: Locale): Promise<HomePageContent | null> {
  const result = await wpGraphqlRequest<WpHomePageResponse>(GET_HOME_PAGE, { id: HOME_SLUG });
  const page = result?.page;
  if (!page) return null;

  if (page.language.code.toLowerCase() === locale) {
    return normalize(page.homePage);
  }

  // Wrong locale -- resolve the correct slug via `translations[]` (never
  // string-manipulate the slug) and re-query.
  const match = page.translations.find((t) => t.language.code.toLowerCase() === locale);
  if (!match) return null;

  const translated = await wpGraphqlRequest<WpHomePageResponse>(GET_HOME_PAGE, { id: match.slug });
  if (!translated?.page) return null;
  return normalize(translated.page.homePage);
}
