"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SpinViewer } from "./SpinViewer/SpinViewer";
import { SectionOf } from "./types";

type ColorsSpecsSection = SectionOf<"colorsSpecs">;

export function ColorsSpecs({ title, subtitle, modelNameDisplay, colors, specs }: ColorsSpecsSection) {
  const t = useTranslations("models");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = colors[selectedIndex] ?? colors[0];

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ "--section-background-color": selected.sectionBackgroundColor } as React.CSSProperties}
    >
      {/* Tint band from the spec, keyed to the active color. */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[6.1em] w-full opacity-50 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--section-background-color), #fff 15%) 0, hsla(0, 0%, 85%, .1) 20%, transparent 50%, hsla(0, 0%, 85%, .1) 80%, color-mix(in srgb, var(--section-background-color), #fff 15%) 100%)",
        }}
      />

      <div className="relative">
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
                  className={`h-9 w-9 rounded-full border-2 transition-transform ${
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
          <div className="container-max mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="text-center">
                <p className="font-display text-2xl font-bold text-charcoal-800 md:text-3xl">{spec.value}</p>
                <div className="mx-auto mt-2 h-px w-16 bg-charcoal-500/30" />
                <p className="mt-2 text-xs uppercase tracking-wide text-charcoal-500">{spec.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
