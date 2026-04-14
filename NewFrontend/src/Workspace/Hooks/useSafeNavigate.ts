import { useNavigate } from "react-router-dom";

type useSafeNavigateProps = {
    path: string;
    fromPage: string;
}

export const useSafeNavigate = () => {
    // 遷移関数の取得
    const navigate = useNavigate();

    // ゲーム途中の不正なページ遷移を防ぐ機能
    const go = ({path, fromPage}: useSafeNavigateProps) => {
        navigate(path, {
            // 遷移置き換えによって履歴遷移をできなくする
            replace: true,
            // 正しいページ順序かを確認できるstateを準備する
            state: { fromPage: fromPage }
        });
    };

    return go;
};