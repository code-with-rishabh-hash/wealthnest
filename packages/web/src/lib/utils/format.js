/**
 * Format a number as currency with Indian notation (Cr/L) for large amounts.
 */
export function formatMoney(amount, currency) {
    const abs = Math.abs(amount || 0);
    if (abs >= 1e7)
        return currency + (abs / 1e7).toFixed(2) + 'Cr';
    if (abs >= 1e5)
        return currency + (abs / 1e5).toFixed(2) + 'L';
    if (abs >= 1000)
        return currency + abs.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    return currency + abs.toFixed(2);
}
/**
 * Format a date string as "DD Mon YYYY" (e.g., "15 Jan 2025")
 */
export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
/**
 * Convert a date to "YYYY-MM" key for monthly grouping
 */
export function toMonthKey(date) {
    const d = new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
/**
 * Convert a "YYYY-MM" key to a human-readable label (e.g., "Jan 2025")
 */
export function monthLabel(key) {
    const parts = key.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}
//# sourceMappingURL=format.js.map