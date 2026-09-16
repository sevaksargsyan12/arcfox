"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ModelSummary } from "@/lib/data/models";
import { Link } from "@/i18n/navigation";
import { TINT_GRADIENT, TINT_GRADIENT_VERTICAL, visibleTintColor } from "@/components/models/pageBuilder/tintGradient";

// There's no per-model "sectionBackgroundColor" at the ModelSummary level
// (that field only exists per-color inside a model's own colorsSpecs
// page-builder section) -- so unlike ColorsSpecs.tsx, this keys the shared
// tint treatment to a fixed brand color rather than fabricating fake
// per-model color data.
const SHOWCASE_TINT_COLOR = visibleTintColor("#3ea3d7");

/**
 * Pages through every model (data: getModelsByLocale, the same function the
 * /models list page uses), one full model at a time -- reusing
 * ColorsSpecs.tsx's car-color-keyed tint gradients and giant faint
 * watermark treatment for visual consistency with the Model detail pages,
 * adapted to a fixed brand-blue tint since there's no per-model color here.
 * Swiper's own slide track gives swipe for free; prev/next arrows (matching
 * AdditionalCharacteristics2's arrow-button style) sit centered at the
 * bottom-middle of the section.
 */
export function ModelShowcaseSlider({ models }: { models: ModelSummary[] }) {
  const t = useTranslations("models.pageBuilder");
  const swiperRef = useRef<SwiperInstance | null>(null);

  if (models.length === 0) return null;

  return (
    <section
      className="home-model-showcase relative overflow-hidden bg-white py-16 md:py-24"
      style={{ "--section-background-color": SHOWCASE_TINT_COLOR } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-[6.1em] w-full opacity-50 mix-blend-multiply" style={{ background: TINT_GRADIENT }} />

      <div className="relative" style={{ background: TINT_GRADIENT_VERTICAL }}>
        <Swiper onSwiper={(s) => (swiperRef.current = s)} loop={models.length > 1} slidesPerView={1}>
          {models.map((model) => (
            <SwiperSlide key={model.slug}>
              <div className="relative pt-10">
                <p className="mt-4 text-center font-display text-7xl font-black text-charcoal-800/10 select-none md:text-9xl">
                  {model.name}
                </p>

                <div className="container-max -mt-6 md:-mt-10">
                  <div className="relative aspect-2.5/1 w-full overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={model.heroImageUrl}
                      alt={model.name}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>

                  <div className="mt-6 flex flex-col items-center gap-2 text-center">
                    <h2 className="font-display text-2xl font-semibold">{model.name}</h2>
                    {model.tagline && <p className="text-sm text-charcoal-500">{model.tagline}</p>}
                    <Link href={`/models/${model.slug}`} className="btn mt-2">
                      {model.name}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {models.length > 1 && (
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
      </div>
    </section>
  );
}
