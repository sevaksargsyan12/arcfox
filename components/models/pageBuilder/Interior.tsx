"use client";

import { useState } from "react";
import { SectionOf } from "./types";

type InteriorSection = SectionOf<"interior">;

/** Full-width image; centered circular swatch-icon row below it. Clicking a
 *  variant swaps the displayed image. Falls back to a plain colored dot
 *  (using `colorSwatch`) when a variant has no `swatchIconUrl` -- confirmed
 *  real case (T5's variants have no icon images yet), and exactly what
 *  `colorSwatch` exists for. */
export function Interior({ title, subtitle, variants }: InteriorSection) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = variants[selectedIndex] ?? variants[0];
  const image = selected.imageDesktop ?? selected.imageMobile;

  return (
    <section className="py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      {image && (
        <div className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.imageDesktop ?? image}
            alt={title ?? ""}
            className="hidden aspect-[16/7] w-full object-cover md:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.imageMobile ?? image}
            alt={title ?? ""}
            className="aspect-[4/3] w-full object-cover md:hidden"
          />
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-3">
        {variants.map((variant, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={i === selectedIndex}
            onClick={() => setSelectedIndex(i)}
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-transform ${
              i === selectedIndex ? "scale-110 border-brand-blue" : "border-charcoal-500/20"
            }`}
            style={variant.swatchIconUrl ? undefined : { backgroundColor: variant.colorSwatch }}
          >
            {variant.swatchIconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={variant.swatchIconUrl} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
