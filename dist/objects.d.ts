export declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;
export declare function pick<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;
export declare function omit<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
export declare function mapValues<T extends Record<string, unknown>, R>(object: T, callback: (value: unknown, key: string) => R): Record<string, R>;
export declare function mapKeys(object: Record<string, unknown>, callback: (key: string, value: unknown) => string): Record<string, unknown>;
export declare function invert(object: Record<string, string>): Record<string, string>;
export declare function isEmpty(value: unknown): boolean;
export declare function deepEqual(valueA: unknown, valueB: unknown): boolean;
//# sourceMappingURL=objects.d.ts.map