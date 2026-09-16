import { LatestPost } from "@/lib/data/latestPosts";

interface LatestNewsProps {
  posts: LatestPost[];
  /** From homePage.newsTitle (CMS content) -- not messages/*.json. */
  newsTitle: string | null;
}

/**
 * Title-only card grid of the latest 4 real WP posts (see
 * lib/data/latestPosts.ts -- currently backed by mock data since no real
 * posts exist yet). No image/link per current scope: the mock fixture's
 * slug doesn't correspond to a real route, and linking to the existing
 * ACF-"news"-backed /news/[id] route would point at the wrong content
 * type, so these render as plain non-interactive cards for now.
 */
export function LatestNews({ posts, newsTitle }: LatestNewsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="home-news bg-form-bg py-16 md:py-24">
      <div className="container-max">
        {newsTitle && (
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{newsTitle}</h2>
        )}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl bg-white p-6">
              <h3 className="font-display text-lg font-semibold leading-snug">{post.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
