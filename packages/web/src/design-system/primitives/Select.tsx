import type { CSSProperties, ChangeEventHandler, ReactNode } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  children?: ReactNode;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function Select({
  label,
  value,
  onChange,
  children,
  style: sx,
  'aria-label': ariaLabel,
}: SelectProps) {
  const { T } = useTheme();

  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: T.textSec,
            marginBottom: 5,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || label}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: T.inputBg,
          border: `1px solid ${T.inputBd}`,
          borderRadius: 9,
          color: T.inputTxt,
          fontSize: 13,
          outline: 'none',
          ...sx,
        }}
      >
        {children}
      </select>
    </div>
  );
}
