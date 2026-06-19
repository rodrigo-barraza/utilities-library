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
export declare function createVaultClient(options?: VaultClientOptions): VaultClient;
export declare function bootstrapEnvironment(): Promise<void>;
//# sourceMappingURL=vault.d.ts.map