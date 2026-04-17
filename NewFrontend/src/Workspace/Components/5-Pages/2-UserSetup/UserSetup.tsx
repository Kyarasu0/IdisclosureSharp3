// ===============================================
// Components/5-Pages/2-UserSetup/UserSetup.tsx
// ===============================================

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { ValidatedInputField } from "../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { UserInfoForm } from "../../3-Organisms/Control/UserInfoForm/UserInfoForm";
// 自作の関数とタイプをインポート
import { useSafeNavGuard } from "../../../Functions/Hooks/useSafeNavGuard";
import type { NavigationGuardProps } from "../../../Functions/Hooks/useSafeNavGuard";
// アイコンのインポート
import { User } from "lucide-react";
// デザインに関するファイルをインポート
import styles from "./UserSetup.module.css";

export const UserSetup = (isNavigationBlocked: NavigationGuardProps) => {
    // 入力値を管理
    const [username, setUsername] = useState("");
    // 遷移元を確認し遷移を許可するかを管理
    const guard = useSafeNavGuard();
    useEffect(() => {
        if (!isNavigationBlocked) return;

        guard({
            allowedFromPages: ["Introduction"],
            redirectPath: "/"
        });
    }, [isNavigationBlocked]);

    return(
        <div className={styles.container}>
            <UserInfoForm />
        </div>
    );
}