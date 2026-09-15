"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { SectionOf } from "./types";

type AppearanceSliderSection = SectionOf<"appearanceSlider">;

// Swiper's loop mode needs enough real slides to clone from, or the wrap-
// around edge shows blank space instead of the next/previous slide. With
// only a handful of real slides (3 is the common real-data case), repeat
// them until there are at least this many before handing the array to
// Swiper, rather than relying on `loopAdditionalSlides` guesswork.
const MIN_LOOP_SLIDES = 6;

/**
 * Full width, infinite-looping (swipe past either end and it wraps rather
 * than stopping): 1.2 slides visible on mobile (a small peek of the next
 * one), 2.5 on desktop. `textOnImage` overlays bottom-center. Dots render
 * in their own row below the slider (not Swiper's default overlaid
 * pagination), one per REAL slide (not per looped/duplicated copy).
 *
 * A slide with `textOnImage` but no image still renders (as a plain tinted
 * card carrying just the text) rather than being dropped -- confirmed real
 * case (T5's 3 slides all have real caption text but no images yet).
 */
export function AppearanceSlider({
  title,
  subtitle,
  slides,
}: AppearanceSliderSection) {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  // Repeat the real slides so Swiper's loop has enough clones to draw from
  // (e.g. 3 real slides -> 6 rendered), so swiping past either end always
  // wraps into a real slide instead of blank space. Dots still reflect only
  // the `slides.length` real/unique slides.
  const displaySlides =
    slides.length > 0 && slides.length < MIN_LOOP_SLIDES
      ? Array.from({
          length: Math.ceil(MIN_LOOP_SLIDES / slides.length),
        }).flatMap(() => slides)
      : slides;

  return (
    <section className="section-appearance-slider py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && (
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
          )}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex % slides.length)}
        loop={slides.length > 1}
        spaceBetween={16}
        slidesPerView={2.5}
        centeredSlides={false}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
            centeredSlides: true,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.5,
            centeredSlides: true,
            spaceBetween: 20,
          },
        }}
        className="mt-8 px-4 pb-10 md:px-8"
      >
        {displaySlides.map((slide, i) => {
          const image = slide.imageDesktop ?? slide.imageMobile;
          return (
            <SwiperSlide key={i}>
              <div className="relative overflow-hidden rounded-2xl">
                {image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageDesktop ?? image}
                      alt={slide.textOnImage ?? ""}
                      className="hidden h-95 w-full object-cover md:block"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageMobile ?? image}
                      alt={slide.textOnImage ?? ""}
                      className="h-95 w-full object-cover md:hidden"
                    />
                  </>
                ) : (
                  <div className="h-95 w-full bg-charcoal-700" />
                )}
                {slide.textOnImage && (
                  <p className="absolute inset-x-0 bottom-4 text-center text-sm font-medium text-white drop-shadow">
                    {slide.textOnImage}
                  </p>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {slides.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}`}
              aria-current={i === active}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-brand-blue" : "w-2 bg-charcoal-500/30"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
