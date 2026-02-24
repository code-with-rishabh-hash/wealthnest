import type { CSSProperties, ChangeEventHandler, KeyboardEventHandler, ComponentType } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface FieldProps {
  label?: string;
  icon?: ComponentType<{ size: number; style?: CSSProperties }>;
  textarea?: boolean;
  type?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export function Field({
  label,
  icon: Icon,
  textarea,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FieldProps) {
  const { T } = useTheme();
  const El = textarea ? 'textarea' : 'input';

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
      <div style={{ position: 'relative' }}>
        {Icon && !textarea && (
          <Icon
            size={15}
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: T.textMut,
              pointerEvents: 'none',
            }}
          />
        )}
        <El
          {...(props as Record<string, unknown>)}
          autoComplete="off"
          aria-label={ariaLabel || label}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          style={{
            width: '100%',
            padding: Icon && !textarea ? '10px 12px 10px 36px' : '10px 12px',
            background: T.inputBg,
            border: `1px solid ${T.inputBd}`,
            borderRadius: 9,
            color: T.inputTxt,
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box' as const,
            minHeight: textarea ? 60 : undefined,
            transition: 'border-color 0.2s',
            ...props.style,
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.target.style.borderColor = T.inputFocus;
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.target.style.borderColor = T.inputBd;
          }}
        />
      </div>
    </div>
  );
}
