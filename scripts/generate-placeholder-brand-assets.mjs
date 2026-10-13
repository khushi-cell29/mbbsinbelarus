/**
 * Generates PLACEHOLDER brand assets (text-only) so the site never ships another
 * country's artwork. Replace the outputs with real brand artwork when available:
 *   public/logo.png         (used in structured data / emails)
 *   public/og-default.jpg   (1200x630 default social preview)
 *   src/app/icon.png        (favicon, picked up automatically by Next.js)
 *
 * Usage: node scripts/generate-placeholder-brand-assets.mjs
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const NAME = "MBBS in Belarus";
const TAGLINE = "English-medium medical education in Belarus";
const RED = "#C8102E";
const GREEN = "#007A3D";

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${RED}"/>
  <path d="M0 416 a96 96 0 0 0 96 96 h320 a96 96 0 0 0 96 -96 v-74 H0z" fill="${GREEN}"/>
  <text x="256" y="262" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="700" fill="#fff" text-anchor="middle">MBBS</text>
  <text x="256" y="440" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="600" fill="#fff" text-anchor="middle">Belarus</text>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${RED}"/>
  <rect y="420" width="1200" height="210" fill="${GREEN}"/>
  <text x="600" y="270" font-family="Arial, Helvetica, sans-serif" font-size="110" font-weight="700" fill="#fff" text-anchor="middle">${NAME}</text>
  <text x="600" y="350" font-family="Arial, Helvetica, sans-serif" font-size="40" fill="#fff" text-anchor="middle">${TAGLINE}</text>
</svg>`;

await sharp(Buffer.from(logoSvg)).png().toFile("public/logo.png");
await sharp(Buffer.from(logoSvg)).resize(256, 256).png().toFile("src/app/icon.png");
await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toFile("public/og-default.jpg");
console.log("Generated public/logo.png, public/og-default.jpg, src/app/icon.png");
