import type { PageKey } from "../../Registries/AxisRegistries/PagesRegistry";

//URL直打ちでの画面遷移の防御を有効にするかどうか
const isNavigationBlocked: boolean = false;

export const SharpOneAxisOutline: {
  path: string;
  page: PageKey;
  props?: Record<string, unknown>;
}[] = [
  {
    path: "/",
    page: "Introduction",
    props: {
      // 次ページに遷移
      onMoveClick: "GoToUserSetupFromIntroduction"
    },
  },
  {
    path: "/user-setup",
    page: "UserSetup",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      // 前ページに遷移
      onReturnClick: "GoToIntroductionFromUserSetup",
      // ページガード
      onGuard: "GuardUserSetup",
      // 次ページに遷移
      onSaveAndMoveClick: "GoToSecretSetupFromUserSetup",
    },
  },
  {
    path: "/secret-setup",
    page: "SecretSetup",
    props:{
      isNavigationBlocked: isNavigationBlocked,
      // 前ページに遷移
      onReturnClick:"GoToUserSetupFromSecretSetup",
      // ページガード
      onGuard:"GuardSecretSetup",
      // 次ページに遷移
      onConfirmClick:"GoToCreateJoinFromSecretSetup",

      // ローカルストレージから情報を取得
      getLocalStorage: "getLocalStorage",
      // 点数計算関数
      calculateScoreFn: "calculateScoreFn",
    }
  },
  {
    path: "/create-join",
    page: "CreateJoin",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      // 前ページに遷移
      onReturnClick: "GoToSecretSetupFromCreateJoin",
      // ページガード
      onGuard: "GuardCreateJoin",
      // 次ページに遷移
      onCreateRoom: "CreateRoomAndMove",
      onJoinRoom: "JoinRoomAndMove",
      onSaveAndMoveClick: "GoToWaitingFromCreateJoin",

      // ローカルストレージから情報を取得
      getLocalStorage: "getLocalStorage",
    }
  },
  {
    path: "/waiting",
    page: "Waiting",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      // 前ページに遷移
      onReturnClick: "GoToCreateJoinFromWaiting",
      // ページガード
      onGuard: "GuardWaiting",
      // 次ページに遷移
      onStartGame: "GoToPCDesktopFromWaitingMaster",
      getStartGame: "GoToPCDesktopFromWaitingClient",

      // ローカルストレージから情報を取得
      getLocalStorage: "getLocalStorage",
      // プロパティから情報を取得/保存
      getCustomProperties: "getCustomProperties",
      setCustomProperties: "setCustomProperties",
      // データの送受信
      sendData: "sendData",
      receiveData: "receiveData",
      // Photonから参加プレイヤーの情報を取得/保存
      subscribePhotonPlayers: "subscribePhotonPlayers",
    }
  },
  {
    path: "/pc-desktop",
    page: "PCDesktop",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      // 前ページに遷移
      onReturnClick: "GoToCreateJoinFromWaiting",
      // ページガード
      onGuard: "GuardWaiting",
      // 次ページに遷移
      onStartGame: "GoToPCDesktopFromWaitingMaster",
      getStartGame: "GoToPCDesktopFromWaitingClient",

      // ローカルストレージから情報を取得
      getLocalStorage: "getLocalStorage",
      // プロパティから情報を取得/保存
      getCustomProperties: "getCustomProperties",
      setCustomProperties: "setCustomProperties",
      // データの送受信
      sendData: "sendData",
      receiveData: "receiveData",
      // Photonから参加プレイヤーの情報を取得/保存
      subscribePhotonPlayers: "subscribePhotonPlayers",
    }
  }
];