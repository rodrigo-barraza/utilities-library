// ─────────────────────────────────────────────────────────────
// Color — Color manipulation and interpolation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Parse a hex color string (#RGB, #RRGGBB, or #RRGGBBAA) into
 * an `{ r, g, b, a }` object with values in the 0–255 range
 * (alpha as 0–1).
 *
 * @param {string} hex - Hex color string (with or without #)
 * @returns {{ r: number, g: number, b: number, a: number }}
 */
export function parseHex(hex) {
  let h = hex.replace(/^#/, "");
  if (h.length === 3 || h.length === 4) {
    h = [...h].map((c) => c + c).join("");
  }
  const int = parseInt(h, 16);
  if (h.length === 8) {
    return {
      r: (int >>> 24) & 0xff,
      g: (int >>> 16) & 0xff,
      b: (int >>> 8) & 0xff,
      a: (int & 0xff) / 255,
    };
  }
  return {
    r: (int >> 16) & 0xff,
    g: (int >> 8) & 0xff,
    b: int & 0xff,
    a: 1,
  };
}

/**
 * Convert an `{ r, g, b }` object (0–255) to a hex color string.
 *
 * @param {{ r: number, g: number, b: number }} color
 * @returns {string} Hex color string (e.g. "#ff8800")
 */
export function toHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Linearly interpolate between two hex colors.
 *
 * @param {string} colorA - Start hex color
 * @param {string} colorB - End hex color
 * @param {number} t - Interpolation factor (0 = colorA, 1 = colorB)
 * @returns {string} Interpolated hex color
 */
export function lerpColor(colorA, colorB, t) {
  const a = parseHex(colorA);
  const b = parseHex(colorB);
  return toHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

/**
 * Convert an `{ r, g, b }` object (0–255) to an HSL object.
 *
 * @param {{ r: number, g: number, b: number }} color
 * @returns {{ h: number, s: number, l: number }} h in [0,360], s and l in [0,100]
 */
export function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert an HSL object to `{ r, g, b }` (0–255).
 *
 * @param {{ h: number, s: number, l: number }} hsl - h in [0,360], s and l in [0,100]
 * @returns {{ r: number, g: number, b: number }}
 */
export function hslToRgb({ h, s, l }) {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Lighten or darken a hex color by a percentage.
 *
 * @param {string} hex - Hex color string
 * @param {number} amount - Percentage to lighten (+) or darken (−), e.g. 20 or -20
 * @returns {string} Adjusted hex color
 */
export function adjustBrightness(hex, amount) {
  const rgb = parseHex(hex);
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
  return toHex(hslToRgb(hsl));
}
