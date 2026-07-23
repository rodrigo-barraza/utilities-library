import type { Readable } from "stream";
import type { LoggerLike } from "./GracefulShutdown.js";
import type { Client as MinioClient } from "minio";
export interface MinioClientConfig {
    endpoint: string;
    accessKey: string;
    secretKey: string;
}
export interface MinioInitConfig extends MinioClientConfig {
    bucket: string;
    publicRead?: boolean;
    logger?: LoggerLike;
}
/**
 * Construct a raw MinIO `Client` from a full endpoint URL
 * (protocol → useSSL, port defaulted from protocol). Use this for
 * multi-bucket/admin or throwaway clients; use {@link MinioManager}
 * for the common single-bucket service case.
 */
export declare function createMinioClient({ endpoint, accessKey, secretKey, }: MinioClientConfig): Promise<MinioClient>;
export interface MinioObjectInfo {
    name: string;
    size: number;
    lastModified: Date;
}
export declare const MinioManager: {
    /**
     * Initialize the MinIO client and ensure the bucket exists.
     *
     * A failed connect resolves with MinIO unavailable (consumers keep
     * working inline/degraded) and schedules background reconnect attempts
     * every {@link RECONNECT_DELAY_MILLISECONDS} until one succeeds.
     */
    init(config: MinioInitConfig): Promise<void>;
    /**
     * Whether MinIO is available for use.
     */
    isAvailable(): boolean;
    /**
     * Get the base URL for direct public access to objects in the bucket.
     */
    getBucketUrl(): string | null;
    /**
     * Build a direct public URL for an object key.
     */
    getPublicUrl(key: string): string | null;
    /**
     * Generate a presigned URL for temporary access.
     */
    getPresignedUrl(key: string, expirySeconds?: number, bucket?: string): Promise<string>;
    /**
     * Upload a file buffer to MinIO.
     */
    upload(key: string, buffer: Buffer, contentType: string, bucket?: string): Promise<void>;
    /**
     * Upload a local file to MinIO (streams from disk).
     */
    uploadFile(key: string, filePath: string, metadata?: Record<string, string>, bucket?: string): Promise<void>;
    /**
     * Get a readable stream for an object.
     */
    get(key: string, bucket?: string): Promise<Readable>;
    /**
     * Remove an object from the bucket.
     */
    remove(key: string, bucket?: string): Promise<void>;
    /**
     * Get object metadata (stat).
     */
    stat(key: string, bucket?: string): Promise<import("minio").BucketItemStat>;
    /**
     * Whether an object exists (stat-based, swallows not-found).
     */
    exists(key: string, bucket?: string): Promise<boolean>;
    /**
     * List all objects in the bucket with an optional prefix.
     */
    listObjects(prefix?: string, bucket?: string): Promise<MinioObjectInfo[]>;
    /**
     * Health check — verify MinIO connectivity.
     */
    healthCheck(): Promise<{
        status: string;
        bucket?: string;
        error?: string;
    }>;
    /**
     * Reset state (for testing or shutdown).
     */
    reset(): void;
};
//# sourceMappingURL=MinioManager.d.ts.map