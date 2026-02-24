import { useState, useCallback, createContext, useContext } from 'react';
export const ToastContext = createContext(null);
export function useToastState() {
    const [toasts, setToasts] = useState([]);
    const [confirmDlg, setConfirmDlg] = useState(null);
    const toast = useCallback((msg, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);
    const askConfirm = useCallback((title, message, onYes, variant = 'danger', confirmText, cancelText) => {
        setConfirmDlg({ title, message, onYes, variant, confirmText, cancelText });
    }, []);
    const dismissConfirm = useCallback(() => setConfirmDlg(null), []);
    const handleConfirm = useCallback(() => {
        confirmDlg?.onYes();
        setConfirmDlg(null);
    }, [confirmDlg]);
    return { toasts, toast, confirmDlg, askConfirm, dismissConfirm, handleConfirm };
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
//# sourceMappingURL=useToast.js.map