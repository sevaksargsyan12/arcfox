import latestPostsFixture from "./fixtures/latestPosts.json";
import { GET_LATEST_POSTS, wpGraphqlRequest, WpLatestPostsResponse } from "./wpgraphql";
import { Locale, LocalizedText, resolveLocalizedText } from "./types";

// The Home page's "latest news" grid shows the real WP `posts` type -- NOT
// the project's separate ACF-based "news" mock concept in lib/data/news.ts
// (a different content type; that file is left untouched). Confirmed
// against the live backend during planning: the query below is valid, but
// currently returns an empty `nodes` array (no real posts exist in
// WordPress yet). Per spec, this falls back to a small mock/placeholder
// list whenever the real query comes back empty or unreachable -- using
// the exact same LocalizedText/fixture idiom lib/data/news.ts already
// uses -- so once real posts exist, the real branch already wins with no
// code change.

export interface LatestPost {
  id: string;
  title: string;
  slug: string;
  date: string;
}

interface RawMockPost {
  id: string;
  slug: string;
  date: string;
  title: LocalizedText;
}

const mockItems = latestPostsFixture.items as RawMockPost[];

function mockLatestPosts(locale: Locale, count: number): LatestPost[] {
  return mockItems.slice(0, count).map((raw) => ({
    id: raw.id,
    slug: raw.slug,
    date: raw.date,
    title: resolveLocalizedText(raw.title, locale),
  }));
}

export async function getLatestPosts(locale: Locale, count = 4): Promise<LatestPost[]> {
  const result = await wpGraphqlRequest<WpLatestPostsResponse>(GET_LATEST_POSTS, {
    language: locale.toUpperCase(),
    first: count,
  });

  const nodes = result?.posts.nodes;
  if (nodes && nodes.length > 0) {
    return nodes.map((n) => ({ id: n.id, title: n.title, slug: n.slug, date: n.date }));
  }

  return mockLatestPosts(locale, count);
}
