import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let database: Db | null = null;

/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 */
export async function connectDatabase(connectionUri: string, databaseName?: string): Promise<Db> {
  if (database) return database;
  client = new MongoClient(connectionUri);
  await client.connect();
  const databaseInstance = client.db(databaseName);
  if (databaseInstance.databaseName === "test") {
    throw new Error(
      "utilities-library: Connecting to the 'test' database is forbidden. Please specify a databaseName explicitly.",
    );
  }
  database = databaseInstance;
  console.log(`📡 Connected to MongoDB: ${database.databaseName}`);
  return database;
}

/**
 * Get the shared database instance.
 */
export function getDatabase(): Db {
  if (!database) throw new Error("Database not connected — call connectDatabase() first");
  return database;
}

/**
 * Set a mock database instance for testing.
 */
export function setDatabaseForTesting(mockDatabase: Db): void {
  database = mockDatabase;
}

/**
 * Close the MongoDB connection and reset the singleton.
 */
export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}


