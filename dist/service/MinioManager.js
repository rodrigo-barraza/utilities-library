// ─────────────────────────────────────────────────────────────
// MinioManager — S3-compatible object storage wrapper
// ─────────────────────────────────────────────────────────────
import { errorMessage } from "../errors.js";
// Minio Client is dynamically imported (optional peer dep)
let _client = null;
let _bucketName = null;
let _endpointUrl = null;
let _initConfig = null;
let _reconnectTimer = null;
// A failed boot-time connect must not latch MinIO off for the process
// lifetime (a NAS restart briefly refuses connections and every consumer
// then silently persists media inline for days) — keep retrying in the
// background until the connect succeeds.
const RECONNECT_DELAY_MILLISECONDS = 30_000;
/**
 * Construct a raw MinIO `Client` from a full endpoint URL
 * (protocol → useSSL, port defaulted from protocol). Use this for
 * multi-bucket/admin or throwaway clients; use {@link MinioManager}
 * for the common single-bucket service case.
 */
export async function createMinioClient({ endpoint, accessKey, secretKey, }) {
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
async function attemptConnect(config) {
    const { endpoint, accessKey, secretKey, bucket, publicRead = false } = config;
    const log = config.logger || console;
    try {
        const client = await createMinioClient({ endpoint, accessKey, secretKey });
        // Ensure bucket exists
        const exists = await client.bucketExists(bucket);
        if (!exists) {
            await client.makeBucket(bucket);
            if (log.info)
                log.info(`MinIO bucket "${bucket}" created`);
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
            log.success(`MinIO connected: ${endpoint} (bucket: ${bucket})`);
        }
        else {
            console.log(`✅ MinIO connected: ${endpoint} (bucket: ${bucket})`);
        }
    }
    catch (error) {
        _client = null;
        _bucketName = null;
        _endpointUrl = null;
        if (log.error) {
            log.error(`MinIO connection failed: ${errorMessage(error)} — retrying in ${RECONNECT_DELAY_MILLISECONDS / 1000}s`);
        }
        scheduleReconnect();
    }
}
function scheduleReconnect() {
    if (_reconnectTimer)
        return;
    _reconnectTimer = setTimeout(() => {
        _reconnectTimer = null;
        if (_initConfig && !_client)
            void attemptConnect(_initConfig);
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
    async init(config) {
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
    isAvailable() {
        return _client !== null;
    },
    /**
     * Get the base URL for direct public access to objects in the bucket.
     */
    getBucketUrl() {
        if (!_endpointUrl || !_bucketName)
            return null;
        return `${_endpointUrl}/${_bucketName}`;
    },
    /**
     * Build a direct public URL for an object key.
     */
    getPublicUrl(key) {
        const base = this.getBucketUrl();
        if (!base)
            return null;
        return `${base}/${key}`;
    },
    /**
     * Generate a presigned URL for temporary access.
     */
    async getPresignedUrl(key, expirySeconds = 3600, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        return _client.presignedGetObject(bucket || _bucketName, key, expirySeconds);
    },
    /**
     * Upload a file buffer to MinIO.
     */
    async upload(key, buffer, contentType, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        await _client.putObject(bucket || _bucketName, key, buffer, buffer.length, {
            "Content-Type": contentType,
        });
    },
    /**
     * Upload a local file to MinIO (streams from disk).
     */
    async uploadFile(key, filePath, metadata = {}, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        await _client.fPutObject(bucket || _bucketName, key, filePath, metadata);
    },
    /**
     * Get a readable stream for an object.
     */
    async get(key, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        return _client.getObject(bucket || _bucketName, key);
    },
    /**
     * Remove an object from the bucket.
     */
    async remove(key, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        await _client.removeObject(bucket || _bucketName, key);
    },
    /**
     * Get object metadata (stat).
     */
    async stat(key, bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        return _client.statObject(bucket || _bucketName, key);
    },
    /**
     * Whether an object exists (stat-based, swallows not-found).
     */
    async exists(key, bucket) {
        try {
            await this.stat(key, bucket);
            return true;
        }
        catch {
            return false;
        }
    },
    /**
     * List all objects in the bucket with an optional prefix.
     */
    async listObjects(prefix = "", bucket) {
        if (!_client || !_bucketName)
            throw new Error("MinIO client not initialized");
        return new Promise((resolve, reject) => {
            const items = [];
            const stream = _client.listObjectsV2(bucket || _bucketName, prefix, true);
            stream.on("data", (object) => items.push({
                name: object.name,
                size: object.size,
                lastModified: object.lastModified,
            }));
            stream.on("end", () => resolve(items));
            stream.on("error", reject);
        });
    },
    /**
     * Health check — verify MinIO connectivity.
     */
    async healthCheck() {
        if (!_client) {
            return { status: "unavailable" };
        }
        try {
            await _client.bucketExists(_bucketName);
            return { status: "ok", bucket: _bucketName };
        }
        catch (error) {
            return { status: "error", error: errorMessage(error) };
        }
    },
    /**
     * Reset state (for testing or shutdown).
     */
    reset() {
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
//# sourceMappingURL=MinioManager.js.map