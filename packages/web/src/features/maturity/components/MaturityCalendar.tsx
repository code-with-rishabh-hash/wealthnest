import { getInvestmentInfo } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Badge } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';

function Section({ title, items, color, emoji, currency, T, CRD }: {
  title: string; items: any[]; color: string; emoji: string; currency: string; T: any; CRD: React.CSSProperties;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        {emoji} {title} <span style={{ fontSize: 12, fontWeight: 400, color: T.textSec }}>({items.length})</span>
      </h4>
      {items.map((inv: any) => {
        const d = daysUntil(inv.maturityDate);
        return (
          <div key={inv.id} style={{ ...CRD, padding: '14px 18px', marginBottom: 8, borderColor: color + '25' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{getInvestmentInfo(inv.type).icon} {inv.name}</span>
                <div style={{ fontSize: 12, color: T.textSec, marginTop: 3 }}>
                  {inv.institution} {inv.nominee && <span>{'\u00B7'} <span style={{ color: T.nominee }}>{'\u{1F464}'} {inv.nominee}</span></span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.success }}>{formatMoney(inv.principal, currency)}</div>
                <div style={{ fontSize: 11, color, fontWeight: 500, marginTop: 2 }}>
                  {'\u{1F4C5}'} {formatDate(inv.maturityDate)} {d >= 0 ? '(' + d + 'd)' : '(' + Math.abs(d) + 'd overdue)'}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MaturityCalendar() {
  const { T } = useTheme();
  const { data, currency } = useVault();
  const invs = data.investments || [];

  const CRD: React.CSSProperties = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  const activeInvs = invs
    .filter(i => i.maturityDate && i.status !== 'closed')
    .sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime());

  const past = activeInvs.filter(i => daysUntil(i.maturityDate) < 0);
  const soon = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d >= 0 && d <= 30; });
  const upcoming = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d > 30 && d <= 90; });
  const later = activeInvs.filter(i => daysUntil(i.maturityDate) > 90);

  if (activeInvs.length === 0) {
    return (
      <div style={{ ...CRD, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F4C5}'}</div>
        <p style={{ color: T.textSec, fontSize: 13 }}>No investments with maturity dates.</p>
      </div>
    );
  }

  return (
    <>
      <Section title="Overdue / Already Matured" items={past} color={T.danger} emoji={'\u{1F534}'} currency={currency} T={T} CRD={CRD} />
      <Section title="Maturing Within 30 Days" items={soon} color={T.warning} emoji={'\u{1F7E0}'} currency={currency} T={T} CRD={CRD} />
      <Section title="Maturing in 1\u20133 Months" items={upcoming} color={T.info} emoji={'\u{1F535}'} currency={currency} T={T} CRD={CRD} />
      <Section title="Maturing Later" items={later} color={T.success} emoji={'\u{1F7E2}'} currency={currency} T={T} CRD={CRD} />
    </>
  );
}
