import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export function Badge({ children, color = '#3498DB', style: sx }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        background: color + '18',
        color,
        ...sx,
      }}
    >
      {children}
    </span>
  );
}
