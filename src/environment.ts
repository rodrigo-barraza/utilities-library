/**
 * Centralized utility for type-safe environment variable access.
 * Prevents direct process.env references throughout business logic.
 */

export function getEnvironmentVariable(key: string): string | undefined {
  return typeof process !== "undefined" && process.env ? process.env[key] : undefined;
}

export function setEnvironmentVariable(key: string, value: string): void {
  if (typeof process !== "undefined" && process.env) {
    process.env[key] = value;
  }
}

export function getNoColor(): boolean {
  return getEnvironmentVariable("NO_COLOR") !== undefined;
}

export function getForceColor(): boolean {
  return getEnvironmentVariable("FORCE_COLOR") !== undefined;
}

export function getMinioInternalUrl(): string {
  return getEnvironmentVariable("MINIO_INTERNAL_URL") || "";
}

export function getVaultServiceUrl(): string {
  return getEnvironmentVariable("VAULT_SERVICE_URL") || "";
}

export function getVaultServiceToken(): string {
  return getEnvironmentVariable("VAULT_SERVICE_TOKEN") || "";
}
