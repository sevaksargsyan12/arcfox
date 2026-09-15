import { getTranslations } from "next-intl/server";
import { SectionOf } from "./types";

type ExteriorSection = SectionOf<"exterior">;

/**
 * Image capped at 1800px (not full width), centered. `headingOnImage`
 * bottom-left; `metrics[]` bottom-right as bordered boxes on desktop
 * (value large / label caption -- same convention as the ColorsSpecs specs
 * grid, confirmed from real data). On mobile the metrics move below the
 * image into a 2-column grid instead of overlaying it (confirmed from the
 * exterior mobile screenshot).
 *
 * `headingOnImage`/`metrics` must render even when there's no image --
 * confirmed real case (T5 has 3 real metrics but no exterior photo yet);
 * they render as a plain block below the title instead of being lost.
 */
export async function Exterior({ title, subtitle, headingOnImage, imageDesktop, imageMobile, metrics }: ExteriorSection) {
  const t = await getTranslations("models.pageBuilder");
  const image = imageDesktop ?? imageMobile;

  return (
    <section className="section-exterior py-16 md:py-24">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="mt-2 text-charcoal-600">{subtitle}</p>}
        </div>
      )}

      <div className="container-max mt-8">
        {image ? (
          <div className="relative mx-auto max-w-[1800px] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDesktop ?? image}
              alt={headingOnImage ?? title ?? ""}
              className="hidden w-full object-cover md:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageMobile ?? image}
              alt={headingOnImage ?? title ?? ""}
              className="w-full object-cover md:hidden"
            />

            {headingOnImage && (
              <div
                className="heading-on-image absolute bottom-4 left-4 hidden max-w-sm rounded-md p-4 text-lg font-semibold text-white md:block"
                style={{ background: "linear-gradient(90deg, #3ba8dc, #86dbfc33)" }}
              >
                {headingOnImage}
              </div>
            )}

            {metrics.length > 0 && (
              <div className="metrics absolute bottom-0 right-0 p-4 hidden md:flex">
                {metrics.map((m) => (
                  <div key={m.label} className="border-r border-white/30 px-5 py-3 text-right text-white last:border-r-0">
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className="text-xs uppercase tracking-wide text-white/80">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          headingOnImage && (
            <div className="heading-on-image mx-auto max-w-[1800px] rounded-2xl bg-form-bg p-6 text-center">
              <p className="text-lg font-semibold text-charcoal-800">{headingOnImage}</p>
              <p className="mt-1 text-xs text-charcoal-500">{t("noImage")}</p>
            </div>
          )
        )}

        {metrics.length > 0 && (
          <div className={`metrics mt-6 grid grid-cols-2 gap-6 ${image ? "md:hidden" : ""}`}>
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-base font-bold">{m.value}</p>
                <p className="text-xs uppercase tracking-wide text-charcoal-500">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
