import type { ReactNode } from "react";
import styles from "./ProgressBar.module.css";

type Props = {
  value: number; // 0〜100
  icon?: ReactNode;
};

export const ProgressBar = ({ value, icon }: Props) => {
  return (
    <div className={styles.wrapper}>
      
      {/* 上段（アイコン + 数値） */}
      <div className={styles.header}>
        <div className={styles.left}>
          {icon && <div className={styles.icon}>{icon}</div>}
        </div>

        <span className={styles.value}>{value}%</span>
      </div>

      {/* バー */}
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};