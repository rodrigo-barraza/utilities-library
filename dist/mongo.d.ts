import { Db } from "mongodb";
/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export declare function connectDB(uri: string, dbName?: string): Promise<Db>;
/**
 * Get the shared database instance.
 */
export declare function getDB(): Db;
/**
 * Set a mock database instance for testing.
 */
export declare function setDBForTesting(mockDb: Db): void;
/**
 * Close the MongoDB connection and reset the singleton.
 */
export declare function disconnectDB(): Promise<void>;
//# sourceMappingURL=mongo.d.ts.map