import { type ReactNode } from 'react';
import { type Theme, type ThemeName } from './themes';
interface ThemeContextValue {
    T: Theme;
    theme: ThemeName;
    toggleTheme: () => void;
}
export declare function useTheme(): ThemeContextValue;
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map