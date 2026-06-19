import { MongoClient } from "mongodb";
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
//# sourceMappingURL=mongo.js.map