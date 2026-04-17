import { PALETTE as MajorCyberPalette } from "../../Workspace/Theme/Appearance/ColorPalettes/MajorCyberPalette";

export const PalettesRegistry = {

    MajorCyberPalette,

} as const;

export type PaletteKey = keyof typeof PalettesRegistry;