import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../theme/ThemeContext';
export function Select({ label, value, onChange, children, style: sx, 'aria-label': ariaLabel, }) {
    const { T } = useTheme();
    return (_jsxs("div", { style: { marginBottom: 14 }, children: [label && (_jsx("label", { style: {
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textSec,
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }, children: label })), _jsx("select", { value: value, onChange: onChange, "aria-label": ariaLabel || label, style: {
                    width: '100%',
                    padding: '10px 12px',
                    background: T.inputBg,
                    border: `1px solid ${T.inputBd}`,
                    borderRadius: 9,
                    color: T.inputTxt,
                    fontSize: 13,
                    outline: 'none',
                    ...sx,
                }, children: children })] }));
}
//# sourceMappingURL=Select.js.map