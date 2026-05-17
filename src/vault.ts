// ============================================================
// Vault Client — Secret + Registry Bootstrap Utility
// ============================================================

import { readFileSync, existsSync } from "fs";
import { execFileSync } from "child_process";
import { resolve } from "path";

const DEFAULT_VAULT_SERVICE_URL = "http://localhost:5599";
const FETCH_TIMEOUT_MS = 5_000;

function parseEnvFile(filePath: string): Record<string, string> | null {
  const absolutePath = resolve(filePath);
  if (!existsSync(absolutePath)) return null;

  const content = readFileSync(absolutePath, "utf-8");
  const parsed: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

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
  localEnvFile?: string;
  vaultUrl?: string;
  vaultToken?: string;
  fallbackEnvFile?: string;
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
 */
export function createVaultClient(options: VaultClientOptions = {}): VaultClient {
  const { localEnvFile, fallbackEnvFile, keys, prefix, exclude } = options;

  let _localOverrides: Record<string, string> | null = null;
  let _vaultUrl: string | null = null;
  let _vaultToken: string | null = null;
  let _cachedRegistry: Registry | null = null;

  function resolveVaultConnection() {
    if (_vaultUrl !== null) return;

    if (localEnvFile && _localOverrides === null) {
      _localOverrides = parseEnvFile(localEnvFile) || {};
    }

    const local = _localOverrides || {};

    _vaultUrl =
      options.vaultUrl ||
      local.VAULT_SERVICE_URL ||
      process.env.VAULT_SERVICE_URL ||
      DEFAULT_VAULT_SERVICE_URL;

    _vaultToken =
      options.vaultToken ||
      local.VAULT_SERVICE_TOKEN ||
      process.env.VAULT_SERVICE_TOKEN ||
      "";
  }

  return {
    async fetch() {
      const merged: Record<string, string> = {};

      if (localEnvFile) {
        const local = parseEnvFile(localEnvFile);
        if (local) {
          Object.assign(merged, local);
          _localOverrides = local;
          console.warn(
            `📋 Local .env → loaded ${Object.keys(local).length} overrides`,
          );
        }
      }

      resolveVaultConnection();

      if (_vaultToken) {
        try {
          const params = new URLSearchParams();
          if (keys?.length) params.set("keys", keys.join(","));
          if (prefix) params.set("prefix", prefix);
          if (exclude) params.set("exclude", exclude);

          const queryString = params.toString();
          const url = `${_vaultUrl}/secrets${queryString ? "?" + queryString : ""}`;

          const response = await globalThis.fetch(url, {
            headers: { Authorization: `Bearer ${_vaultToken}` },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} — ${response.statusText}`);
          }

          const secrets = await response.json();

          for (const [key, value] of Object.entries(secrets as Record<string, string>)) {
            if (merged[key] === undefined) {
              merged[key] = value;
            }
          }

          console.warn(
            `🔐 Vault → loaded ${Object.keys(secrets as object).length} secrets`,
          );
        } catch (error) {
          console.warn(`⚠️  Vault unreachable (${(error as Error).message})`);
        }
      } else {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
      }

      if (fallbackEnvFile) {
        const fallback = parseEnvFile(fallbackEnvFile);
        if (fallback) {
          let filled = 0;
          for (const [key, value] of Object.entries(fallback)) {
            if (merged[key] === undefined) {
              merged[key] = value;
              filled++;
            }
          }
          if (filled > 0) {
            console.warn(`📄 Fallback .env → filled ${filled} remaining vars`);
          }
        }
      }

      if (Object.keys(merged).length === 0) {
        console.warn("⚠️  No secrets loaded from any source");
      }

      return merged;
    },

    fetchSync(): Record<string, string> {
      const merged: Record<string, string> = {};

      // Layer 1: Local .env file
      if (localEnvFile) {
        const local = parseEnvFile(localEnvFile);
        if (local) {
          Object.assign(merged, local);
          _localOverrides = local;
          console.warn(
            `📋 Local .env → loaded ${Object.keys(local).length} overrides`,
          );
        }
      }

      // Layer 2: Vault HTTP (synchronous via curl)
      resolveVaultConnection();

      if (_vaultToken) {
        try {
          const params = new URLSearchParams();
          if (keys?.length) params.set("keys", keys.join(","));
          if (prefix) params.set("prefix", prefix);
          if (exclude) params.set("exclude", exclude);

          const queryString = params.toString();
          const url = `${_vaultUrl}/secrets${queryString ? "?" + queryString : ""}`;

          const stdout = execFileSync("curl", [
            "-sf",
            "--max-time", String(FETCH_TIMEOUT_MS / 1000),
            "-H", `Authorization: Bearer ${_vaultToken}`,
            url,
          ], { encoding: "utf-8", timeout: FETCH_TIMEOUT_MS + 1000 });

          const secrets = JSON.parse(stdout) as Record<string, string>;

          for (const [key, value] of Object.entries(secrets)) {
            if (merged[key] === undefined) {
              merged[key] = value;
            }
          }

          console.warn(
            `🔐 Vault → loaded ${Object.keys(secrets).length} secrets`,
          );
        } catch (error) {
          console.warn(`⚠️  Vault unreachable (${(error as Error).message})`);
        }
      } else {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
      }

      // Layer 3: Fallback .env file
      if (fallbackEnvFile) {
        const fallback = parseEnvFile(fallbackEnvFile);
        if (fallback) {
          let filled = 0;
          for (const [key, value] of Object.entries(fallback)) {
            if (merged[key] === undefined) {
              merged[key] = value;
              filled++;
            }
          }
          if (filled > 0) {
            console.warn(`📄 Fallback .env → filled ${filled} remaining vars`);
          }
        }
      }

      if (Object.keys(merged).length === 0) {
        console.warn("⚠️  No secrets loaded from any source");
      }

      return merged;
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
      const registry = await this.fetchRegistry();
      const service = (registry.projects || []).find((s) => s.id === serviceId);

      if (!service) {
        console.warn(`⚠️  Service "${serviceId}" not found in registry`);
        return null;
      }

      const urlEnv = `${serviceId.toUpperCase().replace(/-/g, "_")}_URL`;

      if (process.env[urlEnv]) return process.env[urlEnv]!;

      const local = _localOverrides || {};
      if (local[urlEnv]) return local[urlEnv];

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

      const local = _localOverrides || {};
      if (infra.urlEnv && local[infra.urlEnv]) {
        return local[infra.urlEnv];
      }

      if (infra.url) return infra.url;

      return null;
    },

    clearRegistryCache() {
      _cachedRegistry = null;
    },
  };
}

export interface BootstrapEnvOptions {
  localEnvFile?: string;
  fallbackEnvFile?: string;
}

/**
 * Helper to bootstrap environment variables from Vault.
 */
export async function bootstrapEnv(options: BootstrapEnvOptions = {}): Promise<void> {
  const vault = createVaultClient({
    localEnvFile: options.localEnvFile || "./.env",
    fallbackEnvFile: options.fallbackEnvFile || "../vault-service/.env",
  });

  const secrets = await vault.fetch();

  for (const [key, value] of Object.entries(secrets)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
