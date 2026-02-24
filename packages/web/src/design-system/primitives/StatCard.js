import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../theme/ThemeContext';
export function StatCard({ label, value, sub, Icon, color, bg }) {
    const { T } = useTheme();
    return (_jsxs("div", { style: {
            background: bg || T.ghostBg,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: 20,
            boxShadow: T.cardShadow,
            transition: 'all 0.2s',
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 }, children: [_jsx("span", { style: {
                            fontSize: 11,
                            color: T.textSec,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }, children: label }), Icon && (_jsx("div", { style: {
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: color + '12',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, children: _jsx(Icon, { size: 16, color: color }) }))] }), _jsx("div", { style: { fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }, children: value }), sub && (_jsx("span", { style: { fontSize: 11, color: T.textMut, marginTop: 2, display: 'block' }, children: sub }))] }));
}
//# sourceMappingURL=StatCard.js.map