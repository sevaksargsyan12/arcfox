"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { SectionOf } from "./types";

type AdditionalCharacteristics2Section = SectionOf<"additionalCharacteristics2">;

/**
 * Same idea as AdditionalCharacteristics, except on desktop the slideTitle +
 * info sit as an overlay on the bottom of the image (not a row below it),
 * with a slide number ("01", "02"...) above the title, and nav arrows
 * on-image top-right. On mobile this collapses to the same "text below the
 * image, dot pagination" pattern as AdditionalCharacteristics's mobile
 * layout -- confirmed from the mobile screenshot, which drops the overlay
 * and slide-number treatment entirely at that width.
 */
export function AdditionalCharacteristics2({ title, subtitle, slides }: AdditionalCharacteristics2Section) {
  const t = useTranslations("models.pageBuilder");
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const current = slides[active];
  const slideNumber = String(active + 1).padStart(2, "0");

  return (
    <section className="py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <div className="container-max mt-8">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.activeIndex)}
          slidesPerView={1}
          className="overflow-hidden rounded-2xl pb-8 md:pb-0"
        >
          {slides.map((slide, i) => {
            const image = slide.imageDesktop ?? slide.imageMobile;
            return (
              <SwiperSlide key={i}>
                <div className="relative">
                  {image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageDesktop ?? image}
                        alt={slide.slideTitle}
                        className="hidden aspect-[16/7] w-full object-cover md:block"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageMobile ?? image}
                        alt={slide.slideTitle}
                        className="aspect-[4/3] w-full object-cover md:hidden"
                      />
                    </>
                  ) : (
                    <div className="hidden aspect-[16/7] w-full bg-charcoal-700 md:block" />
                  )}

                  {/* Desktop-only: bottom overlay with slide number + text --
                      shown regardless of whether there's an image (confirmed
                      real case: T5's slides all lack images but have real
                      slideTitle/info content that must not be dropped). */}
                  <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/70 to-transparent p-6 text-white md:block">
                    <p className="text-sm text-white/70">{slideNumber}</p>
                    <h3 className="font-display text-lg font-semibold">{slide.slideTitle}</h3>
                    <div
                      className="g-html mt-1 max-w-md text-sm text-white/85"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(slide.infoHtml) }}
                    />
                  </div>

                  {/* Desktop-only: on-image nav arrows, top-right */}
                  <div className="absolute right-4 top-4 hidden gap-2 md:flex">
                    <button
                      type="button"
                      aria-label={t("prevSlide")}
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={t("nextSlide")}
                      onClick={() => swiperRef.current?.slideNext()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Mobile-only: text below the image, no overlay/number */}
        <div className="mt-6 md:hidden">
          <h3 className="font-display text-lg font-semibold">{current.slideTitle}</h3>
          <div
            className="g-html mt-2 text-sm text-charcoal-600"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.infoHtml) }}
          />
        </div>
      </div>
    </section>
  );
}
