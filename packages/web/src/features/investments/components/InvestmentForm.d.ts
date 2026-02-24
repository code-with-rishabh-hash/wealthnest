import type { Investment } from '@wealthnest/shared';
interface InvestmentFormProps {
    initial?: Investment;
    onSave: (inv: Partial<Investment>) => void;
    onCancel: () => void;
}
export declare function InvestmentForm({ initial, onSave, onCancel }: InvestmentFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=InvestmentForm.d.ts.map