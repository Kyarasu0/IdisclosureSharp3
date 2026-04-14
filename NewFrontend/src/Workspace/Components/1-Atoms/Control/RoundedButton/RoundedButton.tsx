// =================================================================
// Components/1-Atoms/Control/RoundedButton/RoundedButton.tsx
// =================================================================

// デザインに関連するファイルをインポート
import styles from "./RoundedButton.module.css";
import { PALETTE } from "./../../../../Theme/Palettes/MajorCyberPalette";
import type { LucideIcon } from "lucide-react";

type RoundedButtonProps = {
    label?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
}

export const RoundedButton = ({
    label = "Click me!",
    icon: Icon,
    onClick = () => { console.log("RoundedButton!") },
    size = "md"
}: RoundedButtonProps ) => {
    let scale = 0.75;
    switch(size){
        case "sm": scale *= 2/3; break;
        case "lg": scale *= 2; break;
    }
    return(
        <button
            onClick={onClick}
            className={ styles.roundedButton }
            style={{
                "--cyan": PALETTE.cyan,
                "--black-glass": PALETTE.blackGlass,
                padding: `${scale}rem ${scale * 2}rem`,
                fontSize: `${scale * 4/5}rem`,
            } as React.CSSProperties}
        >
            <span className={styles.content}>
                {Icon && <Icon className={styles.icon} />}
                {label}
            </span>
        </button>
    );
}