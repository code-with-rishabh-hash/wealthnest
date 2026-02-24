import { AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warn' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { T } = useTheme();
  if (!open) return null;

  const colors = {
    danger: { bg: T.dangerBg, color: T.danger, Ic: AlertTriangle },
    warn: { bg: T.warningBg, color: T.warning, Ic: AlertTriangle },
    info: { bg: T.infoBg, color: T.info, Ic: Info },
  };
  const c = colors[variant] || colors.danger;

  return (
    <div
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        padding: 20,
        animation: 'fadeIn 0.15s',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.surface,
          borderRadius: 20,
          width: '100%',
          maxWidth: 400,
          padding: '32px 28px',
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          animation: 'slideUp 0.2s',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: c.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <c.Ic size={28} color={c.color} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" full onClick={onCancel}>
            {cancelText || 'Cancel'}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'warn' ? 'warn' : 'primary'}
            full
            onClick={onConfirm}
          >
            {confirmText || 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
