import { SectionOf } from "./types";

type HeroSection = SectionOf<"hero">;

/**
 * Full-bleed hero, no max-width -- image scales to fill the viewport at any
 * zoom level (per reference/model_page/hero/styles.txt). Title/subtitle sit
 * top-left on desktop, centered on mobile (confirmed from the hero + hero
 * mobile screenshots -- the text spec only mentions the desktop position).
 * Nudged slightly up and left of dead-center, with a lighter overlay/brighter
 * image and a wider, bolder body-font title, to sit closer to the
 * reference's brighter, higher, non-condensed hero treatment.
 *
 * Falls back to a plain dark background when both images are missing --
 * confirmed real case (T5 currently has no hero image at all) -- rather than
 * rendering a broken/empty <img>.
 */
export function Hero({ title, subtitle, imageDesktop, imageMobile }: HeroSection) {
  const hasImage = imageDesktop || imageMobile;

  return (
    // -mt-20 pulls the hero up under the sticky header, matching the site's
    // existing hero treatment (components/home/Hero.tsx).
    <section className="section-hero relative -mt-20 flex h-screen items-center overflow-hidden bg-charcoal-900">
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageDesktop ?? imageMobile ?? undefined}
            alt={title ?? ""}
            className="absolute inset-0 hidden h-full w-full object-cover brightness-110 md:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageMobile ?? imageDesktop ?? undefined}
            alt={title ?? ""}
            className="absolute inset-0 h-full w-full object-cover brightness-110 md:hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        </>
      )}

      {(title || subtitle) && (
        <div className="container-max relative z-10 -mt-10 flex w-full flex-col items-center text-center text-white md:-mt-31.25 md:ml-15 md:items-start md:text-left">
          {title && <h1 className="font-body text-4xl font-bold tracking-wide md:text-6xl">{title}</h1>}
          {subtitle && <p className="mt-3 max-w-md whitespace-pre-line font-body text-lg text-white/85 md:text-xl">{subtitle}</p>}
        </div>
      )}
    </section>
  );
}
