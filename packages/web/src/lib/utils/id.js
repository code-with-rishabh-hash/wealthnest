/**
 * Generate a unique ID using timestamp + random suffix.
 * Provides sufficient uniqueness for client-side entity identification.
 */
export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
//# sourceMappingURL=id.js.map