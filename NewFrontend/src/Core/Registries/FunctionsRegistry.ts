// Core/Registries/FunctionsRegistry.ts

import { useSafeNavigate } from "../../Workspace/Functions/Hooks/useSafeNavigate";
import { useSafeNavGuard } from "../../Workspace/Functions/Hooks/useSafeNavGuard";
import { calculateScore } from "../../Workspace/Functions/Utils/calculateScore";

export const FunctionsRegistry = () => {
  const go = useSafeNavigate();
  const guard = useSafeNavGuard();

  return {

    // ====================
    // Introduction
    // ====================
    // 1. 次のページへ遷移
    GoToUserSetupFromIntroduction: () =>
      go({
        path: "/user-setup",
        fromPage: "Introduction",
      }),

    // ====================
    // UserSetup
    // ====================
    // 1. 前のページへ遷移
    GoToIntroductionFromUserSetup: () =>
      go({
        path: "/",
        fromPage: "UserSetup",
      }),

    // 2. ページガード
    GuardUserSetup: () =>
      guard({
        allowedFromPages: ["Introduction", "SecretSetup"],
        redirectPath: "/user-setup",
      }),
    
    // 3. 情報を保存して次のページへ遷移
    GoToSecretSetupFromUserSetup: (userId: string, birthDate: string) => {
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          userId,
          birthDate,
        })
      );
      go({
        path: "/secret-setup",
        fromPage: "UserSetup",
      });
    },

    // ====================
    // SecretSetup
    // ====================
    // 1. 前のページへ遷移
    GoToUserSetupFromSecretSetup: () =>
      go({
        path: "/user-setup",
        fromPage: "SecretSetup",
      }),

    // 2. ページガード
    GuardSecretSetup: () =>
      guard({
        allowedFromPages: ["UserSetup", "CreateJoin"],
        redirectPath: "/secret-setup",
      }),
    
    // 3. 情報の取得と保存をして次のページへ遷移
    GoToCreateJoinFromSecretSetup: (
      userId: string,
      birthDate: string,
      secretId: string,
      score: number
    ) => {

      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          userId,
          birthDate,
          secretId,
          score,
        })
      );

      go({
        path: "/create-join",
        fromPage: "SecretSetup",
      });
    },

    // 4. その他必要なプログラム
    // 特典計算プログラム
    calculateScoreFn: calculateScore,
    // localstrage取得プログラム
    getLocalStorage: (key: string) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    }

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;