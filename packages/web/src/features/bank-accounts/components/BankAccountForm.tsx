import { useState } from 'react';
import { Check } from 'lucide-react';
import { BANK_TYPES } from '@wealthnest/shared';
import type { BankAccount } from '@wealthnest/shared';
import { Button, Field, Select } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';

interface BankAccountFormProps {
  initial?: BankAccount;
  onSave: (b: Partial<BankAccount>) => void;
  onCancel: () => void;
}

export function BankAccountForm({ initial, onSave, onCancel }: BankAccountFormProps) {
  const { currency } = useVault();
  const [f, setF] = useState<Partial<BankAccount>>(
    initial || { bankName: '', accountNo: '', type: 'Savings', balance: 0, nominee: '', branch: '', ifsc: '', notes: '' },
  );
  const u = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const CurIcon = ({ size, style }: { size?: number; style?: React.CSSProperties }) => (
    <span style={{ ...style, fontSize: size ? size - 1 : 14, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif" }}>{currency}</span>
  );

  return (
    <>
      <Field label={'\u{1F3E6} Bank Name'} value={f.bankName || ''} onChange={e => u('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
      <Field label={'\u{1F4C4} Account Number'} value={f.accountNo || ''} onChange={e => u('accountNo', e.target.value)} placeholder="Account number" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Select label={'\u{1F4CB} Account Type'} value={f.type} onChange={e => u('type', e.target.value)}>
          {BANK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Field label={'\u{1F4B0} Balance'} icon={CurIcon} type="number" value={f.balance || ''} onChange={e => u('balance', parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label={'\u{1F4CD} Branch'} value={f.branch || ''} onChange={e => u('branch', e.target.value)} placeholder="Branch name" />
        <Field label={'\u{1F3F7} IFSC Code'} value={f.ifsc || ''} onChange={e => u('ifsc', e.target.value)} placeholder="IFSC" />
      </div>
      <Field label={'\u{1F464} Nominee'} value={f.nominee || ''} onChange={e => u('nominee', e.target.value)} placeholder="Nominee name" />
      <Field label={'\u{1F4DD} Notes'} textarea value={f.notes || ''} onChange={e => u('notes', e.target.value)} placeholder="Additional details..." />
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Button variant="success" full onClick={() => onSave(f)}><Check size={16} /> {initial ? 'Update Account' : 'Add Account'}</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
}
