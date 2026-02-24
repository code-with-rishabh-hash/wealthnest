import type { ComponentType } from 'react';
interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    Icon?: ComponentType<{
        size: number;
        color?: string;
    }>;
    color?: string;
    bg?: string;
}
export declare function StatCard({ label, value, sub, Icon, color, bg }: StatCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=StatCard.d.ts.map