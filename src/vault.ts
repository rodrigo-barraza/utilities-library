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
}

export interface RegistryInfrastructure {
  id: string;
  label: string;
  type?: string;
  url?: string;
  urlEnvironmentVariable?: string;
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

export function createVaultClient(options: VaultClientOptions = {}): VaultClient {
  const { keys, prefix, exclude } = options;

  let vaultServiceUrl: string | null = null;
  let vaultServiceToken: string | null = null;
  let cachedRegistry: Registry | null = null;

  function resolveVaultConnection() {
    if (vaultServiceUrl !== null) return;

    vaultServiceUrl =
      options.vaultUrl ||
      process.env.VAULT_SERVICE_URL ||
      DEFAULT_VAULT_SERVICE_URL;

    vaultServiceToken =
      options.vaultToken ||
      process.env.VAULT_SERVICE_TOKEN ||
      "";

    if (!vaultServiceToken) {
      try {
        let currentDirectory = process.cwd();
        for (let i = 0; i < 6; i++) {
          const keyPath = path.join(currentDirectory, "vault-service", "vault.key");
          if (fs.existsSync(keyPath)) {
            vaultServiceToken = fs.readFileSync(keyPath, "utf-8").trim();
            break;
          }
          const directKeyPath = path.join(currentDirectory, "vault.key");
          if (fs.existsSync(directKeyPath)) {
            vaultServiceToken = fs.readFileSync(directKeyPath, "utf-8").trim();
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

      if (!vaultServiceToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
        return {};
      }

      try {
        const queryString = buildQueryString();
        const url = `${vaultServiceUrl}/secrets${queryString ? "?" + queryString : ""}`;

        const response = await globalThis.fetch(url, {
          headers: { Authorization: `Bearer ${vaultServiceToken}` },
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

      if (!vaultServiceToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — skipping Vault");
        return {};
      }

      try {
        const queryString = buildQueryString();
        const url = `${vaultServiceUrl}/secrets${queryString ? "?" + queryString : ""}`;

        const standardOutput = execFileSync("curl", [
          "-sf",
          "--max-time", String(FETCH_TIMEOUT_MILLISECONDS / 1000),
          "-H", `Authorization: Bearer ${vaultServiceToken}`,
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
      if (cachedRegistry) return cachedRegistry;

      resolveVaultConnection();

      if (!vaultServiceToken) {
        console.warn("⚠️  No VAULT_SERVICE_TOKEN set — cannot fetch registry");
        return { version: 0, projects: [], infrastructure: [] };
      }

      try {
        const url = `${vaultServiceUrl}/registry`;
        const response = await globalThis.fetch(url, {
          headers: { Authorization: `Bearer ${vaultServiceToken}` },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MILLISECONDS),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        cachedRegistry = (await response.json()) as Registry;
        console.warn(
          `📋 Registry → ${cachedRegistry.projects?.length || 0} projects, ${cachedRegistry.infrastructure?.length || 0} infrastructure`,
        );
        return cachedRegistry;
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
      const infrastructureEntry = (registry.infrastructure || []).find(
        (infrastructureItem) => infrastructureItem.id === infrastructureId,
      );

      if (!infrastructureEntry) {
        console.warn(`⚠️  Infrastructure "${infrastructureId}" not found in registry`);
        return null;
      }

      if (infrastructureEntry.urlEnvironmentVariable && process.env[infrastructureEntry.urlEnvironmentVariable]) {
        return process.env[infrastructureEntry.urlEnvironmentVariable]!;
      }

      if (infrastructureEntry.url) return infrastructureEntry.url;

      return null;
    },

    clearRegistryCache() {
      cachedRegistry = null;
    },
  };
}

export async function bootstrapEnvironment(): Promise<void> {
  const vault = createVaultClient();

  const secrets = await vault.fetch();

  for (const [key, value] of Object.entries(secrets)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
