"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SpinViewer } from "./SpinViewer/SpinViewer";
import { SectionOf } from "./types";

type ColorsSpecsSection = SectionOf<"colorsSpecs">;

// Shared with the top tint band -- both are the same car-color-keyed tint,
// just at different widths/positions, so they read as one continuous
// treatment rather than two unrelated gradients.
const TINT_GRADIENT =
  "linear-gradient(to right, color-mix(in srgb, var(--section-background-color), #fff 40%) 0, hsla(0, 0%, 85%, .06) 20%, transparent 50%, hsla(0, 0%, 85%, .06) 80%, color-mix(in srgb, var(--section-background-color), #fff 40%) 100%)";

// Same car-color-keyed tint as TINT_GRADIENT, but running top-to-bottom over
// the whole content column instead of left-to-right over one band, and
// softer still (more white-mixed, lower mid-band opacity).
const TINT_GRADIENT_VERTICAL =
  "linear-gradient(to bottom, color-mix(in srgb, var(--section-background-color), #fff 55%) 0, hsla(0, 0%, 85%, .04) 20%, transparent 50%, hsla(0, 0%, 85%, .04) 80%, color-mix(in srgb, var(--section-background-color), #fff 55%) 100%)";

// TINT_GRADIENT(_VERTICAL) already mixes the tint color with white -- for a
// color that's already near-white itself (a literal "white" paint option,
// but the same logic applies to any pale/pearl color), that mix lands on
// pure (or near-pure) white and disappears against the page's own white
// background. Clamp any color this light to a visible light gray instead,
// by the same rule for every color rather than special-casing "white".
function visibleTintColor(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const perceivedLightness = 0.299 * r + 0.587 * g + 0.114 * b; // 0-255
  return perceivedLightness > 235 ? "#d4d4d4" : hex;
}

export function ColorsSpecs({ title, subtitle, modelNameDisplay, colors, specs }: ColorsSpecsSection) {
  const t = useTranslations("models");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = colors[selectedIndex] ?? colors[0];

  return (
    <section
      className="section-colors-specs relative overflow-hidden pt-0 pb-16 md:pb-24"
      style={
        { "--section-background-color": visibleTintColor(selected.sectionBackgroundColor) } as React.CSSProperties
      }
    >
      {/* Tint band from the spec, keyed to the active color. */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[6.1em] w-full opacity-50 mix-blend-multiply"
        style={{ background: TINT_GRADIENT }}
      />

      <div className="relative middle pt-10" style={{ background: TINT_GRADIENT_VERTICAL }}>
        {(title || subtitle) && (
          <div className="text-center">
            {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
            {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
          </div>
        )}

        {modelNameDisplay && (
          <p className="mt-4 text-center font-display text-7xl font-black text-charcoal-800/10 select-none md:text-9xl">
            {modelNameDisplay}
          </p>
        )}

        <div className="container-max -mt-6 md:-mt-10">
          {selected.spinFrames.length > 0 ? (
            <SpinViewer frames={selected.spinFrames} alt={`${modelNameDisplay ?? ""} ${selected.label}`} hint={t("spinHint")} />
          ) : (
            <div className="flex aspect-[2.5/1] w-full items-center justify-center text-sm text-charcoal-500">
              {t("pageBuilder.noImage")}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              {colors.map((color, i) => (
                <button
                  key={color.label + i}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={i === selectedIndex}
                  onClick={() => setSelectedIndex(i)}
                  className={`h-9 w-9 rounded-full cursor-pointer border-2 transition-transform ${
                    i === selectedIndex ? "scale-110 border-brand-blue" : "border-charcoal-500/20"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            <p className="text-sm text-charcoal-500">{selected.label}</p>
          </div>
        </div>

        {specs.length > 0 && (
          // Full-width band (not container-max) so the car-color tint can
          // bleed edge-to-edge behind the specs, same gradient as the top
          // tint band -- matches the reference, where selecting a color
          // re-tints this whole strip, not just the centered grid.
          <div className="relative mt-10 w-full py-2" style={{ background: TINT_GRADIENT }}>
            <div className="specs-grid container-max grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="text-center">
                  {/* Typography + divider lifted from the reference's
                      specs-grid rule (`border-bottom: 1px solid #999; font:
                      500 1.67vw/1.2 DINNextW1G-Regular; padding: 0 1em 0
                      .5em;`) -- DINNextW1G is licensed, so this uses the
                      project's existing free lookalike (font-body/Inter) at
                      the same weight/line-height. The raw `1.67vw` is
                      clamped (~15-22px) instead of left unbounded, since an
                      unclamped vw unit would shrink illegibly small on a
                      narrow phone and oversized on an ultra-wide monitor. */}
                  <p
                    className="border-b border-[#999] pb-2 pl-[.5em] pr-[1em] font-body font-medium text-charcoal-800"
                    style={{ fontSize: "clamp(0.95rem, 1.67vw, 1.375rem)", lineHeight: 1.2 }}
                  >
                    {spec.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-charcoal-500">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
