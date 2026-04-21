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
    GoToUserSetupFromIntroduction: () =>
      go({
        path: "/user-setup",
        fromPage: "Introduction",
      }),

    // ====================
    // UserSetup
    // ====================
    GoToIntroductionFromUserSetup: () =>
      go({
        path: "/",
        fromPage: "UserSetup",
      }),

    GuardUserSetup: () =>
      guard({
        allowedFromPages: ["Introduction"],
        redirectPath: "/user-setup",
      }),
    
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

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;