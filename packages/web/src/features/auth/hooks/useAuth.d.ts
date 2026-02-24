import type { VaultData, Currency } from '@wealthnest/shared';
interface AuthState {
    mode: 'detect' | 'login' | 'setup';
    password: string;
    password2: string;
    showPassword: boolean;
    error: string;
    busy: boolean;
    currency: Currency;
    attempts: number;
    wiped: boolean;
    confirmReset: boolean;
}
export declare function useAuth(onUnlock: (data: VaultData, password: string) => void): {
    state: AuthState;
    update: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void;
    clearError: () => void;
    doSetup: () => Promise<void>;
    doLogin: () => Promise<void>;
    doReset: () => Promise<void>;
    passwordStrength: number;
};
export {};
//# sourceMappingURL=useAuth.d.ts.map