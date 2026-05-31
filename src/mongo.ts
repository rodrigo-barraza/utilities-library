import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let database: Db | null = null;

/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export async function connectDB(uri: string, dbName?: string): Promise<Db> {
  if (database) return database;
  client = new MongoClient(uri);
  await client.connect();
  const dbInstance = client.db(dbName);
  if (dbInstance.databaseName === "test") {
    throw new Error(
      "utilities-library: Connecting to the 'test' database is forbidden. Please specify a dbName explicitly.",
    );
  }
  database = dbInstance;
  console.log(`📡 Connected to MongoDB: ${database.databaseName}`);
  return database;
}

/**
 * Get the shared database instance.
 */
export function getDB(): Db {
  if (!database) throw new Error("Database not connected — call connectDB() first");
  return database;
}

/**
 * Set a mock database instance for testing.
 */
export function setDBForTesting(mockDb: Db): void {
  database = mockDb;
}

/**
 * Close the MongoDB connection and reset the singleton.
 */
export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}
