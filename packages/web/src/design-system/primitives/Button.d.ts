import type { ReactNode, CSSProperties } from 'react';
interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'success' | 'danger' | 'warn' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    full?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    style?: CSSProperties;
    'aria-label'?: string;
    type?: 'button' | 'submit' | 'reset';
}
export declare function Button({ children, variant, size, full, onClick, disabled, style: sx, 'aria-label': ariaLabel, type, }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Button.d.ts.map