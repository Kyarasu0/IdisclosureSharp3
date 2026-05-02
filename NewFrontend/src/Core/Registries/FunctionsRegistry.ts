// 型読み込み
/// <reference path="../../types/photon.d.ts" />

// Core/Registries/FunctionsRegistry.ts

import { useSafeNavigate } from "../../Workspace/Functions/Hooks/useSafeNavigate";
import { useSafeNavGuard } from "../../Workspace/Functions/Hooks/useSafeNavGuard";
import { calculateScore } from "../../Workspace/Functions/Utils/calculateScore";
import { createRoom } from "../../Workspace/Functions/Photon/createRoom";
import { joinRoom } from "../../Workspace/Functions/Photon/joinRoom";
import { disconnectPhoton } from "../../Workspace/Functions/Photon/disconnectPhoton";
import { getPhotonPlayers } from "../../Workspace/Functions/Photon/getPhotonPlayers";

export const FunctionsRegistry = () => {
  const go = useSafeNavigate();
  const guard = useSafeNavGuard();

  return {

    // ====================
    // Introduction
    // ====================
    // 1. 次のページへ遷移
    GoToUserSetupFromIntroduction: () => go({ path: "/user-setup", fromPage: "Introduction" }),

    // ====================
    // UserSetup
    // ====================
    // 1. 前のページへ遷移
    GoToIntroductionFromUserSetup: () => go({ path: "/", fromPage: "UserSetup" }),
    // 2. ページガード
    GuardUserSetup: () => guard({ 
      allowedFromPages: ["Introduction", "SecretSetup"], 
      redirectPath: "/user-setup"
    }),
    // 3. 情報を保存して次のページへ遷移
    GoToSecretSetupFromUserSetup: (userId: string, birthDate: string) => {
      localStorage.setItem(
        "registrationData",
        JSON.stringify({ userId, birthDate })
      );
      go({ path: "/secret-setup", fromPage: "UserSetup" });
    },

    // ====================
    // SecretSetup
    // ====================
    // 1. 前のページへ遷移
    GoToUserSetupFromSecretSetup: () => go({ path: "/user-setup", fromPage: "SecretSetup" }),
    // 2. ページガード
    GuardSecretSetup: () => guard({
      allowedFromPages: ["UserSetup", "CreateJoin"],
      redirectPath: "/secret-setup"
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
        JSON.stringify({ userId, birthDate, secretId, score })
      );
      go({ path: "/create-join", fromPage: "SecretSetup" });
    },
    // 4. その他必要なプログラム
    // 特典計算プログラム
    calculateScoreFn: calculateScore,
    // localstrage取得プログラム
    getLocalStorage: (key: string) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    },

    // ====================
    // CreateJoin
    // ====================
    // 1. 前のページへ遷移
    GoToSecretSetupFromCreateJoin: () => go({ path: "/secret-setup", fromPage: "CreateJoin" }),
    // 2. ページガード
    GuardCreateJoin: () => guard({
      allowedFromPages: ["SecretSetup", "Waiting"],
      redirectPath: "/create-join"
    }),
    // 3. 部屋作成
    CreateRoomAndMove: createRoom,
    // 4. 部屋参加
    JoinRoomAndMove: joinRoom,
    // 5. 切断処理
    onDisconnectPhoton: disconnectPhoton,
    // 6. ページ遷移
    GoToWaitingFromCreateJoin: () => go({ path: "/waiting", fromPage: "CreateJoin" }),

    // ====================
    // Waiting
    // ====================
    // 1. 前のページへ遷移
    GoToCreateJoinFromWaiting: () => go({ path: "/create-join", fromPage: "Waiting" }),
    // 2. ページガード
    GuardWaiting: () => guard({
      allowedFromPages: ["CreateJoin"],
      redirectPath: "/create-join",
    }),
    // 3. 参加者一覧取得
    GetPhotonPlayers: getPhotonPlayers,
    // 4. ゲーム開始
    GoToPCDesktopFromWaiting: () => go({ path: "/pc-desktop", fromPage: "Waiting" }),

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;