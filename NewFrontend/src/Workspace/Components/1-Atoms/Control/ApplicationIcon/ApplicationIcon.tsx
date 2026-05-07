// ============================================================
// Components/Atoms/CyberIcon/CyberIcon.tsx
// ============================================================

import type { ReactNode, CSSProperties } from "react";
import styles from "./ApplicationIcon.module.css";

type Variant = "diamond" | "hex" | "cut" | "square";

type Props = {
  icon?: ReactNode;
  content?: string;
  label: string;
  hover?: boolean;
  variant?: Variant;
  color?: string;
  onClick?: () => void;
};

export const ApplicationIcon = ({
  icon,
  content,
  label,
  hover = true,
  variant = "cut",
  color = "#00f0ff",
  onClick,
}: Props) => {
  const clipMap: Record<Variant, string> = {
    diamond: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
    hex: "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
    cut: "polygon(0 15%,15% 0,100% 0,100% 85%,85% 100%,0 100%)",
    square: "none",
  };

  return (
    <div
      className={hover ? styles.wrapper : styles.nonHoverWrapper}
      onClick={onClick}
    >
      <div
        className={styles.iconBox}
        style={
          {
            "--clip": clipMap[variant],
            "--color": color,
          } as CSSProperties
        }
      >
        {/* 枠 */}
        <div className={styles.borderLayer} />

        {/* 中身 */}
        <div className={styles.inner}>
          {/* アイコン */}
          {icon && <div className={styles.icon}>{icon}</div>}

          {/* 文字 */}
          {content && (
            <div className={styles.content}>
              {content}
            </div>
          )}
        </div>
      </div>

      {/* ラベル */}
      <span className={styles.label}>{label}</span>
    </div>
  );
};