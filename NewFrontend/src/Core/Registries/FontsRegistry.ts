import { FONT as MajorFont } from "../../Workspace/Theme/Appearance/FontPalettes/MajorFontPalette/MajorFontPalette";

export const FontsRegistry = {

    MajorFont,

} as const;

export type FontKey = keyof typeof FontsRegistry;