// ==========================
// Hooks/useSafeNavGuard.ts
// ==========================
// How to use: 許可されたページからの遷移かどうかをチェックする関数

// 基本的な関数のインポート
import { useLocation, useNavigate } from "react-router-dom";

export type NavigationGuardProps = {
    isNavigationBlocked: boolean;
};

type useSafeNavGuardProps = {
    allowedFromPages: string[];
    redirectPath: string;
}

export const useSafeNavGuard = () => {
    // Startup Log(Function)
    const logOwner = "useSafeNavGuard";
    console.log(`\n${logOwner}-Function is running!\n`);

    const location = useLocation();
    const navigate = useNavigate();

    const guard = ({ allowedFromPages, redirectPath }: useSafeNavGuardProps) => {

        // Startup Log(Function)
        const logOwner2 = "navGuard";
        console.log(`\n${logOwner2}-Function is running!\n`);

        const fromPage = location.state?.fromPage;

        // Input Log
        console.log(`[${logOwner}] Input =>`);
        console.log(`fromPage: ${fromPage},`);
        console.log(`allowedFromPages: ${allowedFromPages.join(", ")}`);

        // fromPageがallowedFromPages配列に含まれているか
        const isValid = allowedFromPages.includes(fromPage);

        if (!isValid) {
            // Verify Error Log
            console.log(`[${logOwner}] Invalid access! Redirecting...`);
            navigate(redirectPath, { replace: true });
            
            // Shutdown Log
            console.log(`\n[${logOwner2}] Shutdown!\n`);
            return false;
        }

        // Verify Success Log
        console.log(`[${logOwner}] Valid access`);

        // Shutdown Log
        console.log(`\n[${logOwner2}] Shutdown!\n`);
        return true;
    };

    // Shutdown Log
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return guard;
};