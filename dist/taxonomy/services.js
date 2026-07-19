// ─────────────────────────────────────────────────────────────
// Services — Canonical project-id → dev port registry
// ─────────────────────────────────────────────────────────────
// Compile-time mirror of vault-service projects.json (the runtime
// and deploy source of truth — each project entry carries `port`).
// Env-provided URLs always win at runtime; these ports are the
// LAST-RESORT dev fallbacks so no client or service ever hardcodes
// a sibling's port again. When a port changes, update projects.json
// AND this map together.
// ─────────────────────────────────────────────────────────────
/** Dev-default port per project id, keyed exactly as in vault projects.json. */
export const SERVICE_PORTS = {
    "vault-service": 5599,
    "tools-service": 5590,
    "portal-service": 4001,
    "lights-service": 4444,
    "clock-crew-service": 5593,
    "prism-service": 7777,
    "prism-client": 3333,
    "portal-client": 4000,
    "clock-crew-client": 3001,
    "lights-client": 4445,
    "rod-dev-client": 3000,
    "lupos-bot": 1337,
    "meepothegeomancer-client": 5570,
    "classic-whitemane-client": 3002,
    "messages-service": 5602,
    "messages-client": 3003,
    "ledger-service": 5603,
    "ledger-client": 3004,
    "sessions-service": 5580,
    "dygest-service": 5606,
    "dygest-client": 3005,
    "gauge-service": 5607,
    "gauge-client": 3006,
    "reels-service": 5608,
    "reels-client": 3007,
    "clankerbox-service": 5609,
    "clankerbox-client": 3008,
    "iron-service": 5610,
    "iron-client": 3009,
    "games-service": 5611,
    "games-client": 3010,
    "qbittorrent-service": 8080,
    "lupos-client": 3011,
    "notes-service": 5612,
    "notes-client": 3012,
    "images-service": 5613,
    "images-client": 3013,
    "music-service": 5614,
    "music-client": 3014,
    "accounts-service": 5615,
    "accounts-client": 3015,
    "animals-service": 5616,
    "animals-client": 3016,
    "payments-service": 5617,
    "payments-client": 3017,
};
/**
 * Resolve a port from a project id ("sessions-service") or a short
 * name ("sessions", "lupos"). Short names try -service, then -bot,
 * then -client, so "prism" resolves to the service, not the client.
 */
export function getServicePort(name) {
    const candidates = [name, `${name}-service`, `${name}-bot`, `${name}-client`];
    for (const candidate of candidates) {
        if (candidate in SERVICE_PORTS)
            return SERVICE_PORTS[candidate];
    }
    return undefined;
}
//# sourceMappingURL=services.js.map