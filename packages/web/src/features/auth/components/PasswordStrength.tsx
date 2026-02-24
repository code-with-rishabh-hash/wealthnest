import { useTheme } from '@/design-system/theme/ThemeContext';

const LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const COLORS = ['', '#ef4444', '#f59e0b', '#22c55e', '#10b981'];

interface PasswordStrengthProps {
  strength: number;
}

export function PasswordStrength({ strength }: PasswordStrengthProps) {
  const { T } = useTheme();

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 4 }} role="meter" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4} aria-label="Password strength">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= strength ? COLORS[strength] : T.ghostBg,
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, color: COLORS[strength] || T.textMut, marginTop: 4, fontWeight: 500 }}>
        {LABELS[strength]}
      </p>
      {strength > 0 && strength < 3 && (
        <p style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>
          Tip: Use 12+ characters with uppercase, numbers & symbols for maximum security
        </p>
      )}
    </div>
  );
}
