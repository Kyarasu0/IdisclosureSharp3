// ============================================================
// Components/2-Molecules/Windows/GlassWindow/GlassWindow.tsx
// ============================================================

// 基本的な関数をインポート
import type { ReactNode } from "react";

// デザインに関するファイルをインポート
import type { LucideIcon } from "lucide-react";
import styles from "./GlassWindow.module.css";
import { main } from "framer-motion/client";

type Props = {
  icon: LucideIcon;
  title: string;
  subTitle?: string;
  children: ReactNode;
  mainColor?: string;
  subColor?: string;
  contentAlign?: "flex-start" | "center" | "flex-end";
  className?: string;
  state?: WindowState;
};

type WindowState =
  | "closed"
  | "opening"
  | "opened"
  | "closing";

export const GlassWindow = ({
  icon: Icon,
  title,
  subTitle,
  children,
  mainColor = "var(--cyan)",
  subColor = "var(--pink)",
  contentAlign = "center",
  className,
  state = "opened",
}: Props) => {
  return (
    <div 
        className={`${styles.window} ${className} ${styles[state]}`}
        style={{
            borderRight: `1px solid ${mainColor}`,
            borderLeft: `1px solid ${mainColor}`
        }}
    >

        {/* 四つ角飾り */}
        <div className={`${styles.rightTop} ${styles.windowParts}`} style={{ borderColor: mainColor }} ></div>
        <div className={`${styles.rightBottom} ${styles.windowParts}`} style={{ borderColor: mainColor }} ></div>
        <div className={`${styles.leftTop} ${styles.windowParts}`} style={{ borderColor: mainColor }} ></div>
        <div className={`${styles.leftBottom} ${styles.windowParts}`} style={{ borderColor: mainColor }} ></div>

        {/* スキャンライン(上) */}
        <div 
            className={`${styles.scanLine} ${styles.windowParts}`} 
            style={{ 
                top: 0,
                /* バックグラウンド設定 */
                background: `linear-gradient(
                    90deg,
                    ${mainColor},
                    ${subColor},
                    ${mainColor},
                    ${mainColor}
                )`,
            } as React.CSSProperties}
        />

        {/* ===== Header ===== */}
        <div 
            className={styles.header}
            style={{
                /* 装飾設定 */
                borderBottom: `1px solid ${mainColor}`
            }}
        >
            
            {/* 左：アイコン＋タイトル */}
            <div className={styles.titleBlock}>
                <Icon 
                    size={16} 
                    className={styles.icon}
                    style={{
                        /* 文字設定 */
                        color: mainColor,
                        /* 装飾設定 */
                        filter: `drop-shadow(0 0 5px ${mainColor})`
                    }}
                />

                <div>
                    <div 
                        className={styles.title}
                        style={{
                            /* 文字設定 */
                            color: mainColor,
                            textShadow: `0 0 10px ${mainColor}`
                        }}
                    >{title}</div>
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
        <div 
            className={styles.content}
            style={{ 
                alignItems: contentAlign,
                 /* 文字設定 */
                color: mainColor
            }}
        >
            {children}
        </div>

        {/* スキャンライン(下) */}
        <div 
            className={`${styles.scanLine} ${styles.windowParts}`} 
            style={{ 
                bottom: 0,
                /* バックグラウンド設定 */
                background: `linear-gradient(
                    -90deg,
                    ${mainColor},
                    ${subColor},
                    ${mainColor},
                    ${mainColor}
                )`,
            } as React.CSSProperties}
        />
    </div>
  );
};