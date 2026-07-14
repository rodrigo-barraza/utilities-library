// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities-library/service — Node.js service chassis entry point
// ─────────────────────────────────────────────────────────────

export { createService } from "./createService.ts";
export type { ServiceConfig, ServiceContext, RouteMount, CronJobConfig } from "./createService.ts";

export { MongoManager, connectDatabase, getDatabase, getCollection, disconnectDatabase, setDatabaseForTesting, createIndexes } from "./MongoManager.ts";
export type { ConnectDBOptions, IndexSpec } from "./MongoManager.ts";

export { MinioManager } from "./MinioManager.ts";
export type { MinioInitConfig, MinioObjectInfo } from "./MinioManager.ts";

export { createAuthMiddleware, createSecretGuard } from "./AuthMiddleware.ts";
export type { AuthMiddlewareOptions, SecretGuardOptions, ResolvedIdentity } from "./AuthMiddleware.ts";

export { IDENTITY_HEADERS, requestLocalStorage, getTraceHeaders } from "./TraceContext.ts";
export type { RequestStore } from "./TraceContext.ts";

export { buildPagination } from "./Pagination.ts";
export type { PaginationQuery, Pagination, BuildPaginationOptions } from "./Pagination.ts";

export { toObjectId, buildTimeRangeFilter } from "./MongoUtilities.ts";

export { createRequestLoggerMiddleware } from "./RequestLoggerMiddleware.ts";
export type { RequestLoggerOptions } from "./RequestLoggerMiddleware.ts";

export { HealthAggregator } from "./HealthAggregator.ts";

export { createErrorHandler, notFoundHandler, HttpError } from "./ErrorMiddleware.ts";
export type { ErrorHandlerOptions } from "./ErrorMiddleware.ts";

export { registerCleanup, runCleanupFunctions, installShutdownHandlers, cleanupCount } from "./GracefulShutdown.ts";
export type { LoggerLike, ShutdownOptions } from "./GracefulShutdown.ts";

export { CronScheduler } from "./CronScheduler.ts";
export type { ScheduleOptions } from "./CronScheduler.ts";

export { PrismApiClient } from "./PrismApiClient.ts";
export type {
  PrismApiClientConfig,
  PrismLoggerLike,
  PrismRequestOptions,
  PrismChatMessage,
  PrismChatParams,
  PrismAgentParams,
  PrismTranscribeParams,
  PrismTextToSpeechParams,
  PrismEmbedParams,
  PrismMemoryExtractParams,
  PrismMemorySearchParams,
  PrismMemoryItem,
  PrismResponse,
  PrismSpeechResult,
} from "./PrismApiClient.ts";
