/**
 * Format a Date as an ISO date string (YYYY-MM-DD).
 */
export declare function toISODate(date?: Date): string;
/**
 * Human-readable relative timestamp from an ISO date string or Date.
 * Covers fine-grained ("just now", "30s ago") and
 * coarse-grained ("today", "yesterday", "3d ago") ranges.
 */
export declare function timeAgo(date: string | Date | null | undefined): string;
/**
 * Calculate whole days elapsed since an ISO 8601 timestamp.
 */
export declare function daysSinceIso(isoDate: string): number;
/**
 * Format an ISO timestamp as a compact, human-readable date-time string.
 * Uses Intl.DateTimeFormat for locale-correct output.
 * Omits the year when the date is in the current year.
 */
export declare function formatDateTime(dateInput: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string;
/**
 * Return a new Date that is `daysCount` days in the past from now.
 */
export declare function daysAgo(daysCount: number): Date;
/**
 * Format a Date as a local-time date string (YYYY-MM-DD).
 * Unlike `toISODate()`, this uses the local timezone rather than UTC.
 */
export declare function toLocalDateString(date?: Date): string;
//# sourceMappingURL=date.d.ts.map