import { type Router, type Express } from "express";
import type { Db } from "mongodb";
import { type Logger } from "../node.js";
import { type MinioInitConfig } from "./MinioManager.js";
import { HealthAggregator } from "./HealthAggregator.js";
import { CronScheduler } from "./CronScheduler.js";
import type { IndexSpec } from "./MongoManager.js";
/**
 * `Access-Control-Max-Age` sent on the preflight response, in seconds.
 *
 * Deliberately a constant and not a `ServiceConfig` option: how long a
 * preflight may be cached is a property of the browser, not of the
 * service, so every consumer wants the same answer.
 *
 * Browsers clamp this rather than reject it, so the number is a ceiling
 * request and not a guarantee — Chromium honours up to 7200, Firefox up
 * to 86400, and Safari caps well below both. 600 sits under every one of
 * those ceilings, so every engine takes it literally, and it bounds how
 * long a browser can keep applying a stale CORS policy after the
 * allow-list changes. With no header at all the default is 5 seconds,
 * which is what cross-origin callers pay today.
 */
export declare const CORS_PREFLIGHT_MAX_AGE_SECONDS = 600;
export interface RouteMount {
    path: string;
    router: Router;
}
export interface CronJobConfig {
    name: string;
    intervalMs: number;
    fn: () => Promise<void> | void;
    immediate?: boolean;
}
export interface ServiceConfig {
    name: string;
    port: number;
    version?: string;
    description?: string;
    mongo?: {
        uri: string;
        dbName?: string;
        indexes?: Array<{
            collection: string;
            indexes: IndexSpec[];
        }>;
    };
    minio?: Omit<MinioInitConfig, "logger">;
    auth?: {
        apiSecret?: string;
        secretHeader?: string;
        bypassPaths?: string[];
        defaultProject?: string;
        defaultUsername?: string;
    };
    routes?: RouteMount[];
    cors?: string | string[];
    bodyLimit?: string;
    logger?: Logger;
    beforeRoutes?: (app: Express, context: ServiceContext) => void | Promise<void>;
    afterRoutes?: (app: Express, context: ServiceContext) => void | Promise<void>;
    listen?: boolean;
    cron?: CronJobConfig[];
}
export interface ServiceContext {
    app: Express;
    db: Db | null;
    logger: Logger;
    health: HealthAggregator;
    scheduler: CronScheduler;
}
export declare function createService(config: ServiceConfig): Promise<ServiceContext>;
//# sourceMappingURL=createService.d.ts.map