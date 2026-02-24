import { useState, useCallback, createContext, useContext } from 'react';
import type { VaultData, Investment, BankAccount, Transaction } from '@wealthnest/shared';
import { CRY } from '@/lib/crypto/crypto';
import { storage, STORAGE_KEYS } from '@/lib/storage/storage';
import { uid } from '@/lib/utils/id';

interface VaultContextValue {
  data: VaultData;
  password: string;
  saving: boolean;
  saved: boolean;
  currency: string;
  save: (newData: VaultData) => Promise<void>;
  // Investment CRUD
  addInvestment: (inv: Omit<Investment, 'id' | 'createdAt'>) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  // Bank Account CRUD
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  // Transaction CRUD
  addTransaction: (tx: Omit<Transaction, 'id' | 'ts'>) => void;
  deleteTransaction: (id: string) => void;
}

export const VaultContext = createContext<VaultContextValue | null>(null);

export function useVaultState(
  initialData: VaultData,
  pw: string,
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void,
): VaultContextValue {
  const [data, setData] = useState<VaultData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currency = data.currency || '₹';

  const save = useCallback(
    async (newData: VaultData) => {
      setSaving(true);
      const updated = { ...newData, lastModified: Date.now() };
      setData(updated);
      try {
        await storage.set(STORAGE_KEYS.DATA, await CRY.encrypt(updated, pw));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        console.error(e);
        onToast('Failed to save data', 'error');
      }
      setSaving(false);
    },
    [pw, onToast],
  );

  const addInvestment = useCallback(
    (inv: Omit<Investment, 'id' | 'createdAt'>) => {
      save({
        ...data,
        investments: [...(data.investments || []), { ...inv, id: uid(), createdAt: Date.now() } as Investment],
      });
      onToast('\u{2705} Investment added successfully');
    },
    [data, save, onToast],
  );

  const updateInvestment = useCallback(
    (id: string, updates: Partial<Investment>) => {
      save({
        ...data,
        investments: data.investments.map(i =>
          i.id === id ? { ...i, ...updates, lastUpdated: Date.now() } : i,
        ),
      });
      onToast('\u{2705} Investment updated');
    },
    [data, save, onToast],
  );

  const deleteInvestment = useCallback(
    (id: string) => {
      save({ ...data, investments: data.investments.filter(i => i.id !== id) });
      onToast('\u{1F5D1} Investment deleted');
    },
    [data, save, onToast],
  );

  const addBankAccount = useCallback(
    (bank: Omit<BankAccount, 'id'>) => {
      save({
        ...data,
        bankAccounts: [...(data.bankAccounts || []), { ...bank, id: uid() } as BankAccount],
      });
      onToast('\u{2705} Bank account added');
    },
    [data, save, onToast],
  );

  const updateBankAccount = useCallback(
    (id: string, updates: Partial<BankAccount>) => {
      save({
        ...data,
        bankAccounts: data.bankAccounts.map(b =>
          b.id === id ? { ...b, ...updates } : b,
        ),
      });
      onToast('\u{2705} Bank account updated');
    },
    [data, save, onToast],
  );

  const deleteBankAccount = useCallback(
    (id: string) => {
      save({ ...data, bankAccounts: data.bankAccounts.filter(b => b.id !== id) });
      onToast('\u{1F5D1} Bank account deleted');
    },
    [data, save, onToast],
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'ts'>) => {
      save({
        ...data,
        transactions: [{ ...tx, id: uid(), ts: Date.now() } as Transaction, ...(data.transactions || [])],
      });
      onToast(tx.type === 'income' ? '\u{1F4B0} Income recorded' : '\u{1F4B8} Expense recorded');
    },
    [data, save, onToast],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      save({ ...data, transactions: data.transactions.filter(t => t.id !== id) });
    },
    [data, save],
  );

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

export function useVault(): VaultContextValue {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
