import type { CSSProperties, ChangeEventHandler, ReactNode } from 'react';
interface SelectProps {
    label?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    children?: ReactNode;
    style?: CSSProperties;
    'aria-label'?: string;
}
export declare function Select({ label, value, onChange, children, style: sx, 'aria-label': ariaLabel, }: SelectProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Select.d.ts.map