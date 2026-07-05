// ─────────────────────────────────────────────────────────────
// Format — Number, cost, duration, and time formatting utilities
// ─────────────────────────────────────────────────────────────
export function formatCompact(value) {
    if (value == null)
        return "—";
    if (value >= 1_000_000)
        return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
    if (value >= 1_000)
        return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
    return value.toLocaleString();
}
export function formatNumber(value) {
    if (value === null || value === undefined)
        return "0";
    if (value >= 1_000_000)
        return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000)
        return `${(value / 1_000).toFixed(0)}K`;
    return value.toLocaleString();
}
export function formatTokenCount(value) {
    if (value === null || value === undefined || value === 0)
        return "0";
    return Number(value).toLocaleString();
}
export function formatCost(value) {
    if (value === null || value === undefined)
        return "$0.00";
    return `$${value.toFixed(5)}`;
}
export function formatCostAdaptive(cost) {
    if (!cost || cost === 0)
        return "$0.00";
    if (cost < 0.01)
        return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
}
export function formatCostTag(estimatedCost) {
    return estimatedCost !== null ? `, cost: $${estimatedCost.toFixed(6)}` : "";
}
export function formatLatency(seconds) {
    if (seconds === null || seconds === undefined)
        return "-";
    if (seconds >= 60)
        return `${(seconds / 60).toFixed(1)}m`;
    if (seconds >= 1)
        return `${seconds.toFixed(1)}s`;
    return `${Math.round(seconds * 1000)}ms`;
}
export function formatLatencyMilliseconds(milliseconds) {
    if (!milliseconds)
        return "—";
    return formatLatency(milliseconds / 1000);
}
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
export function formatElapsedTime(seconds) {
    if (seconds == null || seconds <= 0)
        return "0s";
    return formatDuration(seconds * 1000);
}
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
export function formatBytes(bytes) {
    if (!bytes || bytes === 0)
        return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const scaledValue = bytes / Math.pow(1024, unitIndex);
    return `${scaledValue < 10 ? scaledValue.toFixed(2) : scaledValue < 100 ? scaledValue.toFixed(1) : Math.round(scaledValue)} ${units[unitIndex]}`;
}
export function formatTokensPerSecond(value) {
    if (value === null || value === undefined || value === 0)
        return "—";
    return `${Number(value).toFixed(1)}`;
}
/** @deprecated Use formatTokensPerSecond instead */
export const formatTokensPerSec = formatTokensPerSecond;
export function formatContextTokens(tokens) {
    if (!tokens)
        return null;
    return formatCompact(tokens);
}
export function roundMilliseconds(seconds) {
    return parseFloat(seconds.toFixed(3));
}
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
/**
 * Format execution time into a human-readable string (e.g., "2.50s" or "25ms").
 * Commonly used in request logging.
 */
export function formatRequestTime(elapsedMs) {
    if (elapsedMs >= 1000) {
        return `${(elapsedMs / 1000).toFixed(2)}s`;
    }
    return `${Math.round(elapsedMs)}ms`;
}
//# sourceMappingURL=format.js.map