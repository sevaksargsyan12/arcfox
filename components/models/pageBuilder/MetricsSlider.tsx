"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { SectionOf } from "./types";

type MetricsSliderSection = SectionOf<"metricsSlider">;

/**
 * Max-width 1800px (not full width). Swipeable image slider with no visible
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
    <div className="flex flex-wrap gap-6">
      {current.metrics.map((m) => (
        <div key={m.label}>
          <p className="text-lg font-bold">{m.label}</p>
          <p className="text-sm text-charcoal-600 md:text-white/85">{m.value}</p>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <section className="section-metrics-slider py-16 md:py-24">
      <div className="container-max mx-auto max-w-[1800px]">
        {(title || subtitle) && (
          <div className="text-center">
            {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
            {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
          </div>
        )}

        {/* Mobile-only: title/heading above the slider */}
        <div className="mt-6 text-center md:hidden">
          <h3 className="font-display text-lg font-semibold">{current.slideTitle}</h3>
          <p className="mt-1 text-sm text-charcoal-600">{current.slideHeading}</p>
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
                      <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/60 to-transparent p-6 text-white md:block">
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

        <div className="mt-6 flex flex-wrap justify-center gap-6 border-b border-charcoal-500/15 pb-4">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`text-sm font-medium ${
                i === active ? "border-b-2 border-ink pb-1 text-ink" : "text-charcoal-500 hover:text-ink"
              }`}
            >
              {slide.slideTitle}
            </button>
          ))}
        </div>

        {/* Desktop-only: active slide's heading, centered, non-interactive */}
        <p className="mt-4 hidden text-center text-charcoal-600 md:block">{current.slideHeading}</p>
      </div>
    </section>
  );
}
