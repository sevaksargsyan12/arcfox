import { Locale } from "./types";
import {
  GET_NEWS_LIST,
  GET_POST_BY_SLUG,
  mediaUrl,
  wpGraphqlRequest,
  WpNewsListResponse,
  WpPostBySlugResponse,
} from "./wpgraphql";

// Real WP `posts`, same content type as the Home page's "latest news" strip
// (lib/data/latestPosts.ts) -- comes entirely from the real WPGraphQL
// backend, no mock fallback. No categories/pagination yet: just the posts
// that exist, most recent first (WP's own default post order).

export interface NewsListItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  /** Plain text, stripped of WP's auto-generated excerpt markup. */
  excerpt: string | null;
  imageUrl: string | null;
}

export interface NewsItem extends NewsListItem {
  /** Sanitize with sanitizeHtml() before rendering -- rich WYSIWYG post content. */
  contentHtml: string | null;
}

// No pagination UI yet -- fetch a generous batch instead of paging.
const NEWS_LIST_LIMIT = 50;

// WP's excerpt/title fields come back with entities encoded (wptexturize
// turns straight quotes/ellipses into &#8217;/&hellip; etc.), so stripping
// tags alone still leaves literal "&#8217;" in the text -- decode both
// numeric (&#8217;, &#x2019;) and the small set of named entities WP
// actually emits here.
const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const code =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_HTML_ENTITIES[entity] ?? match;
  });
}

function stripHtml(html: string): string | null {
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, "")).trim();
  return text.length > 0 ? text : null;
}

export async function getNewsList(locale: Locale): Promise<NewsListItem[]> {
  const result = await wpGraphqlRequest<WpNewsListResponse>(GET_NEWS_LIST, {
    language: locale.toUpperCase(),
    first: NEWS_LIST_LIMIT,
  });

  return (result?.posts.nodes ?? []).map((n) => ({
    id: n.id,
    slug: n.slug,
    title: decodeHtmlEntities(n.title),
    date: n.date,
    excerpt: n.excerpt ? stripHtml(n.excerpt) : null,
    imageUrl: mediaUrl(n.featuredImage),
  }));
}

function normalizePost(post: NonNullable<WpPostBySlugResponse["post"]>): NewsItem {
  return {
    id: post.id,
    slug: post.slug,
    title: decodeHtmlEntities(post.title),
    date: post.date,
    excerpt: post.excerpt ? stripHtml(post.excerpt) : null,
    imageUrl: mediaUrl(post.featuredImage),
    contentHtml: post.content,
  };
}

export async function getNewsBySlug(slug: string, locale: Locale): Promise<NewsItem | null> {
  const result = await wpGraphqlRequest<WpPostBySlugResponse>(GET_POST_BY_SLUG, { slug });
  const post = result?.post;
  if (!post) return null;

  if (post.language.code.toLowerCase() === locale) {
    return normalizePost(post);
  }

  // Wrong locale -- resolve the correct slug via `translations[]` (never
  // string-manipulate the slug) and re-query, same as getModelBySlug/getAboutPage.
  const match = post.translations.find((t) => t.language.code.toLowerCase() === locale);
  if (!match) return null;

  const translated = await wpGraphqlRequest<WpPostBySlugResponse>(GET_POST_BY_SLUG, { slug: match.slug });
  if (!translated?.post) return null;
  return normalizePost(translated.post);
}
