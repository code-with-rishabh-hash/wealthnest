import { useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { VaultData } from '@wealthnest/shared';
import { ThemeProvider } from '@/design-system/theme/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { AppMain } from './AppMain';

interface AppState {
  phase: 'auth' | 'app';
  data?: VaultData;
  password?: string;
}

export default function App() {
  const [state, setState] = useState<AppState>({ phase: 'auth' });

  const handleUnlock = useCallback((data: VaultData, password: string) => {
    setState({ phase: 'app', data, password });
  }, []);

  const handleLogout = useCallback(() => {
    setState({ phase: 'auth' });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          {state.phase === 'auth' ? (
            <AuthScreen onUnlock={handleUnlock} />
          ) : (
            <AppMain
              initialData={state.data!}
              password={state.password!}
              onLogout={handleLogout}
            />
          )}
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
