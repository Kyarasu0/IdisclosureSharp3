import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
import { PALETTE } from "./../../../Theme/Palettes/MajorCyberPalette";
import styles from "./Introduction.module.css";

export const Introduction = () => {
    return (
        <div 
            className={styles.container}
            style={{ "--cyan": PALETTE.cyan } as React.CSSProperties}
        >
            {/* ロゴマーク */}
            <div className={styles.logoWrapper}>
                <Logo size="lg" type="vertical"/>
            </div>
            
            {/* スタートボタン */}
            <div className={styles.roundedButtonWrapper}>
                <RoundedButton size="lg" label="PRESS TO START"/>
            </div>

            {/* 三角ジャンプ */}
            <div className={styles.bounceArrow}>▼</div>
        </div>
    );
}