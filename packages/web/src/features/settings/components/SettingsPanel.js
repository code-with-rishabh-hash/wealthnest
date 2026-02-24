import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Download, Upload, Trash2, ShieldCheck } from 'lucide-react';
import { MAX_ATTEMPTS } from '@wealthnest/shared';
import { useTheme } from '@/design-system/theme/ThemeContext';
import { Button } from '@/design-system/primitives';
import { useVault } from '@/hooks/useVaultData';
import { useToast } from '@/hooks/useToast';
import { CRY } from '@/lib/crypto/crypto';
import { storage, STORAGE_KEYS } from '@/lib/storage/storage';
export function SettingsPanel({ onLogout }) {
    const { T } = useTheme();
    const { data, password, currency, save } = useVault();
    const { toast, askConfirm } = useToast();
    const invs = data.investments || [];
    const banks = data.bankAccounts || [];
    const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };
    const doExport = async () => {
        const enc = await CRY.encrypt(data, password);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(enc)], { type: 'application/json' }));
        a.download = 'wealthnest-backup-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        toast('\u{1F4BE} Encrypted backup downloaded', 'success');
    };
    const doImport = () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = '.json';
        inp.onchange = async (e) => {
            try {
                const file = e.target.files?.[0];
                if (!file)
                    return;
                const dec = await CRY.decrypt(JSON.parse(await file.text()), password);
                askConfirm('Import Backup', 'This will merge imported data with your existing vault. Duplicate records will be skipped. Continue?', async () => {
                    const merged = { ...data };
                    const imported = dec;
                    const eIds = new Set((merged.investments || []).map((i) => i.id));
                    (imported.investments || []).forEach((i) => { if (!eIds.has(i.id))
                        merged.investments.push(i); });
                    const bIds = new Set((merged.bankAccounts || []).map((b) => b.id));
                    (imported.bankAccounts || []).forEach((b) => { if (!bIds.has(b.id))
                        merged.bankAccounts.push(b); });
                    const tIds = new Set((merged.transactions || []).map((t) => t.id));
                    (imported.transactions || []).forEach((t) => { if (!tIds.has(t.id))
                        merged.transactions.push(t); });
                    save(merged);
                    toast('\u{2705} Import successful! Data merged.', 'success');
                }, 'info', 'Import Data', 'Cancel');
            }
            catch {
                toast('\u{274C} Import failed. Wrong password or invalid file.', 'error');
            }
        };
        inp.click();
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { style: CRD, children: [_jsxs("h4", { style: { fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }, children: ['\u{1F512}', " Security Overview"] }), [
                        ['\u{1F510} Encryption', 'AES-256-GCM', T.success],
                        ['\u{1F511} Key Derivation', 'PBKDF2 (600K iterations)', T.success],
                        ['\u{1F6E1} Integrity Check', 'SHA-256 on every unlock', T.success],
                        ['\u{1F4A3} Auto-Wipe', MAX_ATTEMPTS + ' failed attempts', T.warning],
                        ['\u{23F1} Session Timeout', '15 min inactivity', T.warning],
                        ['\u{1F4B1} Currency', currency, T.text],
                        ['\u{1F4BC} Investments', String(invs.length), T.text],
                        ['\u{1F3E6} Bank Accounts', String(banks.length), T.text],
                    ].map(([k, v, c]) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, borderBottom: `1px solid ${T.border}` }, children: [_jsx("span", { style: { color: T.textSec }, children: k }), _jsx("span", { style: { color: c, fontWeight: 500 }, children: v })] }, k)))] }), _jsxs("div", { style: { ...CRD, marginTop: 16, background: T.accentBg, borderColor: T.accentBd, display: 'flex', gap: 12, alignItems: 'flex-start' }, children: [_jsx(ShieldCheck, { size: 20, color: T.accent, style: { marginTop: 2, flexShrink: 0 } }), _jsxs("div", { style: { fontSize: 12, color: T.textSec, lineHeight: 1.7 }, children: [_jsxs("strong", { style: { color: T.accent }, children: ['\u{1F6E1}', " Zero-Knowledge Architecture:"] }), " Your master password is never stored. Data integrity is verified with SHA-256 on every unlock. Any modification to encrypted data triggers automatic wipe. ", MAX_ATTEMPTS, " wrong passwords permanently wipes everything. Session auto-locks after 15 minutes of inactivity."] })] }), _jsxs("div", { style: { display: 'flex', gap: 10, marginTop: 16 }, children: [_jsxs(Button, { variant: "outline", full: true, onClick: doExport, children: [_jsx(Download, { size: 16 }), " ", '\u{1F4BE}', " Export Backup"] }), _jsxs(Button, { variant: "outline", full: true, onClick: doImport, children: [_jsx(Upload, { size: 16 }), " ", '\u{1F4E5}', " Import Backup"] })] }), _jsxs(Button, { variant: "danger", full: true, onClick: () => askConfirm('Emergency Wipe', 'This will PERMANENTLY DELETE all encrypted data including investments, bank accounts, and transaction history. This action cannot be undone.', async () => {
                    await storage.del(STORAGE_KEYS.HASH);
                    await storage.del(STORAGE_KEYS.DATA);
                    await storage.del(STORAGE_KEYS.ATTEMPTS);
                    onLogout();
                }, 'danger', '\u{1F4A3} Wipe All Data', 'Keep Data'), style: { marginTop: 12 }, children: [_jsx(Trash2, { size: 16 }), " ", '\u{1F4A3}', " Emergency Wipe"] })] }));
}
//# sourceMappingURL=SettingsPanel.js.map