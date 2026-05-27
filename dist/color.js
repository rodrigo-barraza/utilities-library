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
        normalizedHex = [...normalizedHex].map((hexChar) => hexChar + hexChar).join("");
    }
    const parsedInteger = parseInt(normalizedHex, 16);
    if (normalizedHex.length === 8) {
        return {
            r: (parsedInteger >>> 24) & 0xff,
            g: (parsedInteger >>> 16) & 0xff,
            b: (parsedInteger >>> 8) & 0xff,
            a: (parsedInteger & 0xff) / 255,
        };
    }
    return {
        r: (parsedInteger >> 16) & 0xff,
        g: (parsedInteger >> 8) & 0xff,
        b: parsedInteger & 0xff,
        a: 1,
    };
}
/**
 * Convert an `{ r, g, b }` object (0–255) to a hex color string.
 */
export function toHex({ r, g, b }) {
    return ("#" +
        [r, g, b]
            .map((channelValue) => Math.round(channelValue).toString(16).padStart(2, "0"))
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
export function rgbToHsl({ r: redInput, g: greenInput, b: blueInput }) {
    const r = redInput / 255;
    const g = greenInput / 255;
    const b = blueInput / 255;
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
export function hslToRgb({ h: hueInput, s: saturationInput, l: lightnessInput }) {
    const h = hueInput / 360;
    const s = saturationInput / 100;
    const l = lightnessInput / 100;
    if (s === 0) {
        const grayscaleValue = Math.round(l * 255);
        return { r: grayscaleValue, g: grayscaleValue, b: grayscaleValue };
    }
    const hue2rgb = (tempColorVal1, tempColorVal2, tempColorVal3) => {
        if (tempColorVal3 < 0)
            tempColorVal3 += 1;
        if (tempColorVal3 > 1)
            tempColorVal3 -= 1;
        if (tempColorVal3 < 1 / 6)
            return tempColorVal1 + (tempColorVal2 - tempColorVal1) * 6 * tempColorVal3;
        if (tempColorVal3 < 1 / 2)
            return tempColorVal2;
        if (tempColorVal3 < 2 / 3)
            return tempColorVal1 + (tempColorVal2 - tempColorVal1) * (2 / 3 - tempColorVal3) * 6;
        return tempColorVal1;
    };
    const tempColorVal2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const tempColorVal1 = 2 * l - tempColorVal2;
    return {
        r: Math.round(hue2rgb(tempColorVal1, tempColorVal2, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(tempColorVal1, tempColorVal2, h) * 255),
        b: Math.round(hue2rgb(tempColorVal1, tempColorVal2, h - 1 / 3) * 255),
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
/**
 * Linearly interpolate between two RGB triplets.
 */
export function lerpRgb(colorA, colorB, interpolationValue) {
    return [
        colorA[0] + (colorB[0] - colorA[0]) * interpolationValue,
        colorA[1] + (colorB[1] - colorA[1]) * interpolationValue,
        colorA[2] + (colorB[2] - colorA[2]) * interpolationValue,
    ];
}
/**
 * Sample the rainbow palette at a normalized position.
 */
export function paletteAt(colors, position) {
    const scaledPosition = (((position % 1) + 1) % 1) * colors.length;
    const currentIndex = Math.floor(scaledPosition);
    const fractionalPart = scaledPosition - currentIndex;
    return lerpRgb(colors[currentIndex % colors.length], colors[(currentIndex + 1) % colors.length], fractionalPart);
}
//# sourceMappingURL=color.js.map