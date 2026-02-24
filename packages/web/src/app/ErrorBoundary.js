import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        // TODO: Send to Sentry in production
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: 40, textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: '\u{26A0}\u{FE0F}' }), _jsx("h2", { style: { fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#e2e8f0' }, children: "Something went wrong" }), _jsx("p", { style: { fontSize: 14, color: '#8b95a8', marginBottom: 20, maxWidth: 400 }, children: "An unexpected error occurred. Your data is safe \u2014 it's encrypted in your browser storage." }), _jsx("button", { onClick: () => window.location.reload(), style: {
                            padding: '10px 24px', borderRadius: 10, border: 'none',
                            background: 'linear-gradient(135deg,#34d399,#059669)',
                            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }, children: "Reload Application" }), this.state.error && (_jsx("pre", { style: { marginTop: 20, fontSize: 11, color: '#525c6f', maxWidth: 500, overflow: 'auto', textAlign: 'left', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }, children: this.state.error.message }))] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map