"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { SectionOf } from "./types";

type AppearanceSliderSection = SectionOf<"appearanceSlider">;

/**
 * Full width. 2.5 slides on desktop (partial next/prev visible), 1 centered
 * slide with dots on mobile. `textOnImage` overlays bottom-center.
 *
 * A slide with `textOnImage` but no image still renders (as a plain tinted
 * card carrying just the text) rather than being dropped -- confirmed real
 * case (T5's 3 slides all have real caption text but no images yet).
 */
export function AppearanceSlider({ title, subtitle, slides }: AppearanceSliderSection) {
  return (
    <section className="py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1.08}
        centeredSlides
        breakpoints={{ 768: { slidesPerView: 2.5, centeredSlides: false, spaceBetween: 20 } }}
        className="mt-8 px-4 pb-10 md:px-8"
      >
        {slides.map((slide, i) => {
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
                      className="hidden aspect-[4/3] w-full object-cover md:block"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageMobile ?? image}
                      alt={slide.textOnImage ?? ""}
                      className="aspect-[4/3] w-full object-cover md:hidden"
                    />
                  </>
                ) : (
                  <div className="aspect-[4/3] w-full bg-charcoal-700" />
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
    </section>
  );
}
