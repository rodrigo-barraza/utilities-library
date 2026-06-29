import { type PlainObject } from "./objects.ts";
export declare function chunk<ArrayItem>(array: ArrayItem[], size: number): ArrayItem[][];
export declare function shuffleArray<ArrayItem>(array: ArrayItem[]): ArrayItem[];
export declare function pickRandom<ArrayItem>(array: ArrayItem[]): ArrayItem;
export declare function compactPayload<Payload extends PlainObject>(object: Payload): Partial<Payload>;
export declare function groupBy<ArrayItem>(array: ArrayItem[], keySelector: string | ((item: ArrayItem) => string)): Record<string, ArrayItem[]>;
export declare function uniqueBy<ArrayItem>(array: ArrayItem[], keySelector: string | ((item: ArrayItem) => unknown)): ArrayItem[];
export declare function partition<ArrayItem>(array: ArrayItem[], predicate: (item: ArrayItem) => boolean): [ArrayItem[], ArrayItem[]];
export declare function intersection<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[];
export declare function difference<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[];
export interface SortByOptions {
    descending?: boolean;
}
export declare function sortBy<ArrayItem>(array: ArrayItem[], keyOrComparator: string | ((firstItem: ArrayItem, secondItem: ArrayItem) => number), { descending }?: SortByOptions): ArrayItem[];
export declare function flatten<ArrayItem>(array: ArrayItem[], depth?: number): ArrayItem[];
//# sourceMappingURL=arrays.d.ts.map