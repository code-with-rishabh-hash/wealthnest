import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to Sentry in production
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{26A0}\u{FE0F}'}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#e2e8f0' }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: '#8b95a8', marginBottom: 20, maxWidth: 400 }}>
            An unexpected error occurred. Your data is safe — it&apos;s encrypted in your browser storage.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#34d399,#059669)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Reload Application
          </button>
          {this.state.error && (
            <pre style={{ marginTop: 20, fontSize: 11, color: '#525c6f', maxWidth: 500, overflow: 'auto', textAlign: 'left', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
