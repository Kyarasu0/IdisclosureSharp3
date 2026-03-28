import type { ReactNode } from "react";
import styles from "./RoundedButton.module.css";

type RoundedButtonProps = {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  size?: "lg" | "md" | "sm";
  fullWidth?: boolean;
};

export const RoundedButton = ({
  onClick,
  children,
  icon,
  size = "md",
  fullWidth = false,
}: RoundedButtonProps) => {
  return (
    <div
      className={`${styles.startButtonWrapper} ${
        fullWidth ? styles.fullWidth : ""
      }`}
    >
      <button
        className={`
          ${styles.startButton}
          ${styles[size]}
        `}
        onClick={onClick}
      >
        <div className={styles.startButtonBg}></div>
        <div className={styles.startButtonOverlay}></div>

        <span
          className={`${
            icon ? styles.contentWithIcon : styles.contentNoIcon
          } ${styles.content}`}
        >
          {children}
          {icon && <span className={styles.icon}>{icon}</span>}
        </span>
      </button>
    </div>
  );
};