// ─────────────────────────────────────────────────────────────
// Validation — Input parsing and constraint checking
// ─────────────────────────────────────────────────────────────

/**
 * Parse an integer query param with a default fallback and optional max clamp.
 */
export function parseIntParam(value: string | undefined | null, defaultValue: number, max?: number): number {
  if (value == null) return defaultValue;
  const parsed = parseInt(value, 10);
  const result = isNaN(parsed) ? defaultValue : parsed;
  return max != null ? Math.min(result, max) : result;
}

/**
 * Safely parse a price string like "$29.99" or "29.99" into a number.
 */
export function parsePrice(priceString: string | null | undefined): number | null {
  if (!priceString) return null;
  const cleaned = String(priceString).replace(/[^0-9.]/g, "");
  const parsedPrice = parseFloat(cleaned);
  return isNaN(parsedPrice) ? null : parsedPrice;
}

/**
 * Validate that a string value does not exceed a maximum length.
 * Returns an error message string if exceeded, or null if valid.
 */
export function validateMaxLength(value: string | null | undefined, maxLength: number, label: string): string | null {
  if (value && value.length > maxLength) {
    return `${label} exceeds maximum length of ${maxLength.toLocaleString()} characters`;
  }
  return null;
}

/**
 * Safely parse a JSON string, returning a fallback on failure.
 */
export function parseJsonSafe<T = unknown>(jsonString: string | null | undefined, fallback: T | null = null): T | null {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Parse JSON from an LLM response, handling markdown code blocks.
 * Many LLMs wrap JSON in ```json ... ``` — this strips that before parsing.
 */
export function parseJsonFromLlmResponse(text: string | null | undefined): Record<string, unknown> | unknown[] | null {
  if (!text) return null;
  let jsonText = text.trim();

  // 1. Try extracting from ```json ... ``` fences
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  // 2. Try direct parse (works for clean JSON or fence-extracted)
  try {
    return JSON.parse(jsonText);
  } catch {
    // continue to fallback strategies
  }

  // 3. Fallback: extract first top-level JSON object via brace matching
  const objectStart = jsonText.indexOf("{");
  if (objectStart !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = objectStart; i < jsonText.length; i++) {
      const character = jsonText[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (character === "\\") {
        escape = true;
        continue;
      }
      if (character === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (character === "{") depth++;
      else if (character === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(jsonText.slice(objectStart, i + 1));
          } catch {
            break;
          }
        }
      }
    }
  }

  // 4. Fallback: extract first top-level JSON array via bracket matching
  const arrayStart = jsonText.indexOf("[");
  if (arrayStart !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = arrayStart; i < jsonText.length; i++) {
      const character = jsonText[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (character === "\\") {
        escape = true;
        continue;
      }
      if (character === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (character === "[") depth++;
      else if (character === "]") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(jsonText.slice(arrayStart, i + 1));
          } catch {
            break;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Check if a string is a valid email address.
 * Uses a practical regex covering 99.9% of real-world addresses
 * (not the full RFC 5322 grammar, which is deliberately over-broad).
 */
export function isEmail(text: string | null | undefined): boolean {
  if (!text) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
}

/**
 * Check if a string is a valid HTTP(S) URL.
 * Uses the URL constructor for spec-compliant parsing.
 */
export interface IsUrlOptions {
  requireHttps?: boolean;
}

export function isUrl(text: string | null | undefined, { requireHttps = false }: IsUrlOptions = {}): boolean {
  if (!text) return false;
  try {
    const url = new URL(text);
    if (requireHttps) return url.protocol === "https:";
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Check if a value is numeric (finite number or numeric string).
 * e.g. isNumeric("3.14") → true, isNumeric("abc") → false, isNumeric(NaN) → false
 */
export function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") {
    return Number.isFinite(Number(value));
  }
  return false;
}
