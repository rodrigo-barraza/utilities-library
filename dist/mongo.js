import { MongoClient, ObjectId } from "mongodb";
let client = null;
let database = null;
export async function connectDatabase(connectionUri, databaseName) {
    if (database)
        return database;
    client = new MongoClient(connectionUri);
    await client.connect();
    const databaseInstance = client.db(databaseName);
    // Safety guard: prevent accidentally connecting to the default 'test' database
    if (databaseInstance.databaseName === "test") {
        throw new Error("utilities-library: Connecting to the 'test' database is forbidden. Please specify a databaseName explicitly.");
    }
    database = databaseInstance;
    console.log(`📡 Connected to MongoDB: ${database.databaseName}`);
    return database;
}
export function getDatabase() {
    if (!database)
        throw new Error("Database not connected — call connectDatabase() first");
    return database;
}
export function setDatabaseForTesting(mockDatabase) {
    database = mockDatabase;
}
export async function disconnectDatabase() {
    if (client) {
        await client.close();
        client = null;
        database = null;
    }
}
/**
 * Safely convert a string to a MongoDB ObjectId.
 * Returns null if the string is not a valid ObjectId.
 */
export function toObjectId(id) {
    if (!id)
        return null;
    try {
        return new ObjectId(id);
    }
    catch {
        return null;
    }
}
/**
 * Build a time-range filter for MongoDB queries.
 */
export function buildTimeRangeFilter(field, from, to) {
    const filter = {};
    if (from)
        filter.$gte = new Date(from);
    if (to)
        filter.$lte = new Date(to);
    return Object.keys(filter).length ? { [field]: filter } : {};
}
/**
 * Build a MongoDB pagination object from query params.
 */
export function buildPagination(query) {
    const limit = Math.min(500, Math.max(1, parseInt(String(query.limit || ""), 10) || 20));
    let skip = 0;
    if (query.offset !== undefined) {
        skip = Math.max(0, parseInt(String(query.offset || ""), 10) || 0);
    }
    else if (query.page !== undefined) {
        const page = Math.max(1, parseInt(String(query.page || ""), 10) || 1);
        skip = (page - 1) * limit;
    }
    return { limit, skip };
}
//# sourceMappingURL=mongo.js.map