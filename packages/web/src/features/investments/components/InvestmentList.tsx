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
import type { Investment } from '@wealthnest/shared';

export function InvestmentList() {
  const { T } = useTheme();
  const { data, currency, addInvestment, updateInvestment, deleteInvestment } = useVault();
  const { askConfirm } = useToast();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editItem, setEditItem] = useState<Investment | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterNominee, setFilterNominee] = useState('all');

  const invs = data.investments || [];
  const banks = data.bankAccounts || [];

  const nominees = useMemo(() => {
    const set = new Set<string>();
    invs.forEach(i => { if (i.nominee) set.add(i.nominee); });
    banks.forEach(b => { if (b.nominee) set.add(b.nominee); });
    return [...set].sort();
  }, [invs, banks]);

  const filtered = useMemo(() => invs.filter(i => {
    if (filterNominee !== 'all' && i.nominee !== filterNominee) return false;
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (searchQ && !i.name?.toLowerCase().includes(searchQ.toLowerCase()) && !i.institution?.toLowerCase().includes(searchQ.toLowerCase()) && !i.nominee?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  }), [invs, filterNominee, filterType, searchQ]);

  const CRD: React.CSSProperties = {
    background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff',
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: 20,
    boxShadow: T.cardShadow,
  };

  const handleDelete = (id: string) => {
    askConfirm(
      'Delete Investment',
      'Are you sure you want to delete this investment? This action cannot be undone.',
      () => deleteInvestment(id),
    );
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={() => setModal('add')}><Plus size={15} /> Add Investment</Button>
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMut }} />
          <input
            placeholder="Search investments..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            aria-label="Search investments"
            style={{ width: '100%', padding: '10px 12px 10px 34px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} aria-label="Filter by type" style={{ padding: '10px 12px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: 'none' }}>
          <option value="all">All Types</option>
          {INV_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
        </select>
        <select value={filterNominee} onChange={e => setFilterNominee(e.target.value)} aria-label="Filter by nominee" style={{ padding: '10px 12px', background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: 'none' }}>
          <option value="all">All Nominees</option>
          {nominees.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <p style={{ fontSize: 12, color: T.textSec, marginBottom: 12 }}>
        {'\u{1F4CB}'} {filtered.length} investment{filtered.length !== 1 ? 's' : ''} {'\u00B7'} Total: {formatMoney(filtered.filter(i => i.status !== 'closed').reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), currency)}
      </p>

      {filtered.length === 0 ? (
        <div style={{ ...CRD, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F4C8}'}</div>
          <p style={{ color: T.textSec, fontSize: 13 }}>No investments found. Add your first investment to get started.</p>
        </div>
      ) : (
        filtered.map(inv => (
          <InvestmentCard
            key={inv.id}
            investment={inv}
            currency={currency}
            cardStyle={CRD}
            onEdit={() => { setEditItem(inv); setModal('edit'); }}
            onDelete={() => handleDelete(inv.id)}
          />
        ))
      )}

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add Investment" maxWidth="560px" icon={Plus} iconColor={T.success}>
        <InvestmentForm onSave={inv => { addInvestment(inv as any); setModal(null); }} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'edit'} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Investment" maxWidth="560px" icon={Edit} iconColor={T.info}>
        {editItem && <InvestmentForm initial={editItem} onSave={inv => { updateInvestment(editItem.id, inv); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Modal>
    </>
  );
}
