import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { THEMES } from './themes';
const ThemeCtx = createContext(null);
export function useTheme() {
    const ctx = useContext(ThemeCtx);
    if (!ctx)
        throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('wn:theme') || 'dark';
        }
        catch {
            return 'dark';
        }
    });
    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem('wn:theme', next);
            }
            catch {
                // Storage unavailable
            }
            return next;
        });
    }, []);
    const T = THEMES[theme] || THEMES.dark;
    return (_jsx(ThemeCtx.Provider, { value: { T, theme, toggleTheme }, children: children }));
}
//# sourceMappingURL=ThemeContext.js.map