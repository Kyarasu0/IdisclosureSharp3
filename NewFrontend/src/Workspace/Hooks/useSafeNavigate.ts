// ==========================
// Hooks/useSafeNavigate.ts
// ==========================
// How to use: URLを直接編集することによるページ遷移と履歴からのページ遷移を妨げる関数

// 基本的な関数のインポート
import { useNavigate } from "react-router-dom";

type useSafeNavigateProps = {
    path: string;
    fromPage: string;
}

export const useSafeNavigate = () => {
    // Startup Log(Function)
    const logOwner = "useSafeNavigate";
    console.log(`\n${logOwner}-Function is running!\n`);

    // 遷移関数の取得
    const navigate = useNavigate();
    // ゲーム途中の不正なページ遷移を防ぐ機能
    const go = ({path, fromPage}: useSafeNavigateProps) => {
        // Startup Log(Function)
        const logOwner2 = "go";
        console.log(`\n${logOwner2}-Function is running!\n`);
        // Input Log
        console.log(`[${logOwner}] Input =>\npath: ${path},\nfromPage: ${fromPage}`);

        navigate(path, {
            // 遷移置き換えによって履歴遷移をできなくする
            replace: true,
            // 正しいページ順序かを確認できるstateを準備する
            state: { fromPage: fromPage }
        });

        // Shutdown Log
        console.log(`\n[${logOwner2}] Shutdown!\n`);
    };

    // Shutdown Log
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return go;
};