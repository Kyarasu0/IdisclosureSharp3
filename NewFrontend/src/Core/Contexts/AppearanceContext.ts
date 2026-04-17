// Core/Contexts/AppearanceContext.ts
import { createContext, useContext } from "react";

// 必要に応じて型をちゃんと分けてもOK
export type Appearance = {
    palette: Record<string, string>;
    font: Record<string, string>;
};

export const AppearanceContext = createContext<Appearance | null>(null);

export const useAppearance = () => {
    const ctx = useContext(AppearanceContext);
    if (!ctx) throw new Error("AppearanceContext is not provided");
    return ctx;
};