import { useState, useCallback, createContext, useContext } from 'react';
import type { ToastItem } from '@/design-system/primitives/Toast';

interface ConfirmState {
  title: string;
  message: string;
  onYes: () => void;
  variant: 'danger' | 'warn' | 'info';
  confirmText?: string;
  cancelText?: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (msg: string, type?: ToastItem['type']) => void;
  confirmDlg: ConfirmState | null;
  askConfirm: (
    title: string,
    message: string,
    onYes: () => void,
    variant?: 'danger' | 'warn' | 'info',
    confirmText?: string,
    cancelText?: string,
  ) => void;
  dismissConfirm: () => void;
  handleConfirm: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastState(): ToastContextValue {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDlg, setConfirmDlg] = useState<ConfirmState | null>(null);

  const toast = useCallback((msg: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const askConfirm = useCallback(
    (
      title: string,
      message: string,
      onYes: () => void,
      variant: 'danger' | 'warn' | 'info' = 'danger',
      confirmText?: string,
      cancelText?: string,
    ) => {
      setConfirmDlg({ title, message, onYes, variant, confirmText, cancelText });
    },
    [],
  );

  const dismissConfirm = useCallback(() => setConfirmDlg(null), []);

  const handleConfirm = useCallback(() => {
    confirmDlg?.onYes();
    setConfirmDlg(null);
  }, [confirmDlg]);

  return { toasts, toast, confirmDlg, askConfirm, dismissConfirm, handleConfirm };
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
