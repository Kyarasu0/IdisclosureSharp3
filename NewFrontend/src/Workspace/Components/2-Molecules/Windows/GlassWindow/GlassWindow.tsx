// ============================================================
// Components/2-Molecules/Windows/GlassWindow/GlassWindow.tsx
// ============================================================

// 基本的な関数をインポート
import type { ReactNode } from "react";

// デザインに関するファイルをインポート
import type { LucideIcon } from "lucide-react";
import styles from "./GlassWindow.module.css";

type Props = {
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
}: Props) => {
  return (
    <div className={`${styles.window} ${className}`}>

        {/* 四つ角飾り */}
        <div className={styles.rightTop}></div>
        <div className={styles.rightBottom}></div>
        <div className={styles.leftTop}></div>
        <div className={styles.leftBottom}></div>

        {/* スキャンライン(上) */}
        <div 
            className={styles.scanLine} 
            style={{ 
                top: 0,
                "--deg": "90deg",
            } as React.CSSProperties}
        />

        {/* ===== Header ===== */}
        <div className={styles.header}>
            
            {/* 左：アイコン＋タイトル */}
            <div className={styles.titleBlock}>
                <Icon size={16} className={styles.icon} />

                <div>
                    <div className={styles.title}>{title}</div>
                </div>
            </div>
            {/* 右：ウィンドウボタン */}
            <div className={styles.controls} >
                <span className={styles.green} />
                <span className={styles.yellow} />
                <span className={styles.pink} />
            </div>

        </div>

        {/* ===== Content ===== */}
        <div className={styles.content}>
            {children}
        </div>

        {/* スキャンライン(下) */}
        <div 
            className={styles.scanLine} 
            style={{ 
                bottom: 0,
                "--deg": "-90deg",
            } as React.CSSProperties}
        />
    </div>
  );
};