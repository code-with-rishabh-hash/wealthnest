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
  const CRD: React.CSSProperties = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  const cm = toMonthKey(new Date());
  const mt = txns.filter(t => toMonthKey(t.date) === cm);
  const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp2 = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <Button onClick={() => setModal(true)} style={{ marginBottom: 16 }}><Plus size={15} /> Add Transaction</Button>
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 16 }}>
        <StatCard label={'\u{1F4B0} Month Income'} value={formatMoney(inc, currency)} color={T.success} bg={T.successBg} />
        <StatCard label={'\u{1F4B8} Month Expenses'} value={formatMoney(exp2, currency)} color={T.danger} bg={T.dangerBg} />
        <StatCard label={'\u{1F4CA} Net'} value={formatMoney(inc - exp2, currency)} color={inc - exp2 >= 0 ? T.success : T.danger} bg={inc - exp2 >= 0 ? T.successBg : T.dangerBg} />
      </div>
      <div style={CRD}>
        {txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{'\u{1F4B8}'}</div>
            <p style={{ color: T.textSec, fontSize: 13 }}>No transactions yet. Start tracking your income and expenses.</p>
          </div>
        ) : txns.slice(0, 30).map(tx => {
          const c = getCategoryInfo(tx.category, tx.type);
          return (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.tagBg(c.color), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: T.textMut }}>{tx.note ? tx.note + ' \u00B7 ' : ''}{tx.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: tx.type === 'income' ? T.success : T.danger }}>
                  {tx.type === 'income' ? '+' : '\u2212'}{formatMoney(tx.amount, currency)}
                </span>
                <button onClick={() => deleteTransaction(tx.id)} aria-label="Delete transaction" style={{ background: T.dangerBg, borderRadius: 7, padding: 5, color: T.danger, cursor: 'pointer', display: 'flex', border: 'none' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Transaction" icon={Plus} iconColor={T.success}>
        <TransactionForm onSave={tx => { addTransaction(tx as any); setModal(false); }} onCancel={() => setModal(false)} />
      </Modal>
    </>
  );
}
