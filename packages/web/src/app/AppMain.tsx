import { useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Sun, Moon, Download, Upload, LogOut, X, Shield, TrendingUp, Wallet, Users, Calendar, PiggyBank, Settings, ShieldCheck } from 'lucide-react';
import { getInvestmentInfo } from '@wealthnest/shared';
import type { VaultData } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { getCSS } from '@/design-system/theme/css-generator';
import { Button, Badge, ConfirmDialog, ToastContainer } from '@/design-system/primitives';
import { VaultContext, useVaultState } from '@/hooks/useVaultData';
import { ToastContext, useToastState } from '@/hooks/useToast';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { formatMoney } from '@/lib/utils/format';
import { daysUntil } from '@/lib/utils/date';
import { CRY } from '@/lib/crypto/crypto';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy-loaded routes
import { Dashboard } from '@/features/overview/components/Dashboard';
import { InvestmentList } from '@/features/investments/components/InvestmentList';
import { BankAccountList } from '@/features/bank-accounts/components/BankAccountList';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { NomineeList } from '@/features/nominees/components/NomineeList';
import { MaturityCalendar } from '@/features/maturity/components/MaturityCalendar';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';

interface AppMainProps {
  initialData: VaultData;
  password: string;
  onLogout: () => void;
}

const TABS = [
  { path: '/dashboard', label: 'Overview', Ic: Shield, emoji: '\u{1F3E0}' },
  { path: '/investments', label: 'Investments', Ic: TrendingUp, emoji: '\u{1F4C8}' },
  { path: '/banks', label: 'Bank Accounts', Ic: Wallet, emoji: '\u{1F3E6}' },
  { path: '/nominees', label: 'By Nominee', Ic: Users, emoji: '\u{1F465}' },
  { path: '/maturity', label: 'Maturity', Ic: Calendar, emoji: '\u{1F4C5}' },
  { path: '/transactions', label: 'Expenses', Ic: PiggyBank, emoji: '\u{1F4B8}' },
  { path: '/settings', label: 'Settings', Ic: Settings, emoji: '\u{2699}' },
];

export function AppMain({ initialData, password, onLogout }: AppMainProps) {
  const { T, toggleTheme } = useTheme();
  const toastState = useToastState();
  const vaultState = useVaultState(initialData, password, toastState.toast);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);

  useSessionTimeout(onLogout);

  const alerts = useMemo(() =>
    (vaultState.data.investments || [])
      .filter(inv => inv.status !== 'closed' && inv.maturityDate && daysUntil(inv.maturityDate) >= -7 && daysUntil(inv.maturityDate) <= 30)
      .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate)),
    [vaultState.data.investments],
  );

  const doExport = async () => {
    const enc = await CRY.encrypt(vaultState.data, password);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(enc)], { type: 'application/json' }));
    a.download = 'wealthnest-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    toastState.toast('\u{1F4BE} Encrypted backup downloaded', 'success');
  };

  const doImport = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json';
    inp.onchange = async (e: Event) => {
      try {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const dec = await CRY.decrypt(JSON.parse(await file.text()), password);
        toastState.askConfirm(
          'Import Backup',
          'This will merge imported data with your existing vault. Duplicate records will be skipped. Continue?',
          async () => {
            const merged = { ...vaultState.data } as any;
            const imported = dec as any;
            const eIds = new Set((merged.investments || []).map((i: any) => i.id));
            (imported.investments || []).forEach((i: any) => { if (!eIds.has(i.id)) merged.investments.push(i); });
            const bIds = new Set((merged.bankAccounts || []).map((b: any) => b.id));
            (imported.bankAccounts || []).forEach((b: any) => { if (!bIds.has(b.id)) merged.bankAccounts.push(b); });
            const tIds = new Set((merged.transactions || []).map((t: any) => t.id));
            (imported.transactions || []).forEach((t: any) => { if (!tIds.has(t.id)) merged.transactions.push(t); });
            vaultState.save(merged);
            toastState.toast('\u{2705} Import successful! Data merged.', 'success');
          },
          'info',
          'Import Data',
          'Cancel',
        );
      } catch {
        toastState.toast('\u{274C} Import failed. Wrong password or invalid file.', 'error');
      }
    };
    inp.click();
  };

  return (
    <ToastContext.Provider value={toastState}>
      <VaultContext.Provider value={vaultState}>
        <div style={{ minHeight: '100vh', background: T.bg, transition: 'background 0.3s' }}>
          <style>{getCSS(T)}</style>

          {/* Header */}
          <header style={{ position: 'sticky', top: 0, zIndex: 100, background: T.headerBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={17} color={T.accent} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>WealthNest</span>
              {vaultState.saving && <Badge color={T.warning}>{'\u23F3'} Saving...</Badge>}
              {vaultState.saved && !vaultState.saving && <Badge color={T.success}>{'\u2705'} Encrypted</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setShowAlerts(!showAlerts)} aria-label={`Maturity alerts (${alerts.length})`} style={{ position: 'relative', cursor: 'pointer', padding: 8, borderRadius: 10, background: alerts.length > 0 ? T.warningBg : 'transparent', border: 'none' }}>
                <Bell size={17} color={alerts.length > 0 ? T.warning : T.textMut} />
                {alerts.length > 0 && <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />}
              </button>
              <button onClick={toggleTheme} aria-label="Toggle theme" style={{ cursor: 'pointer', padding: 8, borderRadius: 10, background: T.ghostBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                {T.isDark ? <Sun size={17} color={T.textSec} /> : <Moon size={17} color={T.textSec} />}
              </button>
              <Button variant="ghost" size="sm" onClick={doExport} aria-label="Export backup"><Download size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={doImport} aria-label="Import backup"><Upload size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={onLogout} style={{ borderColor: T.danger + '30' }} aria-label="Logout"><LogOut size={14} color={T.danger} /></Button>
            </div>
          </header>

          {/* Maturity Alerts Dropdown */}
          {showAlerts && alerts.length > 0 && (
            <div style={{ background: T.warningBg, borderBottom: `1px solid ${T.warning}20`, padding: '14px 16px', animation: 'slideDown 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.warningTxt }}>{'\u{1F514}'} Upcoming Maturities ({alerts.length})</span>
                <button onClick={() => setShowAlerts(false)} aria-label="Close alerts" style={{ cursor: 'pointer', color: T.textMut, padding: 4, background: 'none', border: 'none' }}><X size={16} /></button>
              </div>
              {alerts.map(inv => {
                const d = daysUntil(inv.maturityDate);
                const urgency = d <= 0 ? T.danger : d <= 7 ? T.warning : T.info;
                return (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{inv.name}</span>
                      {inv.nominee && <span style={{ fontSize: 11, color: T.textMut, marginLeft: 8 }}>Nominee: {inv.nominee}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{formatMoney(inv.principal, vaultState.currency)}</span>
                      <Badge color={urgency}>{d <= 0 ? 'MATURED' : d + 'd left'}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: 2, padding: '10px 16px', borderBottom: `1px solid ${T.border}`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} role="tablist">
            {TABS.map(t => {
              const isActive = location.pathname === t.path;
              return (
                <button
                  key={t.path}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => navigate(t.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10,
                    fontSize: 12, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                    background: isActive ? T.accentBg : 'transparent',
                    color: isActive ? T.accent : T.textSec,
                    whiteSpace: 'nowrap', transition: 'all 0.15s', minHeight: 38,
                    border: isActive ? `1px solid ${T.accentBd}` : '1px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{t.emoji}</span> {t.label}
                  {t.path === '/maturity' && alerts.length > 0 && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, marginLeft: 2 }}>{alerts.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 16px 60px' }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investments" element={<InvestmentList />} />
                <Route path="/banks" element={<BankAccountList />} />
                <Route path="/nominees" element={<NomineeList />} />
                <Route path="/maturity" element={<MaturityCalendar />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/settings" element={<SettingsPanel onLogout={onLogout} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>

          <ConfirmDialog
            open={!!toastState.confirmDlg}
            title={toastState.confirmDlg?.title}
            message={toastState.confirmDlg?.message}
            confirmText={toastState.confirmDlg?.confirmText}
            cancelText={toastState.confirmDlg?.cancelText}
            variant={toastState.confirmDlg?.variant}
            onConfirm={toastState.handleConfirm}
            onCancel={toastState.dismissConfirm}
          />
          <ToastContainer toasts={toastState.toasts} />
        </div>
      </VaultContext.Provider>
    </ToastContext.Provider>
  );
}
