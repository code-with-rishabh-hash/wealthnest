import { Edit, Trash2 } from 'lucide-react';
import { getInvestmentInfo } from '@wealthnest/shared';
import type { Investment } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Badge } from '@/design-system/primitives';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';

interface InvestmentCardProps {
  investment: Investment;
  currency: string;
  cardStyle: React.CSSProperties;
  onEdit: () => void;
  onDelete: () => void;
}

export function InvestmentCard({ investment: inv, currency, cardStyle, onEdit, onDelete }: InvestmentCardProps) {
  const { T } = useTheme();
  const ti = getInvestmentInfo(inv.type);
  const d = inv.maturityDate ? daysUntil(inv.maturityDate) : null;

  return (
    <div
      style={{
        ...cardStyle,
        marginBottom: 12,
        borderColor: inv.status === 'closed' ? T.border : d !== null && d <= 30 && d >= 0 ? T.warning + '30' : T.border,
        opacity: inv.status === 'closed' ? 0.65 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18 }}>{ti.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{inv.name || ti.label}</span>
            <Badge color={ti.color}>{ti.label}</Badge>
            {inv.status === 'closed' && <Badge color={T.danger}>{'\u{1F512}'} Closed</Badge>}
            {inv.status === 'matured' && <Badge color={T.warning}>{'\u{1F4C5}'} Matured</Badge>}
            {d !== null && d <= 30 && d > 0 && inv.status === 'active' && <Badge color={T.warning}>{'\u{23F3}'} {d}d to maturity</Badge>}
            {d !== null && d <= 0 && inv.status === 'active' && <Badge color={T.danger}>{'\u{1F534}'} MATURED</Badge>}
          </div>
          <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
            {inv.institution && <span>{inv.institution} {'\u00B7'} </span>}
            {inv.accountNo && <span>A/C: {inv.accountNo} {'\u00B7'} </span>}
            {inv.interestRate > 0 && <span>{inv.interestRate}% {'\u00B7'} </span>}
            {inv.nominee && <span style={{ color: T.nominee }}>{'\u{1F464}'} {inv.nominee}</span>}
          </div>
          {inv.startDate && (
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 3 }}>
              {'\u{1F4C5}'} {formatDate(inv.startDate)}{inv.maturityDate ? ' \u2192 ' + formatDate(inv.maturityDate) : ''}
            </div>
          )}
          {inv.notes && <div style={{ fontSize: 11, color: T.textMut, marginTop: 3, fontStyle: 'italic' }}>{'\u{1F4DD}'} {inv.notes}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.success }}>{formatMoney(inv.currentValue || inv.principal, currency)}</div>
          {inv.currentValue && inv.principal && inv.currentValue !== inv.principal && (
            <div style={{ fontSize: 11, color: inv.currentValue > inv.principal ? T.success : T.danger, fontWeight: 500 }}>
              {inv.currentValue > inv.principal ? '\u{2B06}' : '\u{2B07}'} {inv.currentValue > inv.principal ? '+' : ''}{formatMoney(inv.currentValue - inv.principal, currency)} ({((inv.currentValue - inv.principal) / inv.principal * 100).toFixed(1)}%)
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
            <button onClick={onEdit} aria-label={`Edit ${inv.name}`} style={{ background: T.infoBg, borderRadius: 8, padding: 7, color: T.info, cursor: 'pointer', display: 'flex', border: 'none' }}>
              <Edit size={14} />
            </button>
            <button onClick={onDelete} aria-label={`Delete ${inv.name}`} style={{ background: T.dangerBg, borderRadius: 8, padding: 7, color: T.danger, cursor: 'pointer', display: 'flex', border: 'none' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
