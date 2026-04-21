// ===============================================
// Components/1-Atoms/Control/SubmitButton.tsx
// ===============================================

// ReactNode = ボタン内に文字・アイコンなど自由に入れられる型
import type { ReactNode } from "react";
// デザインに関連するファイルをインポート
import styles from "./SubmitButton.module.css";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

// ===============================================
// Props型定義
// ===============================================
type SubmitButtonProps = {
  // buttonの種類
  type?: "button" | "submit" | "reset";
  // 読み込み中かどうか
  isLoading?: boolean;
  // 手動で無効化するか
  disabled?: boolean;
  // クリック時の処理
  onClick?: () => void;
  // ボタン内の表示内容
  children: ReactNode;
  // ボタンのサイズ
  size?: "sm" | "md" | "lg";
};

// ===============================================
// コンポーネント本体
// ===============================================
export const SubmitButton = ({
    type = "button",
    isLoading = false,
    disabled = false,
    onClick = () => {},
    children,
    size,
}: SubmitButtonProps) => {
    let scale = 0.75;
    switch(size){
        case "sm": scale *= 2/3; break;
        case "lg": scale *= 2; break;
    }
    const { palette, font } = useAppearance();

    return (
        <button
            type={type}
            // disabled または loading中なら押せない
            disabled={disabled || isLoading}
            onClick={onClick}
            className={styles.button}
            style={{
                "--black": palette.black,
                "--cyan": palette.cyan,
                "--gray": palette.gray,
                fontFamily: font.primary,
                padding: `${scale}rem ${scale * 2}rem`,
                fontSize: `${scale * 1.5}rem`,
            } as React.CSSProperties}
        >
            {/* 通常時：文字やアイコンを表示 */}
            {!isLoading && (
                <span className={styles.buttonContent}>
                    {children}
                </span>
            )}

            {/* 読み込み中：ローダー表示 */}
            {isLoading && (
                <div className={styles.loaderWrapper}>
                    <div className={styles.loader} />
                </div>
            )}
        
        </button>
    );
};