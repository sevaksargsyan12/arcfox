"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ModelShowcaseEntry } from "@/lib/data/models";
import { Link } from "@/i18n/navigation";
import { ColorsSpecs } from "@/components/models/pageBuilder/ColorsSpecs";

/**
 * Pages through every model that has a real colorsSpecs section (data:
 * getModelShowcaseEntries) -- each slide renders the exact same
 * ColorsSpecs component/functionality as the Model detail page (360° spin
 * viewer, color swatches, specs grid, car-color-keyed tint/watermark), not
 * a simplified re-implementation, so the tint is automatically keyed to
 * each model's own real selected color. Swipe between models is
 * deliberately disabled (`allowTouchMove={false}`) -- switching models is
 * arrows-only here, so it can't be confused with dragging inside a slide
 * to spin the car; prev/next arrows (matching AdditionalCharacteristics2's
 * arrow-button style) sit centered at the bottom-middle of the section,
 * calling slidePrev()/slideNext() directly. A small "view model" link
 * overlays each
 * slide, since ColorsSpecs's own title/subtitle are the colors *section's*
 * generic heading ("COLORS"/etc.), not the model's marketing name.
 */
export function ModelShowcaseSlider({ entries }: { entries: ModelShowcaseEntry[] }) {
  const t = useTranslations("models.pageBuilder");
  const swiperRef = useRef<SwiperInstance | null>(null);

  if (entries.length === 0) return null;

  return (
    <section className="home-model-showcase relative overflow-hidden bg-white py-16 md:py-24">
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        loop={entries.length > 1}
        slidesPerView={1}
        allowTouchMove={false}
      >
        {entries.map((entry) => (
          <SwiperSlide key={entry.slug}>
            <div className="relative">
              <ColorsSpecs {...entry.colorsSpecs} />
              <Link
                href={`/models/${entry.slug}`}
                className="absolute right-6 top-6 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-white"
              >
                {entry.name}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {entries.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={t("prevSlide")}
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-500/30 hover:border-brand-blue"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={t("nextSlide")}
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-500/30 hover:border-brand-blue"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
