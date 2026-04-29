import type { PageKey } from "../Registries/PagesRegistry";

//URL直打ちでの画面遷移の防御を有効にするかどうか
const isNavigationBlocked: boolean = true;

export const MainOutline: {
  path: string;
  page: PageKey;
  props?: Record<string, unknown>;
}[] = [
  {
    path: "/",
    page: "Introduction",
    props: {
      onMoveClick: "GoToUserSetupFromIntroduction"
    },
  },
  {
    path: "/user-setup",
    page: "UserSetup",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      onGuard: "GuardUserSetup",
      onReturnClick: "GoToIntroductionFromUserSetup",
      onSaveAndMoveClick: "GoToSecretSetupFromUserSetup",
    },
  },
  {
    path: "/secret-setup",
    page: "SecretSetup",
    props:{
      isNavigationBlocked: isNavigationBlocked,
      onGuard:"GuardSecretSetup",
      onReturnClick:"GoToUserSetupFromSecretSetup",
      onConfirmClick:"GoToCreateJoinFromSecretSetup",
      getLocalStorage: "getLocalStorage",
      calculateScoreFn: "calculateScoreFn",
    }
  },
  {
    path: "/create-join",
    page: "CreateJoin",
    props: {
      isNavigationBlocked: isNavigationBlocked,
      onGuard: "GuardCreateJoin",
      onReturnClick: "GoToSecretSetupFromCreateJoin",
      getLocalStorage: "getLocalStorage",
      onCreateRoom: "CreateRoomAndMove",
      onJoinRoom: "JoinRoomAndMove"
    }
  },
  // {
  //   path: "/waiting",
  //   page: "Waiting",
  //   props: {
  //     isNavigationBlocked: isNavigationBlocked,
  //     onGuard: "GuardWaiting",
  //     getPhotonPlayers: "GetPhotonPlayers",
  //     onStartGame: "GoToDesktopFromWaiting"
  //   }
  // }
];