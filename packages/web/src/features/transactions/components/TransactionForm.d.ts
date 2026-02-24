interface TransactionFormProps {
    onSave: (tx: {
        type: string;
        amount: number;
        category: string;
        note: string;
        date: string;
    }) => void;
    onCancel: () => void;
}
export declare function TransactionForm({ onSave, onCancel }: TransactionFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TransactionForm.d.ts.map