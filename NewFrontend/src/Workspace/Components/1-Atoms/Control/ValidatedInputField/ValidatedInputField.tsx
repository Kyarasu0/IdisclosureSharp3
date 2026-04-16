// ========================================================================
// Components/1-Atoms/Control/ValidatedInputField/ValidatedInputField.tsx
// ========================================================================

// 基本的な関数をインポート
import type { ReactNode } from 'react';
// デザインに関連するファイルをインポート
import styles from "./ValidatedInputField.module.css";
import { PALETTE } from "../../../../Theme/Palettes/MajorCyberPalette";

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
            className={styles.dot}
            style={{
              background: isValid ? PALETTE.green : PALETTE.pink
            }}
          />
        )}

      </div>
    </div>
  );
};