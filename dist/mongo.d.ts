import { Db } from "mongodb";
export declare function connectDatabase(connectionUri: string, databaseName?: string): Promise<Db>;
export declare function getDatabase(): Db;
export declare function setDatabaseForTesting(mockDatabase: Db): void;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=mongo.d.ts.map