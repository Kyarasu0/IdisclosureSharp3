// Components/CurrencyDisplay/CurrencyDisplay.tsx

import type { ReactNode } from "react";
import styles from "./CurrencyDisplay.module.css";

type Props = {
  amount: string;
  label: string;
  icon?: ReactNode;
  color?: string; // ← 追加
};

export const CurrencyDisplay = ({
  amount,
  label,
  icon,
  color = "#22d3ee", // デフォルト
}: Props) => {
  return (
    <div
      className={styles.wrapper}
      style={
        {
          "--accent": color,
        } as React.CSSProperties
      }
    >
      <div className={styles.left}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <span className={styles.label}>{label}</span>
      </div>

      <div className={styles.amount}>{amount}</div>
    </div>
  );
};