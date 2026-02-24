import type { ComponentType } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  Icon?: ComponentType<{ size: number; color?: string }>;
  color?: string;
  bg?: string;
}

export function StatCard({ label, value, sub, Icon, color, bg }: StatCardProps) {
  const { T } = useTheme();

  return (
    <div
      style={{
        background: bg || T.ghostBg,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 20,
        boxShadow: T.cardShadow,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: T.textSec,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: color + '12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={16} color={color} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
      {sub && (
        <span style={{ fontSize: 11, color: T.textMut, marginTop: 2, display: 'block' }}>
          {sub}
        </span>
      )}
    </div>
  );
}
