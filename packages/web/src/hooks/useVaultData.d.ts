import type { VaultData, Investment, BankAccount, Transaction } from '@wealthnest/shared';
interface VaultContextValue {
    data: VaultData;
    password: string;
    saving: boolean;
    saved: boolean;
    currency: string;
    save: (newData: VaultData) => Promise<void>;
    addInvestment: (inv: Omit<Investment, 'id' | 'createdAt'>) => void;
    updateInvestment: (id: string, updates: Partial<Investment>) => void;
    deleteInvestment: (id: string) => void;
    addBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
    updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
    deleteBankAccount: (id: string) => void;
    addTransaction: (tx: Omit<Transaction, 'id' | 'ts'>) => void;
    deleteTransaction: (id: string) => void;
}
export declare const VaultContext: import("react").Context<VaultContextValue | null>;
export declare function useVaultState(initialData: VaultData, pw: string, onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void): VaultContextValue;
export declare function useVault(): VaultContextValue;
export {};
//# sourceMappingURL=useVaultData.d.ts.map