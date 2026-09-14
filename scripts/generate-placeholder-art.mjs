// Generates all placeholder SVG imagery used by the mock data layer:
// model hero/exterior art, 360deg spin frames, generic interior/about/
// global-rd/news art. Everything here is procedurally generated so the
// project builds and looks reasonable offline, without depending on any
// real photography (none exists yet -- and the reference project's real
// ArcFox photography must not be reused, per the branding decision).
//
// Run with: node scripts/generate-placeholder-art.mjs
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const models = JSON.parse(
  readFileSync(join(root, "lib/data/fixtures/models.json"), "utf-8")
);

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function write(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf-8");
}

/** Rough perceived brightness -- used to pick a readable overlay/window tint. */
function isDark(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 130;
}

function shade(hex, amount) {
  const c = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(c.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(c.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(c.slice(4, 6), 16) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

// A single stylized side-profile car silhouette, reused (recolored) across
// every model and every spin frame -- a deliberate simplification for
// Phase 1 placeholder art rather than bespoke per-model vector art.
const CAR_BODY_PATH =
  "M40,222 C40,182 72,152 122,150 C156,108 224,78 322,78 C420,78 482,108 522,150 " +
  "C648,152 702,154 738,190 C762,206 760,218 738,222 L682,222 " +
  "C682,196 658,176 630,176 C602,176 578,196 578,222 L222,222 " +
  "C222,196 198,176 170,176 C142,176 118,196 118,222 Z";
const CABIN_WINDOW_PATH =
  "M170,148 C200,116 250,96 322,96 C394,96 448,116 480,148 C440,138 380,132 322,132 " +
  "C264,132 206,138 170,148 Z";

function carGroup({ hex, frameIndex = 0, frameCount = 8 }) {
  const angle = (frameIndex / frameCount) * Math.PI * 2;
  const scaleX = 0.58 + 0.42 * Math.abs(Math.cos(angle));
  const highlightShift = Math.sin(angle) * 240;
  const dark = isDark(hex);
  const windowFill = dark ? "rgba(255,255,255,0.18)" : "rgba(10,14,18,0.55)";
  const bodyShade = shade(hex, dark ? 35 : -25);

  return `
  <g transform="translate(400,190) scale(${scaleX.toFixed(3)},1) translate(-400,-190)">
    <ellipse cx="400" cy="248" rx="${300 * scaleX + 40}" ry="16" fill="rgba(0,0,0,0.16)" />
    <path d="${CAR_BODY_PATH}" fill="${hex}" />
    <path d="${CAR_BODY_PATH}" fill="none" stroke="${bodyShade}" stroke-width="2" opacity="0.5" />
    <path d="${CABIN_WINDOW_PATH}" fill="${windowFill}" />
    <circle cx="170" cy="222" r="46" fill="#15171a" />
    <circle cx="170" cy="222" r="20" fill="#3a3d42" />
    <circle cx="630" cy="222" r="46" fill="#15171a" />
    <circle cx="630" cy="222" r="20" fill="#3a3d42" />
    <rect x="${120 + highlightShift}" y="90" width="70" height="140" fill="white" opacity="0.16" transform="skewX(-18)" />
  </g>`;
}

function svgWrap(width, height, inner, background = "none") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${
    background !== "none" ? `<rect width="${width}" height="${height}" fill="${background}" />` : ""
  }${inner}</svg>`;
}

function gradientBg(id, from, to) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${from}" />
    <stop offset="100%" stop-color="${to}" />
  </linearGradient></defs>`;
}

// --- Model hero, exterior gallery & 360 spin frames -----------------------
for (const model of models) {
  for (const color of model.colors) {
    // 8-frame spin sequence
    for (let i = 0; i < 8; i++) {
      const svg = svgWrap(800, 320, carGroup({ hex: color.hex, frameIndex: i }));
      write(join(publicDir, "spin", model.slug, color.key, `${i}.svg`), svg);
    }
  }

  const heroColor = model.colors[0].hex;
  const heroSvg = svgWrap(
    1600,
    720,
    `${gradientBg("heroBg", shade(heroColor, 60), shade(heroColor, -10))}` +
      `<rect width="1600" height="720" fill="url(#heroBg)" />` +
      `<g transform="translate(400,220) scale(1.6)">${carGroup({ hex: heroColor, frameIndex: 0 }).replace(/<ellipse[^>]*\/>/, "")}</g>`
  );
  write(join(publicDir, "images", "models", model.slug, "hero.svg"), heroSvg);

  // Exterior gallery: reuse a few spin angles at a nicer crop/background.
  const exteriorFrames = [0, 2, 5];
  exteriorFrames.forEach((frameIndex, i) => {
    const svg = svgWrap(
      1200,
      600,
      `${gradientBg("extBg" + i, "#f4f5f6", "#e2e5e8")}` +
        `<rect width="1200" height="600" fill="url(#extBg${i})" />` +
        `<g transform="translate(200,140) scale(1.25)">${carGroup({ hex: model.colors[i % model.colors.length].hex, frameIndex })}</g>`
    );
    write(join(publicDir, "images", "models", model.slug, `exterior-${i + 1}.svg`), svg);
  });
}

// --- Shared generic interior placeholders (reused across all models) ------
const interiorAccents = ["#3ea3d7", "#ce953b", "#585858"];
interiorAccents.forEach((accent, i) => {
  const svg = svgWrap(
    1200,
    700,
    `${gradientBg("intBg" + i, "#1c1e21", "#34393e")}` +
      `<rect width="1200" height="700" fill="url(#intBg${i})" />` +
      `<circle cx="260" cy="500" r="150" fill="none" stroke="${accent}" stroke-width="14" opacity="0.85" />` +
      `<circle cx="260" cy="500" r="40" fill="${accent}" opacity="0.6" />` +
      `<rect x="520" y="260" width="520" height="190" rx="18" fill="rgba(255,255,255,0.08)" stroke="${accent}" stroke-width="2" />` +
      `<rect x="550" y="290" width="220" height="14" rx="7" fill="${accent}" opacity="0.7" />` +
      `<rect x="550" y="320" width="340" height="10" rx="5" fill="rgba(255,255,255,0.35)" />`
  );
  write(join(publicDir, "images", "interior", `${i + 1}.svg`), svg);
});

// --- Home hero slides (reuse the first three models' hero art) ------------
// (no extra generation needed -- home.ts fixture points at model hero.svg)

// --- News placeholder banners ----------------------------------------------
const newsAccents = ["#3ea3d7", "#ce953b", "#34393e", "#2f4a3e", "#14475f", "#585858"];
newsAccents.forEach((accent, i) => {
  const svg = svgWrap(
    1200,
    675,
    `${gradientBg("newsBg" + i, shade(accent, 40), shade(accent, -30))}` +
      `<rect width="1200" height="675" fill="url(#newsBg${i})" />` +
      `<circle cx="${180 + i * 40}" cy="180" r="120" fill="rgba(255,255,255,0.12)" />` +
      `<rect x="0" y="520" width="1200" height="155" fill="rgba(0,0,0,0.18)" />` +
      `<rect x="70" y="565" width="260" height="16" rx="8" fill="rgba(255,255,255,0.75)" />` +
      `<rect x="70" y="595" width="420" height="10" rx="5" fill="rgba(255,255,255,0.4)" />`
  );
  write(join(publicDir, "images", "news", `${i + 1}.svg`), svg);
});

// --- Generic section art: About / Partners / Global R&D --------------------
const sectionArt = [
  ["about", "hero", "#34393e", "#1c1e21"],
  ["about", "map", "#3ea3d7", "#14475f"],
  ["partners", "hero", "#585858", "#34393e"],
  ["partners", "huawei-banner", "#c8102e", "#6b0916"],
  ["partners", "magna-banner", "#0033a0", "#001a52"],
  ["global-rd", "design", "#3ea3d7", "#2f83b1"],
  ["global-rd", "capability", "#474c52", "#1c1e21"],
  ["global-rd", "battery", "#ce953b", "#8a5f22"],
];
for (const [folder, name, from, to] of sectionArt) {
  const svg = svgWrap(
    1600,
    640,
    `${gradientBg("sec", from, to)}<rect width="1600" height="640" fill="url(#sec)" />` +
      `<circle cx="1250" cy="150" r="260" fill="rgba(255,255,255,0.08)" />` +
      `<circle cx="220" cy="520" r="200" fill="rgba(255,255,255,0.06)" />`
  );
  write(join(publicDir, "images", folder, `${name}.svg`), svg);
}

console.log("Placeholder art generated.");
