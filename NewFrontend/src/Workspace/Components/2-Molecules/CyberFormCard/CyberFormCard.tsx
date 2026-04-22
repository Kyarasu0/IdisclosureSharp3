// ==============================================================
// Components/2-Molecules/CyberFormCard/CyberFormCard.tsx
// ==============================================================

// デザインに関するファイルをインポート
import styles from "./CyberFormCard.module.css";
// 設定ファイルをインポート
import { useAppearance } from "../../../../Core/Contexts/AppearanceContext";

type CyberFormCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const CyberFormCard = ({
    children,
    className = "",
}: CyberFormCardProps) => {

    const { palette } = useAppearance();

    return(
        <div 
            className={`${styles.card} ${className}`}
            style={{
                "--black-glass": palette.blackGlass,
                "--cyan": palette.cyan,
                "--cyan-shadow": palette.cyanShadow,
                "--pink": palette.pink,
            } as React.CSSProperties}
        >
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

            {/* 内容 */}
            {children}

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
}
