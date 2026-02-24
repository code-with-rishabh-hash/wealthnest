import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Calendar, Tag } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button, Field } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { useToast } from '@/hooks/useToast';
export function TransactionForm({ onSave, onCancel }) {
    const { T } = useTheme();
    const { currency } = useVault();
    const { toast } = useToast();
    const [f, setF] = useState({ type: 'expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    const cats = f.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const CurIcon = ({ size, style }) => (_jsx("span", { style: { ...style, fontSize: size ? size - 1 : 14, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif" }, children: currency }));
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: { display: 'flex', gap: 4, marginBottom: 16, background: T.ghostBg, borderRadius: 12, padding: 4 }, role: "radiogroup", "aria-label": "Transaction type", children: ['expense', 'income'].map(t => (_jsxs("button", { role: "radio", "aria-checked": f.type === t, onClick: () => { u('type', t); u('category', ''); }, style: {
                        flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                        textTransform: 'capitalize', textAlign: 'center', cursor: 'pointer', border: 'none',
                        background: f.type === t ? (t === 'expense' ? T.dangerBg : T.successBg) : 'transparent',
                        color: f.type === t ? (t === 'expense' ? T.danger : T.success) : T.textMut,
                        transition: 'all 0.15s',
                    }, children: [t === 'expense' ? '\u{1F4B8}' : '\u{1F4B0}', " ", t] }, t))) }), _jsx(Field, { label: '\u{1F4B2} Amount', icon: CurIcon, type: "number", placeholder: "0.00", value: f.amount, onChange: e => u('amount', e.target.value) }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsxs("label", { style: { display: 'block', fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }, children: ['\u{1F3F7}', " Category"] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 6 }, role: "radiogroup", "aria-label": "Category", children: cats.map(c => (_jsxs("button", { role: "radio", "aria-checked": f.category === c.id, onClick: () => u('category', c.id), style: {
                                padding: '9px 7px', borderRadius: 10, cursor: 'pointer',
                                border: f.category === c.id ? `2px solid ${c.color}` : `1px solid ${T.border}`,
                                background: f.category === c.id ? T.expBg(c.color) : T.ghostBg,
                                fontSize: 11, fontWeight: f.category === c.id ? 600 : 400,
                                color: f.category === c.id ? (T.isDark ? '#fff' : c.color) : T.textSec,
                                display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s',
                            }, children: [_jsx("span", { style: { fontSize: 14 }, children: c.icon }), " ", c.label] }, c.id))) })] }), _jsx(Field, { label: '\u{1F4C5} Date', icon: Calendar, type: "date", value: f.date, onChange: e => u('date', e.target.value) }), _jsx(Field, { label: '\u{1F4DD} Note', icon: Tag, value: f.note, onChange: e => u('note', e.target.value), placeholder: "Details..." }), _jsxs(Button, { variant: f.type === 'income' ? 'success' : 'danger', full: true, onClick: () => {
                    if (f.amount && f.category) {
                        onSave({ ...f, amount: parseFloat(f.amount) });
                    }
                    else {
                        toast('Please fill amount and category', 'warning');
                    }
                }, children: [_jsx(Plus, { size: 16 }), " Add ", f.type === 'income' ? 'Income' : 'Expense'] })] }));
}
//# sourceMappingURL=TransactionForm.js.map