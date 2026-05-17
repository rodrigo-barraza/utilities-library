// ─────────────────────────────────────────────────────────────
// Time — Duration constants and converters (milliseconds)
// ─────────────────────────────────────────────────────────────
/** One second in milliseconds. */
export const MS_PER_SECOND = 1_000;
/** One minute in milliseconds. */
export const MS_PER_MINUTE = 60_000;
/** One hour in milliseconds. */
export const MS_PER_HOUR = 3_600_000;
/** One day in milliseconds. */
export const MS_PER_DAY = 86_400_000;
/** One day in seconds. */
export const SECONDS_PER_DAY = 86_400;
/** One week in milliseconds. */
export const MS_PER_WEEK = 604_800_000;
/**
 * Convert seconds to milliseconds.
 */
export const seconds = (n) => n * MS_PER_SECOND;
/**
 * Convert minutes to milliseconds.
 */
export const minutes = (n) => n * MS_PER_MINUTE;
/**
 * Convert hours to milliseconds.
 */
export const hours = (n) => n * MS_PER_HOUR;
/**
 * Convert days to milliseconds.
 */
export const days = (n) => n * MS_PER_DAY;
/**
 * Convert weeks to milliseconds.
 */
export const weeks = (n) => n * MS_PER_WEEK;
// ── Polling Interval Tiers ──────────────────────────────────
// Standardized intervals for UI polling across all clients.
/** 3 s — Live status, benchmarks, worker panels. */
export const POLL_FAST = 3_000;
/** 5 s — Default table/list polling (containers, conversations). */
export const POLL_STANDARD = 5_000;
/** 15 s — Model lists, analytics, moderate-frequency data. */
export const POLL_MODERATE = 15_000;
/** 30 s — Health checks, background probes. */
export const POLL_SLOW = 30_000;
/** 60 s — Dashboard-level refreshes. */
export const POLL_LAZY = 60_000;
//# sourceMappingURL=time.js.map