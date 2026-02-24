import { type ReactNode, type ComponentType } from 'react';
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: string;
    icon?: ComponentType<{
        size: number;
        color?: string;
    }>;
    iconColor?: string;
}
export declare function Modal({ open, onClose, title, children, maxWidth, icon: Icon, iconColor }: ModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=Modal.d.ts.map