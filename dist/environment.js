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
//# sourceMappingURL=environment.js.map