import type { Investment } from '@wealthnest/shared';
interface InvestmentCardProps {
    investment: Investment;
    currency: string;
    cardStyle: React.CSSProperties;
    onEdit: () => void;
    onDelete: () => void;
}
export declare function InvestmentCard({ investment: inv, currency, cardStyle, onEdit, onDelete }: InvestmentCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=InvestmentCard.d.ts.map