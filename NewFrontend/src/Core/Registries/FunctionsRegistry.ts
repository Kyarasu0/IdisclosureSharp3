// Core/Registries/FunctionsRegistry.ts

import { useSafeNavigate } from "../../Workspace/Functions/Hooks/useSafeNavigate";
import { useSafeNavGuard } from "../../Workspace/Functions/Hooks/useSafeNavGuard";

export const FunctionsRegistry = () => {
  const go = useSafeNavigate();
  const guard = useSafeNavGuard();

  return {

    // ====================
    // Introduction
    // ====================
    GoToIntroductionFromUserSedtup: () =>
      go({
        path: "/",
        fromPage: "UserSetup",
      }),

    // ====================
    // UserSetup
    // ====================
    GoToUserSetupFromIntroduction: () =>
      go({
        path: "/user-setup",
        fromPage: "Introduction",
      }),

    GuardUserSetup: () =>
      guard({
        allowedFromPages: ["Introduction"],
        redirectPath: "/user-setup",
      }),

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;