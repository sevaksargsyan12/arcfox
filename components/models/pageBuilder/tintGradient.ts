// Car-color-keyed tint treatment, extracted from ColorsSpecs.tsx so the
// Home page's Model Showcase Slider can share the exact same visual
// language instead of duplicating these gradient strings.
//
// Every consumer sets a `--section-background-color` CSS custom property
// (typically on the element these are used from, or an ancestor) and these
// gradients read it via `var(...)`.

// Shared with the top tint band -- both are the same car-color-keyed tint,
// just at different widths/positions, so they read as one continuous
// treatment rather than two unrelated gradients.
export const TINT_GRADIENT =
  "linear-gradient(to right, color-mix(in srgb, var(--section-background-color), #fff 40%) 0, hsla(0, 0%, 85%, .06) 20%, transparent 50%, hsla(0, 0%, 85%, .06) 80%, color-mix(in srgb, var(--section-background-color), #fff 40%) 100%)";

// Same car-color-keyed tint as TINT_GRADIENT, but running top-to-bottom over
// the whole content column instead of left-to-right over one band, and
// softer still (more white-mixed, lower mid-band opacity).
export const TINT_GRADIENT_VERTICAL =
  "linear-gradient(to bottom, color-mix(in srgb, var(--section-background-color), #fff 55%) 0, hsla(0, 0%, 85%, .04) 20%, transparent 50%, hsla(0, 0%, 85%, .04) 80%, color-mix(in srgb, var(--section-background-color), #fff 55%) 100%)";

// TINT_GRADIENT(_VERTICAL) already mixes the tint color with white -- for a
// color that's already near-white itself (a literal "white" paint option,
// but the same logic applies to any pale/pearl color), that mix lands on
// pure (or near-pure) white and disappears against the page's own white
// background. Clamp any color this light to a visible light gray instead,
// by the same rule for every color rather than special-casing "white".
export function visibleTintColor(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const perceivedLightness = 0.299 * r + 0.587 * g + 0.114 * b; // 0-255
  return perceivedLightness > 235 ? "#d4d4d4" : hex;
}
