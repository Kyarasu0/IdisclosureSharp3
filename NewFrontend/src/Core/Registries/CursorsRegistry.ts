import { TapRipple } from "../../Workspace/Theme/CursorEffects/TapRipple/TapRipple";

export const CursorsRegistry = {

    TapRipple,

} as const;

export type CursorKey = keyof typeof CursorsRegistry;