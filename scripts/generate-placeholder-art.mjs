// Generates placeholder SVG imagery for content that has no real
// photography yet: news banners, and generic section art for About/
// Partners/Global R&D (plus a generic fallback thumbnail for any real CMS
// model missing its own photo). Model imagery itself is entirely real,
// fetched live from WPGraphQL -- there is no mock model art to generate.
//
// Run with: node scripts/generate-placeholder-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function write(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf-8");
}

function shade(hex, amount) {
  const c = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(c.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(c.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(c.slice(4, 6), 16) + amount));
  return `rgb(${r}, ${g}, ${b})`;
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
  // Generic fallback for real CMS content missing a media field (e.g. a
  // model with no listThumbnail/hero image yet) -- not model-specific.
  ["models", "placeholder", "#585858", "#34393e"],
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
