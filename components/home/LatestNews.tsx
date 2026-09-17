import { LatestPost } from "@/lib/data/latestPosts";
import { Link } from "@/i18n/navigation";

interface LatestNewsProps {
  posts: LatestPost[];
  /** From homePage.newsTitle (CMS content) -- not messages/*.json. */
  newsTitle: string | null;
}

export function LatestNews({ posts, newsTitle }: LatestNewsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="home-news bg-form-bg py-16 md:py-24">
      <div className="container-max">
        {newsTitle && (
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{newsTitle}</h2>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group block w-full rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.125rem)]"
            >
              <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-brand-blue">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
