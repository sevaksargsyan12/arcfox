"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { SectionOf } from "./types";

type MetricsSliderSection = SectionOf<"metricsSlider">;

/**
 * Max-width 1320px (not full width). Swipeable image slider with no visible
 * nav arrows, a tab row of every slide's `slideTitle` below it, then the
 * active slide's `slideHeading` centered below the tabs. Metrics (when
 * present -- confirmed some slides have none) sit along the bottom of the
 * image: label large/bold, value caption -- the opposite convention from
 * Exterior's `metrics[]` despite the identical field names, confirmed from
 * real data. Mobile reorders title/heading above the slider and moves
 * metrics below the image instead of overlaying it.
 */
export function MetricsSlider({ title, subtitle, slides }: MetricsSliderSection) {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const current = slides[active];

  function goTo(i: number) {
    swiperRef.current?.slideTo(i);
  }

  const metricsRow = current.metrics && current.metrics.length > 0 ? (
    // flex-nowrap + flex-1 at md+ keeps every metric on one row on desktop
    // regardless of count/text length -- font-size uses a vw-scaled clamp()
    // instead of a fixed Tailwind size, so long labels shrink to fit rather
    // than wrapping onto a second line. Mobile keeps the original
    // wrap-if-needed behavior (narrower column, stacked below the image).
    <div className="flex flex-wrap gap-6 md:flex-nowrap md:justify-between md:gap-4">
      {current.metrics.map((m) => (
        <div key={m.label} className="md:min-w-0 md:flex-1">
          <p className="font-bold" style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)" }}>
            {m.label}
          </p>
          {/* White on the on-image desktop overlay; a visible gray on
              mobile, where this same row sits below the image on a plain
              light background instead (white would vanish there). */}
          <div className="my-2 h-px w-20 bg-charcoal-500/30 md:bg-white" />
          <p className="text-charcoal-600 md:text-white/85" style={{ fontSize: "clamp(0.8rem, 1vw, 1rem)" }}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <section className="section-metrics-slider py-16 md:py-24">
      <div className="container-max mx-auto max-w-330">
        {(title || subtitle) && (
          <div className="text-center">
            {title && <h2 className="font-display text-3xl font-semibold">{title}</h2>}
            {subtitle && <p className="mt-2 text-lg text-charcoal-600">{subtitle}</p>}
          </div>
        )}

        {/* Mobile-only: title/heading above the slider */}
        <div className="mt-6 text-center md:hidden">
          <h3 className="font-display text-xl font-semibold">{current.slideTitle}</h3>
          <p className="mt-1 text-base text-charcoal-600">{current.slideHeading}</p>
        </div>

        <div className="mt-6">
          <Swiper onSwiper={(s) => (swiperRef.current = s)} onSlideChange={(s) => setActive(s.activeIndex)} slidesPerView={1}>
            {slides.map((slide, i) => {
              const image = slide.imageDesktop ?? slide.imageMobile;
              return (
                <SwiperSlide key={i}>
                  <div className="relative overflow-hidden rounded-2xl">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={slide.slideTitle} className="aspect-[16/8] w-full object-cover" />
                    ) : (
                      <div className="aspect-[16/8] w-full bg-charcoal-700" />
                    )}
                    {/* Metrics overlay renders regardless of image so real
                        metric text is never dropped for a slide with no
                        photo yet. */}
                    {i === active && metricsRow && (
                      // Inset 120px from both edges (not full-bleed on the
                      // image) so the metrics band reads as a centered,
                      // max-width block rather than stretching edge-to-edge
                      // -- same "don't just fill the image" idea as
                      // Exterior's mx-auto max-w image wrapper. No
                      // background box behind it -- text sits directly on
                      // the photo.
                      <div className="absolute inset-x-30 bottom-0 hidden p-6 text-white md:block">
                        {metricsRow}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Mobile-only: metrics below the image, not on it */}
        {metricsRow && <div className="mt-6 md:hidden">{metricsRow}</div>}

        <div className="mt-8 flex flex-wrap justify-center gap-10 border-b border-charcoal-500/15 pb-5">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`px-1 text-lg font-medium ${
                i === active ? "border-b-2 border-ink pb-2 text-ink" : "text-charcoal-500 hover:text-ink"
              }`}
            >
              {slide.slideTitle}
            </button>
          ))}
        </div>

        {/* Desktop-only: active slide's heading, centered, non-interactive */}
        <p className="mt-4 hidden text-center text-lg text-charcoal-600 md:block">{current.slideHeading}</p>
      </div>
    </section>
  );
}
