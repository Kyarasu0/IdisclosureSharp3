import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import styles from "./GlassWindow.module.css";

type GlassWindowProps = {
  icon: LucideIcon;
  title: string;
  subTitle?: string;
  children: ReactNode;
  className?: string;
};

export const GlassWindow = ({
  icon: Icon,
  title,
  subTitle,
  children,
  className = "",
}: GlassWindowProps) => {
  return (
    <div className={`${styles.window} ${className}`}>
      
      {/* ===== Header ===== */}
      <div className={styles.header}>
        <div className={styles.leftArea}>
          <div className={styles.iconBox}>
            <Icon size={16} />
          </div>

          <div className={styles.titleArea}>
            <span className={styles.title}>{title}</span>
            {subTitle && (
              <span className={styles.subTitle}>{subTitle}</span>
            )}
          </div>
        </div>

        <div className={styles.windowControls}>
          <div className={styles.dot} />
          <div className={`${styles.dot} ${styles.yellow}`} />
          <div className={`${styles.dot} ${styles.pink}`} />
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Corner Accent */}
      <div className={styles.corner} />
    </div>
  );
};
