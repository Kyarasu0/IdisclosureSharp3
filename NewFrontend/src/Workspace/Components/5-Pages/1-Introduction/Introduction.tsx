// ====================================================
// Components/5-Pages/1-Introduction/Introduction.tsx
// ====================================================

// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
// デザインに関連するファイルをインポート
import { PALETTE } from "../../../Theme/Appearance/ColorPalettes/MajorCyberPalette";
import styles from "./Introduction.module.css";
// 自作の関数をインポート
import { useSafeNavigate } from "../../../Functions/Hooks/useSafeNavigate";

export const Introduction = () => {
    // 関数を抽出
    const go = useSafeNavigate();

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
                <RoundedButton 
                    size="lg"
                    label="PRESS TO START"
                    onClick={() =>
                        go({
                            path: "/user-setup",
                            fromPage: "Introduction"
                        })
                    }
                />
            </div>

            {/* 三角ジャンプ */}
            <div className={styles.bounceArrow}>▼</div>
        </div>
    );
}