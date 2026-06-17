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
  formatLatencyMilliseconds,
  formatDuration,
  formatElapsedTime,
  formatFileSize,
  formatBytes,
  formatMediaTimestamp,
  formatTokensPerSec,
  formatContextTokens,
  formatPercent,
  roundMilliseconds,
} from "./format.ts";
export type { FormatFileSizeOptions } from "./format.ts";

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
} from "./text.ts";

// Date — Date formatting and relative time
export { toISODate, timeAgo, daysSinceIso, formatDateTime, daysAgo, toLocalDateString } from "./date.ts";

// Async — Promise-based timing, concurrency, and control
export { sleep, retry, withTimeout, withTimeoutFallback, fetchWithTimeout, pMap, defer } from "./async.ts";
export type { RetryOptions, PMapOptions, Deferred } from "./async.ts";

// Time — Duration constants, converters, and polling intervals
export {
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_DAY,
  SECONDS_PER_DAY,
  MILLISECONDS_PER_WEEK,
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
  FEEDBACK_BRIEF_MILLISECONDS,
  FEEDBACK_STANDARD_MILLISECONDS,
  TOAST_DURATION_MILLISECONDS,
  ACTION_COOLDOWN_MILLISECONDS,
  ACTION_COOLDOWN_LONG_MILLISECONDS,
  HIGHLIGHT_DURATION_MILLISECONDS,
} from "./time.ts";


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
} from "./arrays.ts";
export type { SortByOptions } from "./arrays.ts";

// Objects — Plain-object manipulation
export { deepMerge, pick, omit, mapValues, mapKeys, invert, isEmpty, deepEqual } from "./objects.ts";

// Math — Numeric utilities
export { clamp, roundCents, randomInt, cosineSimilarity, lerp, remap, sum, average, median, roundTo } from "./math.ts";

// Validation — Input parsing and constraint checking
export {
  parseIntParam,
  parsePrice,
  validateMaxLength,
  parseJsonSafe,
  parseJsonFromLargeLanguageModelResponse,
  isEmail,
  isUrl,
  isNumeric,
} from "./validation.ts";
export type { IsUrlOptions } from "./validation.ts";

// Crypto — Browser-safe cryptographic utilities
export { generateUUID } from "./crypto.ts";

// Phone — Phone number formatting
export { formatPhone } from "./phone.ts";

// Rate — Debounce and throttle
export { debounce, throttle } from "./rate.ts";
export type { DebouncedFunction, ThrottledFunction, DebounceOptions } from "./rate.ts";

// Color — Color manipulation and interpolation
export { parseHex, toHex, lerpColor, rgbToHsl, hslToRgb, adjustBrightness, lerpRgb, paletteAt } from "./color.ts";
export type { RGB, RGBA, HSL, RgbTriplet } from "./color.ts";

// Errors — Type-safe error handling utilities
export { errorMessage } from "./errors.ts";
