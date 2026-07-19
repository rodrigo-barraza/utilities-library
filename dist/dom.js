// ─────────────────────────────────────────────────────────────
// DOM — Browser-only helpers (no-ops off the main thread / SSR)
// ─────────────────────────────────────────────────────────────
/**
 * Copy text to clipboard with error handling.
 * Uses the modern Clipboard API with a legacy execCommand fallback
 * for insecure contexts (plain HTTP on non-localhost origins).
 * Returns true on success, false on failure (including SSR).
 */
export async function copyToClipboard(text) {
    if (typeof document === "undefined")
        return false;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch {
            return copyViaLegacyExecCommand(text);
        }
    }
    return copyViaLegacyExecCommand(text);
}
function copyViaLegacyExecCommand(text) {
    const textAreaElement = document.createElement("textarea");
    textAreaElement.value = text;
    textAreaElement.setAttribute("readonly", "");
    textAreaElement.style.position = "fixed";
    textAreaElement.style.left = "-9999px";
    textAreaElement.style.opacity = "0";
    document.body.appendChild(textAreaElement);
    textAreaElement.select();
    textAreaElement.setSelectionRange(0, text.length);
    let isSuccessful = false;
    try {
        isSuccessful = document.execCommand("copy");
    }
    catch {
        isSuccessful = false;
    }
    document.body.removeChild(textAreaElement);
    return isSuccessful;
}
//# sourceMappingURL=dom.js.map