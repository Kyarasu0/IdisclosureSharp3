import { MajorCyberBackground } from "../../../Workspace/Theme/Backgrounds/MajorCyberBackground/MajorCyberBackground";

export const BackgroundsRegistry = {

    MajorCyberBackground,

} as const;

export type AnimationKey = keyof typeof MajorCyberBackground;