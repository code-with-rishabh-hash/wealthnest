import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/design-system/theme/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { AppMain } from './AppMain';
export default function App() {
    const [state, setState] = useState({ phase: 'auth' });
    const handleUnlock = useCallback((data, password) => {
        setState({ phase: 'app', data, password });
    }, []);
    const handleLogout = useCallback(() => {
        setState({ phase: 'auth' });
    }, []);
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { children: _jsx(BrowserRouter, { children: state.phase === 'auth' ? (_jsx(AuthScreen, { onUnlock: handleUnlock })) : (_jsx(AppMain, { initialData: state.data, password: state.password, onLogout: handleLogout })) }) }) }));
}
//# sourceMappingURL=App.js.map