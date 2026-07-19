/** Dev-default port per project id, keyed exactly as in vault projects.json. */
export declare const SERVICE_PORTS: {
    readonly "vault-service": 5599;
    readonly "tools-service": 5590;
    readonly "portal-service": 4001;
    readonly "lights-service": 4444;
    readonly "clock-crew-service": 5593;
    readonly "prism-service": 7777;
    readonly "prism-client": 3333;
    readonly "portal-client": 4000;
    readonly "clock-crew-client": 3001;
    readonly "lights-client": 4445;
    readonly "rod-dev-client": 3000;
    readonly "lupos-bot": 1337;
    readonly "meepothegeomancer-client": 5570;
    readonly "classic-whitemane-client": 3002;
    readonly "messages-service": 5602;
    readonly "messages-client": 3003;
    readonly "ledger-service": 5603;
    readonly "ledger-client": 3004;
    readonly "sessions-service": 5580;
    readonly "dygest-service": 5606;
    readonly "dygest-client": 3005;
    readonly "gauge-service": 5607;
    readonly "gauge-client": 3006;
    readonly "reels-service": 5608;
    readonly "reels-client": 3007;
    readonly "clankerbox-service": 5609;
    readonly "clankerbox-client": 3008;
    readonly "iron-service": 5610;
    readonly "iron-client": 3009;
    readonly "games-service": 5611;
    readonly "games-client": 3010;
    readonly "qbittorrent-service": 8080;
    readonly "lupos-client": 3011;
    readonly "notes-service": 5612;
    readonly "notes-client": 3012;
    readonly "images-service": 5613;
    readonly "images-client": 3013;
    readonly "music-service": 5614;
    readonly "music-client": 3014;
    readonly "accounts-service": 5615;
    readonly "accounts-client": 3015;
    readonly "animals-service": 5616;
    readonly "animals-client": 3016;
    readonly "payments-service": 5617;
    readonly "payments-client": 3017;
};
export type ServiceId = keyof typeof SERVICE_PORTS;
/**
 * Resolve a port from a project id ("sessions-service") or a short
 * name ("sessions", "lupos"). Short names try -service, then -bot,
 * then -client, so "prism" resolves to the service, not the client.
 */
export declare function getServicePort(name: string): number | undefined;
//# sourceMappingURL=services.d.ts.map