// ─────────────────────────────────────────────────────────────
// Validation — Input parsing and constraint checking
// ─────────────────────────────────────────────────────────────
export function parseIntParam(value, defaultValue, max) {
    if (value == null)
        return defaultValue;
    const parsed = parseInt(value, 10);
    const result = isNaN(parsed) ? defaultValue : parsed;
    return max != null ? Math.min(result, max) : result;
}
export function parsePrice(priceString) {
    if (!priceString)
        return null;
    const cleaned = String(priceString).replace(/[^0-9.]/g, "");
    const parsedPrice = parseFloat(cleaned);
    return isNaN(parsedPrice) ? null : parsedPrice;
}
export function validateMaxLength(value, maxLength, label) {
    if (value && value.length > maxLength) {
        return `${label} exceeds maximum length of ${maxLength.toLocaleString()} characters`;
    }
    return null;
}
export function parseJsonSafe(jsonString, fallback = null) {
    if (!jsonString)
        return fallback;
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return fallback;
    }
}
// Handles markdown code blocks that LLMs commonly wrap JSON in (```json ... ```).
// Falls back to brace/bracket matching when direct parsing fails.
export function parseJsonFromLargeLanguageModelResponse(text) {
    if (!text)
        return null;
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch)
        jsonText = jsonMatch[1].trim();
    try {
        return JSON.parse(jsonText);
    }
    catch {
        // continue to fallback strategies
    }
    const objectStart = jsonText.indexOf("{");
    if (objectStart !== -1) {
        let depth = 0;
        let isInString = false;
        let isEscaped = false;
        for (let i = objectStart; i < jsonText.length; i++) {
            const character = jsonText[i];
            if (isEscaped) {
                isEscaped = false;
                continue;
            }
            if (character === "\\") {
                isEscaped = true;
                continue;
            }
            if (character === '"') {
                isInString = !isInString;
                continue;
            }
            if (isInString)
                continue;
            if (character === "{")
                depth++;
            else if (character === "}") {
                depth--;
                if (depth === 0) {
                    try {
                        return JSON.parse(jsonText.slice(objectStart, i + 1));
                    }
                    catch {
                        break;
                    }
                }
            }
        }
    }
    const arrayStart = jsonText.indexOf("[");
    if (arrayStart !== -1) {
        let depth = 0;
        let isInString = false;
        let isEscaped = false;
        for (let i = arrayStart; i < jsonText.length; i++) {
            const character = jsonText[i];
            if (isEscaped) {
                isEscaped = false;
                continue;
            }
            if (character === "\\") {
                isEscaped = true;
                continue;
            }
            if (character === '"') {
                isInString = !isInString;
                continue;
            }
            if (isInString)
                continue;
            if (character === "[")
                depth++;
            else if (character === "]") {
                depth--;
                if (depth === 0) {
                    try {
                        return JSON.parse(jsonText.slice(arrayStart, i + 1));
                    }
                    catch {
                        break;
                    }
                }
            }
        }
    }
    return null;
}
export function isEmail(text) {
    if (!text)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
}
export function isUrl(text, { requireHttps = false } = {}) {
    if (!text)
        return false;
    try {
        const url = new URL(text);
        if (requireHttps)
            return url.protocol === "https:";
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch {
        return false;
    }
}
export function isNumeric(value) {
    if (typeof value === "number")
        return Number.isFinite(value);
    if (typeof value === "string" && value.trim() !== "") {
        return Number.isFinite(Number(value));
    }
    return false;
}
//# sourceMappingURL=validation.js.map