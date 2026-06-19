import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectDatabase(connectionUri: string, databaseName?: string): Promise<Db> {
  if (database) return database;
  client = new MongoClient(connectionUri);
  await client.connect();
  const databaseInstance = client.db(databaseName);
  // Safety guard: prevent accidentally connecting to the default 'test' database
  if (databaseInstance.databaseName === "test") {
    throw new Error(
      "utilities-library: Connecting to the 'test' database is forbidden. Please specify a databaseName explicitly.",
    );
  }
  database = databaseInstance;
  console.log(`📡 Connected to MongoDB: ${database.databaseName}`);
  return database;
}

export function getDatabase(): Db {
  if (!database) throw new Error("Database not connected — call connectDatabase() first");
  return database;
}

export function setDatabaseForTesting(mockDatabase: Db): void {
  database = mockDatabase;
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}
