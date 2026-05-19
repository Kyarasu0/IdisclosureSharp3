// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// Core/Registries/FunctionsRegistry.ts

import type { Participant } from "../../../Workspace/Functions/2-Utils/initGame.ts"

import { useSafeNavigate } from "../../../Workspace/Functions/1-Hooks/useSafeNavigate.ts";
import { useSafeNavGuard } from "../../../Workspace/Functions/1-Hooks/useSafeNavGuard.ts";
import { calculateScore } from "../../../Workspace/Functions/2-Utils/calculateScore.ts";
import { createRoom } from "../../../Workspace/Functions/3-Photon/createRoom.ts";
import { joinRoom } from "../../../Workspace/Functions/3-Photon/joinRoom.ts";
import { disconnectPhoton } from "../../../Workspace/Functions/3-Photon/disconnectPhoton.ts";
import { subscribePhotonPlayers } from "../../../Workspace/Functions/3-Photon/subscribePhotonPlayers.ts";
import { setCustomProperties } from "../../../Workspace/Functions/3-Photon/setCustomProperties.ts";
import { getCustomProperties } from "../../../Workspace/Functions/3-Photon/getCustomProperties.ts";
import { sendData } from "../../../Workspace/Functions/3-Photon/sendData.ts";
import { receiveData } from "../../../Workspace/Functions/3-Photon/receiveData.ts";
import { initGame, initActor } from "../../../Workspace/Functions/2-Utils/initGame.ts";

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
    GoToCreateJoinFromWaiting: () => {
      disconnectPhoton();
      go({ path: "/create-join", fromPage: "Waiting" });
    },
    // 2. ページガード
    GuardWaiting: () => guard({
      allowedFromPages: ["CreateJoin"],
      redirectPath: "/create-join",
    }),
    // 3. 参加者一覧取得
    subscribePhotonPlayers: subscribePhotonPlayers,
    // 4. ゲーム開始
    GoToPCDesktopFromWaitingMaster: (
      participants: Participant[],
      getLocalStorage: <T>(key: string) => T,
      eventCode: number,
    ) => {
      initGame( participants, getLocalStorage, eventCode );
      go({ path: "/pc-desktop", fromPage: "Waiting" });
    },
    GoToPCDesktopFromWaitingClient: (
      participants: Participant[],
      getLocalStorage: <T>(key: string) => T,
      eventCode: number,
    ) => {
      initActor( participants, getLocalStorage, eventCode );
      go({ path: "/pc-desktop", fromPage: "Waiting" });
    },
    // 5. プロパティの情報を取得/保存
    setCustomProperties: setCustomProperties,
    getCustomProperties: getCustomProperties,
    // 6. データの送受信
    sendData: sendData,
    receiveData: receiveData,

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;