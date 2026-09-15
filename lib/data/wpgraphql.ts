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
