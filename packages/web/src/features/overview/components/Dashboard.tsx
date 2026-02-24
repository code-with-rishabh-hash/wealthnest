import { useMemo } from 'react';
import { TrendingUp, Wallet, ShieldCheck, FileText, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getInvestmentInfo, NOM_COLORS } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { StatCard, Badge, Button } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { formatMoney } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { T } = useTheme();
  const { data, currency } = useVault();
  const navigate = useNavigate();

  const invs = data.investments || [];
  const banks = data.bankAccounts || [];

  const totalPortfolio = useMemo(() => invs.filter(i => i.status !== 'closed').reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), [invs]);
  const totalBanks = useMemo(() => banks.reduce((s, b) => s + (b.balance || 0), 0), [banks]);

  const portfolioByType = useMemo(() => {
    const m: Record<string, number> = {};
    invs.filter(i => i.status !== 'closed').forEach(i => { m[i.type] = (m[i.type] || 0) + (i.currentValue || i.principal || 0); });
    return Object.entries(m).map(([type, val]) => ({ ...getInvestmentInfo(type), value: val })).sort((a, b) => b.value - a.value);
  }, [invs]);

  const portfolioByNominee = useMemo(() => {
    const m: Record<string, number> = {};
    invs.filter(i => i.status !== 'closed').forEach(i => { const n = i.nominee || 'Unassigned'; m[n] = (m[n] || 0) + (i.currentValue || i.principal || 0); });
    banks.forEach(b => { const n = b.nominee || 'Unassigned'; m[n] = (m[n] || 0) + (b.balance || 0); });
    return Object.entries(m).map(([name, val]) => ({ name, value: val })).sort((a, b) => b.value - a.value);
  }, [invs, banks]);

  const alerts = useMemo(() =>
    invs.filter(inv => inv.status !== 'closed' && inv.maturityDate && daysUntil(inv.maturityDate) >= -7 && daysUntil(inv.maturityDate) <= 30)
      .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate)),
    [invs],
  );

  const CRD: React.CSSProperties = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  const ChartTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.tipBg, border: `1px solid ${T.tipBd}`, borderRadius: 10, padding: '10px 14px', boxShadow: T.shadow }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.tipTxt, marginBottom: 4 }}>{payload[0]?.name}</p>
        {payload.map((p: any, i: number) => <p key={i} style={{ fontSize: 12, color: T.tipTxt }}>{formatMoney(p.value, currency)}</p>)}
      </div>
    );
  };

  return (
    <>
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label={'\u{1F4BC} Total Portfolio'} value={formatMoney(totalPortfolio, currency)} Icon={TrendingUp} color={T.success} bg={T.successBg} />
        <StatCard label={'\u{1F3E6} Bank Balance'} value={formatMoney(totalBanks, currency)} Icon={Wallet} color={T.info} bg={T.infoBg} />
        <StatCard label={'\u{1F4B0} Total Wealth'} value={formatMoney(totalPortfolio + totalBanks, currency)} Icon={ShieldCheck} color={T.accent} bg={T.accentBg} />
        <StatCard label={'\u{1F4CA} Active Investments'} value={String(invs.filter(i => i.status !== 'closed').length)} sub={invs.filter(i => i.status === 'closed').length + ' closed'} Icon={FileText} color={T.warning} bg={T.warningBg} />
      </div>

      {alerts.length > 0 && (
        <div style={{ ...CRD, background: T.warningBg, borderColor: T.warning + '20', marginBottom: 18 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: T.warningTxt, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>{'\u{26A0}\u{FE0F}'} Investments Maturing Soon</h4>
          {alerts.slice(0, 5).map(inv => {
            const d = daysUntil(inv.maturityDate);
            return (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                <span style={{ color: T.text }}>{getInvestmentInfo(inv.type).icon} {inv.name} {inv.nominee && <span style={{ color: T.textMut }}>({inv.nominee})</span>}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: T.text, fontWeight: 500 }}>{formatMoney(inv.principal, currency)}</span>
                  <Badge color={d <= 0 ? T.danger : d <= 7 ? T.warning : T.info}>{d <= 0 ? 'MATURED' : d + ' days'}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: portfolioByType.length > 0 ? '1fr 1fr' : '1fr', gap: 16, marginBottom: 18 }}>
        {portfolioByType.length > 0 && (
          <div style={CRD}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>{'\u{1F4CA}'} Portfolio by Type</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={portfolioByType} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">{portfolioByType.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
              <Tooltip content={<ChartTooltip />} /></PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10 }}>
              {portfolioByType.map(c => (
                <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: T.textSec, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />{c.icon} {c.label}
                  </span>
                  <span style={{ color: T.text, fontWeight: 500 }}>{formatMoney(c.value, currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {portfolioByNominee.length > 0 && (
          <div style={CRD}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>{'\u{1F465}'} Wealth by Nominee</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={portfolioByNominee} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: T.chartLabel, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: T.cursor }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>{portfolioByNominee.map((_, i) => <Cell key={i} fill={NOM_COLORS[i % NOM_COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {invs.length === 0 && banks.length === 0 && (
        <div style={{ ...CRD, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F3E6}'}</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>Welcome to WealthNest</h3>
          <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 20px' }}>Start by adding your investments and bank accounts. Your data is encrypted with AES-256-GCM and never leaves your device.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/investments')}><Plus size={15} /> Add Investment</Button>
            <Button variant="outline" onClick={() => navigate('/banks')}><Plus size={15} /> Add Bank Account</Button>
          </div>
        </div>
      )}
    </>
  );
}
