export declare function formatCompact(value: number | null | undefined): string;
export declare function formatNumber(value: number | null | undefined): string;
export declare function formatTokenCount(value: number | null | undefined): string;
export declare function formatCost(value: number | null | undefined): string;
export declare function formatCostAdaptive(cost: number | null | undefined): string;
export declare function formatCostTag(estimatedCost: number | null): string;
export declare function formatLatency(seconds: number | null | undefined): string;
export declare function formatLatencyMilliseconds(milliseconds: number | null | undefined): string;
export declare function formatDuration(milliseconds: number | null | undefined): string;
export declare function formatElapsedTime(seconds: number | null | undefined): string;
export interface FormatFileSizeOptions {
    compact?: boolean;
}
export declare function formatFileSize(bytes: number, { compact }?: FormatFileSizeOptions): string | null;
export declare function formatBytes(bytes: number): string;
export declare function formatTokensPerSec(value: number | null | undefined): string;
export declare function formatContextTokens(tokens: number | null | undefined): string | null;
export declare function roundMilliseconds(seconds: number): number;
export declare function formatCurrency(amount: number | null | undefined, currencyCode?: string): string;
export declare function formatPercent(value: number | null | undefined, decimals?: number | "adaptive"): string;
export declare function formatMediaTimestamp(seconds: number | null | undefined): string;
//# sourceMappingURL=format.d.ts.map