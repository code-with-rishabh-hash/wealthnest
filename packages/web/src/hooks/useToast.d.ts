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
    askConfirm: (title: string, message: string, onYes: () => void, variant?: 'danger' | 'warn' | 'info', confirmText?: string, cancelText?: string) => void;
    dismissConfirm: () => void;
    handleConfirm: () => void;
}
export declare const ToastContext: import("react").Context<ToastContextValue | null>;
export declare function useToastState(): ToastContextValue;
export declare function useToast(): ToastContextValue;
export {};
//# sourceMappingURL=useToast.d.ts.map