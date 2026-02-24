/**
 * Format a number as currency with Indian notation (Cr/L) for large amounts.
 */
export declare function formatMoney(amount: number, currency: string): string;
/**
 * Format a date string as "DD Mon YYYY" (e.g., "15 Jan 2025")
 */
export declare function formatDate(dateStr: string): string;
/**
 * Convert a date to "YYYY-MM" key for monthly grouping
 */
export declare function toMonthKey(date: string | Date): string;
/**
 * Convert a "YYYY-MM" key to a human-readable label (e.g., "Jan 2025")
 */
export declare function monthLabel(key: string): string;
//# sourceMappingURL=format.d.ts.map