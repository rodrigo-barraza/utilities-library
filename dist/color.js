// ─────────────────────────────────────────────────────────────
// Color — Color manipulation and interpolation utilities
// ─────────────────────────────────────────────────────────────
/**
 * Parse a hex color string (#RGB, #RRGGBB, or #RRGGBBAA) into
 * an `{ r, g, b, a }` object with values in the 0–255 range
 * (alpha as 0–1).
 */
export function parseHex(hex) {
    let normalizedHex = hex.replace(/^#/, "");
    if (normalizedHex.length === 3 || normalizedHex.length === 4) {
        normalizedHex = [...normalizedHex].map((c) => c + c).join("");
    }
    const int = parseInt(normalizedHex, 16);
    if (normalizedHex.length === 8) {
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
 */
export function toHex({ r, g, b }) {
    return ("#" +
        [r, g, b]
            .map((c) => Math.round(c).toString(16).padStart(2, "0"))
            .join(""));
}
/**
 * Linearly interpolate between two hex colors.
 */
export function lerpColor(colorA, colorB, t) {
    const startColor = parseHex(colorA);
    const endColor = parseHex(colorB);
    return toHex({
        r: startColor.r + (endColor.r - startColor.r) * t,
        g: startColor.g + (endColor.g - startColor.g) * t,
        b: startColor.b + (endColor.b - startColor.b) * t,
    });
}
/**
 * Convert an `{ r, g, b }` object (0–255) to an HSL object.
 */
export function rgbToHsl({ r: rIn, g: gIn, b: bIn }) {
    const r = rIn / 255;
    const g = gIn / 255;
    const b = bIn / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min)
        return { h: 0, s: 0, l: l * 100 };
    const delta = max - min;
    const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let h;
    if (max === r)
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g)
        h = ((b - r) / delta + 2) / 6;
    else
        h = ((r - g) / delta + 4) / 6;
    return { h: h * 360, s: s * 100, l: l * 100 };
}
/**
 * Convert an HSL object to `{ r, g, b }` (0–255).
 */
export function hslToRgb({ h: hIn, s: sIn, l: lIn }) {
    const h = hIn / 360;
    const s = sIn / 100;
    const l = lIn / 100;
    if (s === 0) {
        const grayscaleValue = Math.round(l * 255);
        return { r: grayscaleValue, g: grayscaleValue, b: grayscaleValue };
    }
    const hue2rgb = (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
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
 */
export function adjustBrightness(hex, amount) {
    const rgb = parseHex(hex);
    const hsl = rgbToHsl(rgb);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return toHex(hslToRgb(hsl));
}
//# sourceMappingURL=color.js.map