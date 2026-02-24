import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { getInvestmentInfo } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';
function Section({ title, items, color, emoji, currency, T, CRD }) {
    if (items.length === 0)
        return null;
    return (_jsxs("div", { style: { marginBottom: 18 }, children: [_jsxs("h4", { style: { fontSize: 14, fontWeight: 600, color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }, children: [emoji, " ", title, " ", _jsxs("span", { style: { fontSize: 12, fontWeight: 400, color: T.textSec }, children: ["(", items.length, ")"] })] }), items.map((inv) => {
                const d = daysUntil(inv.maturityDate);
                return (_jsx("div", { style: { ...CRD, padding: '14px 18px', marginBottom: 8, borderColor: color + '25' }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsxs("span", { style: { fontSize: 14, fontWeight: 500, color: T.text }, children: [getInvestmentInfo(inv.type).icon, " ", inv.name] }), _jsxs("div", { style: { fontSize: 12, color: T.textSec, marginTop: 3 }, children: [inv.institution, " ", inv.nominee && _jsxs("span", { children: ['\u00B7', " ", _jsxs("span", { style: { color: T.nominee }, children: ['\u{1F464}', " ", inv.nominee] })] })] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: 16, fontWeight: 700, color: T.success }, children: formatMoney(inv.principal, currency) }), _jsxs("div", { style: { fontSize: 11, color, fontWeight: 500, marginTop: 2 }, children: ['\u{1F4C5}', " ", formatDate(inv.maturityDate), " ", d >= 0 ? '(' + d + 'd)' : '(' + Math.abs(d) + 'd overdue)'] })] })] }) }, inv.id));
            })] }));
}
export function MaturityCalendar() {
    const { T } = useTheme();
    const { data, currency } = useVault();
    const invs = data.investments || [];
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    const activeInvs = invs
        .filter(i => i.maturityDate && i.status !== 'closed')
        .sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime());
    const past = activeInvs.filter(i => daysUntil(i.maturityDate) < 0);
    const soon = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d >= 0 && d <= 30; });
    const upcoming = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d > 30 && d <= 90; });
    const later = activeInvs.filter(i => daysUntil(i.maturityDate) > 90);
    if (activeInvs.length === 0) {
        return (_jsxs("div", { style: { ...CRD, textAlign: 'center', padding: '48px 24px' }, children: [_jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: '\u{1F4C5}' }), _jsx("p", { style: { color: T.textSec, fontSize: 13 }, children: "No investments with maturity dates." })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Section, { title: "Overdue / Already Matured", items: past, color: T.danger, emoji: '\u{1F534}', currency: currency, T: T, CRD: CRD }), _jsx(Section, { title: "Maturing Within 30 Days", items: soon, color: T.warning, emoji: '\u{1F7E0}', currency: currency, T: T, CRD: CRD }), _jsx(Section, { title: "Maturing in 1\\u20133 Months", items: upcoming, color: T.info, emoji: '\u{1F535}', currency: currency, T: T, CRD: CRD }), _jsx(Section, { title: "Maturing Later", items: later, color: T.success, emoji: '\u{1F7E2}', currency: currency, T: T, CRD: CRD })] }));
}
//# sourceMappingURL=MaturityCalendar.js.map