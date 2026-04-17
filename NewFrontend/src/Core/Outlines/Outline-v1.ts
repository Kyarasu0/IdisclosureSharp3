import type { PageKey } from "../Registries/PagesRegistry";

//URL直打ちでの画面遷移を許可するかどうか
const isNavigationBlocked: boolean = false; 

export const MainOutline: {
  path: string;
  page: PageKey;
  props?: Record<string, unknown>;
}[] = [
  {
    path: "/",
    page: "Introduction",
    props: {},
  },
  {
    path: "/user-setup",
    page: "UserSetup",
    props: {
      isNavigationBlocked: isNavigationBlocked,
    },
  },
];