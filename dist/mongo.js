import { MongoClient } from "mongodb";
let client = null;
let database = null;
/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export async function connectDatabase(connectionUri, databaseName) {
    if (database)
        return database;
    client = new MongoClient(connectionUri);
    await client.connect();
    const databaseInstance = client.db(databaseName);
    if (databaseInstance.databaseName === "test") {
        throw new Error("utilities-library: Connecting to the 'test' database is forbidden. Please specify a databaseName explicitly.");
    }
    database = databaseInstance;
    console.log(`📡 Connected to MongoDB: ${database.databaseName}`);
    return database;
}
/**
 * Get the shared database instance.
 */
export function getDatabase() {
    if (!database)
        throw new Error("Database not connected — call connectDatabase() first");
    return database;
}
/**
 * Set a mock database instance for testing.
 */
export function setDatabaseForTesting(mockDatabase) {
    database = mockDatabase;
}
/**
 * Close the MongoDB connection and reset the singleton.
 */
export async function disconnectDatabase() {
    if (client) {
        await client.close();
        client = null;
        database = null;
    }
}
//# sourceMappingURL=mongo.js.map