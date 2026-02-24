import type { BankAccount } from '@wealthnest/shared';
interface BankAccountFormProps {
    initial?: BankAccount;
    onSave: (b: Partial<BankAccount>) => void;
    onCancel: () => void;
}
export declare function BankAccountForm({ initial, onSave, onCancel }: BankAccountFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BankAccountForm.d.ts.map