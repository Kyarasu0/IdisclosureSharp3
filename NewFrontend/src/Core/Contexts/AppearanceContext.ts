// Core/Contexts/AppearanceContext.ts
import { createContext, useContext } from "react";

// 必要に応じて型をちゃんと分けてもOK
export type Appearance = {
    palette: Record<string, string>;
    font: Record<string, string>;
    scoreName: string;
    initialScore: number,
    userIdCost: number,
    birthYearCost: number,
    birthDayCost: number,
    noiseCost: number,
    eventMap: Record<string, number>,
    wifiSet: string[],
};

export const AppearanceContext = createContext<Appearance | null>(null);

export const useAppearance = () => {
    const ctx = useContext(AppearanceContext);
    if (!ctx) throw new Error("AppearanceContext is not provided");
    return ctx;
};