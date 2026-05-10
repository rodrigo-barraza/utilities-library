// ─────────────────────────────────────────────────────────────
// Effects — Visual Filter Effects (Browser-only)
// ─────────────────────────────────────────────────────────────
// GPU-accelerated CSS + Canvas visual effects that can be
// applied to any DOM element. Each effect injects its own
// scoped CSS on first use (idempotent) and returns a cleanup
// function for easy teardown.
//
// Usage:
//   import { applyStatic, applyChromaticAberration } from '@rodrigo-barraza/utilities-library/effects';
//   const cleanup = applyStatic(element, { intensity: 0.4 });
//   cleanup(); // remove effect
// ─────────────────────────────────────────────────────────────

/* global document */

const STYLE_ID = "rb-effects-stylesheet";

// ── Internals ──────────────────────────────────────────────

/** @type {Set<string>} Tracks which effect stylesheets have been injected */
const _injected = new Set();

/**
 * Inject a `<style>` block once per effect name.
 * @param {string} name
 * @param {string} css
 */
function _injectCSS(name, css) {
  if (typeof document === "undefined") return;
  if (_injected.has(name)) return;
  _injected.add(name);

  let sheet = document.getElementById(STYLE_ID);
  if (!sheet) {
    sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    document.head.appendChild(sheet);
  }
  sheet.textContent += `\n/* ── ${name} ── */\n${css}\n`;
}

/**
 * Add class(es) to an element, return a cleanup that removes them.
 * @param {HTMLElement} el
 * @param {string[]} classes
 * @returns {() => void}
 */
function _applyClasses(el, classes) {
  classes.forEach((c) => el.classList.add(c));
  return () => classes.forEach((c) => el.classList.remove(c));
}

// ── 1. Static / Noise ──────────────────────────────────────
// Analog TV static — animated pseudo-element with SVG feTurbulence

const STATIC_CSS = `
@keyframes rb-fx-static-drift {
  0%   { transform: translate3d(0, 0, 0); }
  10%  { transform: translate3d(-2%, -3%, 0); }
  20%  { transform: translate3d(3%, 1%, 0); }
  30%  { transform: translate3d(-1%, 4%, 0); }
  40%  { transform: translate3d(4%, -2%, 0); }
  50%  { transform: translate3d(-3%, 3%, 0); }
  60%  { transform: translate3d(2%, -4%, 0); }
  70%  { transform: translate3d(-4%, 1%, 0); }
  80%  { transform: translate3d(1%, 3%, 0); }
  90%  { transform: translate3d(3%, -1%, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
.rb-fx-static {
  position: relative;
  overflow: hidden;
}
.rb-fx-static::after {
  content: "";
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: var(--rb-fx-static-intensity, 0.12);
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 9999;
  animation: rb-fx-static-drift 0.3s steps(6) infinite;
  will-change: transform;
}
`;

/**
 * Apply analog TV static / noise overlay.
 * @param {HTMLElement} el
 * @param {{ intensity?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyStatic(el, { intensity = 0.12 } = {}) {
  _injectCSS("static", STATIC_CSS);
  el.style.setProperty("--rb-fx-static-intensity", String(intensity));
  return _applyClasses(el, ["rb-fx-static"]);
}

// ── 2. Chromatic Aberration (RGB Split) ────────────────────
// Separates color channels via offset text-shadows and box-shadows

const CHROMATIC_CSS = `
@keyframes rb-fx-chromatic-shift {
  0%, 100% {
    text-shadow:
      var(--rb-fx-ca-offset, 2px) 0 0 rgba(255, 0, 0, var(--rb-fx-ca-intensity, 0.6)),
      calc(var(--rb-fx-ca-offset, 2px) * -1) 0 0 rgba(0, 255, 255, var(--rb-fx-ca-intensity, 0.6));
  }
  25% {
    text-shadow:
      calc(var(--rb-fx-ca-offset, 2px) * -0.5) var(--rb-fx-ca-offset, 2px) 0 rgba(255, 0, 0, var(--rb-fx-ca-intensity, 0.6)),
      var(--rb-fx-ca-offset, 2px) calc(var(--rb-fx-ca-offset, 2px) * -0.5) 0 rgba(0, 255, 255, var(--rb-fx-ca-intensity, 0.6));
  }
  50% {
    text-shadow:
      calc(var(--rb-fx-ca-offset, 2px) * -1) 0 0 rgba(255, 0, 0, var(--rb-fx-ca-intensity, 0.6)),
      var(--rb-fx-ca-offset, 2px) 0 0 rgba(0, 255, 255, var(--rb-fx-ca-intensity, 0.6));
  }
  75% {
    text-shadow:
      var(--rb-fx-ca-offset, 2px) calc(var(--rb-fx-ca-offset, 2px) * -0.5) 0 rgba(255, 0, 0, var(--rb-fx-ca-intensity, 0.6)),
      calc(var(--rb-fx-ca-offset, 2px) * -0.5) var(--rb-fx-ca-offset, 2px) 0 rgba(0, 255, 255, var(--rb-fx-ca-intensity, 0.6));
  }
}
.rb-fx-chromatic {
  animation: rb-fx-chromatic-shift 4s ease-in-out infinite;
  will-change: text-shadow;
}
.rb-fx-chromatic-static {
  text-shadow:
    var(--rb-fx-ca-offset, 2px) 0 0 rgba(255, 0, 0, var(--rb-fx-ca-intensity, 0.6)),
    calc(var(--rb-fx-ca-offset, 2px) * -1) 0 0 rgba(0, 255, 255, var(--rb-fx-ca-intensity, 0.6));
}
`;

/**
 * Apply chromatic aberration (RGB channel separation) via text-shadow.
 * @param {HTMLElement} el
 * @param {{ offset?: number, intensity?: number, animated?: boolean }} [options]
 * @returns {() => void} cleanup
 */
export function applyChromaticAberration(el, { offset = 2, intensity = 0.6, animated = true } = {}) {
  _injectCSS("chromatic", CHROMATIC_CSS);
  el.style.setProperty("--rb-fx-ca-offset", `${offset}px`);
  el.style.setProperty("--rb-fx-ca-intensity", String(intensity));
  return _applyClasses(el, [animated ? "rb-fx-chromatic" : "rb-fx-chromatic-static"]);
}

// ── 3. CRT Scanlines ──────────────────────────────────────

const SCANLINE_CSS = `
.rb-fx-scanlines {
  position: relative;
  overflow: hidden;
}
.rb-fx-scanlines::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, var(--rb-fx-scan-intensity, 0.08)) 0px,
    rgba(0, 0, 0, var(--rb-fx-scan-intensity, 0.08)) 1px,
    transparent 1px,
    transparent var(--rb-fx-scan-gap, 3px)
  );
  pointer-events: none;
  z-index: 9998;
}
@keyframes rb-fx-scanline-roll {
  from { background-position: 0 0; }
  to   { background-position: 0 100%; }
}
.rb-fx-scanlines-rolling::before {
  animation: rb-fx-scanline-roll 8s linear infinite;
  will-change: background-position;
}
`;

/**
 * Apply CRT scanline overlay.
 * @param {HTMLElement} el
 * @param {{ intensity?: number, gap?: number, rolling?: boolean }} [options]
 * @returns {() => void} cleanup
 */
export function applyScanlines(el, { intensity = 0.08, gap = 3, rolling = false } = {}) {
  _injectCSS("scanlines", SCANLINE_CSS);
  el.style.setProperty("--rb-fx-scan-intensity", String(intensity));
  el.style.setProperty("--rb-fx-scan-gap", `${gap}px`);
  const classes = ["rb-fx-scanlines"];
  if (rolling) classes.push("rb-fx-scanlines-rolling");
  return _applyClasses(el, classes);
}

// ── 4. Glitch / Jitter ────────────────────────────────────
// Consolidated from prism-client CycleButton + HistoryPanel

const GLITCH_CSS = `
@keyframes rb-fx-glitch-hue {
  0%   { filter: hue-rotate(0deg) brightness(1.2); }
  25%  { filter: hue-rotate(90deg) brightness(1.6); }
  50%  { filter: hue-rotate(180deg) brightness(0.8); }
  75%  { filter: hue-rotate(270deg) brightness(1.4); }
  100% { filter: hue-rotate(360deg) brightness(1.2); }
}
@keyframes rb-fx-glitch-jitter {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(-1px, 1px, 0) scale(1.03); }
  50%  { transform: translate3d(1px, -1px, 0) scale(0.97); }
  75%  { transform: translate3d(1px, 0, 0) scale(1.01); }
  100% { transform: translate3d(-1px, 0, 0) scale(0.99); }
}
@keyframes rb-fx-glitch-clip {
  0%   { clip-path: inset(40% 0 60% 0); }
  10%  { clip-path: inset(10% 0 85% 0); }
  20%  { clip-path: inset(80% 0 5% 0); }
  30%  { clip-path: inset(25% 0 50% 0); }
  40%  { clip-path: inset(60% 0 15% 0); }
  50%  { clip-path: inset(5% 0 70% 0); }
  60%  { clip-path: inset(90% 0 2% 0); }
  70%  { clip-path: inset(15% 0 75% 0); }
  80%  { clip-path: inset(55% 0 30% 0); }
  90%  { clip-path: inset(35% 0 45% 0); }
  100% { clip-path: inset(70% 0 10% 0); }
}
.rb-fx-glitch {
  animation:
    rb-fx-glitch-hue 0.15s linear infinite,
    rb-fx-glitch-jitter 0.05s steps(2) infinite;
  will-change: filter, transform, text-shadow;
  text-shadow:
    1px 0 0 rgba(255, 0, 0, 0.7),
    -1px 0 0 rgba(0, 255, 255, 0.7);
}
.rb-fx-glitch-subtle {
  animation: rb-fx-glitch-jitter 0.1s steps(3) infinite;
  will-change: transform;
}
`;

/**
 * Apply glitch distortion (hue cycling + jitter + RGB text-shadow).
 * Consolidated from prism-client's CycleButton and HistoryPanel effects.
 * @param {HTMLElement} el
 * @param {{ subtle?: boolean }} [options]
 * @returns {() => void} cleanup
 */
export function applyGlitch(el, { subtle = false } = {}) {
  _injectCSS("glitch", GLITCH_CSS);
  return _applyClasses(el, [subtle ? "rb-fx-glitch-subtle" : "rb-fx-glitch"]);
}

// ── 5. VHS Tracking ──────────────────────────────────────

const VHS_CSS = `
@keyframes rb-fx-vhs-track {
  0%   { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  2%   { transform: translate3d(4px, 0, 0) skewX(0.5deg); opacity: 0.85; }
  4%   { transform: translate3d(-2px, 0, 0) skewX(-0.3deg); opacity: 1; }
  5%   { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  45%  { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  46%  { transform: translate3d(-6px, 0, 0) skewX(1deg); opacity: 0.8; }
  47%  { transform: translate3d(3px, 0, 0) skewX(-0.5deg); opacity: 0.95; }
  48%  { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  100% { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
}
.rb-fx-vhs {
  animation: rb-fx-vhs-track 4s linear infinite;
  will-change: transform, opacity;
}
`;

/**
 * Apply VHS tracking distortion — sporadic horizontal skew + offset.
 * @param {HTMLElement} el
 * @returns {() => void} cleanup
 */
export function applyVhsTracking(el) {
  _injectCSS("vhs", VHS_CSS);
  return _applyClasses(el, ["rb-fx-vhs"]);
}

// ── 6. Hue Rotate (Rainbow Cycle) ─────────────────────────

const HUE_CSS = `
@keyframes rb-fx-hue-rotate {
  from { filter: hue-rotate(0deg); }
  to   { filter: hue-rotate(360deg); }
}
.rb-fx-hue-rotate {
  animation: rb-fx-hue-rotate var(--rb-fx-hue-duration, 4s) linear infinite;
  will-change: filter;
}
`;

/**
 * Apply continuous hue rotation (rainbow cycle).
 * @param {HTMLElement} el
 * @param {{ duration?: number }} [options] duration in seconds
 * @returns {() => void} cleanup
 */
export function applyHueRotate(el, { duration = 4 } = {}) {
  _injectCSS("hue-rotate", HUE_CSS);
  el.style.setProperty("--rb-fx-hue-duration", `${duration}s`);
  return _applyClasses(el, ["rb-fx-hue-rotate"]);
}

// ── 7. Shimmer / Skeleton Loading ─────────────────────────

const SHIMMER_CSS = `
@keyframes rb-fx-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.rb-fx-shimmer {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, var(--rb-fx-shimmer-intensity, 0.06)) 50%,
    transparent 75%
  );
  background-size: 400% 100%;
  animation: rb-fx-shimmer var(--rb-fx-shimmer-duration, 1.5s) ease-in-out infinite;
  will-change: background-position;
}
`;

/**
 * Apply shimmer / loading highlight sweep.
 * @param {HTMLElement} el
 * @param {{ intensity?: number, duration?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyShimmer(el, { intensity = 0.06, duration = 1.5 } = {}) {
  _injectCSS("shimmer", SHIMMER_CSS);
  el.style.setProperty("--rb-fx-shimmer-intensity", String(intensity));
  el.style.setProperty("--rb-fx-shimmer-duration", `${duration}s`);
  return _applyClasses(el, ["rb-fx-shimmer"]);
}

// ── 8. Pixel Dissolve ─────────────────────────────────────

const DISSOLVE_CSS = `
@keyframes rb-fx-dissolve {
  0%   { filter: contrast(1) brightness(1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence baseFrequency='0.02'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='0'/%3E%3C/filter%3E%3C/svg%3E#d"); }
  50%  { filter: contrast(1.2) brightness(1.1); opacity: 0.7; }
  100% { filter: contrast(1) brightness(1); opacity: 0; }
}
.rb-fx-dissolve {
  animation: rb-fx-dissolve var(--rb-fx-dissolve-duration, 1s) ease-out forwards;
  will-change: filter, opacity;
}
`;

/**
 * Apply pixel dissolve / disintegration effect.
 * @param {HTMLElement} el
 * @param {{ duration?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyDissolve(el, { duration = 1 } = {}) {
  _injectCSS("dissolve", DISSOLVE_CSS);
  el.style.setProperty("--rb-fx-dissolve-duration", `${duration}s`);
  return _applyClasses(el, ["rb-fx-dissolve"]);
}

// ── 9. CRT Vignette ──────────────────────────────────────

const VIGNETTE_CSS = `
.rb-fx-vignette {
  position: relative;
  overflow: hidden;
}
.rb-fx-vignette::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, var(--rb-fx-vignette-intensity, 0.6)) 100%
  );
  pointer-events: none;
  z-index: 9997;
}
`;

/**
 * Apply CRT-style vignette (darkened edges).
 * @param {HTMLElement} el
 * @param {{ intensity?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyVignette(el, { intensity = 0.6 } = {}) {
  _injectCSS("vignette", VIGNETTE_CSS);
  el.style.setProperty("--rb-fx-vignette-intensity", String(intensity));
  return _applyClasses(el, ["rb-fx-vignette"]);
}

// ── 10. Flicker ───────────────────────────────────────────

const FLICKER_CSS = `
@keyframes rb-fx-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: var(--rb-fx-flicker-min, 0.4); }
}
.rb-fx-flicker {
  animation: rb-fx-flicker var(--rb-fx-flicker-duration, 3s) linear infinite;
  will-change: opacity;
}
`;

/**
 * Apply fluorescent light flicker.
 * @param {HTMLElement} el
 * @param {{ duration?: number, minOpacity?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyFlicker(el, { duration = 3, minOpacity = 0.4 } = {}) {
  _injectCSS("flicker", FLICKER_CSS);
  el.style.setProperty("--rb-fx-flicker-duration", `${duration}s`);
  el.style.setProperty("--rb-fx-flicker-min", String(minOpacity));
  return _applyClasses(el, ["rb-fx-flicker"]);
}

// ── 11. CRT Bundle (scanlines + vignette + static) ────────

/**
 * Apply a full CRT monitor effect (scanlines + vignette + static noise).
 * @param {HTMLElement} el
 * @param {{ scanIntensity?: number, vignetteIntensity?: number, noiseIntensity?: number }} [options]
 * @returns {() => void} cleanup
 */
export function applyCRT(el, { scanIntensity = 0.06, vignetteIntensity = 0.5, noiseIntensity = 0.08 } = {}) {
  const cleanups = [
    applyScanlines(el, { intensity: scanIntensity, rolling: true }),
    applyVignette(el, { intensity: vignetteIntensity }),
    applyStatic(el, { intensity: noiseIntensity }),
  ];
  return () => cleanups.forEach((fn) => fn());
}

// ── 12. Compose — chain multiple effects ──────────────────

/**
 * Apply multiple effects to one element. Returns a single cleanup.
 * @param {HTMLElement} el
 * @param {Array<(el: HTMLElement) => (() => void)>} fns
 * @returns {() => void} cleanup
 */
export function composeEffects(el, fns) {
  const cleanups = fns.map((fn) => fn(el));
  return () => cleanups.forEach((fn) => fn());
}
