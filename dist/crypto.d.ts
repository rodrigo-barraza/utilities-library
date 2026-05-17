/**
 * Generate a RFC 4122 v4 UUID.
 *
 * Prefers `crypto.randomUUID()` when available (secure contexts: HTTPS / localhost).
 * Falls back to `crypto.getRandomValues()` which works in ALL browser contexts,
 * including plain HTTP over LAN IPs (e.g. http://192.168.x.x).
 */
export declare function generateUUID(): string;
//# sourceMappingURL=crypto.d.ts.map