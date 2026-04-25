// ========================================================================
// Components/1-Atoms/Control/ValidatedInputField/ValidatedInputField.tsx
// ========================================================================

// 基本的な関数をインポート
import type { ReactNode } from 'react';
// デザインに関連するファイルをインポート
import styles from "./ValidatedInputField.module.css";

type ValidatedInputFieldProps = {
  label: string;                      // 入力欄の名前
  icon: ReactNode;                    // アイコンを指定
  type?: string;                      // 入力タイプ
  value: string;                      // 入力値
  onChange: (value: string) => void;  // 入力変更時の処理
  placeholder?: string;               // 入力欄の説明
  required?: boolean;                 // データが揃う必要があるか
  pattern?: RegExp;                   // TS側バリデーション
  htmlPattern?: string;               // HTML側バリデーション
  showStatusDot?: boolean;            // 入力値が正しいかのチェック
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
  // 文字の大きさ設定
  const fontSize = 1.3;

  return (
    <div className={styles.field}>
      
      {/* ラベル表示（アイコン + テキスト） */}
      <label 
        className={styles.label}
        style={{
          fontSize: `${1 * fontSize}rem`,
        }}
      >
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
          style={{ 
            colorScheme: 'dark',
            fontSize: `${1 * fontSize}rem`,
          } as React.CSSProperties}
        />

        {/* ステータスドット（入力状態表示） */}
        {showStatusDot && (
          <div
            className={styles.dot}
            style={{
              background: isValid ? "var(--green)" : "var(--pink)"
            }}
          />
        )}
      </div>
    </div>
  );
};