import { useState, useCallback, createContext, useContext } from 'react';
import { CRY } from '@/lib/crypto/crypto';
import { storage, STORAGE_KEYS } from '@/lib/storage/storage';
import { uid } from '@/lib/utils/id';
export const VaultContext = createContext(null);
export function useVaultState(initialData, pw, onToast) {
    const [data, setData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const currency = data.currency || '₹';
    const save = useCallback(async (newData) => {
        setSaving(true);
        const updated = { ...newData, lastModified: Date.now() };
        setData(updated);
        try {
            await storage.set(STORAGE_KEYS.DATA, await CRY.encrypt(updated, pw));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        catch (e) {
            console.error(e);
            onToast('Failed to save data', 'error');
        }
        setSaving(false);
    }, [pw, onToast]);
    const addInvestment = useCallback((inv) => {
        save({
            ...data,
            investments: [...(data.investments || []), { ...inv, id: uid(), createdAt: Date.now() }],
        });
        onToast('\u{2705} Investment added successfully');
    }, [data, save, onToast]);
    const updateInvestment = useCallback((id, updates) => {
        save({
            ...data,
            investments: data.investments.map(i => i.id === id ? { ...i, ...updates, lastUpdated: Date.now() } : i),
        });
        onToast('\u{2705} Investment updated');
    }, [data, save, onToast]);
    const deleteInvestment = useCallback((id) => {
        save({ ...data, investments: data.investments.filter(i => i.id !== id) });
        onToast('\u{1F5D1} Investment deleted');
    }, [data, save, onToast]);
    const addBankAccount = useCallback((bank) => {
        save({
            ...data,
            bankAccounts: [...(data.bankAccounts || []), { ...bank, id: uid() }],
        });
        onToast('\u{2705} Bank account added');
    }, [data, save, onToast]);
    const updateBankAccount = useCallback((id, updates) => {
        save({
            ...data,
            bankAccounts: data.bankAccounts.map(b => b.id === id ? { ...b, ...updates } : b),
        });
        onToast('\u{2705} Bank account updated');
    }, [data, save, onToast]);
    const deleteBankAccount = useCallback((id) => {
        save({ ...data, bankAccounts: data.bankAccounts.filter(b => b.id !== id) });
        onToast('\u{1F5D1} Bank account deleted');
    }, [data, save, onToast]);
    const addTransaction = useCallback((tx) => {
        save({
            ...data,
            transactions: [{ ...tx, id: uid(), ts: Date.now() }, ...(data.transactions || [])],
        });
        onToast(tx.type === 'income' ? '\u{1F4B0} Income recorded' : '\u{1F4B8} Expense recorded');
    }, [data, save, onToast]);
    const deleteTransaction = useCallback((id) => {
        save({ ...data, transactions: data.transactions.filter(t => t.id !== id) });
    }, [data, save]);
    return {
        data,
        password: pw,
        saving,
        saved,
        currency,
        save,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        addTransaction,
        deleteTransaction,
    };
}
export function useVault() {
    const ctx = useContext(VaultContext);
    if (!ctx)
        throw new Error('useVault must be used within VaultProvider');
    return ctx;
}
//# sourceMappingURL=useVaultData.js.map