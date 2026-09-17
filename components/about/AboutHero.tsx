import { Reveal } from "@/components/ui/Reveal";

interface AboutHeroProps {
  imageUrl: string | null;
  imageMobileUrl: string | null;
  heroText: string | null;
}

export function AboutHero({ imageUrl, imageMobileUrl, heroText }: AboutHeroProps) {
  const image = imageUrl ?? imageMobileUrl;
  if (!image && !heroText) return null;

  return (
    // -mt-20 pulls the hero up under the sticky header, matching the site's
    // established hero treatment (see components/models/pageBuilder/Hero.tsx).
    // Unlike that h-screen/object-cover treatment, this image is NOT cropped
    // to a fixed viewport height -- it's rendered in normal flow at `w-full`
    // with no height constraint, so the full image is always visible at
    // whatever height its own aspect ratio produces (same sizing convention
    // as the Exterior section's image).
    <section className="about-hero relative -mt-20 overflow-hidden">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl ?? image} alt="" className="hidden w-full object-cover md:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageMobileUrl ?? image} alt="" className="w-full object-cover md:hidden" />
          <div className="absolute inset-0 bg-black/30" />
        </>
      )}
      {heroText && (
        <Reveal
          className={
            image
              ? "absolute inset-0 z-10 flex items-center justify-center px-4 text-center"
              : "flex items-center justify-center px-4 py-24 text-center"
          }
        >
          <h1
            className={`max-w-4xl font-display text-4xl font-bold md:text-6xl ${image ? "text-white" : ""}`}
          >
            {heroText}
          </h1>
        </Reveal>
      )}
    </section>
  );
}
