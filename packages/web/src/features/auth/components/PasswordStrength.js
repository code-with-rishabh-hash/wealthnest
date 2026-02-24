import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '@/design-system/theme/ThemeContext';
const LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const COLORS = ['', '#ef4444', '#f59e0b', '#22c55e', '#10b981'];
export function PasswordStrength({ strength }) {
    const { T } = useTheme();
    return (_jsxs("div", { style: { marginTop: 14 }, children: [_jsx("div", { style: { display: 'flex', gap: 4 }, role: "meter", "aria-valuenow": strength, "aria-valuemin": 0, "aria-valuemax": 4, "aria-label": "Password strength", children: [1, 2, 3, 4].map(i => (_jsx("div", { style: {
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: i <= strength ? COLORS[strength] : T.ghostBg,
                        transition: 'background 0.3s',
                    } }, i))) }), _jsx("p", { style: { fontSize: 11, color: COLORS[strength] || T.textMut, marginTop: 4, fontWeight: 500 }, children: LABELS[strength] }), strength > 0 && strength < 3 && (_jsx("p", { style: { fontSize: 10, color: T.textMut, marginTop: 2 }, children: "Tip: Use 12+ characters with uppercase, numbers & symbols for maximum security" }))] }));
}
//# sourceMappingURL=PasswordStrength.js.map