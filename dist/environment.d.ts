/**
 * Centralized utility for type-safe environment variable access.
 * Prevents direct process.env references throughout business logic.
 */
export declare function getEnvironmentVariable(key: string): string | undefined;
export declare function setEnvironmentVariable(key: string, value: string): void;
export declare function isBrowser(): boolean;
/**
 * True when running in a browser served from a production hostname
 * (default: any host ending in ".dev").
 */
export declare function isProductionHostname(suffix?: string): boolean;
export interface ResolveClientServiceUrlOptions {
    /** Vault/LAN URL — used server-side and in local dev. */
    internalUrl?: string;
    /** Public domain URL — used by browsers on production hostnames. */
    publicUrl?: string;
    /** Hostname suffix that marks production (default ".dev"). */
    productionSuffix?: string;
}
/**
 * Resolve which service URL a client should call without triggering
 * Chrome's Private Network Access prompt: browsers on production
 * hostnames get the public URL; SSR and local dev get the internal one.
 */
export declare function resolveClientServiceUrl({ internalUrl, publicUrl, productionSuffix, }: ResolveClientServiceUrlOptions): string | undefined;
export declare function getNoColor(): boolean;
export declare function getForceColor(): boolean;
export declare function getMinioInternalUrl(): string;
export declare function getVaultServiceUrl(): string;
export declare function getVaultServiceToken(): string;
/**
 * Fail-fast aggregated required-config check. `required` maps a display
 * label (usually the env var name, optionally annotated with the config
 * key it feeds) to its resolved value; all falsy values are reported in
 * one error instead of failing deep at the first use site.
 */
export declare function assertRequiredEnvironment(required: Record<string, unknown>, { prefix }?: {
    prefix?: string;
}): void;
//# sourceMappingURL=environment.d.ts.map