import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { BankAccount } from '@wealthnest/shared';
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
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editItem, setEditItem] = useState<BankAccount | null>(null);

  const banks = data.bankAccounts || [];
  const CRD: React.CSSProperties = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  const handleDelete = (id: string) => {
    askConfirm('Delete Bank Account', 'Are you sure you want to delete this bank account? This action cannot be undone.', () => deleteBankAccount(id));
  };

  return (
    <>
      <Button onClick={() => setModal('add')} style={{ marginBottom: 18 }}><Plus size={15} /> Add Bank Account</Button>
      {banks.length === 0 ? (
        <div style={{ ...CRD, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F3E6}'}</div>
          <p style={{ color: T.textSec, fontSize: 13 }}>No bank accounts added yet. Add your first bank account to track your balances.</p>
        </div>
      ) : banks.map(b => (
        <div key={b.id} style={{ ...CRD, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18 }}>{'\u{1F3E6}'}</span> {b.bankName}
              </div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
                {'\u{1F4C4}'} A/C: {b.accountNo} {'\u00B7'} {b.type}
                {b.branch && <span> {'\u00B7'} {'\u{1F4CD}'} {b.branch}</span>}
                {b.ifsc && <span> {'\u00B7'} IFSC: {b.ifsc}</span>}
                {b.nominee && <span> {'\u00B7'} <span style={{ color: T.nominee }}>{'\u{1F464}'} {b.nominee}</span></span>}
              </div>
              {b.notes && <div style={{ fontSize: 11, color: T.textMut, marginTop: 3, fontStyle: 'italic' }}>{'\u{1F4DD}'} {b.notes}</div>}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.info }}>{formatMoney(b.balance, currency)}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => { setEditItem(b); setModal('edit'); }} aria-label={`Edit ${b.bankName}`} style={{ background: T.infoBg, borderRadius: 8, padding: 7, color: T.info, cursor: 'pointer', display: 'flex', border: 'none' }}><Edit size={14} /></button>
                <button onClick={() => handleDelete(b.id)} aria-label={`Delete ${b.bankName}`} style={{ background: T.dangerBg, borderRadius: 8, padding: 7, color: T.danger, cursor: 'pointer', display: 'flex', border: 'none' }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add Bank Account" icon={Plus} iconColor={T.success}>
        <BankAccountForm onSave={b => { addBankAccount(b as any); setModal(null); }} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'edit'} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Bank Account" icon={Edit} iconColor={T.info}>
        {editItem && <BankAccountForm initial={editItem} onSave={b => { updateBankAccount(editItem.id, b); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Modal>
    </>
  );
}
