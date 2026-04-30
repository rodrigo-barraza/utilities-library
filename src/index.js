// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities — Isomorphic entry point
// ─────────────────────────────────────────────────────────────
// Browser-safe utilities. No Node.js APIs (fs, crypto, process).
// For Node-only utilities, import from "@rodrigo-barraza/utilities/node".
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
  roundMs,
} from "./format.js";

// Text — String manipulation and sanitization
export { stripHtml, normalizeName, renderToolName, humanizeToolName } from "./text.js";

// Date — Date formatting and relative time
export { toISODate, timeAgo, daysSinceIso } from "./date.js";

// Async — Promise-based timing
export { sleep } from "./async.js";

// Arrays — Array and object manipulation
export { chunk, shuffleArray, pickRandom, compactPayload } from "./arrays.js";

// Validation — Input parsing and constraint checking
export { parseIntParam, parsePrice, validateMaxLength } from "./validation.js";

// Crypto — Browser-safe cryptographic utilities
export { generateUUID } from "./crypto.js";

// Phone — Phone number formatting
export { formatPhone } from "./phone.js";
