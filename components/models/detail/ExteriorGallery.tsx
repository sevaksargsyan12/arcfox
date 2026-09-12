"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export function ExteriorGallery({ images, title, alt }: { images: string[]; title: string; alt: string }) {
  return (
    <div>
      <h2 className="text-center font-display text-2xl font-semibold">{title}</h2>
      <Swiper modules={[Navigation]} navigation spaceBetween={16} slidesPerView={1.15} className="mt-6" breakpoints={{
        768: { slidesPerView: 2.2 },
      }}>
        {images.map((src, i) => (
          <SwiperSlide key={src}>
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
