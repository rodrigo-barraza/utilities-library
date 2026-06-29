export interface PlainObject {
    [key: string]: unknown;
}
export declare function isRecord(value: unknown): value is PlainObject;
export declare function deepMerge<T extends PlainObject>(target: T, source: PlainObject): T;
export declare function pick<T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;
export declare function omit<T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
export declare function mapValues<T extends PlainObject, R>(object: T, callback: (value: unknown, key: string) => R): Record<string, R>;
export declare function mapKeys(object: PlainObject, callback: (key: string, value: unknown) => string): PlainObject;
export declare function invert(object: Record<string, string>): Record<string, string>;
export declare function isEmpty(value: unknown): boolean;
export declare function deepEqual(valueA: unknown, valueB: unknown): boolean;
//# sourceMappingURL=objects.d.ts.map