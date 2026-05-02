// ===============================================
// Components/5-Pages/2-UserSetup/UserSetup.tsx
// ===============================================

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { UserInfoForm } from "../../3-Organisms/Control/UserInfoForm/UserInfoForm";
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
// デザインに関するファイルをインポート
import styles from "./UserSetup.module.css";
import { ArrowBigLeft } from "lucide-react";

type Props = {
  isNavigationBlocked: boolean;
  // 前ページに遷移
  onReturnClick: () => void;
  // ページガード
  onGuard: () => void;
  // 次ページに遷移
  onSaveAndMoveClick: ( userId: string, birthDate: string ) => void;
};

export const UserSetup = ({
    isNavigationBlocked,
    // 前ページに遷移
    onReturnClick,
    // ページ遷移
    onGuard,
    // 次ページに遷移
    onSaveAndMoveClick,
}: Props) => {
    // 入力値を管理
    const [userId, setUserId] = useState("");
    const [birthDate, setBirthDate] = useState("2000-01-01");

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
                <UserInfoForm
                    userId={userId}
                    setUserId={setUserId}
                    birthDate={birthDate}
                    setBirthDate={setBirthDate}
                    onSaveAndMoveClick={() =>
                        onSaveAndMoveClick(userId, birthDate)
                    }
                    className={styles.userSetupForm}
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