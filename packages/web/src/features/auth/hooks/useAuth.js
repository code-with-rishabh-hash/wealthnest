import { useState, useEffect } from 'react';
import { MAX_ATTEMPTS } from '@wealthnest/shared';
import { CRY } from '@/lib/crypto/crypto';
import { storage, STORAGE_KEYS } from '@/lib/storage/storage';
const EMPTY_VAULT = {
    investments: [],
    bankAccounts: [],
    transactions: [],
    budgets: [],
    nominees: [],
};
export function useAuth(onUnlock) {
    const [state, setState] = useState({
        mode: 'detect',
        password: '',
        password2: '',
        showPassword: false,
        error: '',
        busy: false,
        currency: '₹',
        attempts: 0,
        wiped: false,
        confirmReset: false,
    });
    const update = (key, value) => setState(prev => ({ ...prev, [key]: value }));
    const clearError = () => update('error', '');
    useEffect(() => {
        if (!window.isSecureContext) {
            update('error', 'Warning: This page is not served over HTTPS. Encryption requires a secure context.');
        }
        (async () => {
            const att = await storage.get(STORAGE_KEYS.ATTEMPTS);
            if (att && att >= MAX_ATTEMPTS) {
                await storage.del(STORAGE_KEYS.HASH);
                await storage.del(STORAGE_KEYS.DATA);
                await storage.del(STORAGE_KEYS.ATTEMPTS);
                setState(prev => ({ ...prev, wiped: true, mode: 'setup' }));
                return;
            }
            if (att)
                update('attempts', att);
            const hash = await storage.get(STORAGE_KEYS.HASH);
            update('mode', hash ? 'login' : 'setup');
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const doSetup = async () => {
        if (state.password.length < 8) {
            update('error', 'Minimum 8 characters required');
            return;
        }
        if (state.password !== state.password2) {
            update('error', "Passwords don't match");
            return;
        }
        update('busy', true);
        clearError();
        try {
            const empty = {
                ...EMPTY_VAULT,
                currency: state.currency,
                createdAt: Date.now(),
            };
            await storage.set(STORAGE_KEYS.HASH, await CRY.hash(state.password));
            await storage.set(STORAGE_KEYS.DATA, await CRY.encrypt(empty, state.password));
            await storage.set(STORAGE_KEYS.ATTEMPTS, 0);
            onUnlock(empty, state.password);
        }
        catch (e) {
            update('error', 'Setup failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
        }
        update('busy', false);
    };
    const doLogin = async () => {
        if (state.attempts >= MAX_ATTEMPTS) {
            update('error', 'Too many attempts. All data has been wiped for security.');
            return;
        }
        update('busy', true);
        clearError();
        try {
            const stored = await storage.get(STORAGE_KEYS.HASH);
            if ((await CRY.hash(state.password)) !== stored) {
                const newAtt = state.attempts + 1;
                setState(prev => ({ ...prev, attempts: newAtt }));
                await storage.set(STORAGE_KEYS.ATTEMPTS, newAtt);
                if (newAtt >= MAX_ATTEMPTS) {
                    await storage.del(STORAGE_KEYS.HASH);
                    await storage.del(STORAGE_KEYS.DATA);
                    await storage.del(STORAGE_KEYS.ATTEMPTS);
                    setState(prev => ({
                        ...prev,
                        error: '\u{1F6A8} SECURITY WIPE: ' + MAX_ATTEMPTS + ' failed attempts. All data destroyed.',
                        wiped: true,
                        mode: 'setup',
                    }));
                }
                else {
                    const remaining = MAX_ATTEMPTS - newAtt;
                    update('error', '\u{1F512} Wrong password. ' + remaining + ' attempt' + (remaining !== 1 ? 's' : '') + ' remaining before data wipe.');
                }
                update('busy', false);
                return;
            }
            const enc = await storage.get(STORAGE_KEYS.DATA);
            if (!enc) {
                update('error', 'No encrypted data found. Vault may have been reset.');
                update('busy', false);
                return;
            }
            try {
                const data = await CRY.decrypt(enc, state.password);
                await storage.set(STORAGE_KEYS.ATTEMPTS, 0);
                onUnlock(data, state.password);
            }
            catch (e) {
                if (e instanceof Error && e.message === 'TAMPER_DETECTED') {
                    await storage.del(STORAGE_KEYS.HASH);
                    await storage.del(STORAGE_KEYS.DATA);
                    await storage.del(STORAGE_KEYS.ATTEMPTS);
                    setState(prev => ({
                        ...prev,
                        error: '\u{1F6A8} TAMPER DETECTED: Data integrity check failed. Vault wiped for security.',
                        wiped: true,
                        mode: 'setup',
                    }));
                }
                else {
                    throw e;
                }
            }
        }
        catch (e) {
            if (!state.wiped)
                update('error', 'Decryption failed. Please try again.');
        }
        update('busy', false);
    };
    const doReset = async () => {
        await storage.del(STORAGE_KEYS.HASH);
        await storage.del(STORAGE_KEYS.DATA);
        await storage.del(STORAGE_KEYS.ATTEMPTS);
        setState({
            mode: 'setup',
            password: '',
            password2: '',
            showPassword: false,
            error: '',
            busy: false,
            currency: '₹',
            attempts: 0,
            wiped: false,
            confirmReset: false,
        });
    };
    const passwordStrength = (() => {
        const pw = state.password;
        if (pw.length >= 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw))
            return 4;
        if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw))
            return 3;
        if (pw.length >= 8)
            return 2;
        if (pw.length >= 4)
            return 1;
        return 0;
    })();
    return {
        state,
        update,
        clearError,
        doSetup,
        doLogin,
        doReset,
        passwordStrength,
    };
}
//# sourceMappingURL=useAuth.js.map