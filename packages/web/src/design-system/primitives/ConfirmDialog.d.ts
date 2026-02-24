interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warn' | 'info';
    onConfirm?: () => void;
    onCancel?: () => void;
}
export declare function ConfirmDialog({ open, title, message, confirmText, cancelText, variant, onConfirm, onCancel, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=ConfirmDialog.d.ts.map