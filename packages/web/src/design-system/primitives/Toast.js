import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
export function ToastContainer({ toasts }) {
    const { T } = useTheme();
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { "aria-live": "polite", "aria-atomic": "false", style: {
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxWidth: 380,
            width: 'calc(100% - 32px)',
            pointerEvents: 'none',
        }, children: toasts.map(t => {
            const styles = {
                success: { bg: T.isDark ? 'rgba(22,163,74,0.15)' : 'rgba(22,163,74,0.08)', bd: T.success + '30', color: T.success, Ic: CheckCircle },
                error: { bg: T.isDark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.08)', bd: T.danger + '30', color: T.danger, Ic: XCircle },
                warning: { bg: T.isDark ? 'rgba(217,119,6,0.15)' : 'rgba(217,119,6,0.08)', bd: T.warning + '30', color: T.warning, Ic: AlertTriangle },
                info: { bg: T.isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', bd: T.info + '30', color: T.info, Ic: Info },
            };
            const s = styles[t.type] || styles.success;
            return (_jsxs("div", { role: "status", style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: T.surface,
                    border: `1px solid ${s.bd}`,
                    boxShadow: T.shadow,
                    animation: 'toastIn 0.3s ease',
                    pointerEvents: 'auto',
                }, children: [_jsx(s.Ic, { size: 20, color: s.color, style: { flexShrink: 0 } }), _jsx("span", { style: { fontSize: 13, fontWeight: 500, color: T.text, lineHeight: 1.4 }, children: t.msg })] }, t.id));
        }) }));
}
//# sourceMappingURL=Toast.js.map