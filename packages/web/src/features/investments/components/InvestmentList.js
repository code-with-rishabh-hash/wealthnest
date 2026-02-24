import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Plus, Search, Edit } from 'lucide-react';
import { INV_TYPES } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button, Modal } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { useToast } from '@/hooks/useToast';
import { formatMoney } from '@/lib/utils/format';
import { InvestmentCard } from './InvestmentCard';
import { InvestmentForm } from './InvestmentForm';
export function InvestmentList() {
    const { T } = useTheme();
    const { data, currency, addInvestment, updateInvestment, deleteInvestment } = useVault();
    const { askConfirm } = useToast();
    const [modal, setModal] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [searchQ, setSearchQ] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterNominee, setFilterNominee] = useState('all');
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
    const filtered = useMemo(() => invs.filter(i => {
        if (filterNominee !== 'all' && i.nominee !== filterNominee)
            return false;
        if (filterType !== 'all' && i.type !== filterType)
            return false;
        if (searchQ && !i.name?.toLowerCase().includes(searchQ.toLowerCase()) && !i.institution?.toLowerCase().includes(searchQ.toLowerCase()) && !i.nominee?.toLowerCase().includes(searchQ.toLowerCase()))
            return false;
        return true;
    }), [invs, filterNominee, filterType, searchQ]);
    const CRD = {
        background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff',
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 20,
        boxShadow: T.cardShadow,
    };
    const handleDelete = (id) => {
        askConfirm('Delete Investment', 'Are you sure you want to delete this investment? This action cannot be undone.', () => deleteInvestment(id));
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }, children: [_jsxs(Button, { onClick: () => setModal('add'), children: [_jsx(Plus, { size: 15 }), " Add Investment"] }), _jsxs("div", { style: { position: 'relative', flex: 1, minWidth: 160 }, children: [_jsx(Search, { size: 14, style: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMut } }), _jsx("input", { placeholder: "Search investments...", value: searchQ, onChange: e => setSearchQ(e.target.value), "aria-label": "Search investments", style: { width: '100%', padding: '10px 12px 10px 34px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 13, outline: 'none', boxSizing: 'border-box' } })] }), _jsxs("select", { value: filterType, onChange: e => setFilterType(e.target.value), "aria-label": "Filter by type", style: { padding: '10px 12px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: 'none' }, children: [_jsx("option", { value: "all", children: "All Types" }), INV_TYPES.map(t => _jsxs("option", { value: t.id, children: [t.icon, " ", t.label] }, t.id))] }), _jsxs("select", { value: filterNominee, onChange: e => setFilterNominee(e.target.value), "aria-label": "Filter by nominee", style: { padding: '10px 12px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: 'none' }, children: [_jsx("option", { value: "all", children: "All Nominees" }), nominees.map(n => _jsx("option", { value: n, children: n }, n))] })] }), _jsxs("p", { style: { fontSize: 12, color: T.textSec, marginBottom: 12 }, children: ['\u{1F4CB}', " ", filtered.length, " investment", filtered.length !== 1 ? 's' : '', " ", '\u00B7', " Total: ", formatMoney(filtered.filter(i => i.status !== 'closed').reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), currency)] }), filtered.length === 0 ? (_jsxs("div", { style: { ...CRD, textAlign: 'center', padding: '48px 24px' }, children: [_jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: '\u{1F4C8}' }), _jsx("p", { style: { color: T.textSec, fontSize: 13 }, children: "No investments found. Add your first investment to get started." })] })) : (filtered.map(inv => (_jsx(InvestmentCard, { investment: inv, currency: currency, cardStyle: CRD, onEdit: () => { setEditItem(inv); setModal('edit'); }, onDelete: () => handleDelete(inv.id) }, inv.id)))), _jsx(Modal, { open: modal === 'add', onClose: () => setModal(null), title: "Add Investment", maxWidth: "560px", icon: Plus, iconColor: T.success, children: _jsx(InvestmentForm, { onSave: inv => { addInvestment(inv); setModal(null); }, onCancel: () => setModal(null) }) }), _jsx(Modal, { open: modal === 'edit', onClose: () => { setModal(null); setEditItem(null); }, title: "Edit Investment", maxWidth: "560px", icon: Edit, iconColor: T.info, children: editItem && _jsx(InvestmentForm, { initial: editItem, onSave: inv => { updateInvestment(editItem.id, inv); setModal(null); setEditItem(null); }, onCancel: () => { setModal(null); setEditItem(null); } }) })] }));
}
//# sourceMappingURL=InvestmentList.js.map