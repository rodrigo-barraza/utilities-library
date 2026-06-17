// ─────────────────────────────────────────────────────────────
// Format — Number, cost, duration, and time formatting utilities
// ─────────────────────────────────────────────────────────────
/**
 * Format a number with compact notation and adaptive decimal precision.
 * e.g. 10000000 → "10M", 3500 → "3.5K", 42 → "42"
 */
export function formatCompact(value) {
    if (value == null)
        return "—";
    if (value >= 1_000_000)
        return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
    if (value >= 1_000)
        return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
    return value.toLocaleString();
}
/**
 * Format a number with K/M abbreviation (truncated, no decimals).
 */
export function formatNumber(value) {
    if (value === null || value === undefined)
        return "0";
    if (value >= 1_000_000)
        return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000)
        return `${(value / 1_000).toFixed(0)}K`;
    return value.toLocaleString();
}
/**
 * Format a token count as full value with thousands separators.
 * Unlike formatNumber, this never abbreviates to K/M.
 * e.g. 1234567 → "1,234,567"
 */
export function formatTokenCount(value) {
    if (value === null || value === undefined || value === 0)
        return "0";
    return Number(value).toLocaleString();
}
/**
 * Format a USD cost with fixed 5-decimal precision.
 */
export function formatCost(value) {
    if (value === null || value === undefined)
        return "$0.00";
    return `$${value.toFixed(5)}`;
}
/**
 * Format a USD cost with adaptive precision.
 * Costs < $0.01 show 4 decimals, otherwise 2.
 * e.g. 0.0034 → "$0.0034", 1.50 → "$1.50"
 */
export function formatCostAdaptive(cost) {
    if (!cost || cost === 0)
        return "$0.00";
    if (cost < 0.01)
        return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
}
/**
 * Format an estimated cost as a log-friendly tag string.
 * Returns `, cost: $0.001234` when cost is available, or empty string otherwise.
 */
export function formatCostTag(estimatedCost) {
    return estimatedCost !== null ? `, cost: $${estimatedCost.toFixed(6)}` : "";
}
/**
 * Format a latency value given in seconds.
 * e.g. 0.3 → "300ms", 5.2 → "5.2s", 90 → "1.5m"
 */
export function formatLatency(seconds) {
    if (seconds === null || seconds === undefined)
        return "-";
    if (seconds >= 60)
        return `${(seconds / 60).toFixed(1)}m`;
    if (seconds >= 1)
        return `${seconds.toFixed(1)}s`;
    return `${Math.round(seconds * 1000)}ms`;
}
/**
 * Format a latency value given in milliseconds.
 * Thin wrapper over formatLatency(seconds).
 */
export function formatLatencyMilliseconds(milliseconds) {
    if (!milliseconds)
        return "—";
    return formatLatency(milliseconds / 1000);
}
/**
 * Format a duration in milliseconds to a human-readable string.
 * e.g. 500 → "500ms", 5000 → "5.0s", 90000 → "1m 30s"
 */
export function formatDuration(milliseconds) {
    if (milliseconds == null)
        return "—";
    const roundedMilliseconds = Math.round(milliseconds);
    if (roundedMilliseconds < 1000)
        return `${roundedMilliseconds}ms`;
    if (roundedMilliseconds < 60_000)
        return `${(roundedMilliseconds / 1000).toFixed(1)}s`;
    const totalMinutes = Math.floor(roundedMilliseconds / 60_000);
    const remainingSeconds = Math.floor((roundedMilliseconds % 60_000) / 1000);
    if (totalMinutes < 60)
        return remainingSeconds > 0 ? `${totalMinutes}m ${remainingSeconds}s` : `${totalMinutes}m`;
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return remainingMinutes > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalHours}h`;
}
/**
 * Format an elapsed duration (in seconds) into a human-readable string.
 * Delegates to `formatDuration(ms)` internally.
 * e.g. 5 → "5.0s", 65 → "1m 5s", 3665 → "1h 1m"
 */
export function formatElapsedTime(seconds) {
    if (seconds == null || seconds <= 0)
        return "0s";
    return formatDuration(seconds * 1000);
}
/**
 * Format a byte count as human-readable file size (GB, MB, KB).
 */
export function formatFileSize(bytes, { compact = false } = {}) {
    const spacer = compact ? "" : " ";
    if (compact) {
        if (bytes === 0)
            return "0B";
        if (bytes < 1024)
            return `${bytes}B`;
        if (bytes < 1_048_576)
            return `${(bytes / 1024).toFixed(1)}${spacer}KB`;
        if (bytes < 1_073_741_824)
            return `${(bytes / 1_048_576).toFixed(1)}${spacer}MB`;
        return `${(bytes / 1_073_741_824).toFixed(1)}${spacer}GB`;
    }
    if (!bytes)
        return null;
    if (bytes >= 1_073_741_824)
        return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
    if (bytes >= 1_048_576)
        return `${(bytes / 1_048_576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}
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
export function formatBytes(bytes) {
    if (!bytes || bytes === 0)
        return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const scaledValue = bytes / Math.pow(1024, unitIndex);
    return `${scaledValue < 10 ? scaledValue.toFixed(2) : scaledValue < 100 ? scaledValue.toFixed(1) : Math.round(scaledValue)} ${units[unitIndex]}`;
}
/**
 * Format tokens-per-second with consistent precision.
 * Returns "X.X" or "—" for null/zero values.
 */
export function formatTokensPerSec(value) {
    if (value === null || value === undefined || value === 0)
        return "—";
    return `${Number(value).toFixed(1)}`;
}
/**
 * Format a context window token count (e.g. 128000 → "128K", 1000000 → "1M").
 * Delegates to `formatCompact` with truncated decimals.
 */
export function formatContextTokens(tokens) {
    if (!tokens)
        return null;
    return formatCompact(tokens);
}
/**
 * Round a floating-point seconds value to millisecond precision (3 decimals).
 * Standard precision for all timing metrics stored in the database.
 */
export function roundMilliseconds(seconds) {
    return parseFloat(seconds.toFixed(3));
}
/**
 * Format a monetary amount with its currency symbol.
 * Uses Intl.NumberFormat to correctly place thousands separators and
 * applies the symbol for the requested currency.
 */
export function formatCurrency(amount, currencyCode = "USD") {
    if (amount == null || amount === 0) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
        }).format(0);
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: Math.abs(amount) < 0.01 ? 4 : 2,
        maximumFractionDigits: Math.abs(amount) < 0.01 ? 4 : 2,
    }).format(amount);
}
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
export function formatPercent(value, decimals = 1) {
    if (value == null)
        return "—";
    if (decimals === "adaptive") {
        if (value < 0.01)
            return "0%";
        if (value < 1)
            return `${value.toFixed(2)}%`;
        if (value < 10)
            return `${value.toFixed(1)}%`;
        return `${Math.round(value)}%`;
    }
    return `${Number(value).toFixed(decimals)}%`;
}
/**
 * Format a duration in seconds as a media timestamp (H:MM:SS or M:SS).
 * Used for video players, track durations, and media metadata.
 * e.g. 65 → "1:05", 3661 → "1:01:01", 0 → "0:00"
 */
export function formatMediaTimestamp(seconds) {
    if (!seconds || seconds <= 0)
        return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (hours > 0)
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
//# sourceMappingURL=format.js.map