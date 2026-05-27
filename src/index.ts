// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities-library — Isomorphic entry point
// ─────────────────────────────────────────────────────────────
// Browser-safe utilities. No Node.js APIs (fs, crypto, process).
// For Node-only utilities, import from "@rodrigo-barraza/utilities-library/node".
// ─────────────────────────────────────────────────────────────

// Format — Number, cost, duration, and time formatting
export {
  formatCompact,
  formatNumber,
  formatTokenCount,
  formatCost,
  formatCostAdaptive,
  formatCostTag,
  formatCurrency,
  formatLatency,
  formatLatencyMs,
  formatDuration,
  formatElapsedTime,
  formatFileSize,
  formatBytes,
  formatMediaTimestamp,
  formatTokensPerSec,
  formatContextTokens,
  formatPercent,
  roundMs,
} from "./format.js";
export type { FormatFileSizeOptions } from "./format.js";

// Text — String manipulation, sanitization, and case conversion
export {
  stripHtml,
  normalizeName,
  renderToolName,
  humanizeToolName,
  truncate,
  escapeRegex,
  getRootDomain,
  getSubdomain,
  capitalize,
  slugify,
  toKebabCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  pluralize,
  wordCount,
} from "./text.js";

// Date — Date formatting and relative time
export { toISODate, timeAgo, daysSinceIso, formatDateTime, daysAgo, toLocalDateString } from "./date.js";

// Async — Promise-based timing, concurrency, and control
export { sleep, retry, withTimeout, withTimeoutFallback, fetchWithTimeout, pMap, defer } from "./async.js";
export type { RetryOptions, PMapOptions, Deferred } from "./async.js";

// Time — Duration constants, converters, and polling intervals
export {
  MS_PER_SECOND,
  MS_PER_MINUTE,
  MS_PER_HOUR,
  MS_PER_DAY,
  SECONDS_PER_DAY,
  MS_PER_WEEK,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  POLL_FAST,
  POLL_STANDARD,
  POLL_MODERATE,
  POLL_SLOW,
  POLL_LAZY,
  FEEDBACK_BRIEF_MS,
  FEEDBACK_STANDARD_MS,
  TOAST_DURATION_MS,
  ACTION_COOLDOWN_MS,
  ACTION_COOLDOWN_LONG_MS,
  HIGHLIGHT_DURATION_MS,
} from "./time.js";

// Arrays — Array manipulation
export {
  chunk,
  shuffleArray,
  pickRandom,
  compactPayload,
  groupBy,
  uniqueBy,
  partition,
  intersection,
  difference,
  sortBy,
  flatten,
} from "./arrays.js";
export type { SortByOptions } from "./arrays.js";

// Objects — Plain-object manipulation
export { deepMerge, pick, omit, mapValues, mapKeys, invert, isEmpty, deepEqual } from "./objects.js";

// Math — Numeric utilities
export { clamp, roundCents, randomInt, cosineSimilarity, lerp, remap, sum, average, median, roundTo } from "./math.js";

// Validation — Input parsing and constraint checking
export {
  parseIntParam,
  parsePrice,
  validateMaxLength,
  parseJsonSafe,
  parseJsonFromLlmResponse,
  isEmail,
  isUrl,
  isNumeric,
} from "./validation.js";
export type { IsUrlOptions } from "./validation.js";

// Crypto — Browser-safe cryptographic utilities
export { generateUUID } from "./crypto.js";

// Phone — Phone number formatting
export { formatPhone } from "./phone.js";

// Rate — Debounce and throttle
export { debounce, throttle } from "./rate.js";
export type { DebouncedFunction, ThrottledFunction, DebounceOptions } from "./rate.js";

// Color — Color manipulation and interpolation
export { parseHex, toHex, lerpColor, rgbToHsl, hslToRgb, adjustBrightness, lerpRgb, paletteAt } from "./color.js";
export type { RGB, RGBA, HSL, RgbTriplet } from "./color.js";

// Errors — Type-safe error handling utilities
export { errorMessage } from "./errors.js";
