import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { getInvestmentInfo, NOM_COLORS } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Badge } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';
export function NomineeList() {
    const { T } = useTheme();
    const { data, currency } = useVault();
    const invs = data.investments || [];
    const banks = data.bankAccounts || [];
    const nominees = useMemo(() => {
        const set = new Set();
        invs.forEach(i => { if (i.nominee)
            set.add(i.nominee); });
        banks.forEach(b => { if (b.nominee)
            set.add(b.nominee); });
        return [...set].sort();
    }, [invs, banks]);
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    if (nominees.length === 0) {
        return (_jsxs("div", { style: { ...CRD, textAlign: 'center', padding: '48px 24px' }, children: [_jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: '\u{1F465}' }), _jsx("p", { style: { color: T.textSec, fontSize: 13 }, children: "No nominees found. Add nominees when creating investments or bank accounts." })] }));
    }
    return (_jsx(_Fragment, { children: nominees.map((nom, ni) => {
            const nInvs = invs.filter(i => i.nominee === nom && i.status !== 'closed');
            const nBanks = banks.filter(b => b.nominee === nom);
            const total = nInvs.reduce((s, i) => s + (i.currentValue || i.principal || 0), 0) + nBanks.reduce((s, b) => s + (b.balance || 0), 0);
            const nc = NOM_COLORS[ni % NOM_COLORS.length];
            return (_jsxs("div", { style: { ...CRD, marginBottom: 14, borderColor: nc + '30' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 12, background: nc + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: nc }, children: nom[0] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 16, fontWeight: 600, color: T.text }, children: nom }), _jsxs("div", { style: { fontSize: 12, color: T.textSec }, children: [nInvs.length, " investment", nInvs.length !== 1 ? 's' : '', " ", '\u00B7', " ", nBanks.length, " bank account", nBanks.length !== 1 ? 's' : ''] })] })] }), _jsx("div", { style: { fontSize: 22, fontWeight: 700, color: nc }, children: formatMoney(total, currency) })] }), nInvs.map(inv => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${T.border}`, fontSize: 12 }, children: [_jsxs("span", { style: { color: T.textSoft }, children: [getInvestmentInfo(inv.type).icon, " ", inv.name || getInvestmentInfo(inv.type).label, " ", _jsxs("span", { style: { color: T.textMut }, children: ["(", inv.institution, ")"] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx("span", { style: { color: T.text, fontWeight: 500 }, children: formatMoney(inv.currentValue || inv.principal, currency) }), inv.maturityDate && _jsx(Badge, { color: daysUntil(inv.maturityDate) <= 30 ? T.warning : T.textMut, children: formatDate(inv.maturityDate) })] })] }, inv.id))), nBanks.map(b => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${T.border}`, fontSize: 12 }, children: [_jsxs("span", { style: { color: T.textSoft }, children: ['\u{1F3E6}', " ", b.bankName, " (", b.type, ")"] }), _jsx("span", { style: { color: T.text, fontWeight: 500 }, children: formatMoney(b.balance, currency) })] }, b.id)))] }, nom));
        }) }));
}
//# sourceMappingURL=NomineeList.js.map