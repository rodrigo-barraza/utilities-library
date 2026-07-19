/** Cross-service Mongo collection names. */
export declare const COLLECTIONS: {
    /** Per-request cost/usage log — the workspace's cost source of truth. */
    readonly requests: "requests";
    /** Per-project settings documents (tools-service, workspace-service). */
    readonly settings: "settings";
    /** Media metadata shared by reels pipelines. */
    readonly media: "media";
    /** Visitor sessions written by sessions-service, read by portal analytics. */
    readonly sessions: "sessions";
};
export type CollectionKey = keyof typeof COLLECTIONS;
export type CollectionName = (typeof COLLECTIONS)[CollectionKey];
//# sourceMappingURL=collections.d.ts.map