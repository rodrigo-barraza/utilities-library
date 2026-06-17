// ─────────────────────────────────────────────────────────────
// Date — Date formatting and relative time utilities
// ─────────────────────────────────────────────────────────────

/**
 * Format a Date as an ISO date string (YYYY-MM-DD).
 */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Human-readable relative timestamp from an ISO date string or Date.
 * Covers fine-grained ("just now", "30s ago") and
 * coarse-grained ("today", "yesterday", "3d ago") ranges.
 */
export function timeAgo(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const differenceMilliseconds = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(differenceMilliseconds / 1000);
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
 */
export function daysSinceIso(isoDate: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000),
  );
}

/**
 * Format an ISO timestamp as a compact, human-readable date-time string.
 * Uses Intl.DateTimeFormat for locale-correct output.
 * Omits the year when the date is in the current year.
 */
export function formatDateTime(
  dateInput: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
): string {
  if (!dateInput) return "—";
  const parsedDate = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(parsedDate.getTime())) return "—";
  const sameYear = parsedDate.getFullYear() === new Date().getFullYear();
  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Return a new Date that is `daysCount` days in the past from now.
 */
export function daysAgo(daysCount: number): Date {
  const result = new Date();
  result.setDate(result.getDate() - daysCount);
  return result;
}

/**
 * Format a Date as a local-time date string (YYYY-MM-DD).
 * Unlike `toISODate()`, this uses the local timezone rather than UTC.
 */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
//
