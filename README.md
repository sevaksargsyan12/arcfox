# Veylor — Automotive Brand Website (Phase 1: Frontend Scaffold)

A Next.js (App Router) frontend for an ArcFox-style automotive marketing website,
built against local mock data behind a clean data-fetching abstraction. **No backend
exists yet** — Phase 2 will swap the mock data layer for headless WordPress +
WPGraphQL without touching any page or component code.

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
Design/Capability/Battery), News (release list + detail), Careers (list + detail +
application form UI), Test Drive booking (form UI), Contact (form UI), Privacy
Statement, Official Statement.

**Excluded** (not scaffolded at all — no routes, no components, no data): the media/
gallery center (reference's `/multimedia` and its near-duplicate `/multimedias`), the
distributor center and all its subpages, dealer registration, News → Event Review, and
the reference's separate "Media Contact" press-inquiry page (`/mediaCenter`) — all
excluded per explicit decisions made before/during planning.

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
7. **News/careers pagination** — plain `?page=N` query params, not the reference's
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
14. **Forms** — no real submissions anywhere (careers apply, test drive, contact); all
    three validate client-side (`react-hook-form` + `zod`) and show a shared success
    dialog (`components/ui/SuccessDialog.tsx`) instead of calling an API. Phone fields
    are plain validated `tel` inputs (`libphonenumber-js` for validation) rather than a
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

## Data layer (`lib/data/`) — Phase 2 work

Every function below is already `async` and returns a clean, locale-resolved type, so
in Phase 2 **only the function bodies change** (fixture lookup → WPGraphQL request) —
no page or component code should need to change.

| File | Functions | Backs |
|---|---|---|
| `lib/data/models.ts` | `getModelSlugs`, `getModelSummaries(locale)`, `getModelBySlug(slug, locale)` | Home, header mega-menu, `/models`, `/models/[slug]`, test drive model picker |
| `lib/data/news.ts` | `getFeaturedNews`, `getNewsList`, `getNewsCategories`, `getNewsById`, `getNewsIds` | Home news preview, `/news`, `/news/[id]` |
| `lib/data/jobs.ts` | `getJobCategories`, `getJobAreas`, `getJobCategoryOptions`, `getJobAreaOptions`, `getJobList`, `getJobById`, `getJobIds`, *(documented but unimplemented)* `submitJobApplication` | `/careers`, `/careers/[id]` |
| `lib/data/nav.ts` | `getHeaderNav(locale)`, `getFooterLinkColumns(locale)` | Header, footer |
| `lib/data/site-config.ts` | `getSiteConfig(locale)` | Footer (name, contact, social links, legal line) |
| `lib/data/options.ts` | `getCountries`, `getCountryOptions`, `getGenderOptions`, `getContactProblemTypes`, `getTestDriveModelOptions` | Contact/Test Drive/Careers form dropdowns |
| `lib/data/about.ts` | `getAboutContent(locale)`, `getPartnersContent(locale)` | `/about`, `/about/partners` |
| `lib/data/global-rd.ts` | `getGlobalRdSection(key, locale)`, `getGlobalRdOverview(locale)` | `/global-rd`, `/global-rd/design`\|`capability`\|`battery` |
| `lib/data/legal.ts` | `getPrivacyStatementHtml(locale)`, `getOfficialStatementHtml(locale)` | `/legal/privacy`, `/legal/official` |

None of the three forms (careers apply, test drive, contact) call any of these — they
are pure client-side UI in Phase 1 (see deviation #14). Phase 2 should add real submit
functions with the same "takes typed input, returns a typed result" shape as
`submitJobApplication`'s documented (but unimplemented) signature.

## Project structure

```
app/[locale]/        Route tree (App Router, next-intl locale segment)
components/          ui/, layout/, home/, models/, news/, careers/, forms/,
                      test-drive/, contact/, about/, global-rd/
lib/data/             Mock data layer + fixtures/ (see table above)
i18n/                 next-intl routing/navigation/request config
messages/             hy.json (source of truth), en.json (fallback)
scripts/              generate-placeholder-art.mjs
public/images/        Generated placeholder imagery
public/spin/          Generated 360° spin-viewer frames
```
