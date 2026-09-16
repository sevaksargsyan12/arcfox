import { setRequestLocale } from "next-intl/server";
import { getModelsByLocale } from "@/lib/data/models";
import { getHomePage } from "@/lib/data/home";
import { getLatestPosts } from "@/lib/data/latestPosts";
import { Locale } from "@/lib/data/types";
import { Hero } from "@/components/home/Hero";
import { ModelShowcaseSlider } from "@/components/home/ModelShowcaseSlider";
import { VideoSection } from "@/components/home/VideoSection";
import { LatestNews } from "@/components/home/LatestNews";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [homePage, models, latestPosts] = await Promise.all([
    getHomePage(typedLocale),
    getModelsByLocale(typedLocale),
    getLatestPosts(typedLocale, 4),
  ]);

  return (
    <>
      {/* Hero and Video depend on the real Home page content -- if the
          backend is unreachable or has no translation for this locale,
          `homePage` is null and these two sections simply don't render
          (never throw, degrade gracefully -- same convention as the Model
          page). Model Showcase and News have their own independent
          fallbacks (an empty model list, or the mock latest-posts list). */}
      {homePage && <Hero slides={homePage.heroSlides} />}

      <ModelShowcaseSlider models={models} />

      {homePage && (
        <VideoSection
          videoUrl={homePage.videoUrl}
          posterUrl={homePage.posterUrl}
          videoTitle={homePage.videoTitle}
          videoSubtitle={homePage.videoSubtitle}
          videoButtonText={homePage.videoButtonText}
          buttonLink={homePage.buttonLink}
        />
      )}

      <LatestNews posts={latestPosts} newsTitle={homePage?.newsTitle ?? null} />

      {/*
        Map section (deferred to a later phase): homePage.mapTitle /
        homePage.mapSubtitle already exist in the WPGraphQL schema but are
        deliberately not queried yet. It slots in here, as the 5th section,
        once built -- appending it after News requires no reordering of the
        4 sections above.
      */}
    </>
  );
}
