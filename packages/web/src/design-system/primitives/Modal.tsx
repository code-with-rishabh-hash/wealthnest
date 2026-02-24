import { useEffect, useRef, type ReactNode, type ComponentType } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  icon?: ComponentType<{ size: number; color?: string }>;
  iconColor?: string;
}

export function Modal({ open, onClose, title, children, maxWidth, icon: Icon, iconColor }: ModalProps) {
  const { T } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        padding: '40px 16px',
        overflowY: 'auto',
        animation: 'fadeIn 0.15s',
      }}
    >
      <div
        ref={dialogRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.surface,
          borderRadius: 18,
          width: '100%',
          maxWidth: maxWidth || '520px',
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          animation: 'slideUp 0.2s',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: `1px solid ${T.border}`,
            position: 'sticky',
            top: 0,
            background: T.surface,
            borderRadius: '18px 18px 0 0',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {Icon && <Icon size={18} color={iconColor || T.accent} />}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: T.ghostBg,
              borderRadius: 8,
              padding: 6,
              color: T.textSec,
              display: 'flex',
              cursor: 'pointer',
              transition: 'background 0.15s',
              border: 'none',
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '16px 20px', maxHeight: '70vh', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
