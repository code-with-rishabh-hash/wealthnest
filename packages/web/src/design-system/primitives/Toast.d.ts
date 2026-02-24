export interface ToastItem {
    id: number;
    msg: string;
    type: 'success' | 'error' | 'warning' | 'info';
}
interface ToastContainerProps {
    toasts: ToastItem[];
}
export declare function ToastContainer({ toasts }: ToastContainerProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=Toast.d.ts.map