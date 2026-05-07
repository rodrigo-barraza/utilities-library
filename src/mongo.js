import { MongoClient } from "mongodb";

let client = null;
let db = null;

/**
 * Connect to MongoDB and return the database instance.
 * Shared across all domains — single connection pool.
 * @param {string} uri - MongoDB connection string
 * @param {string} [dbName] - Optional database name
 * @returns {Promise<import("mongodb").Db>}
 */
export async function connectDB(uri, dbName) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`📡 Connected to MongoDB: ${db.databaseName}`);
  return db;
}

/**
 * Get the shared database instance.
 * @returns {import("mongodb").Db}
 */
export function getDB() {
  if (!db) throw new Error("Database not connected — call connectDB() first");
  return db;
}

/**
 * Set a mock database instance for testing.
 * @param {import("mongodb").Db} mockDb
 */
export function setDBForTesting(mockDb) {
  db = mockDb;
}
