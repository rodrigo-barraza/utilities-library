import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export async function connectDB(uri: string, dbName?: string): Promise<Db> {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`📡 Connected to MongoDB: ${db.databaseName}`);
  return db;
}

/**
 * Get the shared database instance.
 */
export function getDB(): Db {
  if (!db) throw new Error("Database not connected — call connectDB() first");
  return db;
}

/**
 * Set a mock database instance for testing.
 */
export function setDBForTesting(mockDb: Db): void {
  db = mockDb;
}

/**
 * Close the MongoDB connection and reset the singleton.
 */
export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
