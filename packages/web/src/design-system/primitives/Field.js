import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../theme/ThemeContext';
export function Field({ label, icon: Icon, textarea, 'aria-label': ariaLabel, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy, ...props }) {
    const { T } = useTheme();
    const El = textarea ? 'textarea' : 'input';
    return (_jsxs("div", { style: { marginBottom: 14 }, children: [label && (_jsx("label", { style: {
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textSec,
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }, children: label })), _jsxs("div", { style: { position: 'relative' }, children: [Icon && !textarea && (_jsx(Icon, { size: 15, style: {
                            position: 'absolute',
                            left: 11,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: T.textMut,
                            pointerEvents: 'none',
                        } })), _jsx(El, { ...props, autoComplete: "off", "aria-label": ariaLabel || label, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, style: {
                            width: '100%',
                            padding: Icon && !textarea ? '10px 12px 10px 36px' : '10px 12px',
                            background: T.inputBg,
                            border: `1px solid ${T.inputBd}`,
                            borderRadius: 9,
                            color: T.inputTxt,
                            fontSize: 13,
                            outline: 'none',
                            boxSizing: 'border-box',
                            minHeight: textarea ? 60 : undefined,
                            transition: 'border-color 0.2s',
                            ...props.style,
                        }, onFocus: (e) => {
                            e.target.style.borderColor = T.inputFocus;
                        }, onBlur: (e) => {
                            e.target.style.borderColor = T.inputBd;
                        } })] })] }));
}
//# sourceMappingURL=Field.js.map