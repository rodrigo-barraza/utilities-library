/**
 * Centralized utility for type-safe environment variable access.
 * Prevents direct process.env references throughout business logic.
 */
export function getEnvironmentVariable(key) {
    return typeof process !== "undefined" && process.env ? process.env[key] : undefined;
}
export function setEnvironmentVariable(key, value) {
    if (typeof process !== "undefined" && process.env) {
        process.env[key] = value;
    }
}
export function isBrowser() {
    return typeof window !== "undefined";
}
/**
 * True when running in a browser served from a production hostname
 * (default: any host ending in ".dev").
 */
export function isProductionHostname(suffix = ".dev") {
    return isBrowser() && window.location.hostname.endsWith(suffix);
}
/**
 * Resolve which service URL a client should call without triggering
 * Chrome's Private Network Access prompt: browsers on production
 * hostnames get the public URL; SSR and local dev get the internal one.
 */
export function resolveClientServiceUrl({ internalUrl, publicUrl, productionSuffix = ".dev", }) {
    if (!isBrowser())
        return internalUrl;
    if (isProductionHostname(productionSuffix) && publicUrl)
        return publicUrl;
    return internalUrl;
}
export function getNoColor() {
    return getEnvironmentVariable("NO_COLOR") !== undefined;
}
export function getForceColor() {
    return getEnvironmentVariable("FORCE_COLOR") !== undefined;
}
export function getMinioInternalUrl() {
    return getEnvironmentVariable("MINIO_INTERNAL_URL") || "";
}
export function getVaultServiceUrl() {
    return getEnvironmentVariable("VAULT_SERVICE_URL") || "";
}
export function getVaultServiceToken() {
    return getEnvironmentVariable("VAULT_SERVICE_TOKEN") || "";
}
/**
 * Fail-fast aggregated required-config check. `required` maps a display
 * label (usually the env var name, optionally annotated with the config
 * key it feeds) to its resolved value; all falsy values are reported in
 * one error instead of failing deep at the first use site.
 */
export function assertRequiredEnvironment(required, { prefix = "[config]" } = {}) {
    const missing = Object.entries(required)
        .filter(([, value]) => !value)
        .map(([label]) => label);
    if (missing.length > 0) {
        throw new Error(`${prefix} Missing required environment variable(s): ${missing.join(", ")}`);
    }
}
//# sourceMappingURL=environment.js.map