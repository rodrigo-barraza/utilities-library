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
 * @param {number} n
 * @returns {number}
 */
export const seconds = (n) => n * MS_PER_SECOND;

/**
 * Convert minutes to milliseconds.
 * @param {number} n
 * @returns {number}
 */
export const minutes = (n) => n * MS_PER_MINUTE;

/**
 * Convert hours to milliseconds.
 * @param {number} n
 * @returns {number}
 */
export const hours = (n) => n * MS_PER_HOUR;

/**
 * Convert days to milliseconds.
 * @param {number} n
 * @returns {number}
 */
export const days = (n) => n * MS_PER_DAY;

/**
 * Convert weeks to milliseconds.
 * @param {number} n
 * @returns {number}
 */
export const weeks = (n) => n * MS_PER_WEEK;
