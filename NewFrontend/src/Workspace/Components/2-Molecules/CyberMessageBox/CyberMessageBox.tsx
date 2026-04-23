// ==============================================================
// Components/2-Molecules/CyberFormCard/CyberFormCard.tsx
// ==============================================================

import type { ReactNode } from "react";
import styles from "./CyberMessageBox.module.css";

type Props = {
  title: string;
  message: string;
  icon: ReactNode;
  variant?: "warning" | "danger" | "info" | "success";
  className?: string;
};

export const CyberMessageBox = ({
  title,
  message,
  icon,
  variant = "warning",
  className,
}: Props) => {
  return (
    <div className={`${styles.box} ${styles[variant]} ${className}`}>
      <div className={styles.icon}>{icon}</div>

      <p className={styles.text}>
        {title}:
        <br />
        {message}
      </p>
    </div>
  );
};