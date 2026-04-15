// ========================================================================
// Components/1-Atoms/Control/ValidatedInputField/ValidatedInputField.tsx
// ========================================================================

import styles from './ValidatedInputField.module.css';
import type { ReactNode } from 'react';

type ValidatedInputFieldProps = {
  label: string;
  icon: ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  pattern?: RegExp;     // TS側バリデーション
  htmlPattern?: string; // HTML側バリデーション
  showStatusDot?: boolean;
};

export const ValidatedInputField = ({
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
}: ValidatedInputFieldProps) => {

  // 入力値のバリデーション判定
  const isValid = pattern ? pattern.test(value) : value.length > 0;

  return (
    <div className={styles.field}>
      
      {/* ラベル表示（アイコン + テキスト） */}
      <label className={styles.label}>
        {icon} {label}
      </label>

      <div className={styles.inputWrapper}>

        {/* 入力フィールド本体 */}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)} // 親へ値を渡す
          placeholder={placeholder}
          className={styles.input}
          pattern={htmlPattern}
          style={{ colorScheme: 'dark' }}
        />

        {/* ステータスドット（入力状態表示） */}
        {showStatusDot && value && (
          <div
            className={`${styles.dot} ${
              isValid ? styles.valid : styles.invalid
            }`}
          />
        )}

      </div>
    </div>
  );
};