# Model Detail Page + Translation Architecture — Implementation Spec

This document specifies (1) how bilingual (hy/en) content should be fetched and wired
into routing, and (2) the exact visual/behavioral spec for each of the 9 sections on
`/models/[slug]`, sourced from a real WordPress + WPGraphQL + ACF + Polylang backend.

Reference material provided alongside this file:
- `/reference/model_page/<section>/` — one folder per section, each containing a
  desktop screenshot, a `mobile.png`, and a `styles.txt` with exact field references
  (in `[brackets]`) and behavior notes. Use these as the visual/behavioral source of
  truth for each section — the screenshots are from the real reference site, styles.txt
  is written by the project owner describing exactly how each section should work.
- `/reference/graphql/` — verified, real GraphQL queries confirmed working against the
  live local WordPress backend (see query below). Read these before writing any data
  fetching code.

---

## 1. Translation / i18n data architecture

### Backend facts (confirmed, do not re-derive or guess)
- Backend: WordPress + ACF Pro + WPGraphQL + WPGraphQL for ACF + Polylang, running
  locally at `http://localhost/arcfox/graphql` (introspection is enabled locally only —
  never enable public introspection in production).
- Two real `Model` posts exist right now, each with a real Armenian and English
  translation: `kaola-s` / `kaola-s-hy`, `t5` / `t5-hy`.
- **Do not hardcode the `-hy` suffix pattern anywhere in the codebase.** It is an
  auto-generated Polylang slug for whichever translation was created second — it is not
  a stable rule (Armenian slugs may later be manually changed to real Armenian text,
  the same way mesropants.com uses real localized slugs, not auto-suffixed ones).
  All locale-to-post resolution must go through GraphQL's `language` filtering and
  `translations` connection, never through string manipulation of a slug.

### Required data-layer functions (in `lib/data/models.ts`)

```ts
// Returns every Model in the given locale — powers /models list page,
// header mega-menu, and generateStaticParams for the detail route.
getModelsByLocale(locale: 'hy' | 'en'): Promise<ModelSummary[]>

// Returns one Model's full page-builder content in the given locale,
// PLUS enough info to resolve the equivalent slug in the other locale
// (for the language switcher on the detail page).
getModelBySlug(slug: string, locale: 'hy' | 'en'): Promise<ModelDetail | null>
```

`getModelsByLocale` query pattern (already verified working):
```graphql
{
  models(where: { language: EN }) {   # or HY
    nodes {
      title
      slug
      modelMeta {
        tagline
        bodyType
        displayOrder
        listThumbnail { node { sourceUrl altText } }
      }
    }
  }
}
```

`getModelBySlug` must also fetch `language` and `translations` so the language
switcher can link to the correct equivalent post rather than guessing a slug pattern:
```graphql
{
  modelBy(slug: $slug) {
    title
    slug
    language { code }
    translations {
      ... on Model {
        slug
        language { code }
      }
    }
    modelMeta { ... }
    modelPageBuilder {
      pageBuilder {
        __typename
        ... on ModelPageBuilderPageBuilderHeroLayout { ... }
        # etc — see full verified query in /reference/graphql/
      }
    }
  }
}
```

If the post fetched by `slug` is not already in the requested `locale`, use its
`translations` array to find the entry whose `language.code` matches, and re-fetch (or
resolve) using that slug instead. This keeps routing decoupled from whatever slug
strings Polylang happens to generate.

### Routing recommendation
Use a **locale-neutral route param** for `/models/[slug]` — i.e. always link to a
model using its *current-locale* slug (from `getModelsByLocale`), not a fixed
cross-locale identifier. When the user switches language via the header switcher while
on a model detail page, use the `translations` data fetched in step above to redirect
to the equivalent post's slug in the new locale, rather than assuming a naming pattern.

### Media field shapes (confirmed from real query responses)
- Single image fields (Hero, Exterior, etc.) resolve as `{ node: { sourceUrl } }`.
- Gallery fields (`spin_frames`) resolve as `{ nodes: [{ sourceUrl }] }` (plural).
- Normalize both into plain strings/arrays in the adapter layer — components should
  never see the `node`/`nodes` GraphQL wrapper shape.

### Fallback behavior
Only 2 real Models exist right now. For any model slug the app references that isn't
one of these 2, fall back to existing mock data, and flag in your summary anywhere the
current mock lineup doesn't line up with the 2 real ones — do not delete or fabricate
mock models to force a match.

---

## 2. Model Detail Page — Section Specifications

The page is built from WordPress's `pageBuilder` flexible-content array. Each item's
`__typename` determines which component renders. Sections are optional per-model
(a model may omit any section, e.g. Video or Interior) — components must render
nothing gracefully when a layout is absent, not a broken/empty block.

### 2.1 Hero — `ModelPageBuilderPageBuilderHeroLayout`
Fields: `title`, `subtitle`, `imageDesktop`, `imageMobile`
- Full width, no max-width — image scales to fill the viewport at any zoom level.
- `title` and `subtitle` positioned top-left, overlaid on the image.
- See `/reference/model_page/hero/` for exact visual reference.

### 2.2 Colors & Specs — `ModelPageBuilderPageBuilderColorsSpecsLayout`
Fields: `title`, `subtitle`, `modelNameDisplay`, `colors[]` (`colorLabel`, `swatchHex`,
`spinFrames[]`, `sectionBackgroundColor`), `specs[]` (`label`, `value`)
- Full width. Five stacked sub-sections:
  1. `title` + `subtitle`, centered.
  2. `modelNameDisplay` — large centered watermark-style text behind the car.
  3. Car image area: default to `colors[0].spinFrames[0]`. Since ~9 frames exist per
     color, implement a drag/cursor-move 360° rotation effect (evaluate a small
     library for this — e.g. a simple frame-stepping component keyed to horizontal
     drag/mouse delta; no need for a heavy 3D engine, this is a flip-through-frames
     effect, not true 3D).
  4. Color swatch row: one swatch per `colors[]` entry, showing `swatchHex`, labeled
     with `colorLabel`. Clicking a swatch swaps the active `spinFrames[]` set and
     updates the section's background tint to that color's `sectionBackgroundColor`.
  5. Specs grid: each `specs[]` entry shows `value` (large) above `label` (small),
     with a center-dividing line, laid out left-to-right across all entries.
- Background treatment (apply behind section 5, using the active color's
  `sectionBackgroundColor` as `--section-background-color`):
  ```css
  background: linear-gradient(to right,
    color-mix(in srgb, var(--section-background-color), #fff 15%) 0,
    hsla(0, 0%, 85%, .1) 20%,
    transparent 50%,
    hsla(0, 0%, 85%, .1) 80%,
    color-mix(in srgb, var(--section-background-color), #fff 15%) 100%);
  height: 6.1em;
  mix-blend-mode: multiply;
  opacity: .5;
  position: absolute;
  top: 0; left: 0; width: 100%;
  ```
- See `/reference/model_page/colors_and_specs/` for exact visual reference.

### 2.3 Video — `ModelPageBuilderPageBuilderVideoLayout`
Fields: `videoFile`, `posterImage` (optional section — may be entirely absent)
- Full width video. Centered play icon overlay, does not autoplay.
- If `posterImage` exists, show it as the poster/thumbnail before play; if not, fall
  back to the video's own default first-frame appearance.

### 2.4 Exterior — `ModelPageBuilderPageBuilderExteriorLayout`
Fields: `title`, `subtitle`, `imageDesktop`, `imageMobile`, `headingOnImage`,
`metrics[]` (`label`, `value`)
- `title`/`subtitle` centered above the image.
- Image is NOT full width — max-width 1800px, centered.
- `headingOnImage` overlaid bottom-left of the image.
- `metrics[]` rendered bottom-right of the image as adjacent boxes, each separated by
  a right border.
- See `/reference/model_page/exterior/` for exact visual reference.

### 2.5 Appearance Slider — `ModelPageBuilderPageBuilderAppearanceSliderLayout`
Fields: `title`, `subtitle` (both optional — may be empty on some models),
`slides[]` (`imageDesktop`, `imageMobile`, `textOnImage`)
- Full width slider.
- Desktop: show 2.5 slides at once (partial next/prev slide visible).
- Mobile: show 1 centered slide (`imageMobile`) with dot indicators, swipeable.
- `textOnImage` overlaid bottom-center of each slide's image.

### 2.6 Interior — `ModelPageBuilderPageBuilderInteriorLayout`
Fields: `title`, `subtitle` (optional section — may be entirely absent),
`variants[]` (`colorSwatch`, `swatchIcon`, `imageDesktop`, `imageMobile`)
- Full width. `title`/`subtitle` centered above a full-width image.
- Below the image, centered: one circular `swatchIcon` per variant. Clicking a variant
  swaps the displayed `imageDesktop`/`imageMobile`.

### 2.7 Additional Characteristics — `ModelPageBuilderPageBuilderAdditionalCharacteristicsLayout`
Fields: `title`, `subtitle`, `characteristicSlides[]` (`imageDesktop`, `imageMobile`,
`slideTitle`, `info` — rich HTML, render via `dangerouslySetInnerHTML` or equivalent
sanitized HTML renderer)
- `title`/`subtitle` centered. Full-width swipeable image slider.
- Below the image (desktop): `slideTitle` + `info` on the left; navigation arrows on
  the right, same row.
- Mobile: navigation arrows move onto the image itself (left-center and right-center
  of the image), full-width image, no separate row below.

### 2.8 Additional Characteristics 2 — `ModelPageBuilderPageBuilderAdditionalCharacteristics2Layout`
Fields: identical shape to 2.7 (`characteristicSlides2[]` instead of
`characteristicSlides[]`)
- Same slider behavior as Additional Characteristics, EXCEPT: `slideTitle` and `info`
  are rendered as an overlay on the bottom of the image (not a separate row below it),
  and a slide index number ("01", "02", ...) appears above `slideTitle`.

### 2.9 Metrics Slider — `ModelPageBuilderPageBuilderMetricsSliderLayout`
Fields: `title`, `subtitle`, `metricSlides[]` (`imageDesktop`, `imageMobile`,
`slideTitle`, `slideHeading`, `metrics[]` — optional per slide, may be `null`)
- NOT full width — max-width 1800px.
- `title`/`subtitle` above the slider.
- Image slider: swipeable, no visible navigation arrows.
- Below the slider: a tab row of every slide's `slideTitle` — clicking a tab jumps to
  that slide's image.
- Below the tabs: the active slide's `slideHeading`, centered, full container width,
  not clickable/interactive.
- If the active slide has `metrics[]`, render each `label`/`value` pair side by side
  along the bottom of the image.
- Mobile: reorder to `slideTitle` + `slideHeading` ABOVE the image/slider, and
  `metrics[]` (if present) below the image rather than on top of it.

---

## 3. Implementation notes for Claude Code

- Build one React component per `__typename`, and a single `PageBuilder` component
  that switch/maps over the `pageBuilder[]` array rendering the right component per
  entry — do not build a monolithic single-file page for all 9 sections.
- Every text field (`title`, `subtitle`, `label`, `value`, `slideTitle`,
  `slideHeading`, `textOnImage`, `headingOnImage`, `info`, `colorLabel`,
  `modelNameDisplay`) must flow through next-intl / the locale-aware data layer —
  these come from WordPress already localized per the `locale` argument, not from
  static translation files.
- Treat every section as independently optional. A model with no Video and no
  Interior layout in its `pageBuilder[]` array should render a page that simply skips
  those sections — never show an empty/broken block.
- `info` fields contain real HTML (`<ul>`, `<li>`, `<p>`, `<ol>` — confirmed from real
  WordPress content) — sanitize before rendering, don't treat as plain text.
- Confirm against `/reference/graphql/` before writing any query — those files are
  the actual, verified-working shape against the real backend; do not invent field
  names or assume casing.
