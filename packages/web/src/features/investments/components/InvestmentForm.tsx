import { useState } from 'react';
import { Check } from 'lucide-react';
import { INV_TYPES } from '@wealthnest/shared';
import type { Investment } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button, Field, Select } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';

interface InvestmentFormProps {
  initial?: Investment;
  onSave: (inv: Partial<Investment>) => void;
  onCancel: () => void;
}

export function InvestmentForm({ initial, onSave, onCancel }: InvestmentFormProps) {
  const { currency } = useVault();
  const [f, setF] = useState<Partial<Investment>>(
    initial || {
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
    },
  );

  const u = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const CurIcon = ({ size, style }: { size?: number; style?: React.CSSProperties }) => (
    <span style={{ ...style, fontSize: size ? size - 1 : 14, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {currency}
    </span>
  );

  return (
    <>
      <Select label={'\u{1F4CB} Investment Type'} value={f.type} onChange={e => u('type', e.target.value)}>
        {INV_TYPES.map(t => (
          <option key={t.id} value={t.id}>
            {t.icon} {t.label}
          </option>
        ))}
      </Select>
      <Field label={'\u{270F} Name / Description'} value={f.name || ''} onChange={e => u('name', e.target.value)} placeholder="e.g. SBI FD - 2 Year" />
      <Field label={'\u{1F3E6} Institution / Bank'} value={f.institution || ''} onChange={e => u('institution', e.target.value)} placeholder="e.g. State Bank of India" />
      <Field label={'\u{1F4C4} Account / Folio Number'} value={f.accountNo || ''} onChange={e => u('accountNo', e.target.value)} placeholder="Account number" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label={'\u{1F4B0} Principal Amount'} icon={CurIcon} type="number" value={f.principal || ''} onChange={e => u('principal', parseFloat(e.target.value) || 0)} />
        <Field label={'\u{1F4B5} Current Value'} icon={CurIcon} type="number" value={f.currentValue || ''} onChange={e => u('currentValue', parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Field label={'\u{1F4CA} Interest %'} type="number" value={f.interestRate || ''} onChange={e => u('interestRate', parseFloat(e.target.value) || 0)} placeholder="%" />
        <Field label={'\u{1F4C5} Start Date'} type="date" value={f.startDate || ''} onChange={e => u('startDate', e.target.value)} />
        <Field label={'\u{1F4C5} Maturity Date'} type="date" value={f.maturityDate || ''} onChange={e => u('maturityDate', e.target.value)} />
      </div>
      <Field label={'\u{1F464} Nominee Name'} value={f.nominee || ''} onChange={e => u('nominee', e.target.value)} placeholder="Full name of nominee" />
      <Select label={'\u{1F4CC} Status'} value={f.status} onChange={e => u('status', e.target.value)}>
        <option value="active">{'\u{2705}'} Active</option>
        <option value="matured">{'\u{1F4C5}'} Matured</option>
        <option value="closed">{'\u{1F512}'} Closed / Redeemed</option>
      </Select>
      <Field label={'\u{1F4DD} Notes'} textarea value={f.notes || ''} onChange={e => u('notes', e.target.value)} placeholder="Any additional details..." />
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Button variant="success" full onClick={() => onSave(f)}>
          <Check size={16} /> {initial ? 'Update Investment' : 'Add Investment'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
}
