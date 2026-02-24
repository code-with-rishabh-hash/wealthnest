import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ children, color = '#3498DB', style: sx }) {
    return (_jsx("span", { style: {
            display: 'inline-block',
            padding: '3px 9px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 600,
            background: color + '18',
            color,
            ...sx,
        }, children: children }));
}
//# sourceMappingURL=Badge.js.map