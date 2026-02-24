import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { TrendingUp, Wallet, ShieldCheck, FileText, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getInvestmentInfo, NOM_COLORS } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { StatCard, Badge, Button } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';
import { useNavigate } from 'react-router-dom';
export function Dashboard() {
    const { T } = useTheme();
    const { data, currency } = useVault();
    const navigate = useNavigate();
    const invs = data.investments || [];
    const banks = data.bankAccounts || [];
    const totalPortfolio = useMemo(() => invs.filter(i => i.status !== 'closed').reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), [invs]);
    const totalBanks = useMemo(() => banks.reduce((s, b) => s + (b.balance || 0), 0), [banks]);
    const portfolioByType = useMemo(() => {
        const m = {};
        invs.filter(i => i.status !== 'closed').forEach(i => { m[i.type] = (m[i.type] || 0) + (i.currentValue || i.principal || 0); });
        return Object.entries(m).map(([type, val]) => ({ ...getInvestmentInfo(type), value: val })).sort((a, b) => b.value - a.value);
    }, [invs]);
    const portfolioByNominee = useMemo(() => {
        const m = {};
        invs.filter(i => i.status !== 'closed').forEach(i => { const n = i.nominee || 'Unassigned'; m[n] = (m[n] || 0) + (i.currentValue || i.principal || 0); });
        banks.forEach(b => { const n = b.nominee || 'Unassigned'; m[n] = (m[n] || 0) + (b.balance || 0); });
        return Object.entries(m).map(([name, val]) => ({ name, value: val })).sort((a, b) => b.value - a.value);
    }, [invs, banks]);
    const alerts = useMemo(() => invs.filter(inv => inv.status !== 'closed' && inv.maturityDate && daysUntil(inv.maturityDate) >= -7 && daysUntil(inv.maturityDate) <= 30)
        .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate)), [invs]);
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    const ChartTooltip = ({ active, payload }) => {
        if (!active || !payload?.length)
            return null;
        return (_jsxs("div", { style: { background: T.tipBg, border: `1px solid ${T.tipBd}`, borderRadius: 10, padding: '10px 14px', boxShadow: T.shadow }, children: [_jsx("p", { style: { fontSize: 12, fontWeight: 600, color: T.tipTxt, marginBottom: 4 }, children: payload[0]?.name }), payload.map((p, i) => _jsx("p", { style: { fontSize: 12, color: T.tipTxt }, children: formatMoney(p.value, currency) }, i))] }));
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "stat-grid", style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 22 }, children: [_jsx(StatCard, { label: '\u{1F4BC} Total Portfolio', value: formatMoney(totalPortfolio, currency), Icon: TrendingUp, color: T.success, bg: T.successBg }), _jsx(StatCard, { label: '\u{1F3E6} Bank Balance', value: formatMoney(totalBanks, currency), Icon: Wallet, color: T.info, bg: T.infoBg }), _jsx(StatCard, { label: '\u{1F4B0} Total Wealth', value: formatMoney(totalPortfolio + totalBanks, currency), Icon: ShieldCheck, color: T.accent, bg: T.accentBg }), _jsx(StatCard, { label: '\u{1F4CA} Active Investments', value: String(invs.filter(i => i.status !== 'closed').length), sub: invs.filter(i => i.status === 'closed').length + ' closed', Icon: FileText, color: T.warning, bg: T.warningBg })] }), alerts.length > 0 && (_jsxs("div", { style: { ...CRD, background: T.warningBg, borderColor: T.warning + '20', marginBottom: 18 }, children: [_jsxs("h4", { style: { fontSize: 14, fontWeight: 600, color: T.warningTxt, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }, children: ['\u{26A0}\u{FE0F}', " Investments Maturing Soon"] }), alerts.slice(0, 5).map(inv => {
                        const d = daysUntil(inv.maturityDate);
                        return (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12 }, children: [_jsxs("span", { style: { color: T.text }, children: [getInvestmentInfo(inv.type).icon, " ", inv.name, " ", inv.nominee && _jsxs("span", { style: { color: T.textMut }, children: ["(", inv.nominee, ")"] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx("span", { style: { color: T.text, fontWeight: 500 }, children: formatMoney(inv.principal, currency) }), _jsx(Badge, { color: d <= 0 ? T.danger : d <= 7 ? T.warning : T.info, children: d <= 0 ? 'MATURED' : d + ' days' })] })] }, inv.id));
                    })] })), _jsxs("div", { className: "chart-grid", style: { display: 'grid', gridTemplateColumns: portfolioByType.length > 0 ? '1fr 1fr' : '1fr', gap: 16, marginBottom: 18 }, children: [portfolioByType.length > 0 && (_jsxs("div", { style: CRD, children: [_jsxs("h4", { style: { fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }, children: ['\u{1F4CA}', " Portfolio by Type"] }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: portfolioByType, cx: "50%", cy: "50%", innerRadius: 45, outerRadius: 75, paddingAngle: 2, dataKey: "value", children: portfolioByType.map((e, i) => _jsx(Cell, { fill: e.color }, i)) }), _jsx(Tooltip, { content: _jsx(ChartTooltip, {}) })] }) }), _jsx("div", { style: { marginTop: 10 }, children: portfolioByType.map(c => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }, children: [_jsxs("span", { style: { color: T.textSec, display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: { display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 } }), c.icon, " ", c.label] }), _jsx("span", { style: { color: T.text, fontWeight: 500 }, children: formatMoney(c.value, currency) })] }, c.label))) })] })), portfolioByNominee.length > 0 && (_jsxs("div", { style: CRD, children: [_jsxs("h4", { style: { fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }, children: ['\u{1F465}', " Wealth by Nominee"] }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: portfolioByNominee, layout: "vertical", margin: { left: 0, right: 10, top: 0, bottom: 0 }, children: [_jsx(XAxis, { type: "number", tick: { fill: T.chartAxis, fontSize: 10 }, axisLine: false, tickLine: false }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fill: T.chartLabel, fontSize: 11 }, axisLine: false, tickLine: false, width: 90 }), _jsx(Tooltip, { content: _jsx(ChartTooltip, {}), cursor: { fill: T.cursor } }), _jsx(Bar, { dataKey: "value", radius: [0, 8, 8, 0], children: portfolioByNominee.map((_, i) => _jsx(Cell, { fill: NOM_COLORS[i % NOM_COLORS.length] }, i)) })] }) })] }))] }), invs.length === 0 && banks.length === 0 && (_jsxs("div", { style: { ...CRD, textAlign: 'center', padding: '48px 24px' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: '\u{1F3E6}' }), _jsx("h3", { style: { fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }, children: "Welcome to WealthNest" }), _jsx("p", { style: { fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 20px' }, children: "Start by adding your investments and bank accounts. Your data is encrypted with AES-256-GCM and never leaves your device." }), _jsxs("div", { style: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsxs(Button, { onClick: () => navigate('/investments'), children: [_jsx(Plus, { size: 15 }), " Add Investment"] }), _jsxs(Button, { variant: "outline", onClick: () => navigate('/banks'), children: [_jsx(Plus, { size: 15 }), " Add Bank Account"] })] })] }))] }));
}
//# sourceMappingURL=Dashboard.js.map