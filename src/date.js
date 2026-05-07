// ─────────────────────────────────────────────────────────────
// Date — Date formatting and relative time utilities
// ─────────────────────────────────────────────────────────────

/**
 * Format a Date as an ISO date string (YYYY-MM-DD).
 * Replaces the repeated `date.toISOString().slice(0, 10)` pattern.
 *
 * @param {Date} [date=new Date()] - The date to format
 * @returns {string}
 */
export function toISODate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Human-readable relative timestamp from an ISO date string or Date.
 * Covers fine-grained ("just now", "30s ago") and
 * coarse-grained ("today", "yesterday", "3d ago") ranges.
 *
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

/**
 * Calculate whole days elapsed since an ISO 8601 timestamp.
 *
 * @param {string} isoDate - ISO date string
 * @returns {number} Non-negative integer days
 */
export function daysSinceIso(isoDate) {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000),
  );
}

/**
 * Format an ISO timestamp as a compact, human-readable date-time string.
 * Uses Intl.DateTimeFormat for locale-correct output.
 * Omits the year when the date is in the current year.
 *
 * @param {string|Date} dateInput - ISO date string or Date object
 * @param {Intl.DateTimeFormatOptions} [opts] - Additional Intl options to merge
 * @returns {string}
 */
export function formatDateTime(dateInput, opts = {}) {
  if (!dateInput) return "—";
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return "—";
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    ...opts,
  });
}

/**
 * Return a new Date that is `n` days in the past from now.
 *
 * @param {number} n - Number of days ago
 * @returns {Date}
 */
export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Format a Date as a local-time date string (YYYY-MM-DD).
 * Unlike `toISODate()`, this uses the local timezone rather than UTC.
 *
 * @param {Date} [date=new Date()] - The date to format
 * @returns {string}
 */
export function toLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
