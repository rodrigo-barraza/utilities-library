// ─────────────────────────────────────────────────────────────
// Effects — Visual Filter Effects (Browser-only)
// ─────────────────────────────────────────────────────────────

const EFFECTS_STYLESHEET_ID = "rb-effects-stylesheet";
const injectedEffectNames = new Set<string>();

function injectEffectStylesheet(name: string, css: string): void {
  if (typeof document === "undefined") return;
  if (injectedEffectNames.has(name)) return;
  injectedEffectNames.add(name);

  const sheet = document.getElementById(EFFECTS_STYLESHEET_ID) as HTMLStyleElement | null;
  if (!sheet) {
    const newSheet = document.createElement("style");
    newSheet.id = EFFECTS_STYLESHEET_ID;
    document.head.appendChild(newSheet);
    newSheet.textContent = `\n/* ── ${name} ── */\n${css}\n`;
  } else {
    sheet.textContent += `\n/* ── ${name} ── */\n${css}\n`;
  }
}

function applyEffectClasses(element: HTMLElement, classes: string[]): () => void {
  classes.forEach((className) => element.classList.add(className));
  return () => classes.forEach((className) => element.classList.remove(className));
}

// ── 1. Static / Noise ──────────────────────────────────────

const STATIC_CSS = `
@keyframes rb-effect-static-drift {
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
.rb-effect-static {
  position: relative;
  overflow: hidden;
}
.rb-effect-static::after {
  content: "";
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: var(--rb-effect-static-intensity, 0.12);
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 9999;
  animation: rb-effect-static-drift 0.3s steps(6) infinite;
  will-change: transform;
}
`;

export function applyStatic(element: HTMLElement, { intensity = 0.12 } = {}): () => void {
  injectEffectStylesheet("static", STATIC_CSS);
  element.style.setProperty("--rb-effect-static-intensity", String(intensity));
  return applyEffectClasses(element, ["rb-effect-static"]);
}

// ── 2. Chromatic Aberration (RGB Split) ────────────────────

const CHROMATIC_CSS = `
@keyframes rb-effect-chromatic-shift {
  0%, 100% {
    text-shadow:
      var(--rb-effect-chromatic-aberration-offset, 2px) 0 0 rgba(255, 0, 0, var(--rb-effect-chromatic-aberration-intensity, 0.6)),
      calc(var(--rb-effect-chromatic-aberration-offset, 2px) * -1) 0 0 rgba(0, 255, 255, var(--rb-effect-chromatic-aberration-intensity, 0.6));
  }
  50% {
    text-shadow:
      calc(var(--rb-effect-chromatic-aberration-offset, 2px) * -1) 0 0 rgba(255, 0, 0, var(--rb-effect-chromatic-aberration-intensity, 0.6)),
      var(--rb-effect-chromatic-aberration-offset, 2px) 0 0 rgba(0, 255, 255, var(--rb-effect-chromatic-aberration-intensity, 0.6));
  }
}
.rb-effect-chromatic {
  animation: rb-effect-chromatic-shift 4s ease-in-out infinite;
  will-change: text-shadow;
}
.rb-effect-chromatic-static {
  text-shadow:
    var(--rb-effect-chromatic-aberration-offset, 2px) 0 0 rgba(255, 0, 0, var(--rb-effect-chromatic-aberration-intensity, 0.6)),
    calc(var(--rb-effect-chromatic-aberration-offset, 2px) * -1) 0 0 rgba(0, 255, 255, var(--rb-effect-chromatic-aberration-intensity, 0.6));
}
`;

export function applyChromaticAberration(element: HTMLElement, { offset = 2, intensity = 0.6, animated = true } = {}): () => void {
  injectEffectStylesheet("chromatic", CHROMATIC_CSS);
  element.style.setProperty("--rb-effect-chromatic-aberration-offset", `${offset}px`);
  element.style.setProperty("--rb-effect-chromatic-aberration-intensity", String(intensity));
  return applyEffectClasses(element, [animated ? "rb-effect-chromatic" : "rb-effect-chromatic-static"]);
}

// ── 3. CRT Scanlines ──────────────────────────────────────

const SCANLINE_CSS = `
.rb-effect-scanlines { position: relative; overflow: hidden; }
.rb-effect-scanlines::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, var(--rb-effect-scanlines-intensity, 0.08)) 0px,
    rgba(0, 0, 0, var(--rb-effect-scanlines-intensity, 0.08)) 1px,
    transparent 1px,
    transparent var(--rb-effect-scanlines-gap, 3px)
  );
  pointer-events: none;
  z-index: 9998;
}
@keyframes rb-effect-scanlines-roll {
  from { background-position: 0 0; }
  to   { background-position: 0 100%; }
}
.rb-effect-scanlines-rolling::before {
  animation: rb-effect-scanlines-roll 8s linear infinite;
  will-change: background-position;
}
`;

export function applyScanlines(element: HTMLElement, { intensity = 0.08, gap = 3, rolling = false } = {}): () => void {
  injectEffectStylesheet("scanlines", SCANLINE_CSS);
  element.style.setProperty("--rb-effect-scanlines-intensity", String(intensity));
  element.style.setProperty("--rb-effect-scanlines-gap", `${gap}px`);
  const classes = ["rb-effect-scanlines"];
  if (rolling) classes.push("rb-effect-scanlines-rolling");
  return applyEffectClasses(element, classes);
}

// ── 4. Glitch / Jitter ────────────────────────────────────

const GLITCH_CSS = `
@keyframes rb-effect-glitch-hue {
  0%   { filter: hue-rotate(0deg) brightness(1.2); }
  50%  { filter: hue-rotate(180deg) brightness(0.8); }
  100% { filter: hue-rotate(360deg) brightness(1.2); }
}
@keyframes rb-effect-glitch-jitter {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(-1px, 1px, 0) scale(1.03); }
  50%  { transform: translate3d(1px, -1px, 0) scale(0.97); }
  75%  { transform: translate3d(1px, 0, 0) scale(1.01); }
  100% { transform: translate3d(-1px, 0, 0) scale(0.99); }
}
.rb-effect-glitch {
  animation: rb-effect-glitch-hue 0.15s linear infinite, rb-effect-glitch-jitter 0.05s steps(2) infinite;
  will-change: filter, transform, text-shadow;
  text-shadow: 1px 0 0 rgba(255,0,0,0.7), -1px 0 0 rgba(0,255,255,0.7);
}
.rb-effect-glitch-subtle {
  animation: rb-effect-glitch-jitter 0.1s steps(3) infinite;
  will-change: transform;
}
`;

export function applyGlitch(element: HTMLElement, { subtle = false } = {}): () => void {
  injectEffectStylesheet("glitch", GLITCH_CSS);
  return applyEffectClasses(element, [subtle ? "rb-effect-glitch-subtle" : "rb-effect-glitch"]);
}

// ── 5. VHS Tracking ──────────────────────────────────────

const VHS_CSS = `
@keyframes rb-effect-vhs-track {
  0%   { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  2%   { transform: translate3d(4px, 0, 0) skewX(0.5deg); opacity: 0.85; }
  4%   { transform: translate3d(-2px, 0, 0) skewX(-0.3deg); opacity: 1; }
  5%   { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
  100% { transform: translate3d(0, 0, 0) skewX(0deg); opacity: 1; }
}
.rb-effect-vhs { animation: rb-effect-vhs-track 4s linear infinite; will-change: transform, opacity; }
`;

export function applyVhsTracking(element: HTMLElement): () => void {
  injectEffectStylesheet("vhs", VHS_CSS);
  return applyEffectClasses(element, ["rb-effect-vhs"]);
}

// ── 6. Hue Rotate ─────────────────────────────────────────

const HUE_CSS = `
@keyframes rb-effect-hue-rotate { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }
.rb-effect-hue-rotate { animation: rb-effect-hue-rotate var(--rb-effect-hue-duration, 4s) linear infinite; will-change: filter; }
`;

export function applyHueRotate(element: HTMLElement, { duration = 4 } = {}): () => void {
  injectEffectStylesheet("hue-rotate", HUE_CSS);
  element.style.setProperty("--rb-effect-hue-duration", `${duration}s`);
  return applyEffectClasses(element, ["rb-effect-hue-rotate"]);
}

// ── 7. Shimmer ─────────────────────────────────────────────

const SHIMMER_CSS = `
@keyframes rb-effect-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.rb-effect-shimmer {
  background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,var(--rb-effect-shimmer-intensity, 0.06)) 50%, transparent 75%);
  background-size: 400% 100%;
  animation: rb-effect-shimmer var(--rb-effect-shimmer-duration, 1.5s) ease-in-out infinite;
  will-change: background-position;
}
`;

export function applyShimmer(element: HTMLElement, { intensity = 0.06, duration = 1.5 } = {}): () => void {
  injectEffectStylesheet("shimmer", SHIMMER_CSS);
  element.style.setProperty("--rb-effect-shimmer-intensity", String(intensity));
  element.style.setProperty("--rb-effect-shimmer-duration", `${duration}s`);
  return applyEffectClasses(element, ["rb-effect-shimmer"]);
}

// ── 8. Pixel Dissolve ─────────────────────────────────────

const DISSOLVE_CSS = `
@keyframes rb-effect-dissolve {
  0%   { filter: contrast(1) brightness(1); }
  50%  { filter: contrast(1.2) brightness(1.1); opacity: 0.7; }
  100% { filter: contrast(1) brightness(1); opacity: 0; }
}
.rb-effect-dissolve { animation: rb-effect-dissolve var(--rb-effect-dissolve-duration, 1s) ease-out forwards; will-change: filter, opacity; }
`;

export function applyDissolve(element: HTMLElement, { duration = 1 } = {}): () => void {
  injectEffectStylesheet("dissolve", DISSOLVE_CSS);
  element.style.setProperty("--rb-effect-dissolve-duration", `${duration}s`);
  return applyEffectClasses(element, ["rb-effect-dissolve"]);
}

// ── 9. CRT Vignette ──────────────────────────────────────

const VIGNETTE_CSS = `
.rb-effect-vignette { position: relative; overflow: hidden; }
.rb-effect-vignette::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,var(--rb-effect-vignette-intensity, 0.6)) 100%);
  pointer-events: none;
  z-index: 9997;
}
`;

export function applyVignette(element: HTMLElement, { intensity = 0.6 } = {}): () => void {
  injectEffectStylesheet("vignette", VIGNETTE_CSS);
  element.style.setProperty("--rb-effect-vignette-intensity", String(intensity));
  return applyEffectClasses(element, ["rb-effect-vignette"]);
}

// ── 10. Flicker ───────────────────────────────────────────

const FLICKER_CSS = `
@keyframes rb-effect-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: var(--rb-effect-flicker-minimum-opacity, 0.4); }
}
.rb-effect-flicker { animation: rb-effect-flicker var(--rb-effect-flicker-duration, 3s) linear infinite; will-change: opacity; }
`;

export function applyFlicker(element: HTMLElement, { duration = 3, minimumOpacity = 0.4 } = {}): () => void {
  injectEffectStylesheet("flicker", FLICKER_CSS);
  element.style.setProperty("--rb-effect-flicker-duration", `${duration}s`);
  element.style.setProperty("--rb-effect-flicker-minimum-opacity", String(minimumOpacity));
  return applyEffectClasses(element, ["rb-effect-flicker"]);
}

// ── 11. CRT Bundle ────────────────────────────────────────

export function applyCathodeRayTube(
  element: HTMLElement,
  { scanlineIntensity = 0.06, vignetteIntensity = 0.5, noiseIntensity = 0.08 } = {},
): () => void {
  const cleanups = [
    applyScanlines(element, { intensity: scanlineIntensity, rolling: true }),
    applyVignette(element, { intensity: vignetteIntensity }),
    applyStatic(element, { intensity: noiseIntensity }),
  ];
  return () => cleanups.forEach((cleanupFunction) => cleanupFunction());
}

// ── 12. Compose ──────────────────────────────────────────

export function composeEffects(element: HTMLElement, effectFunctions: Array<(element: HTMLElement) => () => void>): () => void {
  const cleanups = effectFunctions.map((effectFunction) => effectFunction(element));
  return () => cleanups.forEach((cleanupFunction) => cleanupFunction());
}
