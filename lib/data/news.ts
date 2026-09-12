import newsFixture from "./fixtures/news.json";
import { Locale, PaginatedResult, resolveLocalizedText } from "./types";

export interface NewsCategory {
  id: string;
  label: string;
}

export interface NewsListItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  categoryId: string;
}

export interface NewsItem extends NewsListItem {
  /** Rendered HTML -- the shape WPGraphQL post content will actually return. */
  contentHtml: string;
}

interface RawNewsItem {
  id: string;
  categoryId: string;
  featured: boolean;
  publishedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  contentHtml: Record<Locale, string>;
}

const rawItems = newsFixture.items as RawNewsItem[];
const rawCategories = newsFixture.categories as {
  id: string;
  label: Record<Locale, string>;
}[];

function toListItem(raw: RawNewsItem, locale: Locale): NewsListItem {
  return {
    id: raw.id,
    title: resolveLocalizedText(raw.title, locale),
    summary: resolveLocalizedText(raw.summary, locale),
    imageUrl: `/images/news/${(Number(raw.id) % 6) + 1}.svg`,
    publishedAt: raw.publishedAt,
    categoryId: raw.categoryId,
  };
}

function sortedByDateDesc(items: RawNewsItem[]): RawNewsItem[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getNewsCategories(locale: Locale): Promise<NewsCategory[]> {
  return rawCategories.map((c) => ({ id: c.id, label: resolveLocalizedText(c.label, locale) }));
}

export async function getFeaturedNews(locale: Locale, limit = 3): Promise<NewsListItem[]> {
  return sortedByDateDesc(rawItems.filter((i) => i.featured))
    .slice(0, limit)
    .map((raw) => toListItem(raw, locale));
}

export async function getNewsList(
  locale: Locale,
  params: { page?: number; pageSize?: number; categoryId?: string } = {}
): Promise<PaginatedResult<NewsListItem>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 6;
  const filtered = sortedByDateDesc(
    params.categoryId ? rawItems.filter((i) => i.categoryId === params.categoryId) : rawItems
  );
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map((raw) => toListItem(raw, locale)),
    total: filtered.length,
    page,
    pageSize,
  };
}

export async function getNewsIds(): Promise<string[]> {
  return rawItems.map((i) => i.id);
}

export async function getNewsById(id: string, locale: Locale): Promise<NewsItem | null> {
  const raw = rawItems.find((i) => i.id === id);
  if (!raw) return null;
  return {
    ...toListItem(raw, locale),
    contentHtml: resolveLocalizedText(raw.contentHtml, locale),
  };
}
