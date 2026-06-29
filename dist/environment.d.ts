/**
 * Centralized utility for type-safe environment variable access.
 * Prevents direct process.env references throughout business logic.
 */
export declare function getEnvironmentVariable(key: string): string | undefined;
export declare function setEnvironmentVariable(key: string, value: string): void;
export declare function getNoColor(): boolean;
export declare function getForceColor(): boolean;
export declare function getMinioInternalUrl(): string;
export declare function getVaultServiceUrl(): string;
export declare function getVaultServiceToken(): string;
//# sourceMappingURL=environment.d.ts.map