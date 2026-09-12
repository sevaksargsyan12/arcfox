"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ModelSummary } from "@/lib/data/models";

export function Hero({ models }: { models: ModelSummary[] }) {
  const t = useTranslations("home.hero");

  return (
    // -mt-20 pulls the hero up under the sticky header (h-20) so the
    // header's transparent/white-text state actually overlays the image
    // instead of leaving a blank strip above it.
    <section className="relative -mt-20">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[560px] md:h-[720px]"
      >
        {models.map((model) => (
          <SwiperSlide key={model.slug}>
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={model.heroImageUrl}
                alt={model.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="container-max relative z-10 flex h-full flex-col items-start justify-end pb-20 text-white">
                <p className="font-display text-sm uppercase tracking-widest text-white/80">
                  {model.bodyType}
                </p>
                <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">{model.name}</h1>
                <p className="mt-3 max-w-md text-white/85">{model.tagline}</p>
                <Link href={`/models/${model.slug}`} className="btn mt-6">
                  {t("cta")}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
