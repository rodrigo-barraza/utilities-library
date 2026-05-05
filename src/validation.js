// ─────────────────────────────────────────────────────────────
// Validation — Input parsing and constraint checking
// ─────────────────────────────────────────────────────────────

/**
 * Parse an integer query param with a default fallback and optional max clamp.
 * Replaces the repeated `Math.min(parseInt(req.query.X) || default, max)` pattern.
 *
 * @param {string|undefined} value - Raw query string value
 * @param {number} defaultValue
 * @param {number} [max] - Optional upper bound (clamped via Math.min)
 * @returns {number}
 */
export function parseIntParam(value, defaultValue, max) {
  if (value == null) return defaultValue;
  const parsed = parseInt(value, 10);
  const result = isNaN(parsed) ? defaultValue : parsed;
  return max != null ? Math.min(result, max) : result;
}

/**
 * Safely parse a price string like "$29.99" or "29.99" into a number.
 * @param {string} priceStr
 * @returns {number|null}
 */
export function parsePrice(priceStr) {
  if (!priceStr) return null;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Validate that a string value does not exceed a maximum length.
 * Returns an error message string if exceeded, or null if valid.
 *
 * @param {string} value - The string to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} label - Human-readable label (e.g. "Code", "Command")
 * @returns {string|null} Error message or null
 */
export function validateMaxLength(value, maxLength, label) {
  if (value && value.length > maxLength) {
    return `${label} exceeds maximum length of ${maxLength.toLocaleString()} characters`;
  }
  return null;
}

/**
 * Safely parse a JSON string, returning a fallback on failure.
 * Avoids the repetitive `try { JSON.parse(x) } catch { return null }` pattern.
 *
 * @param {string} str - JSON string to parse
 * @param {*} [fallback=null] - Value to return if parsing fails
 * @returns {*}
 */
export function parseJsonSafe(str, fallback = null) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Parse JSON from an LLM response, handling markdown code blocks.
 * Many LLMs wrap JSON in ```json ... ``` — this strips that before parsing.
 *
 * @param {string} text - Raw LLM response text
 * @returns {object|Array|null} Parsed JSON, or null if parsing fails
 */
export function parseJsonFromLlmResponse(text) {
  if (!text) return null;
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}
