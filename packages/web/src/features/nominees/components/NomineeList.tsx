import { useMemo } from 'react';
import { getInvestmentInfo, NOM_COLORS } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Badge } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';

export function NomineeList() {
  const { T } = useTheme();
  const { data, currency } = useVault();
  const invs = data.investments || [];
  const banks = data.bankAccounts || [];

  const nominees = useMemo(() => {
    const set = new Set<string>();
    invs.forEach(i => { if (i.nominee) set.add(i.nominee); });
    banks.forEach(b => { if (b.nominee) set.add(b.nominee); });
    return [...set].sort();
  }, [invs, banks]);

  const CRD: React.CSSProperties = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  if (nominees.length === 0) {
    return (
      <div style={{ ...CRD, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F465}'}</div>
        <p style={{ color: T.textSec, fontSize: 13 }}>No nominees found. Add nominees when creating investments or bank accounts.</p>
      </div>
    );
  }

  return (
    <>
      {nominees.map((nom, ni) => {
        const nInvs = invs.filter(i => i.nominee === nom && i.status !== 'closed');
        const nBanks = banks.filter(b => b.nominee === nom);
        const total = nInvs.reduce((s, i) => s + (i.currentValue || i.principal || 0), 0) + nBanks.reduce((s, b) => s + (b.balance || 0), 0);
        const nc = NOM_COLORS[ni % NOM_COLORS.length];
        return (
          <div key={nom} style={{ ...CRD, marginBottom: 14, borderColor: nc + '30' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: nc + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: nc }}>{nom[0]}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{nom}</div>
                  <div style={{ fontSize: 12, color: T.textSec }}>{nInvs.length} investment{nInvs.length !== 1 ? 's' : ''} {'\u00B7'} {nBanks.length} bank account{nBanks.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: nc }}>{formatMoney(total, currency)}</div>
            </div>
            {nInvs.map(inv => (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${T.border}`, fontSize: 12 }}>
                <span style={{ color: T.textSoft }}>{getInvestmentInfo(inv.type).icon} {inv.name || getInvestmentInfo(inv.type).label} <span style={{ color: T.textMut }}>({inv.institution})</span></span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: T.text, fontWeight: 500 }}>{formatMoney(inv.currentValue || inv.principal, currency)}</span>
                  {inv.maturityDate && <Badge color={daysUntil(inv.maturityDate) <= 30 ? T.warning : T.textMut}>{formatDate(inv.maturityDate)}</Badge>}
                </div>
              </div>
            ))}
            {nBanks.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${T.border}`, fontSize: 12 }}>
                <span style={{ color: T.textSoft }}>{'\u{1F3E6}'} {b.bankName} ({b.type})</span>
                <span style={{ color: T.text, fontWeight: 500 }}>{formatMoney(b.balance, currency)}</span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
