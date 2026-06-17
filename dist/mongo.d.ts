import { Db } from "mongodb";
/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export declare function connectDatabase(connectionUri: string, databaseName?: string): Promise<Db>;
/**
 * Get the shared database instance.
 */
export declare function getDatabase(): Db;
/**
 * Set a mock database instance for testing.
 */
export declare function setDatabaseForTesting(mockDatabase: Db): void;
/**
 * Close the MongoDB connection and reset the singleton.
 */
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=mongo.d.ts.map