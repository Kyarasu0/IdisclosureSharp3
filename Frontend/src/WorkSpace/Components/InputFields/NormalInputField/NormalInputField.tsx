import styles from './NormalInputField.module.css';
import type { ReactNode } from 'react';

type InputFieldProps = {
  label: string;
  icon: ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  pattern?: RegExp;          // ← TS側のバリデーション
  htmlPattern?: string;      // ← HTML側のバリデーション
  showStatusDot?: boolean;
};

export const NormalInputField = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  pattern,
  htmlPattern,
  showStatusDot = false
}: InputFieldProps) => {

  const isValid = pattern ? pattern.test(value) : value.length > 0;

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {icon} {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          pattern={htmlPattern}
          style={{ colorScheme: 'dark' }}
        />

        {showStatusDot && (
          <div
            className={
              value && isValid
                ? styles.pulseDotGreen
                : styles.pulseDotRed
            }
          />
        )}
      </div>
    </div>
  );
};
