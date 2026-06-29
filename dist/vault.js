// ============================================================
// Vault Client — Secret + Registry Bootstrap Utility
// ============================================================
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "./errors.js";
import { getEnvironmentVariable, setEnvironmentVariable, getVaultServiceUrl, getVaultServiceToken, } from "./environment.js";
const DEFAULT_VAULT_SERVICE_URL = "http://localhost:5599";
const FETCH_TIMEOUT_MILLISECONDS = 5_000;
export function createVaultClient(options = {}) {
    const { keys, prefix, exclude } = options;
    let vaultServiceUrl = null;
    let vaultServiceToken = null;
    let cachedRegistry = null;
    function resolveVaultConnection() {
        if (vaultServiceUrl !== null)
            return;
        vaultServiceUrl =
            options.vaultUrl ||
                getVaultServiceUrl() ||
                DEFAULT_VAULT_SERVICE_URL;
        vaultServiceToken =
            options.vaultToken ||
                getVaultServiceToken() ||
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
                    if (parentDirectory === currentDirectory)
                        break;
                    currentDirectory = parentDirectory;
                }
            }
            catch {
                // ignore
            }
        }
    }
    function buildQueryString() {
        const params = new URLSearchParams();
        if (keys?.length)
            params.set("keys", keys.join(","));
        if (prefix)
            params.set("prefix", prefix);
        if (exclude)
            params.set("exclude", exclude);
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
                const secrets = (await response.json());
                console.warn(`🔐 Vault → loaded ${Object.keys(secrets).length} secrets`);
                return secrets;
            }
            catch (error) {
                console.warn(`⚠️  Vault unreachable (${getErrorMessage(error)})`);
                return {};
            }
        },
        fetchSync() {
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
                const secrets = JSON.parse(standardOutput);
                console.warn(`🔐 Vault → loaded ${Object.keys(secrets).length} secrets`);
                return secrets;
            }
            catch (error) {
                console.warn(`⚠️  Vault unreachable (${getErrorMessage(error)})`);
                return {};
            }
        },
        async fetchRegistry() {
            if (cachedRegistry)
                return cachedRegistry;
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
                cachedRegistry = (await response.json());
                console.warn(`📋 Registry → ${cachedRegistry.projects?.length || 0} projects, ${cachedRegistry.infrastructure?.length || 0} infrastructure`);
                return cachedRegistry;
            }
            catch (error) {
                console.warn(`⚠️  Registry unreachable (${getErrorMessage(error)})`);
                return { version: 0, projects: [], infrastructure: [] };
            }
        },
        async resolveServiceUrl(serviceId) {
            const urlEnvironmentVariable = `${serviceId.toUpperCase().replace(/-/g, "_")}_URL`;
            // Check process.env first (may have been populated by bootstrapEnvironment)
            const envVal = getEnvironmentVariable(urlEnvironmentVariable);
            if (envVal)
                return envVal;
            // Fall back to registry
            const registry = await this.fetchRegistry();
            const service = (registry.projects || []).find((project) => project.id === serviceId);
            if (!service) {
                console.warn(`⚠️  Service "${serviceId}" not found in registry`);
                return null;
            }
            if (service.url)
                return service.url;
            if (service.port)
                return `http://localhost:${service.port}`;
            return null;
        },
        async resolveInfrastructureUrl(infrastructureId) {
            const registry = await this.fetchRegistry();
            const infrastructureEntry = (registry.infrastructure || []).find((infrastructureItem) => infrastructureItem.id === infrastructureId);
            if (!infrastructureEntry) {
                console.warn(`⚠️  Infrastructure "${infrastructureId}" not found in registry`);
                return null;
            }
            if (infrastructureEntry.urlEnvironmentVariable) {
                const envVal = getEnvironmentVariable(infrastructureEntry.urlEnvironmentVariable);
                if (envVal)
                    return envVal;
            }
            if (infrastructureEntry.url)
                return infrastructureEntry.url;
            return null;
        },
        clearRegistryCache() {
            cachedRegistry = null;
        },
    };
}
export async function bootstrapEnvironment() {
    const vault = createVaultClient();
    const secrets = await vault.fetch();
    for (const [key, value] of Object.entries(secrets)) {
        if (getEnvironmentVariable(key) === undefined) {
            setEnvironmentVariable(key, value);
        }
    }
}
//# sourceMappingURL=vault.js.map