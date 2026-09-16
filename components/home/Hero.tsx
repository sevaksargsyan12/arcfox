"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { useTranslations } from "next-intl";
import { HeroSlide } from "@/lib/data/home";

// Autoplay-only Swiper module -- dots are hand-rolled (not Swiper's built-in
// pagination) because the spec requires an exact vertical stack order
// (bottom-anchored: dots lowest, then title, subtitle, button going up)
// that Swiper's default pagination position can't express. Same
// swiperRef + active-state + realIndex pattern as AppearanceSlider/
// MetricsSlider elsewhere in this codebase.
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const t = useTranslations("home.hero");
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  if (slides.length === 0) return null;

  return (
    // -mt-20 pulls the hero up under the sticky header, matching the site's
    // established hero treatment (see the Model page's own Hero.tsx).
    <section className="home-hero relative -mt-20 h-screen">
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex % slides.length)}
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={slides.length > 1}
        className="h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageDesktop ?? slide.imageMobile ?? undefined}
                alt={slide.title ?? ""}
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageMobile ?? slide.imageDesktop ?? undefined}
                alt={slide.title ?? ""}
                className="absolute inset-0 h-full w-full object-cover md:hidden"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom-anchored overlay, one column per slide's own text so only
          the active slide's title/subtitle/button show. DOM order here is
          top-to-bottom button -> subtitle -> title -> dots, which reads
          bottom-up (from the image's bottom edge) as dots -> title ->
          subtitle -> button, per spec. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-4 pb-10 text-center text-white md:pb-16">
        {slides.map(
          (slide, i) =>
            i === active && (
              <div key={i} className="flex flex-col items-center gap-3">
                {slide.buttonText && slide.link && (
                  // Plain <a>, not the locale-aware Link: the CMS stores
                  // this as a full absolute URL with a hardcoded locale
                  // segment baked in (e.g. "http://localhost:3000/en/
                  // models/kaola-s") rather than a relative path, so
                  // Link's own locale-prefixing would double up or show
                  // the wrong locale on the hy page. Flagging as a
                  // content-authoring issue to fix at the CMS source
                  // rather than parsing/rewriting the URL ourselves.
                  <a href={slide.link} className="btn">
                    {slide.buttonText}
                  </a>
                )}
                {slide.subtitle && <p className="max-w-md text-white/85">{slide.subtitle}</p>}
                {slide.title && (
                  <h1 className="font-display text-4xl font-bold md:text-6xl">{slide.title}</h1>
                )}
              </div>
            )
        )}

        {slides.length > 1 && (
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${t("goToSlide")} ${i + 1}`}
                aria-current={i === active}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
