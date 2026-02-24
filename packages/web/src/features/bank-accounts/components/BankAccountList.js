import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button, Modal } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { useToast } from '@/hooks/useToast';
import { formatMoney } from '@/lib/utils/format';
import { BankAccountForm } from './BankAccountForm';
export function BankAccountList() {
    const { T } = useTheme();
    const { data, currency, addBankAccount, updateBankAccount, deleteBankAccount } = useVault();
    const { askConfirm } = useToast();
    const [modal, setModal] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const banks = data.bankAccounts || [];
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    const handleDelete = (id) => {
        askConfirm('Delete Bank Account', 'Are you sure you want to delete this bank account? This action cannot be undone.', () => deleteBankAccount(id));
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setModal('add'), style: { marginBottom: 18 }, children: [_jsx(Plus, { size: 15 }), " Add Bank Account"] }), banks.length === 0 ? (_jsxs("div", { style: { ...CRD, textAlign: 'center', padding: '48px 24px' }, children: [_jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: '\u{1F3E6}' }), _jsx("p", { style: { color: T.textSec, fontSize: 13 }, children: "No bank accounts added yet. Add your first bank account to track your balances." })] })) : banks.map(b => (_jsx("div", { style: { ...CRD, marginBottom: 12 }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: { fontSize: 18 }, children: '\u{1F3E6}' }), " ", b.bankName] }), _jsxs("div", { style: { fontSize: 12, color: T.textSec, lineHeight: 1.8 }, children: ['\u{1F4C4}', " A/C: ", b.accountNo, " ", '\u00B7', " ", b.type, b.branch && _jsxs("span", { children: [" ", '\u00B7', " ", '\u{1F4CD}', " ", b.branch] }), b.ifsc && _jsxs("span", { children: [" ", '\u00B7', " IFSC: ", b.ifsc] }), b.nominee && _jsxs("span", { children: [" ", '\u00B7', " ", _jsxs("span", { style: { color: T.nominee }, children: ['\u{1F464}', " ", b.nominee] })] })] }), b.notes && _jsxs("div", { style: { fontSize: 11, color: T.textMut, marginTop: 3, fontStyle: 'italic' }, children: ['\u{1F4DD}', " ", b.notes] })] }), _jsxs("div", { style: { textAlign: 'right', flexShrink: 0 }, children: [_jsx("div", { style: { fontSize: 20, fontWeight: 700, color: T.info }, children: formatMoney(b.balance, currency) }), _jsxs("div", { style: { display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }, children: [_jsx("button", { onClick: () => { setEditItem(b); setModal('edit'); }, "aria-label": `Edit ${b.bankName}`, style: { background: T.infoBg, borderRadius: 8, padding: 7, color: T.info, cursor: 'pointer', display: 'flex', border: 'none' }, children: _jsx(Edit, { size: 14 }) }), _jsx("button", { onClick: () => handleDelete(b.id), "aria-label": `Delete ${b.bankName}`, style: { background: T.dangerBg, borderRadius: 8, padding: 7, color: T.danger, cursor: 'pointer', display: 'flex', border: 'none' }, children: _jsx(Trash2, { size: 14 }) })] })] })] }) }, b.id))), _jsx(Modal, { open: modal === 'add', onClose: () => setModal(null), title: "Add Bank Account", icon: Plus, iconColor: T.success, children: _jsx(BankAccountForm, { onSave: b => { addBankAccount(b); setModal(null); }, onCancel: () => setModal(null) }) }), _jsx(Modal, { open: modal === 'edit', onClose: () => { setModal(null); setEditItem(null); }, title: "Edit Bank Account", icon: Edit, iconColor: T.info, children: editItem && _jsx(BankAccountForm, { initial: editItem, onSave: b => { updateBankAccount(editItem.id, b); setModal(null); setEditItem(null); }, onCancel: () => { setModal(null); setEditItem(null); } }) })] }));
}
//# sourceMappingURL=BankAccountList.js.map