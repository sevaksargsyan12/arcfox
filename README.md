# Veylor — Automotive Brand Website (Phase 1 scaffold + early Phase 2)

A Next.js (App Router) frontend for an ArcFox-style automotive marketing website,
built against local mock data behind a clean data-fetching abstraction, so it could
later swap in headless WordPress + WPGraphQL without touching page/component code.
That swap has now started for **Models**: a real local WordPress + ACF + WPGraphQL +
Polylang backend exists, and `/models` renders 2 real models (KAOLA S, T5) merged
alongside the 4 mock ones — see [Real backend: Models](#real-backend-models) below.
Every other content type is still mock-only.

The mock brand used throughout ("Veylor", "Veylor One/Aero/Terra/Nova") is a
placeholder invented for this build — not the reference site's real ArcFox/BAIC
branding, names, or copy (see [Branding](#branding--content) below).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the Armenian site (default,
no prefix). English is at [http://localhost:3000/en](http://localhost:3000/en).

```bash
npm run build   # production build (also validates all generateStaticParams)
npm run start   # serve the production build
npm run generate:art   # regenerate the placeholder SVG imagery (see below)
```

## Languages

- **Armenian (`hy`)** — default locale, served with **no URL prefix** (`/models/one`).
- **English (`en`)** — served under an **`/en` prefix** (`/en/models/one`).
- Powered by [next-intl](https://next-intl.dev). Config: [i18n/routing.ts](i18n/routing.ts).
- `localeDetection` is explicitly disabled (`i18n/routing.ts`) — otherwise next-intl
  negotiates a locale from the browser's `Accept-Language` header and silently
  redirects `/` to `/en` for English-language browsers, which would defeat "hy is
  the default, always served unprefixed at `/`".
- UI-chrome strings live in `messages/hy.json` (source of truth) and `messages/en.json`
  (secondary/fallback). Long-form marketing copy (About/Partners/Global R&D) lives in
  the mock data layer instead — see [Data layer](#data-layer--phase-2-work) below.

## Branding & content

Per an explicit decision made before this build started, all mock content uses an
invented placeholder brand ("Veylor") and model names ("Veylor One/Aero/Terra/Nova"),
not the reference site's real ArcFox/BAIC branding, model names (T1/T5/S5/Kaola S),
or copy. Legal/footer text (privacy statement, official statement, copyright line) is
likewise original placeholder text, not the reference's BAIC-specific legal language
or China ICP/police-registration compliance badges.

**Confirmed exceptions to the above**, made explicitly with the user, scoped
narrowly and not to be extended elsewhere without asking again:
- **Site logo**: the header/footer logo is the real ARCFOX logo image
  (`public/images/logo.webp`, copied as-is from a saved snapshot of the real
  ARCFOX site), not a "Veylor" wordmark. Only the logo *graphic* changed — the
  textual site name ("Veylor"), footer legal line, and page metadata are
  unaffected. It's a light-colored mark with no separate dark variant available,
  so it's CSS-inverted (`invert` class in `components/layout/HeaderClient.tsx`)
  for the solid (non-transparent) header state.
- **`/about/partners` content**: the partner grid and the two "Cooperation
  History" deep-dives (Huawei, Magna) use real, factual partner names and real
  dates/milestones reverse-engineered from a saved snapshot of the real ARCFOX
  partners page (`reference/live-pages/partners/`), written in original wording
  (not copied/paraphrased from that page) — see `lib/data/fixtures/about.json`'s
  `partners` key. Real partner *logos* were not sourced or used (no local
  assets, and reusing seven more companies' trademarked marks wasn't part of
  what was asked) — partner tiles show the name as styled text instead. The
  two deep-dive section banners are placeholder art (see below), not the
  reference's real banner photos.

## Placeholder imagery

No real photography exists for this brand yet, and the reference site's real ArcFox
photography must not be reused. All imagery — model hero shots, the 360° spin-viewer
frames, exterior/interior galleries, news banners, and section art on About/Partners/
Global R&D — is **procedurally generated SVG** via [scripts/generate-placeholder-art.mjs](scripts/generate-placeholder-art.mjs)
(already generated into `public/images/` and `public/spin/`; rerun with
`npm run generate:art` after editing `lib/data/fixtures/models.json`). It uses one
stylized car silhouette recolored per model/color rather than bespoke per-model art —
good enough to prove out the layout and the 360° drag interaction, not meant to look
final. Swap `public/images/**` and `public/spin/**` for real photography whenever it
exists; no code changes needed.

## Pages included / excluded

**Included:** Home, Models (list + detail), About + Partners, Global R&D (landing +
Design/Capability/Battery), News (release list + detail), Contact (form UI), Privacy
Statement, Official Statement.

**Excluded** (not scaffolded at all — no routes, no components, no data): the media/
gallery center (reference's `/multimedia` and its near-duplicate `/multimedias`), the
distributor center and all its subpages, dealer registration, News → Event Review, and
the reference's separate "Media Contact" press-inquiry page (`/mediaCenter`) — all
excluded per explicit decisions made before/during planning. **Careers** (list +
detail + application form) and **Test Drive** booking were built in Phase 1 but later
removed at the user's request, along with everything used only by them (`lib/data/jobs.ts`
+ its fixture, the `components/careers/`, `components/test-drive/`, and
`components/forms/FileUploadField.tsx` components, the "Book a test drive" CTA on
model detail pages, and the corresponding nav/footer links and `messages/*.json` keys).

## Deviations from the reference project (and why)

The reference Nuxt project was used only for structure/design reference, never ported
directly. Where this build differs on purpose:

1. **i18n default locale** — `hy` unprefixed / `en` prefixed, the reverse of the
   reference's `en`-default. Required by the brief.
2. **Model detail data shape** — clean, named sections (`hero`, `colors`, `specs`,
   `featureHighlights`, `exteriorGallery`, `interiorGallery`) replace the reference's
   generic, backend-authored `page1..page8` CMS block shape. Better typed, and a much
   closer match to how WPGraphQL content will actually be modeled in Phase 2.
3. **360° viewer** — 8 placeholder frames per color (configurable per model/color in
   the data layer) vs. the reference's ~36–72 real photographed frames. Real drag
   interaction, deliberately light asset weight for Phase 1. See
   [components/models/detail/SpinViewer/](components/models/detail/SpinViewer/).
4. **News content** — a plain `contentHtml` string rendered via
   `dangerouslySetInnerHTML`, not the reference's ~10-component block-editor renderer
   system (`components/md/*`). This is also the closer match to WPGraphQL post content.
5. **Model URLs** — human-readable slugs (`/models/one`) instead of the reference's
   numeric backend IDs (`/models/55`).
6. **News route** — `/news` is the release list directly (no `/news/release` nesting),
   since Event Review — its only reason to disambiguate against — is excluded.
7. **News pagination** — plain `?page=N` query params, not the reference's
   route-duplication hack (`news/newsRelease/page/[page].ts` re-exporting the list page
   under an alternate URL shape).
8. **Long-form marketing copy** (About/Partners/Global R&D) lives in the data layer
   (`lib/data/about.ts`, `lib/data/global-rd.ts`) as `{hy, en}` fields, not in
   `messages/*.json` — it's content, not UI chrome, and this rehearses the eventual
   WPGraphQL `locale`-argument query shape.
9. **Contact form** — no browser-geolocation "auto-detect your country" flow; a plain
   country dropdown. Simplification, not a missing feature worth the added complexity
   here.
10. **`/global-rd` landing page** — added; the reference has no landing page for
    Global R&D, only three subpages reachable via the nav dropdown. Better mobile-nav
    discoverability and SEO for a low marginal cost (reuses the same data as the menu).
11. **Breakpoints** — kept the reference's numeric values (768 / 992 / 1200 / 1920 /
    2560, with **1200px** as the desktop-nav swap point, not the more common 1024px)
    for visual parity, but expressed via one Tailwind v4 `@theme` block
    ([app/globals.css](app/globals.css)) instead of the reference's duplicated
    Tailwind-config-plus-SCSS-variable system.
12. **Fonts** — the reference's licensed `EurostileNextW1G-*` (display) and
    `DINNextW1G-*` (body) families are replaced with free Google Fonts: **Oswald**
    (display) + **Inter** (body) for English, and **Noto Sans Armenian** for Armenian
    (used for both display and body, varying only by weight, since most
    condensed/display Google Fonts don't ship Armenian glyphs — see
    [app/[locale]/layout.tsx](app/[locale]/layout.tsx)).
13. **Feature highlights** — rendered with `lucide-react` icons rather than the
    brief's `imageUrl`-per-highlight shape, since no bespoke photography exists yet.
    Swap for real images in Phase 2 if wanted; see `FeatureIconKey` in
    `lib/data/models.ts`.
14. **Forms** — no real submission (Contact); it validates client-side
    (`react-hook-form` + `zod`) and shows a shared success dialog
    (`components/ui/SuccessDialog.tsx`) instead of calling an API. Phone fields are
    plain validated `tel` inputs (`libphonenumber-js` for validation) rather than a
    dedicated composite country-code + number widget.
15. **Header overlay-over-hero** — the header is `sticky`, and hero sections
    (`components/home/Hero.tsx`, `components/models/detail/Hero.tsx`) pull themselves
    up under it with a negative top margin (`-mt-20`) rather than making the header
    itself `fixed`/`absolute`. Keeps non-hero pages' layout simple (the header just
    reserves its own space normally) while still achieving the transparent-over-hero
    look on pages that have one.
16. **Dead-code patterns deliberately not replicated**: the reference's commented-out
    legacy `apiList/*.js` files (superseded by `apiList/use*.ts`, never actually
    imported), the near-duplicate `/multimedia` + `/multimedias` pages, three
    hardcoded one-off news detail routes (`detail/90.vue`/`91.vue`/`92.vue`) alongside
    the dynamic `[id].vue`, an entirely unused parallel `components/vehicleModel/*`
    component set for model pages (the live page uses `components/models/*` instead),
    and five near-duplicate color-swatch components (`pieColor/*`). This build's data
    layer and component tree are single-sourced by construction — there is exactly one
    implementation of each page/section type.

## Real backend: Models

`lib/data/models.ts`'s `getModelsByLocale`/`getModelBySlug` now query a real local
WPGraphQL endpoint first (`lib/data/wpgraphql.ts`; queries copied verbatim from
`reference/graphql/*.graphql`), falling back to the mock fixture for any slug the CMS
doesn't have — including every slug, if the backend isn't reachable at all. Nothing
breaks if `npm run dev`/`npm run build` runs without the local WordPress up; `/models`
just shows the 4 mock models and `/models/kaola-s` etc. 404.

- **Endpoint**: `WPGRAPHQL_ENDPOINT` env var, defaulting to `http://localhost/arcfox/graphql`
  (copy `.env.local.example` to `.env.local` to override). Fetched with `next: { revalidate: 60 }`
  (ISR), not `cache: "no-store"` — the model list is read by the header/footer on
  *every* page, so `no-store` there forced the entire site into fully dynamic
  rendering; ISR keeps everything statically generated while still refreshing at
  most once a minute.
- **i18n**: real models aren't locale-invariant (`kaola-s` in `en`, `kaola-s-hy` in
  `hy`) — resolved via GraphQL's `translations`/`language`, never by string-matching
  a slug suffix. Visiting a slug under the wrong locale 307-redirects to the
  canonical one. The header's `LanguageSwitcher` gets the correct translated slug via
  `ModelTranslationsContext` (`components/layout/ModelTranslationsContext.tsx`) —
  needed because the switcher lives in a shared layout, not a descendant of the page.
- **Page builder**: `/models/[slug]` renders one of two ways based on
  `model.source`. Mock models render the original fixed component pipeline
  (`components/models/detail/*`) unchanged. CMS models render
  `components/models/pageBuilder/PageBuilder.tsx`, one component per WordPress
  `pageBuilder[]` `__typename` (`Hero`, `ColorsSpecs`, `Video`, `Exterior`,
  `AppearanceSlider`, `Interior`, `AdditionalCharacteristics`,
  `AdditionalCharacteristics2`, `MetricsSlider`), per `docs/MODEL_PAGE_AND_I18N.md`.
  Every section — and every field within a present section — degrades gracefully
  when its content is null (real, current example: T5's Video layout exists but has
  no video file; several of its slides have real caption text but no images) rather
  than rendering a broken/empty block, or, worse, silently dropping real text that
  has no accompanying image.
- **Known content gaps in the live data** (not code bugs): Armenian (`-hy`) posts are
  real, distinct, correctly-linked Polylang translations, but their actual field text
  is currently identical to the English post — Armenian model pages show English text
  until someone fills in the ACF fields. T5's content is otherwise very sparse (no
  hero image, empty color spin-frames, most images null). One real content bug worth
  fixing at the source: T5's "Glass Roof" characteristic slide's `info` field contains
  a corrupted paste of the old site's rendered markup instead of clean text.
- **A field-naming quirk to know about**: `metrics[]`'s `label`/`value` convention is
  inverted between two section types that share the field names — Exterior's
  `metrics[]` has `value` as the prominent text (matches `specs[]`), but
  `MetricsSlider`'s nested `metricSlides[].metrics[]` has `label` as the prominent
  text instead. Confirmed from real query responses; each component implements its
  own confirmed mapping rather than sharing one renderer.

## Data layer (`lib/data/`) — Phase 2 work

Every function below is already `async` and returns a clean, locale-resolved type, so
in Phase 2 **only the function bodies change** (fixture lookup → WPGraphQL request) —
no page or component code should need to change. `lib/data/models.ts` has already made
that swap (see [Real backend: Models](#real-backend-models) above) — the rest haven't yet.

| File | Functions | Backs |
|---|---|---|
| `lib/data/models.ts` | `getModelsByLocale(locale)`, `getModelBySlug(slug, locale)` — **real WPGraphQL + mock fallback**, see above | Home, header mega-menu, `/models`, `/models/[slug]` |
| `lib/data/news.ts` | `getFeaturedNews`, `getNewsList`, `getNewsCategories`, `getNewsById`, `getNewsIds` | Home news preview, `/news`, `/news/[id]` |
| `lib/data/nav.ts` | `getHeaderNav(locale)`, `getFooterLinkColumns(locale)` | Header, footer |
| `lib/data/site-config.ts` | `getSiteConfig(locale)` | Footer (name, contact, social links, legal line) |
| `lib/data/options.ts` | `getCountries`, `getCountryOptions`, `getGenderOptions`, `getContactProblemTypes` | Contact form dropdowns |
| `lib/data/about.ts` | `getAboutContent(locale)`, `getPartnersContent(locale)` | `/about`, `/about/partners` |
| `lib/data/global-rd.ts` | `getGlobalRdSection(key, locale)`, `getGlobalRdOverview(locale)` | `/global-rd`, `/global-rd/design`\|`capability`\|`battery` |
| `lib/data/legal.ts` | `getPrivacyStatementHtml(locale)`, `getOfficialStatementHtml(locale)` | `/legal/privacy`, `/legal/official` |

The Contact form doesn't call any of these — it's pure client-side UI in Phase 1
(see deviation #14). Phase 2 should add a real submit function for it, following the
same "takes typed input, returns a typed result" shape as the rest of this layer.

## Project structure

```
app/[locale]/        Route tree (App Router, next-intl locale segment)
components/          ui/, layout/, home/, models/ (detail/ legacy pipeline +
                      pageBuilder/ CMS sections), news/, forms/, contact/,
                      about/, global-rd/
lib/data/             Data layer + fixtures/ (see table above), wpgraphql.ts
                      (real GraphQL client, see "Real backend: Models")
lib/sanitize-html.ts  Minimal sanitizer for WordPress WYSIWYG `info` fields
i18n/                 next-intl routing/navigation/request config
messages/             hy.json (source of truth), en.json (fallback)
scripts/              generate-placeholder-art.mjs
public/images/        Generated placeholder imagery
public/spin/          Generated 360° spin-viewer frames
```
