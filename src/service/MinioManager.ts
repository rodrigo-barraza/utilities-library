// ─────────────────────────────────────────────────────────────
// MinioManager — S3-compatible object storage wrapper
// ─────────────────────────────────────────────────────────────

import type { Readable } from "stream";
import type { LoggerLike } from "./GracefulShutdown.ts";
import { errorMessage } from "../errors.ts";

import type { Client as MinioClient } from "minio";

// Minio Client is dynamically imported (optional peer dep)
let _client: MinioClient | null = null;
let _bucketName: string | null = null;
let _endpointUrl: string | null = null;
let _initConfig: MinioInitConfig | null = null;
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

// A failed boot-time connect must not latch MinIO off for the process
// lifetime (a NAS restart briefly refuses connections and every consumer
// then silently persists media inline for days) — keep retrying in the
// background until the connect succeeds.
const RECONNECT_DELAY_MILLISECONDS = 30_000;

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
export async function createMinioClient({
  endpoint,
  accessKey,
  secretKey,
}: MinioClientConfig): Promise<MinioClient> {
  // Minio Client is dynamically imported (optional peer dep)
  const { Client } = await import("minio");
  const url = new URL(endpoint);
  return new Client({
    endPoint: url.hostname,
    port: parseInt(url.port, 10) || (url.protocol === "https:" ? 443 : 80),
    useSSL: url.protocol === "https:",
    accessKey,
    secretKey,
  });
}

export interface MinioObjectInfo {
  name: string;
  size: number;
  lastModified: Date;
}

async function attemptConnect(config: MinioInitConfig): Promise<void> {
  const { endpoint, accessKey, secretKey, bucket, publicRead = false } = config;
  const log: LoggerLike = config.logger || console;

  try {
    const client = await createMinioClient({ endpoint, accessKey, secretKey });

    // Ensure bucket exists
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket);
      if (log.info) log.info(`MinIO bucket "${bucket}" created`);
    }

    // Optionally set public read-only policy
    if (publicRead) {
      const publicPolicy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      });
      await client.setBucketPolicy(bucket, publicPolicy);
    }

    // Only publish state once the bucket check proved the connection works
    _client = client;
    _bucketName = bucket;
    _endpointUrl = endpoint.replace(/\/+$/, "");

    if (log.success) {
      log.success(
        `MinIO connected: ${endpoint} (bucket: ${bucket})`,
      );
    } else {
      console.log(
        `✅ MinIO connected: ${endpoint} (bucket: ${bucket})`,
      );
    }
  } catch (error: unknown) {
    _client = null;
    _bucketName = null;
    _endpointUrl = null;
    if (log.error) {
      log.error(
        `MinIO connection failed: ${errorMessage(error)} — retrying in ${RECONNECT_DELAY_MILLISECONDS / 1000}s`,
      );
    }
    scheduleReconnect();
  }
}

function scheduleReconnect(): void {
  if (_reconnectTimer) return;
  _reconnectTimer = setTimeout(() => {
    _reconnectTimer = null;
    if (_initConfig && !_client) void attemptConnect(_initConfig);
  }, RECONNECT_DELAY_MILLISECONDS);
  // Never hold the process open just to retry MinIO
  _reconnectTimer.unref?.();
}

export const MinioManager = {
  /**
   * Initialize the MinIO client and ensure the bucket exists.
   *
   * A failed connect resolves with MinIO unavailable (consumers keep
   * working inline/degraded) and schedules background reconnect attempts
   * every {@link RECONNECT_DELAY_MILLISECONDS} until one succeeds.
   */
  async init(config: MinioInitConfig): Promise<void> {
    _initConfig = config;
    if (_reconnectTimer) {
      clearTimeout(_reconnectTimer);
      _reconnectTimer = null;
    }
    await attemptConnect(config);
  },

  /**
   * Whether MinIO is available for use.
   */
  isAvailable(): boolean {
    return _client !== null;
  },

  /**
   * Get the base URL for direct public access to objects in the bucket.
   */
  getBucketUrl(): string | null {
    if (!_endpointUrl || !_bucketName) return null;
    return `${_endpointUrl}/${_bucketName}`;
  },

  /**
   * Build a direct public URL for an object key.
   */
  getPublicUrl(key: string): string | null {
    const base = this.getBucketUrl();
    if (!base) return null;
    return `${base}/${key}`;
  },

  /**
   * Generate a presigned URL for temporary access.
   */
  async getPresignedUrl(key: string, expirySeconds = 3600, bucket?: string): Promise<string> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    return _client.presignedGetObject(bucket || _bucketName, key, expirySeconds);
  },

  /**
   * Upload a file buffer to MinIO.
   */
  async upload(key: string, buffer: Buffer, contentType: string, bucket?: string): Promise<void> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    await _client.putObject(bucket || _bucketName, key, buffer, buffer.length, {
      "Content-Type": contentType,
    });
  },

  /**
   * Upload a local file to MinIO (streams from disk).
   */
  async uploadFile(
    key: string,
    filePath: string,
    metadata: Record<string, string> = {},
    bucket?: string,
  ): Promise<void> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    await _client.fPutObject(bucket || _bucketName, key, filePath, metadata);
  },

  /**
   * Get a readable stream for an object.
   */
  async get(key: string, bucket?: string): Promise<Readable> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    return _client.getObject(bucket || _bucketName, key);
  },

  /**
   * Remove an object from the bucket.
   */
  async remove(key: string, bucket?: string): Promise<void> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    await _client.removeObject(bucket || _bucketName, key);
  },

  /**
   * Get object metadata (stat).
   */
  async stat(key: string, bucket?: string) {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    return _client.statObject(bucket || _bucketName, key);
  },

  /**
   * Whether an object exists (stat-based, swallows not-found).
   */
  async exists(key: string, bucket?: string): Promise<boolean> {
    try {
      await this.stat(key, bucket);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * List all objects in the bucket with an optional prefix.
   */
  async listObjects(prefix = "", bucket?: string): Promise<MinioObjectInfo[]> {
    if (!_client || !_bucketName) throw new Error("MinIO client not initialized");
    return new Promise((resolve, reject) => {
      const items: MinioObjectInfo[] = [];
      const stream = _client!.listObjectsV2(
        bucket || _bucketName!,
        prefix,
        true,
      );
      stream.on("data", (object: { name: string; size: number; lastModified: Date }) =>
        items.push({
          name: object.name,
          size: object.size,
          lastModified: object.lastModified,
        }),
      );
      stream.on("end", () => resolve(items));
      stream.on("error", reject);
    });
  },

  /**
   * Health check — verify MinIO connectivity.
   */
  async healthCheck(): Promise<{ status: string; bucket?: string; error?: string }> {
    if (!_client) {
      return { status: "unavailable" };
    }
    try {
      await _client.bucketExists(_bucketName!);
      return { status: "ok", bucket: _bucketName! };
    } catch (error: unknown) {
      return { status: "error", error: errorMessage(error) };
    }
  },

  /**
   * Reset state (for testing or shutdown).
   */
  reset(): void {
    _client = null;
    _bucketName = null;
    _endpointUrl = null;
    _initConfig = null;
    if (_reconnectTimer) {
      clearTimeout(_reconnectTimer);
      _reconnectTimer = null;
    }
  },
};
