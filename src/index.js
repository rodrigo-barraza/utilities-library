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
  formatTokensPerSec,
  formatContextTokens,
  formatPercent,
  roundMs,
} from "./format.js";

// Text — String manipulation and sanitization
export {
  stripHtml,
  normalizeName,
  renderToolName,
  humanizeToolName,
  truncate,
  escapeRegex,
  getRootDomain,
  getSubdomain,
} from "./text.js";

// Date — Date formatting and relative time
export { toISODate, timeAgo, daysSinceIso, formatDateTime, daysAgo, toLocalDateString } from "./date.js";

// Async — Promise-based timing and control
export { sleep, retry, withTimeout } from "./async.js";

// Time — Duration constants and converters
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
} from "./time.js";

// Arrays — Array manipulation
export {
  chunk,
  shuffleArray,
  pickRandom,
  compactPayload,
  groupBy,
  uniqueBy,
} from "./arrays.js";

// Objects — Plain-object manipulation
export { deepMerge, pick, omit } from "./objects.js";

// Math — Numeric utilities
export { clamp } from "./math.js";

// Validation — Input parsing and constraint checking
export {
  parseIntParam,
  parsePrice,
  validateMaxLength,
  parseJsonSafe,
  parseJsonFromLlmResponse,
} from "./validation.js";

// Crypto — Browser-safe cryptographic utilities
export { generateUUID } from "./crypto.js";

// Phone — Phone number formatting
export { formatPhone } from "./phone.js";
