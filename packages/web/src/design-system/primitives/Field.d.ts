import type { CSSProperties, ChangeEventHandler, KeyboardEventHandler, ComponentType } from 'react';
interface FieldProps {
    label?: string;
    icon?: ComponentType<{
        size: number;
        style?: CSSProperties;
    }>;
    textarea?: boolean;
    type?: string;
    value?: string | number;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    placeholder?: string;
    style?: CSSProperties;
    'aria-label'?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
}
export declare function Field({ label, icon: Icon, textarea, 'aria-label': ariaLabel, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy, ...props }: FieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Field.d.ts.map