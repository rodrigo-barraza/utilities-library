/**
 * Type-safe error message extraction for catch blocks.
 *
 * Replaces the unsafe `(error as Error).message` pattern.
 * The only acceptable `unknown` in TypeScript is in catch blocks —
 * this utility provides the canonical narrowing.
 */
export declare const errorMessage: (err: unknown) => string;
//# sourceMappingURL=errors.d.ts.map