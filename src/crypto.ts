// ─────────────────────────────────────────────────────────────
// Crypto — Browser-safe cryptographic utilities
// ─────────────────────────────────────────────────────────────

/**
 * Generate a RFC 4122 v4 UUID.
 *
 * Prefers `crypto.randomUUID()` when available (secure contexts: HTTPS / localhost).
 * Falls back to `crypto.getRandomValues()` which works in ALL browser contexts,
 * including plain HTTP over LAN IPs (e.g. http://192.168.x.x).
 */
export function generateUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback: construct UUID v4 from getRandomValues (available in insecure contexts)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
