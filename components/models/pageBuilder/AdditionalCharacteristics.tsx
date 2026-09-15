"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { SectionOf } from "./types";

type AdditionalCharacteristicsSection = SectionOf<"additionalCharacteristics">;

/**
 * Full-width swipeable image slider. Desktop: slideTitle + info (WYSIWYG,
 * sanitized) sit below the image on the left, nav arrows on the right, same
 * row. Mobile: the arrows move onto the image itself (left/right center),
 * title/subtitle move above the slider (confirmed from the mobile
 * screenshot -- the text spec doesn't call out the title reposition).
 */
export function AdditionalCharacteristics({ title, subtitle, slides }: AdditionalCharacteristicsSection) {
  const t = useTranslations("models.pageBuilder");
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const current = slides[active];

  return (
    <section className="py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <div className="relative mt-8">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
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
                    <div className="aspect-[4/3] w-full bg-form-bg md:aspect-[16/7]" />
                  )}
                  {/* Mobile-only nav arrows, on the image (or its placeholder) */}
                  <button
                    type="button"
                    aria-label={t("prevSlide")}
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 md:hidden"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label={t("nextSlide")}
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 md:hidden"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Desktop-only below-image row */}
        <div className="container-max mt-6 hidden items-start justify-between gap-8 md:flex">
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold">{current.slideTitle}</h3>
            <div
              className="g-html mt-2 max-w-lg text-sm text-charcoal-600"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.infoHtml) }}
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label={t("prevSlide")}
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-500/30 hover:border-brand-blue"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={t("nextSlide")}
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-500/30 hover:border-brand-blue"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mobile-only text (arrows are on the image above) */}
        <div className="container-max mt-6 md:hidden">
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
