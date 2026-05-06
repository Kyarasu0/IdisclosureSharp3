// ============================================================
// Components/Atoms/CyberIcon/CyberIcon.tsx
// ============================================================

import type { ReactNode } from "react";
import styles from "./ApplicationIcon.module.css";

type Variant = "diamond" | "hex" | "cut" | "square";

type Props = {
  icon: ReactNode;
  label: string;
  hover?: boolean;
  variant?: Variant;
  color?: string;
  onClick?: () => void;
};

export const ApplicationIcon = ({
  icon,
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
    <div className={ hover ? styles.wrapper : styles.nonHoverWrapper} onClick={onClick}>
      <div
        className={styles.iconBox}
        style={
          {
            "--clip": clipMap[variant],
            "--color": color,
          } as React.CSSProperties
        }
      >
        <div className={styles.borderLayer} />
        <div className={styles.icon}>{icon}</div>
      </div>

      <span className={styles.label}>{label}</span>
    </div>
  );
};