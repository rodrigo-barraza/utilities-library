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
export declare function createVaultClient(options?: VaultClientOptions): VaultClient;
/**
 * Bootstrap environment variables from Vault.
 * Fetches all secrets from the Vault HTTP API and injects them
 * into process.env (without overwriting existing values).
 */
export declare function bootstrapEnvironment(): Promise<void>;
//# sourceMappingURL=vault.d.ts.map