// ─────────────────────────────────────────────────────────────
// Crypto — Browser-safe cryptographic utilities
// ─────────────────────────────────────────────────────────────
// Prefers crypto.randomUUID() in secure contexts (HTTPS/localhost).
// Falls back to crypto.getRandomValues() for insecure contexts
// (e.g. plain HTTP over LAN IPs like http://192.168.x.x).
export function generateUUID() {
    if (typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const hexadecimalString = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hexadecimalString.slice(0, 8)}-${hexadecimalString.slice(8, 12)}-${hexadecimalString.slice(12, 16)}-${hexadecimalString.slice(16, 20)}-${hexadecimalString.slice(20)}`;
}
//# sourceMappingURL=crypto.js.map