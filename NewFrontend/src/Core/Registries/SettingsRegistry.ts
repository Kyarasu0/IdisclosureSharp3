import { MajorSettings } from "../../Workspace/Theme/Settings/MajorSettings";

export const SettingsRegistry = {

    MajorSettings,

} as const;

export type AnimationKey = keyof typeof MajorSettings;