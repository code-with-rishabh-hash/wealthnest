/**
 * Storage abstraction layer.
 * Currently wraps localStorage with JSON serialization.
 * Will be replaced with API client in Phase 2 for server-backed storage.
 */
export const storage = {
    async get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
        catch {
            return null;
        }
    },
    async set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            // Storage quota exceeded or unavailable
        }
    },
    async del(key) {
        try {
            localStorage.removeItem(key);
        }
        catch {
            // Storage unavailable
        }
    },
};
/** Storage keys used by the application */
export const STORAGE_KEYS = {
    HASH: 'wn:hash',
    DATA: 'wn:data',
    ATTEMPTS: 'wn:attempts',
    THEME: 'wn:theme',
};
//# sourceMappingURL=storage.js.map