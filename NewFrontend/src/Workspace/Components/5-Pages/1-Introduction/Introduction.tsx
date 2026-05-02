// ====================================================
// Components/5-Pages/1-Introduction/Introduction.tsx
// ====================================================

// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
// デザインに関連するファイルをインポート
import styles from "./Introduction.module.css";

type Props = {
    // 次ページに遷移
    onMoveClick: () => void;
};

export const Introduction = ({
    onMoveClick,
}: Props) => {
    return (
        <div className={styles.container}>
            {/* ロゴマーク */}
            <div className={styles.logoWrapper}>
                <Logo size="lg" type="vertical"/>
            </div>
            
            {/* スタートボタン */}
            <div className={styles.roundedButtonWrapper}>
                <RoundedButton 
                    size="lg"
                    label="PRESS TO START"
                    onClick={onMoveClick}
                />
            </div>

            {/* 三角ジャンプ */}
            <div className={styles.bounceArrow}>▼</div>
        </div>
    );
}