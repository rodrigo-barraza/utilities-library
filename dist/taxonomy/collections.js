// ─────────────────────────────────────────────────────────────
// Collections — Canonical cross-service Mongo collection names
// ─────────────────────────────────────────────────────────────
// Only collections read or written by MORE THAN ONE repo belong
// here — `requests` is the cost-accounting source of truth logged
// by every service and queried by clients, so a rename must land
// everywhere at once. Service-private collections stay local to
// their service.
// ─────────────────────────────────────────────────────────────
/** Cross-service Mongo collection names. */
export const COLLECTIONS = {
    /** Per-request cost/usage log — the workspace's cost source of truth. */
    requests: "requests",
    /** Per-project settings documents (tools-service, workspace-service). */
    settings: "settings",
    /** Media metadata shared by reels pipelines. */
    media: "media",
    /** Visitor sessions written by sessions-service, read by portal analytics. */
    sessions: "sessions",
};
//# sourceMappingURL=collections.js.map