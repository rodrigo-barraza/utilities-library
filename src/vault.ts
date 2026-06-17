// ============================================================
// Vault Client — Secret + Registry Bootstrap Utility
// ============================================================

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { errorMessage } from "./errors.js";

const DEFAULT_VAULT_SERVICE_URL = "http://localhost:5599";
const FETCH_TIMEOUT_MILLISECONDS = 5_000;

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
  urlEnvironmentVariable?: string;
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

export interface DecryptedSecrets {
  [key: string]: string;
}

export interface VaultClient {
  fetch(): Promise<DecryptedSecrets>;
  fetchSync(): DecryptedSecrets;
  fetchRegistry(): Promise<Registry>;
  resolveServiceUrl(serviceId: string): Promise<string | null>;
  resolveInfrastructureUrl(infrastructureId: string): Promise<string | null>;
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

    if (!_vaultToken) {
      try {
        let currentDirectory = process.cwd();
        for (let i = 0; i < 6; i++) {
          const keyPath = path.join(currentDirectory, "vault-service", "vault.key");
          if (fs.existsSync(keyPath)) {
            _vaultToken = fs.readFileSync(keyPath, "utf-8").trim();
            break;
          }
          const directKeyPath = path.join(currentDirectory, "vault.key");
          if (fs.existsSync(directKeyPath)) {
            _vaultToken = fs.readFileSync(directKeyPath, "utf-8").trim();
            break;
          }
          const parentDirectory = path.dirname(currentDirectory);
          if (parentDirectory === currentDirectory) break;
          currentDirectory = parentDirectory;
        }
      } catch {
        // ignore
      }
    }
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
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MILLISECONDS),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        const secrets = (await response.json()) as DecryptedSecrets;

        console.warn(
          `🔐 Vault → loaded ${Object.keys(secrets).length} secrets`,
        );

        return secrets;
      } catch (error: unknown) {
        console.warn(`⚠️  Vault unreachable (${errorMessage(error)})`);
        return {};
      }
    },

    fetchSync(): DecryptedSecrets {
      resolveVaultConnection();

      if (!_vaultToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
        return {};
      }

      try {
        const queryString = buildQueryString();
        const url = `${_vaultUrl}/secrets${queryString ? "?" + queryString : ""}`;

        const standardOutput = execFileSync("curl", [
          "-sf",
          "--max-time", String(FETCH_TIMEOUT_MILLISECONDS / 1000),
          "-H", `Authorization: Bearer ${_vaultToken}`,
          url,
        ], { encoding: "utf-8", timeout: FETCH_TIMEOUT_MILLISECONDS + 1000 });

        const secrets = JSON.parse(standardOutput) as DecryptedSecrets;

        console.warn(
          `🔐 Vault → loaded ${Object.keys(secrets).length} secrets`,
        );

        return secrets;
      } catch (error: unknown) {
        console.warn(`⚠️  Vault unreachable (${errorMessage(error)})`);
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
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MILLISECONDS),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        _cachedRegistry = (await response.json()) as Registry;
        console.warn(
          `📋 Registry → ${_cachedRegistry.projects?.length || 0} projects, ${_cachedRegistry.infrastructure?.length || 0} infrastructure`,
        );
        return _cachedRegistry;
      } catch (error: unknown) {
        console.warn(`⚠️  Registry unreachable (${errorMessage(error)})`);
        return { version: 0, projects: [], infrastructure: [] };
      }
    },

    async resolveServiceUrl(serviceId: string): Promise<string | null> {
      const urlEnvironmentVariable = `${serviceId.toUpperCase().replace(/-/g, "_")}_URL`;

      // Check process.env first (may have been populated by bootstrapEnvironment)
      if (process.env[urlEnvironmentVariable]) return process.env[urlEnvironmentVariable]!;

      // Fall back to registry
      const registry = await this.fetchRegistry();
      const service = (registry.projects || []).find((project) => project.id === serviceId);

      if (!service) {
        console.warn(`⚠️  Service "${serviceId}" not found in registry`);
        return null;
      }

      if (service.url) return service.url;
      if (service.port) return `http://localhost:${service.port}`;

      return null;
    },

    async resolveInfrastructureUrl(infrastructureId: string): Promise<string | null> {
      const registry = await this.fetchRegistry();
      const infra = (registry.infrastructure || []).find(
        (infrastructureItem) => infrastructureItem.id === infrastructureId,
      );

      if (!infra) {
        console.warn(`⚠️  Infrastructure "${infrastructureId}" not found in registry`);
        return null;
      }

      if (infra.urlEnvironmentVariable && process.env[infra.urlEnvironmentVariable]) {
        return process.env[infra.urlEnvironmentVariable]!;
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
export async function bootstrapEnvironment(): Promise<void> {
  const vault = createVaultClient();

  const secrets = await vault.fetch();

  for (const [key, value] of Object.entries(secrets)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}


