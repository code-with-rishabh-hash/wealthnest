/**
 * Storage abstraction layer.
 * Currently wraps localStorage with JSON serialization.
 * Will be replaced with API client in Phase 2 for server-backed storage.
 */
export declare const storage: {
    get<T = unknown>(key: string): Promise<T | null>;
    set(key: string, value: unknown): Promise<void>;
    del(key: string): Promise<void>;
};
/** Storage keys used by the application */
export declare const STORAGE_KEYS: {
    readonly HASH: "wn:hash";
    readonly DATA: "wn:data";
    readonly ATTEMPTS: "wn:attempts";
    readonly THEME: "wn:theme";
};
//# sourceMappingURL=storage.d.ts.map