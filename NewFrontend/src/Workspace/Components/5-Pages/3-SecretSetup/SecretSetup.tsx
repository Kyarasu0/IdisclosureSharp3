// ===============================================
// Components/5-Pages/2-UserSetup/UserSetup.tsx
// ===============================================

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { SecretInfoForm } from "../../3-Organisms/Control/SecretInfoForm/SecretInfoForm";
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
// デザインに関するファイルをインポート
import styles from "./SecretSetup.module.css";
import { ArrowBigLeft } from "lucide-react";

type Props = {
  isNavigationBlocked?: boolean;
  onGuard?: () => void;
  onSaveAndMoveClick?: ( secretId: string, score: number ) => void;
  onReturnClick?: () => void;
};

export const SecretSetup = ({
    isNavigationBlocked = false,
    onGuard,
    onSaveAndMoveClick = () => alert("onSaveAndMoveClick is not assigned"),
    onReturnClick = () => alert("onReturnClick is not assigned"),
}: Props) => {
    // 入力値を管理
    const [secretId, setSecretId] = useState("");
    const [score, setScore] = useState(0);

    // 遷移元を確認し遷移を許可するかを管理
    useEffect(() => {
        if (!isNavigationBlocked) return;
        // onGuardが存在するなら実行
        onGuard?.();
    }, [isNavigationBlocked]);

    return(
        <div className={styles.userSetupContainer}>
            <header className={styles.userSetupHeader}>
                {/* ロゴマーク */}
                <Logo size="md" type="horizontal"/>
            </header>
            <main className={styles.userSetupMain}>
                {/* 入力フォーム */}
                <SecretInfoForm
                    secretId={secretId}
                    setSecretId={setSecretId}
                    score={score}
                    setScore={setScore}
                    onSaveAndMoveClick={() =>
                        onSaveAndMoveClick(secretId, score)
                    }
                />
            </main>
            <footer className={styles.userSetupFooter}>
                {/* 戻るボタン */}
                <RoundedButton 
                    size="lg"
                    icon={ArrowBigLeft}
                    onClick={onReturnClick}
                />
            </footer>
        </div>
    );
}