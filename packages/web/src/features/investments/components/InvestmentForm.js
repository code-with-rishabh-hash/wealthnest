import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Check } from 'lucide-react';
import { INV_TYPES } from '@wealthnest/shared';
import { Button, Field, Select } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
export function InvestmentForm({ initial, onSave, onCancel }) {
    const { currency } = useVault();
    const [f, setF] = useState(initial || {
        type: 'fd',
        name: '',
        institution: '',
        accountNo: '',
        principal: 0,
        currentValue: 0,
        interestRate: 0,
        startDate: '',
        maturityDate: '',
        nominee: '',
        notes: '',
        status: 'active',
    });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    const CurIcon = ({ size, style }) => (_jsx("span", { style: { ...style, fontSize: size ? size - 1 : 14, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif" }, children: currency }));
    return (_jsxs(_Fragment, { children: [_jsx(Select, { label: '\u{1F4CB} Investment Type', value: f.type, onChange: e => u('type', e.target.value), children: INV_TYPES.map(t => (_jsxs("option", { value: t.id, children: [t.icon, " ", t.label] }, t.id))) }), _jsx(Field, { label: '\u{270F} Name / Description', value: f.name || '', onChange: e => u('name', e.target.value), placeholder: "e.g. SBI FD - 2 Year" }), _jsx(Field, { label: '\u{1F3E6} Institution / Bank', value: f.institution || '', onChange: e => u('institution', e.target.value), placeholder: "e.g. State Bank of India" }), _jsx(Field, { label: '\u{1F4C4} Account / Folio Number', value: f.accountNo || '', onChange: e => u('accountNo', e.target.value), placeholder: "Account number" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [_jsx(Field, { label: '\u{1F4B0} Principal Amount', icon: CurIcon, type: "number", value: f.principal || '', onChange: e => u('principal', parseFloat(e.target.value) || 0) }), _jsx(Field, { label: '\u{1F4B5} Current Value', icon: CurIcon, type: "number", value: f.currentValue || '', onChange: e => u('currentValue', parseFloat(e.target.value) || 0) })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }, children: [_jsx(Field, { label: '\u{1F4CA} Interest %', type: "number", value: f.interestRate || '', onChange: e => u('interestRate', parseFloat(e.target.value) || 0), placeholder: "%" }), _jsx(Field, { label: '\u{1F4C5} Start Date', type: "date", value: f.startDate || '', onChange: e => u('startDate', e.target.value) }), _jsx(Field, { label: '\u{1F4C5} Maturity Date', type: "date", value: f.maturityDate || '', onChange: e => u('maturityDate', e.target.value) })] }), _jsx(Field, { label: '\u{1F464} Nominee Name', value: f.nominee || '', onChange: e => u('nominee', e.target.value), placeholder: "Full name of nominee" }), _jsxs(Select, { label: '\u{1F4CC} Status', value: f.status, onChange: e => u('status', e.target.value), children: [_jsxs("option", { value: "active", children: ['\u{2705}', " Active"] }), _jsxs("option", { value: "matured", children: ['\u{1F4C5}', " Matured"] }), _jsxs("option", { value: "closed", children: ['\u{1F512}', " Closed / Redeemed"] })] }), _jsx(Field, { label: '\u{1F4DD} Notes', textarea: true, value: f.notes || '', onChange: e => u('notes', e.target.value), placeholder: "Any additional details..." }), _jsxs("div", { style: { display: 'flex', gap: 10, marginTop: 6 }, children: [_jsxs(Button, { variant: "success", full: true, onClick: () => onSave(f), children: [_jsx(Check, { size: 16 }), " ", initial ? 'Update Investment' : 'Add Investment'] }), _jsx(Button, { variant: "ghost", onClick: onCancel, children: "Cancel" })] })] }));
}
//# sourceMappingURL=InvestmentForm.js.map