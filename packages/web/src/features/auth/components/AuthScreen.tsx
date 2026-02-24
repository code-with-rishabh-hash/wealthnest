import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, Sun, Moon, Fingerprint } from 'lucide-react';
import { CURRENCIES, MAX_ATTEMPTS } from '@wealthnest/shared';
import type { VaultData, Currency } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { getCSS } from '@/design-system/theme/css-generator';
import { Button, Field, ConfirmDialog } from '@/design-system/primitives';
import { Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrength } from './PasswordStrength';

interface AuthScreenProps {
  onUnlock: (data: VaultData, password: string) => void;
}

export function AuthScreen({ onUnlock }: AuthScreenProps) {
  const { T, toggleTheme } = useTheme();
  const { state, update, clearError, doSetup, doLogin, doReset, passwordStrength } = useAuth(onUnlock);

  if (state.mode === 'detect') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: T.bg, flexDirection: 'column', gap: 12 }}>
        <style>{getCSS(T)}</style>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s infinite' }}>
          <Shield size={20} color={T.accent} />
        </div>
        <p style={{ color: T.textMut, fontSize: 13 }}>Opening WealthNest...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bgGrad, padding: 20 }}>
      <style>{getCSS(T)}</style>

      <button onClick={toggleTheme} aria-label="Toggle theme" style={{ position: 'fixed', top: 16, right: 16, zIndex: 100, cursor: 'pointer', padding: 10, borderRadius: 12, background: T.ghostBg, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
        {T.isDark ? <Sun size={18} color={T.textSec} /> : <Moon size={18} color={T.textSec} />}
      </button>

      <div style={{ width: '100%', maxWidth: 420, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: '40px 32px', boxShadow: T.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 18px', background: `linear-gradient(135deg,${T.gradStart},${T.gradEnd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.accentBd}` }}>
            <ShieldCheck size={34} color={T.accent} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>WealthNest</h1>
          <p style={{ fontSize: 13, color: T.textSec, marginTop: 6 }}>
            {state.mode === 'setup' ? '\u{1F512} Create your family\u2019s secure vault' : '\u{1F513} Unlock your family vault'}
          </p>
          <p style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>Private & Encrypted Family Wealth Manager</p>
        </div>

        {state.wiped && (
          <div style={{ padding: '12px 14px', background: T.dangerBg, borderRadius: 12, marginBottom: 16, fontSize: 12, color: T.dangerTxt, display: 'flex', alignItems: 'flex-start', gap: 8, border: `1px solid ${T.danger}20` }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Previous vault data was wiped due to security policy. Create a new vault below.</span>
          </div>
        )}

        {state.mode === 'setup' && (
          <div style={{ marginBottom: 18, padding: '14px 16px', borderRadius: 12, background: T.accentBg, border: `1px solid ${T.accentBd}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Fingerprint size={18} color={T.accent} style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6 }}>
              <strong style={{ color: T.accent }}>AES-256-GCM</strong> encryption with <strong style={{ color: T.accent }}>PBKDF2 600K</strong> iterations. Data integrity verified on every unlock. Auto-wipe after {MAX_ATTEMPTS} failed attempts.
            </p>
          </div>
        )}

        {state.mode === 'login' && state.attempts > 0 && (
          <div style={{ padding: '10px 14px', background: T.warningBg, borderRadius: 12, marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${T.warning}20` }}>
            <AlertTriangle size={16} color={T.warning} />
            <span style={{ fontSize: 12, color: T.warningTxt, fontWeight: 500 }}>{'\u26A0'} Failed attempts: {state.attempts}/{MAX_ATTEMPTS}</span>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <Field
            label={'\u{1F511} Master Password'}
            icon={Lock}
            type={state.showPassword ? 'text' : 'password'}
            placeholder="Enter master password"
            value={state.password}
            onChange={e => { update('password', e.target.value); clearError(); }}
            onKeyDown={e => e.key === 'Enter' && (state.mode === 'login' ? doLogin() : null)}
          />
          <button
            onClick={() => update('showPassword', !state.showPassword)}
            aria-label={state.showPassword ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 12, top: 30, padding: 4, cursor: 'pointer', color: T.textMut, background: 'none', border: 'none' }}
          >
            {state.showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {state.mode === 'setup' && (
          <>
            <Field
              label={'\u{1F510} Confirm Password'}
              icon={Lock}
              type="password"
              placeholder="Re-enter password"
              value={state.password2}
              onChange={e => { update('password2', e.target.value); clearError(); }}
              onKeyDown={e => e.key === 'Enter' && doSetup()}
            />
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {'\u{1F4B1}'} Currency
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    onClick={() => update('currency', c)}
                    aria-label={`Select currency ${c}`}
                    aria-pressed={c === state.currency}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: c === state.currency ? T.accentBg : T.ghostBg,
                      border: c === state.currency ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                      color: c === state.currency ? T.accent : T.textMut,
                      transition: 'all 0.15s',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {state.error && (
          <div style={{ padding: '10px 14px', background: T.dangerBg, borderRadius: 12, marginBottom: 14, display: 'flex', gap: 8, alignItems: 'flex-start', border: `1px solid ${T.danger}20` }} role="alert">
            <AlertTriangle size={15} color={T.danger} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: T.dangerTxt, lineHeight: 1.5 }}>{state.error}</span>
          </div>
        )}

        <Button variant="success" size="lg" full onClick={state.mode === 'setup' ? doSetup : doLogin} disabled={state.busy}>
          {state.busy ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'pulse 0.8s linear infinite' }} />
              Encrypting...
            </span>
          ) : state.mode === 'setup' ? (
            <><ShieldCheck size={18} /> Create Family Vault</>
          ) : (
            <><Lock size={18} /> Unlock Vault</>
          )}
        </Button>

        {state.mode === 'setup' && state.password.length > 0 && (
          <PasswordStrength strength={passwordStrength} />
        )}

        {state.mode === 'login' && (
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => update('confirmReset', true)}
              style={{ fontSize: 11, color: T.danger, cursor: 'pointer', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3, background: 'none', border: 'none' }}
            >
              {'\u{1F5D1}'} Reset vault
            </button>
          </p>
        )}
      </div>

      <ConfirmDialog
        open={state.confirmReset}
        title="Reset Vault?"
        message="This will PERMANENTLY DELETE all encrypted data, including investments, bank accounts, and transaction history. This action cannot be undone."
        confirmText="Delete Everything"
        cancelText="Keep Data"
        variant="danger"
        onConfirm={doReset}
        onCancel={() => update('confirmReset', false)}
      />
    </div>
  );
}
