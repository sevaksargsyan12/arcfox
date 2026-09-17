import { decodeHtmlEntities, GET_LATEST_POSTS, wpGraphqlRequest, WpLatestPostsResponse } from "./wpgraphql";
import { Locale } from "./types";

// The Home page's "latest news" grid shows the real WP `posts` type -- NOT
// the project's separate ACF-based "news" mock concept in lib/data/news.ts
// (a different content type; that file is left untouched). Comes entirely
// from the real WPGraphQL backend, no mock fallback -- same convention as
// lib/data/news.ts/home.ts/about.ts. Each card links to /news/[slug] (see
// components/home/LatestNews.tsx), so a mock post with a fake slug would
// just be a broken link; if the backend is unreachable this returns an
// empty array and the section doesn't render.

export interface LatestPost {
  id: string;
  title: string;
  slug: string;
  date: string;
}

export async function getLatestPosts(locale: Locale, count = 4): Promise<LatestPost[]> {
  const result = await wpGraphqlRequest<WpLatestPostsResponse>(GET_LATEST_POSTS, {
    language: locale.toUpperCase(),
    first: count,
  });

  const nodes = result?.posts.nodes ?? [];
  return nodes.map((n) => ({ id: n.id, title: decodeHtmlEntities(n.title), slug: n.slug, date: n.date }));
}
