import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { THEMES, type Theme, type ThemeName } from './themes';

interface ThemeContextValue {
  T: Theme;
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      return (localStorage.getItem('wn:theme') as ThemeName) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: ThemeName = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('wn:theme', next);
      } catch {
        // Storage unavailable
      }
      return next;
    });
  }, []);

  const T = THEMES[theme] || THEMES.dark;

  return (
    <ThemeCtx.Provider value={{ T, theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}
