// 型読み込み
/// <reference path="../../types/photon.d.ts" />

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
    },

    // ====================
    // CreateJoin
    // ====================
    // 1. 前のページへ遷移
    GoToSecretSetupFromCreateJoin: () =>
      go({
        path: "/secret-setup",
        fromPage: "CreateJoin",
      }),
    
    // ガード
    GuardCreateJoin: () =>
      guard({
        allowedFromPages: ["SecretSetup", "Waiting"],
        redirectPath: "/create-join",
      }),

    // 部屋作成
    CreateRoomAndMove: (roomName: string, userName: string, photonApiKey: string) => {
      const Photon = (window as any).Photon;

      if (!Photon?.LoadBalancing) {
        console.error("Photon not loaded");
        return;
      }

      if (!photonApiKey) {
        console.error("Missing API key");
        return;
      }

      localStorage.setItem(
        "photonSettings",
        JSON.stringify({ photonApiKey, roomName })
      );

      const client =
        new Photon.LoadBalancing.LoadBalancingClient(
          Photon.ConnectionProtocol.Wss,
          photonApiKey,
          "1.0"
        );

      client.myActor().setName(userName);

      client.onStateChange = (state: number) => {
        if (state === 4) {
          client.createRoom(roomName, { maxPlayers: 8 });
        }

        if (state === 8) {
          (window as any).photonClient = client;

          go({
            path: "/waiting",
            fromPage: "CreateJoin",
          });
        }
      };

      client.connectToRegionMaster("jp");
    },

    // 部屋参加
    JoinRoomAndMove: (roomName: string, userName: string, photonApiKey: string) => {
      const Photon = (window as any).Photon;

      if (!Photon?.LoadBalancing) {
        console.error("Photon not loaded");
        return;
      }

      if (!photonApiKey) {
        console.error("Missing API key");
        return;
      }

      localStorage.setItem(
        "photonSettings",
        JSON.stringify({ photonApiKey,roomName })
      );

      const client =
        new Photon.LoadBalancing.LoadBalancingClient(
          Photon.ConnectionProtocol.Wss,
          photonApiKey,
          "1.0"
        );

      client.myActor().setName(userName);

      client.onStateChange = (state: number) => {
        if (state === 4) {
          client.joinRoom(roomName);
        }

        if (state === 8) {
          (window as any).photonClient = client;

          go({
            path: "/waiting",
            fromPage: "CreateJoin",
          });
        }
      };

      client.connectToRegionMaster("jp");
    },

    // 切断処理
    onDisconnectPhoton: () => {
      const client = (window as any).photonClient;

      if (!client) {
        console.warn("No Photon client found");
        return;
      }

      try {
        // ルームから退出（入っていれば）
        if (client.isJoinedToRoom?.()) {
          client.leaveRoom?.();
        }

        // サーバーから切断
        client.disconnect?.();

      } catch (e) {
        console.error("Disconnect failed:", e);
      }

      // グローバル参照を削除
      (window as any).photonClient = null;
    },

    // ====================
    // Waiting
    // ====================
    // 1. 前のページへ遷移
    GoToCreateJoinFromWaiting: () =>
      go({
        path: "/create-join",
        fromPage: "Waiting",
      }),

    // ガード
    GuardWaiting: () =>
      guard({
        allowedFromPages: ["CreateJoin"],
        redirectPath: "/create-join",
      }),

    // 参加者一覧取得
    GetPhotonPlayers: () => {
      const client = (window as any).photonClient;
      if (!client) return [];

      const actors = client.myRoomActorsArray() || [];

      return actors.map((actor: any) => ({
        actorNr: actor.actorNr,
        name: actor.name || `Player${actor.actorNr}`,
        isLocal: actor.isLocal,
        isMasterClient: actor.actorNr === 1
      }));
    },

    // ゲーム開始
    GoToDesktopFromWaiting: () =>
      go({
        path: "/pc-desktop",
        fromPage: "Waiting",
      }),

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;