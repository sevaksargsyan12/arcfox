/**
 * Minimal WPGraphQL client for the real (non-mock) model content.
 *
 * Deliberately plain `fetch()` -- one query, no need for a GraphQL client
 * library. `wpGraphqlRequest` never throws: a network failure or a GraphQL
 * `errors` response both resolve to `null`, so every call site in
 * `lib/data/models.ts` can fall back to mock data with a plain `if (!result)`
 * check instead of try/catch scattered everywhere.
 */

const WPGRAPHQL_ENDPOINT = process.env.WPGRAPHQL_ENDPOINT ?? "http://localhost/arcfox/graphql";

export async function wpGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(WPGRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // Real backend content changes independently of this app's build, so
      // don't cache forever -- but `cache: "no-store"` would force every
      // route that touches this (which, via the header/footer model list,
      // is *every* route on the site) into fully dynamic rendering. ISR
      // instead: prerender normally, revalidate in the background at most
      // once a minute.
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.errors) {
      console.error("WPGraphQL request returned errors:", json.errors);
      return null;
    }
    return json.data as T;
  } catch (err) {
    // Local WordPress not running, wrong endpoint, etc. -- treat exactly
    // like "no data available" so callers fall back to mock content.
    console.error("WPGraphQL request failed:", err);
    return null;
  }
}

// Copied verbatim (comments stripped) from reference/graphql/getModelsByLocale.graphql
// -- confirmed working against the real backend. Do not hand-edit field names.
export const GET_MODELS_BY_LOCALE = /* GraphQL */ `
  query GetModelsByLocale($language: LanguageCodeFilterEnum!) {
    models(where: { language: $language }) {
      nodes {
        title
        slug
        modelMeta {
          tagline
          bodyType
          displayOrder
          listThumbnail {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

// New (Home page "Model Showcase") -- same summary fields as
// GET_MODELS_BY_LOCALE, plus each model's colorsSpecs page-builder section
// (confirmed against the live backend during planning: a bulk list query
// can embed the same pageBuilder fragment a single-model query can). Kept
// separate from GET_MODELS_BY_LOCALE, which the Header/Footer mega-menu
// calls on every page and must stay lightweight -- embedding spin-frame
// image arrays there would bloat every page's data fetch.
export const GET_MODELS_WITH_COLORS_SPECS = /* GraphQL */ `
  query GetModelsWithColorsSpecs($language: LanguageCodeFilterEnum!) {
    models(where: { language: $language }) {
      nodes {
        title
        slug
        modelMeta {
          tagline
          bodyType
          displayOrder
          listThumbnail {
            node {
              sourceUrl
              altText
            }
          }
        }
        modelPageBuilder {
          pageBuilder {
            __typename

            ... on ModelPageBuilderPageBuilderColorsSpecsLayout {
              title
              subtitle
              modelNameDisplay
              colors {
                colorLabel
                swatchHex
                sectionBackgroundColor
                spinFrames {
                  nodes {
                    sourceUrl
                  }
                }
              }
              specs {
                label
                value
              }
            }
          }
        }
      }
    }
  }
`;

// Copied verbatim (comments stripped) from reference/graphql/getModelBySlug.graphql
// -- confirmed working against the real backend. Do not hand-edit field names.
export const GET_MODEL_BY_SLUG = /* GraphQL */ `
  query GetModelBySlug($slug: String!) {
    modelBy(slug: $slug) {
      title
      slug
      language {
        code
      }
      translations {
        ... on Model {
          slug
          language {
            code
          }
        }
      }
      modelMeta {
        tagline
        bodyType
        displayOrder
        listThumbnail {
          node {
            sourceUrl
            altText
          }
        }
      }
      modelPageBuilder {
        pageBuilder {
          __typename

          ... on ModelPageBuilderPageBuilderHeroLayout {
            title
            subtitle
            imageDesktop {
              node {
                sourceUrl
              }
            }
            imageMobile {
              node {
                sourceUrl
              }
            }
          }

          ... on ModelPageBuilderPageBuilderColorsSpecsLayout {
            title
            subtitle
            modelNameDisplay
            colors {
              colorLabel
              swatchHex
              sectionBackgroundColor
              spinFrames {
                nodes {
                  sourceUrl
                }
              }
            }
            specs {
              label
              value
            }
          }

          ... on ModelPageBuilderPageBuilderVideoLayout {
            videoFile {
              node {
                mediaItemUrl
              }
            }
            posterImage
          }

          ... on ModelPageBuilderPageBuilderExteriorLayout {
            title
            subtitle
            headingOnImage
            imageDesktop {
              node {
                sourceUrl
              }
            }
            imageMobile {
              node {
                sourceUrl
              }
            }
            metrics {
              label
              value
            }
          }

          ... on ModelPageBuilderPageBuilderAppearanceSliderLayout {
            title
            subtitle
            slides {
              imageDesktop {
                node {
                  sourceUrl
                }
              }
              imageMobile {
                node {
                  sourceUrl
                }
              }
              textOnImage
            }
          }

          ... on ModelPageBuilderPageBuilderInteriorLayout {
            title
            subtitle
            variants {
              colorSwatch
              swatchIcon {
                node {
                  sourceUrl
                }
              }
              imageDesktop {
                node {
                  sourceUrl
                }
              }
              imageMobile {
                node {
                  sourceUrl
                }
              }
            }
          }

          ... on ModelPageBuilderPageBuilderAdditionalCharacteristicsLayout {
            title
            subtitle
            characteristicSlides {
              imageDesktop {
                node {
                  sourceUrl
                }
              }
              imageMobile {
                node {
                  sourceUrl
                }
              }
              slideTitle
              info
            }
          }

          ... on ModelPageBuilderPageBuilderAdditionalCharacteristics2Layout {
            title
            subtitle
            characteristicSlides2 {
              imageDesktop {
                node {
                  sourceUrl
                }
              }
              imageMobile {
                node {
                  sourceUrl
                }
              }
              slideTitle
              info
            }
          }

          ... on ModelPageBuilderPageBuilderMetricsSliderLayout {
            title
            subtitle
            metricSlides {
              imageDesktop {
                node {
                  sourceUrl
                }
              }
              imageMobile {
                node {
                  sourceUrl
                }
              }
              slideTitle
              slideHeading
              metrics {
                label
                value
              }
            }
          }
        }
      }
    }
  }
`;

// New (Home page) -- confirmed against the live backend via introspection +
// a real query during planning. `page(id: "home", idType: URI)` currently
// resolves to the EN post (language.code: "EN"), with a `home-hy` HY
// translation -- the OPPOSITE of what might be assumed from the slug name,
// but consistent with the Model page's own convention (unprefixed = EN,
// "-hy" suffix = HY). Resolve via `translations[]`, same as
// GetModelBySlug -- never hardcode which literal slug belongs to which
// locale.
export const GET_HOME_PAGE = /* GraphQL */ `
  query GetHomePage($id: ID!) {
    page(id: $id, idType: URI) {
      language {
        code
      }
      translations {
        ... on Page {
          slug
          language {
            code
          }
        }
      }
      homePage {
        heroSlider {
          heroSlides {
            title
            subtitle
            buttonText
            link
            imageDesktop {
              node {
                sourceUrl
              }
            }
            imageMobile {
              node {
                sourceUrl
              }
            }
          }
        }
        video {
          node {
            mediaItemUrl
          }
        }
        poster {
          node {
            sourceUrl
          }
        }
        videoTitle
        videoSubtitle
        videoButtonText
        buttonLink
        newsTitle
      }
    }
  }
`;

// New (About page) -- confirmed working against the live backend. Fixed-slug
// singleton page, same convention as GET_HOME_PAGE: resolve locale via
// `translations[]`, never hardcode which literal slug belongs to which
// locale even though "about"/"about-hy" happens to follow the Home/Model
// convention.
export const GET_ABOUT_PAGE = /* GraphQL */ `
  query GetAboutPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      slug
      language {
        code
      }
      translations {
        ... on Page {
          slug
          language {
            code
          }
        }
      }
      aboutPage {
        heroImage {
          node {
            sourceUrl
          }
        }
        heroImageMobile {
          node {
            sourceUrl
          }
        }
        heroText
        biTitle
        biSubtitle
        biText
        biImage {
          node {
            sourceUrl
          }
        }
        bpTitle
        bpItems {
          itemTitle
          itemContent
          itemImage {
            node {
              sourceUrl
            }
          }
        }
        gpTitle
        gpSubtitle
        gpContent
        gpImage {
          node {
            sourceUrl
          }
        }
        metrics {
          metricTitle
          metricContent
        }
        footerTitle
        footerContent
        footerImage {
          node {
            sourceUrl
          }
        }
        footerImageMobile {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// New (Home page "latest news") -- the real WP `posts` type, confirmed
// against the live schema/a real query during planning. Currently returns
// an empty `nodes` array (no real posts exist in WordPress yet) --
// lib/data/latestPosts.ts falls back to mock data whenever this comes back
// empty, so this same query already "just works" once real posts exist.
export const GET_LATEST_POSTS = /* GraphQL */ `
  query GetLatestPosts($language: LanguageCodeFilterEnum!, $first: Int!) {
    posts(where: { language: $language }, first: $first) {
      nodes {
        id
        databaseId
        title
        slug
        date
      }
    }
  }
`;

// --- Raw response shapes (field-for-field with the queries above) ---------

export interface WpModelsByLocaleResponse {
  models: {
    nodes: {
      title: string;
      slug: string;
      modelMeta: {
        tagline: string | null;
        bodyType: string | null;
        displayOrder: number | null;
        listThumbnail: { node: { sourceUrl: string; altText: string } } | null;
      };
    }[];
  };
}

export interface WpModelsWithColorsSpecsResponse {
  models: {
    nodes: {
      title: string;
      slug: string;
      modelMeta: {
        tagline: string | null;
        bodyType: string | null;
        displayOrder: number | null;
        listThumbnail: { node: { sourceUrl: string; altText: string } } | null;
      };
      modelPageBuilder: { pageBuilder: WpPageBuilderRaw[] };
    }[];
  };
}

interface WpMediaNode {
  node: { sourceUrl: string | null } | null;
}
interface WpMediaNodes {
  nodes: { sourceUrl: string }[];
}
// Video attachments confirmed (against the live backend) to return `sourceUrl:
// null` even when the file exists -- only `mediaItemUrl` reliably resolves to
// the actual file URL for this mime type, so the video field uses its own
// shape rather than reusing WpMediaNode/mediaUrl().
interface WpVideoMediaNode {
  node: { mediaItemUrl: string | null } | null;
}

export interface WpPageBuilderRaw {
  __typename: string;
  // Hero
  title?: string | null;
  subtitle?: string | null;
  imageDesktop?: WpMediaNode | null;
  imageMobile?: WpMediaNode | null;
  // ColorsSpecs
  modelNameDisplay?: string | null;
  colors?: {
    colorLabel: string;
    swatchHex: string;
    sectionBackgroundColor: string;
    spinFrames: WpMediaNodes;
  }[];
  specs?: { label: string; value: string }[];
  // Video
  videoFile?: WpVideoMediaNode | null;
  posterImage?: string | null;
  // Exterior
  headingOnImage?: string | null;
  metrics?: { label: string; value: string }[] | null;
  // AppearanceSlider
  slides?: { imageDesktop: WpMediaNode | null; imageMobile: WpMediaNode | null; textOnImage: string | null }[];
  // Interior
  variants?: {
    colorSwatch: string;
    swatchIcon: WpMediaNode | null;
    imageDesktop: WpMediaNode | null;
    imageMobile: WpMediaNode | null;
  }[];
  // AdditionalCharacteristics(2)
  characteristicSlides?: {
    imageDesktop: WpMediaNode | null;
    imageMobile: WpMediaNode | null;
    slideTitle: string;
    info: string;
  }[];
  characteristicSlides2?: {
    imageDesktop: WpMediaNode | null;
    imageMobile: WpMediaNode | null;
    slideTitle: string;
    info: string;
  }[];
  // MetricsSlider
  metricSlides?: {
    imageDesktop: WpMediaNode | null;
    imageMobile: WpMediaNode | null;
    slideTitle: string;
    slideHeading: string;
    metrics: { label: string; value: string }[] | null;
  }[];
}

export interface WpModelBySlugResponse {
  modelBy: {
    title: string;
    slug: string;
    language: { code: string };
    translations: { slug: string; language: { code: string } }[];
    modelMeta: {
      tagline: string | null;
      bodyType: string | null;
      displayOrder: number | null;
      listThumbnail: { node: { sourceUrl: string; altText: string } } | null;
    };
    modelPageBuilder: { pageBuilder: WpPageBuilderRaw[] };
  } | null;
}

export interface WpHomePageResponse {
  page: {
    language: { code: string };
    translations: { slug: string; language: { code: string } }[];
    homePage: {
      heroSlider: {
        heroSlides: {
          title: string | null;
          subtitle: string | null;
          buttonText: string | null;
          link: string | null;
          imageDesktop: { node: { sourceUrl: string | null } | null } | null;
          imageMobile: { node: { sourceUrl: string | null } | null } | null;
        }[];
      } | null;
      video: { node: { mediaItemUrl: string | null } | null } | null;
      poster: { node: { sourceUrl: string | null } | null } | null;
      videoTitle: string | null;
      videoSubtitle: string | null;
      videoButtonText: string | null;
      buttonLink: string | null;
      newsTitle: string | null;
    };
  } | null;
}

export interface WpAboutPageResponse {
  page: {
    title: string;
    slug: string;
    language: { code: string };
    translations: { slug: string; language: { code: string } }[];
    aboutPage: {
      heroImage: WpMediaNode | null;
      heroImageMobile: WpMediaNode | null;
      heroText: string | null;
      biTitle: string | null;
      biSubtitle: string | null;
      biText: string | null;
      biImage: WpMediaNode | null;
      bpTitle: string | null;
      bpItems:
        | {
            itemTitle: string | null;
            itemContent: string | null;
            itemImage: WpMediaNode | null;
          }[]
        | null;
      gpTitle: string | null;
      gpSubtitle: string | null;
      gpContent: string | null;
      gpImage: WpMediaNode | null;
      metrics: { metricTitle: string | null; metricContent: string | null }[] | null;
      footerTitle: string | null;
      footerContent: string | null;
      footerImage: WpMediaNode | null;
      footerImageMobile: WpMediaNode | null;
    };
  } | null;
}

export interface WpLatestPostsResponse {
  posts: {
    nodes: {
      id: string;
      databaseId: number;
      title: string;
      slug: string;
      date: string;
    }[];
  };
}

/** `{ node: { sourceUrl } } | null` -> `string | null` */
export function mediaUrl(field: WpMediaNode | null | undefined): string | null {
  return field?.node?.sourceUrl ?? null;
}

/** `{ node: { mediaItemUrl } } | null` -> `string | null` -- video files only,
 *  see the `WpVideoMediaNode` comment above for why this isn't `mediaUrl()`. */
export function videoMediaUrl(field: WpVideoMediaNode | null | undefined): string | null {
  return field?.node?.mediaItemUrl ?? null;
}

/** `{ nodes: [{ sourceUrl }] }` -> `string[]` */
export function mediaUrls(field: WpMediaNodes | null | undefined): string[] {
  return field?.nodes?.map((n) => n.sourceUrl) ?? [];
}
