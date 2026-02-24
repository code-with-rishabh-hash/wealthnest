import type { ReactNode, CSSProperties } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warn' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  full,
  onClick,
  disabled,
  style: sx,
  'aria-label': ariaLabel,
  type = 'button',
}: ButtonProps) {
  const { T } = useTheme();
  const variants = {
    primary: { bg: `linear-gradient(135deg,${T.accent},${T.accentDk})`, c: '#fff' },
    success: { bg: 'linear-gradient(135deg,#22c55e,#16a34a)', c: '#fff' },
    danger: { bg: 'linear-gradient(135deg,#ef4444,#dc2626)', c: '#fff' },
    warn: { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', c: '#fff' },
    ghost: { bg: T.ghostBg, c: T.ghostTxt },
    outline: { bg: 'transparent', c: T.outlineTxt },
  };
  const t = variants[variant] || variants.primary;
  const pd = size === 'sm' ? '7px 13px' : size === 'lg' ? '14px 26px' : '10px 18px';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;
  const bd = variant === 'ghost' ? `1px solid ${T.ghostBd}` : variant === 'outline' ? `1px solid ${T.outlineBd}` : 'none';

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{
        background: t.bg,
        border: bd,
        borderRadius: 10,
        padding: pd,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        width: full ? '100%' : 'auto',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        userSelect: 'none',
        color: t.c,
        fontSize: fs,
        fontWeight: 700,
        fontFamily: "'DM Sans',system-ui,sans-serif",
        lineHeight: 1.2,
        ...sx,
      }}
    >
      {children}
    </button>
  );
}
