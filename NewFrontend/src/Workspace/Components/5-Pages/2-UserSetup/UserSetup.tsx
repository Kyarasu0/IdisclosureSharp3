// ===============================================
// Components/5-Pages/2-UserSetup/UserSetup.tsx
// ===============================================

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { UserInfoForm } from "../../3-Organisms/Control/UserInfoForm/UserInfoForm";

// デザインに関するファイルをインポート
import styles from "./UserSetup.module.css";

type Props = {
  isNavigationBlocked?: boolean;
  onGuard?: () => void;
};

export const UserSetup = ({
    isNavigationBlocked = false,
    onGuard,
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
        <div className={styles.container}>
            <UserInfoForm
                userId={userId}
                setUserId={setUserId}
                birthDate={birthDate}
                setBirthDate={setBirthDate}
            />
        </div>
    );
}