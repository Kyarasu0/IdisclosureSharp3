// ==============================================================
// Components/2-Molecules/CyberFormCard/CyberFormCard.tsx
// ==============================================================

// デザインに関するファイルをインポート
import styles from "./CyberFormCard.module.css";

type CyberFormCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const CyberFormCard = ({
    children,
    className,
}: CyberFormCardProps) => {

    return(
        <div className={`${styles.card} ${className}`}>
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
