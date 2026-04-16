// ===============================================
// Components/5-Pages/2-UserSetup/UserSetup.tsx
// ===============================================

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { ValidatedInputField } from "../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
// 自作の関数とタイプをインポート
import { useSafeNavGuard } from "../../../Hooks/useSafeNavGuard";
import type { NavigationGuardProps } from "../../../Hooks/useSafeNavGuard";

export const UserSetup = (isNavigationBlocked: NavigationGuardProps) => {
    const UserIcon = () => <span>👤</span>;
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
        <ValidatedInputField
            label="Username"
            icon={<UserIcon />}
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="Enter your username"
            required={true}
            pattern={/^[a-zA-Z0-9_]{3,12}$/}   // 3〜12文字の英数字＋_
            htmlPattern="^[a-zA-Z0-9_]{3,12}$"
            showStatusDot={true}
        />
    );
}