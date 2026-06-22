export interface ScoredDocument<T> {
    document: T;
    score: number;
}
export declare function tokenize(text: string): string[];
/**
 * Extract all searchable text from a tool schema.
 * Concatenates: tool name + description + parameter names + parameter descriptions.
 */
export declare function extractSearchableText(toolSchema: {
    name?: string;
    description?: string;
    parameters?: {
        properties?: Record<string, {
            description?: string;
        }>;
    };
}): string;
/**
 * Pre-built BM25 index over a corpus of tool schemas.
 *
 * Builds the document frequency table and average document length once,
 * then scores queries against it cheaply. Rebuild when the tool catalog
 * changes (stateless per-turn, like Hermes).
 */
export declare class Bm25ToolIndex<T extends {
    name?: string;
    description?: string;
    parameters?: unknown;
}> {
    private readonly documentTokens;
    private readonly documentFrequency;
    private readonly totalDocuments;
    private readonly averageDocumentLength;
    private readonly toolNamesByDocument;
    constructor(documents: T[]);
    /**
     * Score a single document against query terms using BM25.
     */
    private computeBm25;
    /**
     * Search the index for documents matching the query.
     *
     * Returns scored results sorted by relevance (highest first).
     * Uses BM25 as primary ranking, with additive bonuses for exact
     * and partial name matches. Falls back to literal substring
     * matching on tool names when BM25 returns zero hits.
     */
    search(query: string, limit?: number): ScoredDocument<T>[];
}
//# sourceMappingURL=search.d.ts.map