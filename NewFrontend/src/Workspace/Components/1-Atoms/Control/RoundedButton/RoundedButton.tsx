// =================================================================
// Components/1-Atoms/Control/RoundedButton/RoundedButton.tsx
// =================================================================

// デザインに関連するファイルをインポート
import styles from "./RoundedButton.module.css";
import type { LucideIcon } from "lucide-react";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

type RoundedButtonProps = {
    label?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
}

export const RoundedButton = ({
    label = "",
    icon: Icon,
    onClick = () => { alert("RoundedButton!") },
    size = "md"
}: RoundedButtonProps ) => {
    let scale = 0.75;
    switch(size){
        case "sm": scale *= 2/3; break;
        case "lg": scale *= 2; break;
    }
    const { palette, font } = useAppearance();
    return(
        <button
            onClick={onClick}
            className={ styles.roundedButton }
            style={{
                "--cyan": palette.cyan,
                "--black-glass": palette.blackGlass,
                fontFamily: font.primary,
                padding: `${scale}rem ${scale * 2}rem`,
                fontSize: `${scale * 4/5}rem`,
            } as React.CSSProperties}
        >
            <span className={styles.content}>
                {Icon && <Icon 
                    className={styles.icon} 
                    size={scale * 20}
                />}
                {label}
            </span>
        </button>
    );
}