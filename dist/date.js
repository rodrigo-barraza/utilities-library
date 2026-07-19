// ─────────────────────────────────────────────────────────────
// Date — Date formatting and relative time utilities
// ─────────────────────────────────────────────────────────────
export function toISODate(date = new Date()) {
    return date.toISOString().slice(0, 10);
}
export function timeAgo(date) {
    if (!date)
        return "—";
    const differenceMilliseconds = Date.now() - new Date(date).getTime();
    const seconds = Math.floor(differenceMilliseconds / 1000);
    if (seconds < 5)
        return "just now";
    if (seconds < 60)
        return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 0)
        return "today";
    if (days === 1)
        return "yesterday";
    if (days < 30)
        return `${days}d ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
}
export function daysSinceIso(isoDate) {
    return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000));
}
export function formatDateTime(dateInput, options = {}) {
    if (!dateInput)
        return "—";
    const parsedDate = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(parsedDate.getTime()))
        return "—";
    const isCurrentYear = parsedDate.getFullYear() === new Date().getFullYear();
    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(isCurrentYear ? {} : { year: "numeric" }),
        hour: "numeric",
        minute: "2-digit",
        ...options,
    });
}
export function formatDate(dateInput) {
    if (!dateInput)
        return "—";
    const parsedDate = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(parsedDate.getTime()))
        return String(dateInput);
    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
export function daysAgo(daysCount) {
    const result = new Date();
    result.setDate(result.getDate() - daysCount);
    return result;
}
export function toLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
//# sourceMappingURL=date.js.map