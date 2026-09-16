"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { SectionOf } from "./types";

type AdditionalCharacteristics2Section = SectionOf<"additionalCharacteristics2">;

// Minimum horizontal drag distance (px) before a swipe counts as a
// slide-change instead of a tap/scroll.
const SWIPE_THRESHOLD_PX = 40;

/**
 * Full-bleed, edge-to-edge image (no container-max cap), same width
 * treatment as AdditionalCharacteristics. Unlike AC1, this isn't a
 * per-slide sliding carousel: per the reference screenshot, every slide's
 * number/title/info renders simultaneously as its own column overlaid on
 * one image -- the active column is fully opaque white, the rest sit at
 * 50% white -- and the on-image arrows (top-right) just move which column
 * is active (swapping the background image too, for a slide that does
 * carry its own distinct photo).
 *
 * Since there's no Swiper track here, swipe-to-change is a small hand-
 * rolled pointer-drag (same plain-pointer-events approach as the spin
 * viewer's useSpinDrag -- no gesture library), and the image gets a short
 * fade transition on every slide change instead of swapping instantly.
 *
 * Mobile collapses to the same "text below the image, no overlay/number"
 * pattern as AdditionalCharacteristics's mobile layout -- 3 side-by-side
 * columns don't stay legible at that width.
 */
export function AdditionalCharacteristics2({ title, subtitle, slides }: AdditionalCharacteristics2Section) {
  const t = useTranslations("models.pageBuilder");
  const [active, setActive] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const dragStartX = useRef<number | null>(null);
  const current = slides[active];
  const image = current.imageDesktop ?? current.imageMobile;

  function go(delta: number) {
    setActive((i) => (i + delta + slides.length) % slides.length);
  }

  // Reset "faded out" synchronously during render when the active slide
  // changes (React's recommended alternative to an effect for this --
  // same pattern as HeaderClient's route-change reset), then let an
  // effect schedule fading it back in one frame later.
  const [prevActiveForFade, setPrevActiveForFade] = useState(active);
  if (active !== prevActiveForFade) {
    setPrevActiveForFade(active);
    setImageVisible(false);
  }

  useEffect(() => {
    if (imageVisible) return;
    const id = requestAnimationFrame(() => setImageVisible(true));
    return () => cancelAnimationFrame(id);
  }, [imageVisible]);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    go(delta < 0 ? 1 : -1);
  }

  return (
    <section className="section-additional-characteristics2 py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <div className="relative mt-8">
        <div
          className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageDesktop ?? image}
                alt={current.slideTitle}
                draggable={false}
                className={`hidden aspect-16/7 w-full object-cover transition-opacity duration-300 md:block ${
                  imageVisible ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageMobile ?? image}
                alt={current.slideTitle}
                draggable={false}
                className={`aspect-4/3 w-full object-cover transition-opacity duration-300 md:hidden ${
                  imageVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="hidden aspect-16/7 w-full bg-charcoal-700 md:block" />
          )}

          {/* Desktop-only: every slide's number/title/info as its own
              column, all visible at once, flush against each other (no
              radius, no gap) -- one merged white top border across the
              whole row, and a white right border between columns instead
              of each box having its own border/radius. Active column is
              darker + opaque white text, the rest sit at 50% white (per
              the reference screenshot). */}
          <div className="absolute inset-x-0 bottom-0 hidden border-t border-white bg-linear-to-t from-black/70 to-transparent md:flex ">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`flex-1 border-r border-white p-4 transition-all duration-300 last:border-r-0 ${
                  i === active ? "bg-black/40 text-white" : "bg-black/15 text-white/50"
                }`}
              >
                <p className="text-sm">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-lg font-semibold">{slide.slideTitle}</h3>
                <div
                  className="g-html mt-1 max-w-md text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(slide.infoHtml) }}
                />
              </div>
            ))}
          </div>

          {/* Desktop-only: on-image nav arrows, top-right */}
          <div className="absolute right-4 top-4 hidden gap-2 md:flex">
            <button
              type="button"
              aria-label={t("prevSlide")}
              onClick={() => go(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label={t("nextSlide")}
              onClick={() => go(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Mobile-only: text below the image, no overlay/number */}
        <div className="mt-6 px-6 md:hidden">
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
