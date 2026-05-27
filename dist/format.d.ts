/**
 * Format a number with compact notation and adaptive decimal precision.
 * e.g. 10000000 → "10M", 3500 → "3.5K", 42 → "42"
 */
export declare function formatCompact(value: number | null | undefined): string;
/**
 * Format a number with K/M abbreviation (truncated, no decimals).
 */
export declare function formatNumber(value: number | null | undefined): string;
/**
 * Format a token count as full value with thousands separators.
 * Unlike formatNumber, this never abbreviates to K/M.
 * e.g. 1234567 → "1,234,567"
 */
export declare function formatTokenCount(value: number | null | undefined): string;
/**
 * Format a USD cost with fixed 5-decimal precision.
 */
export declare function formatCost(value: number | null | undefined): string;
/**
 * Format a USD cost with adaptive precision.
 * Costs < $0.01 show 4 decimals, otherwise 2.
 * e.g. 0.0034 → "$0.0034", 1.50 → "$1.50"
 */
export declare function formatCostAdaptive(cost: number | null | undefined): string;
/**
 * Format an estimated cost as a log-friendly tag string.
 * Returns `, cost: $0.001234` when cost is available, or empty string otherwise.
 */
export declare function formatCostTag(estimatedCost: number | null): string;
/**
 * Format a latency value given in seconds.
 * e.g. 0.3 → "300ms", 5.2 → "5.2s", 90 → "1.5m"
 */
export declare function formatLatency(seconds: number | null | undefined): string;
/**
 * Format a latency value given in milliseconds.
 * Thin wrapper over formatLatency(seconds).
 */
export declare function formatLatencyMs(ms: number | null | undefined): string;
/**
 * Format a duration in milliseconds to a human-readable string.
 * e.g. 500 → "500ms", 5000 → "5.0s", 90000 → "1m 30s"
 */
export declare function formatDuration(ms: number | null | undefined): string;
/**
 * Format an elapsed duration (in seconds) into a human-readable string.
 * Delegates to `formatDuration(ms)` internally.
 * e.g. 5 → "5.0s", 65 → "1m 5s", 3665 → "1h 1m"
 */
export declare function formatElapsedTime(seconds: number | null | undefined): string;
export interface FormatFileSizeOptions {
    /** If true, omit space between number and unit ("1.5KB" vs "1.5 KB")
     *  and show "0B" for zero. Matches the style used in request loggers. */
    compact?: boolean;
}
/**
 * Format a byte count as human-readable file size (GB, MB, KB).
 */
export declare function formatFileSize(bytes: number, { compact }?: FormatFileSizeOptions): string | null;
/**
 * Format bytes with adaptive decimal precision.
 * Uses the common Math.log/Math.pow approach with dynamic rounding:
 *   - < 10 units  → 2 decimals  (e.g. "3.25 GB")
 *   - < 100 units → 1 decimal   (e.g. "34.5 MB")
 *   - >= 100      → integer     (e.g. "512 KB")
 *
 * Supports B, KB, MB, GB, TB. Returns "0 B" for zero/falsy values.
 * Preferred over `formatFileSize` for infrastructure/system metrics.
 */
export declare function formatBytes(bytes: number): string;
/**
 * Format tokens-per-second with consistent precision.
 * Returns "X.X" or "—" for null/zero values.
 */
export declare function formatTokensPerSec(value: number | null | undefined): string;
/**
 * Format a context window token count (e.g. 128000 → "128K", 1000000 → "1M").
 * Delegates to `formatCompact` with truncated decimals.
 */
export declare function formatContextTokens(tokens: number | null | undefined): string | null;
/**
 * Round a floating-point seconds value to millisecond precision (3 decimals).
 * Standard precision for all timing metrics stored in the database.
 */
export declare function roundMs(seconds: number): number;
/**
 * Format a monetary amount with its currency symbol.
 * Uses Intl.NumberFormat to correctly place thousands separators and
 * applies the symbol for the requested currency.
 */
export declare function formatCurrency(amount: number | null | undefined, currencyCode?: string): string;
/**
 * Format a numeric value as a percentage string.
 * e.g. 85.456 → "85.5%", null → "—"
 *
 * When `decimals` is `"adaptive"`, uses dynamic precision:
 *   - < 0.01  → "0%"
 *   - < 1     → 2 decimals  ("0.42%")
 *   - < 10    → 1 decimal   ("3.5%")
 *   - >= 10   → integer     ("85%")
 */
export declare function formatPercent(value: number | null | undefined, decimals?: number | "adaptive"): string;
/**
 * Format a duration in seconds as a media timestamp (H:MM:SS or M:SS).
 * Used for video players, track durations, and media metadata.
 * e.g. 65 → "1:05", 3661 → "1:01:01", 0 → "0:00"
 */
export declare function formatMediaTimestamp(seconds: number | null | undefined): string;
//# sourceMappingURL=format.d.ts.map