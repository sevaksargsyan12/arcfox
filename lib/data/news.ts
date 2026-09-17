import { Locale } from "./types";
import {
  decodeHtmlEntities,
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
