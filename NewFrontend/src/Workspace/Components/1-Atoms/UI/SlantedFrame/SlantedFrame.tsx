// ==========================================
// Components/1-Atoms/UI/SlantedFrame/SlantedFrame.tsx
// ==========================================

import type { CSSProperties, ReactNode } from "react";
import styles from "./SlantedFrame.module.css";

// ================================
// 型
// ================================
type Props = {
  children: ReactNode;
  // フレーム色
  color?: string;
  // 背景色
  backgroundColor?: string;
  classNameInner?: string;
  // className拡張用
  className?: string;
};

// ================================
// コンポーネント
// ================================
export const SlantedFrame = ({
  children,
  color = "var(--cyan)",
  backgroundColor = "var(--cyan_opWeak)",
  classNameInner,
  className,
}: Props) => {

  // ================================
  // CSS変数
  // ================================
  const style = {
    "--frame-color": color,
    "--frame-bg": backgroundColor,
  } as CSSProperties;

  return (
    <div
      className={`${styles.frame} ${className}`}
      style={style}
    >
      <div className={`${styles.inner} ${classNameInner}`}>
        {children}
      </div>
    </div>
  );
};