import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getCategoryInfo } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button, Modal, StatCard } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney, toMonthKey } from '@/lib/utils/format';
import { TransactionForm } from './TransactionForm';
export function TransactionList() {
    const { T } = useTheme();
    const { data, currency, addTransaction, deleteTransaction } = useVault();
    const [modal, setModal] = useState(false);
    const txns = data.transactions || [];
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    const cm = toMonthKey(new Date());
    const mt = txns.filter(t => toMonthKey(t.date) === cm);
    const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp2 = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setModal(true), style: { marginBottom: 16 }, children: [_jsx(Plus, { size: 15 }), " Add Transaction"] }), _jsxs("div", { className: "stat-grid", style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 16 }, children: [_jsx(StatCard, { label: '\u{1F4B0} Month Income', value: formatMoney(inc, currency), color: T.success, bg: T.successBg }), _jsx(StatCard, { label: '\u{1F4B8} Month Expenses', value: formatMoney(exp2, currency), color: T.danger, bg: T.dangerBg }), _jsx(StatCard, { label: '\u{1F4CA} Net', value: formatMoney(inc - exp2, currency), color: inc - exp2 >= 0 ? T.success : T.danger, bg: inc - exp2 >= 0 ? T.successBg : T.dangerBg })] }), _jsx("div", { style: CRD, children: txns.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '36px 20px' }, children: [_jsx("div", { style: { fontSize: 36, marginBottom: 10 }, children: '\u{1F4B8}' }), _jsx("p", { style: { color: T.textSec, fontSize: 13 }, children: "No transactions yet. Start tracking your income and expenses." })] })) : txns.slice(0, 30).map(tx => {
                    const c = getCategoryInfo(tx.category, tx.type);
                    return (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${T.border}` }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 36, height: 36, borderRadius: 10, background: T.tagBg(c.color), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }, children: c.icon }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 500, color: T.text }, children: c.label }), _jsxs("div", { style: { fontSize: 11, color: T.textMut }, children: [tx.note ? tx.note + ' \u00B7 ' : '', tx.date] })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsxs("span", { style: { fontSize: 14, fontWeight: 600, color: tx.type === 'income' ? T.success : T.danger }, children: [tx.type === 'income' ? '+' : '\u2212', formatMoney(tx.amount, currency)] }), _jsx("button", { onClick: () => deleteTransaction(tx.id), "aria-label": "Delete transaction", style: { background: T.dangerBg, borderRadius: 7, padding: 5, color: T.danger, cursor: 'pointer', display: 'flex', border: 'none' }, children: _jsx(Trash2, { size: 12 }) })] })] }, tx.id));
                }) }), _jsx(Modal, { open: modal, onClose: () => setModal(false), title: "Add Transaction", icon: Plus, iconColor: T.success, children: _jsx(TransactionForm, { onSave: tx => { addTransaction(tx); setModal(false); }, onCancel: () => setModal(false) }) })] }));
}
//# sourceMappingURL=TransactionList.js.map