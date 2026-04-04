import type { ReactNode } from "react";
import styles from "./CyberWindow.module.css";

type Props = {
  children: ReactNode;
  bootState: number;
  alertActive?: boolean;
};

export const CyberWindow = ({ children, bootState, alertActive }: Props) => {
  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.gridBg}></div>

      {/* Panel */}
      <div
        className={`
          ${styles.panel}
          ${bootState >= 1 ? styles.animatingLine : ""}
          ${bootState >= 2 ? styles.animatingExpand : ""}
          ${alertActive ? styles.alertMode : ""}
        `}
      >
        {/* Corner Decorations */}
        <div className={`${styles.cornerDeco} ${styles.cTl}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cTr}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cBl}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cBr}`}></div>

        {/* Content */}
        <div
          className={`
            ${styles.panelContent}
            ${bootState >= 3 ? styles.show : ""}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};