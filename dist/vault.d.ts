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
    fetchRegistry(): Promise<Registry>;
    resolveServiceUrl(serviceId: string): Promise<string | null>;
    resolveInfraUrl(infraId: string): Promise<string | null>;
    clearRegistryCache(): void;
}
/**
 * Create a Vault client instance.
 */
export declare function createVaultClient(options?: VaultClientOptions): VaultClient;
export interface BootstrapEnvOptions {
    localEnvFile?: string;
    fallbackEnvFile?: string;
}
/**
 * Helper to bootstrap environment variables from Vault.
 */
export declare function bootstrapEnv(options?: BootstrapEnvOptions): Promise<void>;
//# sourceMappingURL=vault.d.ts.map