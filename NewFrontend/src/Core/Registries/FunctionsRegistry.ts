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
        allowedFromPages: ["Introduction", "SecretSetup"],
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

    // ====================
    // SecretSetup
    // ====================
    GoToCreateJoinFromSecretSetup: (
      secretId: string,
      score: number
    ) => {
      const raw = localStorage.getItem("registrationData");

      const base = raw ? JSON.parse(raw) : {};

      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          ...base,
          secretId,
          score,
        })
      );

      go({
        path: "/create-join",
        fromPage: "SecretSetup",
      });
    },

    GuardSecretSetup: () =>
      guard({
        allowedFromPages: ["UserSetup", "CreateJoin"],
        redirectPath: "/secret-setup",
      }),

  };
};

export type FunctionKey = keyof ReturnType<typeof FunctionsRegistry>;