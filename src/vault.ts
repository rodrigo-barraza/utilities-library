// ============================================================
// Vault Client — Secret + Registry Bootstrap Utility
// ============================================================

import { execFileSync } from "child_process";

const DEFAULT_VAULT_SERVICE_URL = "http://localhost:5599";
const FETCH_TIMEOUT_MS = 5_000;

export interface RegistryProject {
  id: string;
  label: string;
  port?: number;
  url?: string;
  [key: string]: unknown;
}

export interface RegistryInfrastructure {
  id: string;
  label: string;
  type?: string;
  url?: string;
  urlEnv?: string;
  [key: string]: unknown;
}

export interface Registry {
  version: number;
  projects: RegistryProject[];
  infrastructure: RegistryInfrastructure[];
}

export interface VaultClientOptions {
  vaultUrl?: string;
  vaultToken?: string;
  keys?: string[];
  prefix?: string;
  exclude?: string;
}

export interface VaultClient {
  fetch(): Promise<Record<string, string>>;
  fetchSync(): Record<string, string>;
  fetchRegistry(): Promise<Registry>;
  resolveServiceUrl(serviceId: string): Promise<string | null>;
  resolveInfraUrl(infraId: string): Promise<string | null>;
  clearRegistryCache(): void;
}

/**
 * Create a Vault client instance.
 *
 * All secrets are served by the Vault HTTP API from projects.json.
 * Connection is resolved from: options → process.env → localhost fallback.
 */
export function createVaultClient(options: VaultClientOptions = {}): VaultClient {
  const { keys, prefix, exclude } = options;

  let _vaultUrl: string | null = null;
  let _vaultToken: string | null = null;
  let _cachedRegistry: Registry | null = null;

  function resolveVaultConnection() {
    if (_vaultUrl !== null) return;

    _vaultUrl =
      options.vaultUrl ||
      process.env.VAULT_SERVICE_URL ||
      DEFAULT_VAULT_SERVICE_URL;

    _vaultToken =
      options.vaultToken ||
      process.env.VAULT_SERVICE_TOKEN ||
      "";
  }

  function buildQueryString(): string {
    const params = new URLSearchParams();
    if (keys?.length) params.set("keys", keys.join(","));
    if (prefix) params.set("prefix", prefix);
    if (exclude) params.set("exclude", exclude);
    return params.toString();
  }

  return {
    async fetch() {
      resolveVaultConnection();

      if (!_vaultToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
        return {};
      }

      try {
        const queryString = buildQueryString();
        const url = `${_vaultUrl}/secrets${queryString ? "?" + queryString : ""}`;

        const response = await globalThis.fetch(url, {
          headers: { Authorization: `Bearer ${_vaultToken}` },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        const secrets = await response.json() as Record<string, string>;

        console.warn(
          `🔐 Vault → loaded ${Object.keys(secrets).length} secrets`,
        );

        return secrets;
      } catch (error) {
        console.warn(`⚠️  Vault unreachable (${(error as Error).message})`);
        return {};
      }
    },

    fetchSync(): Record<string, string> {
      resolveVaultConnection();

      if (!_vaultToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
        return {};
      }

      try {
        const queryString = buildQueryString();
        const url = `${_vaultUrl}/secrets${queryString ? "?" + queryString : ""}`;

        const stdout = execFileSync("curl", [
          "-sf",
          "--max-time", String(FETCH_TIMEOUT_MS / 1000),
          "-H", `Authorization: Bearer ${_vaultToken}`,
          url,
        ], { encoding: "utf-8", timeout: FETCH_TIMEOUT_MS + 1000 });

        const secrets = JSON.parse(stdout) as Record<string, string>;

        console.warn(
          `🔐 Vault → loaded ${Object.keys(secrets).length} secrets`,
        );

        return secrets;
      } catch (error) {
        console.warn(`⚠️  Vault unreachable (${(error as Error).message})`);
        return {};
      }
    },

    async fetchRegistry(): Promise<Registry> {
      if (_cachedRegistry) return _cachedRegistry;

      resolveVaultConnection();

      if (!_vaultToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — cannot fetch registry");
        return { version: 0, projects: [], infrastructure: [] };
      }

      try {
        const url = `${_vaultUrl}/registry`;
        const response = await globalThis.fetch(url, {
          headers: { Authorization: `Bearer ${_vaultToken}` },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        _cachedRegistry = await response.json() as Registry;
        console.warn(
          `📋 Registry → ${_cachedRegistry.projects?.length || 0} projects, ${_cachedRegistry.infrastructure?.length || 0} infrastructure`,
        );
        return _cachedRegistry;
      } catch (error) {
        console.warn(`⚠️  Registry unreachable (${(error as Error).message})`);
        return { version: 0, projects: [], infrastructure: [] };
      }
    },

    async resolveServiceUrl(serviceId: string): Promise<string | null> {
      const urlEnv = `${serviceId.toUpperCase().replace(/-/g, "_")}_URL`;

      // Check process.env first (may have been populated by bootstrapEnv)
      if (process.env[urlEnv]) return process.env[urlEnv]!;

      // Fall back to registry
      const registry = await this.fetchRegistry();
      const service = (registry.projects || []).find((s) => s.id === serviceId);

      if (!service) {
        console.warn(`⚠️  Service "${serviceId}" not found in registry`);
        return null;
      }

      if (service.url) return service.url;
      if (service.port) return `http://localhost:${service.port}`;

      return null;
    },

    async resolveInfraUrl(infraId: string): Promise<string | null> {
      const registry = await this.fetchRegistry();
      const infra = (registry.infrastructure || []).find(
        (i) => i.id === infraId,
      );

      if (!infra) {
        console.warn(`⚠️  Infrastructure "${infraId}" not found in registry`);
        return null;
      }

      if (infra.urlEnv && process.env[infra.urlEnv]) {
        return process.env[infra.urlEnv]!;
      }

      if (infra.url) return infra.url;

      return null;
    },

    clearRegistryCache() {
      _cachedRegistry = null;
    },
  };
}

/**
 * Bootstrap environment variables from Vault.
 * Fetches all secrets from the Vault HTTP API and injects them
 * into process.env (without overwriting existing values).
 */
export async function bootstrapEnv(): Promise<void> {
  const vault = createVaultClient();

  const secrets = await vault.fetch();

  for (const [key, value] of Object.entries(secrets)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
