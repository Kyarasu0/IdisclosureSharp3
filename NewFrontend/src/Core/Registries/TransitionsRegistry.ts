import { FadeBlurTransition } from "../../Workspace/Theme/Transitions/FadeBlurTransition/FadeBlurTransition";

export const TransitionsRegistry = {

    FadeBlur: FadeBlurTransition,

} as const;

export type TransitionKey = keyof typeof TransitionsRegistry;