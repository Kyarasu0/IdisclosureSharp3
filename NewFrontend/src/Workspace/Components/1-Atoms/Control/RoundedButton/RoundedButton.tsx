// =================================================================
// Components/1-Atoms/Control/RoundedButton/RoundedButton.tsx
// =================================================================

// デザインに関連するファイルをインポート
import styles from "./RoundedButton.module.css";
import type { LucideIcon } from "lucide-react";

type RoundedButtonProps = {
    label?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    mainColor?: string;
}

export const RoundedButton = ({
    label = "",
    icon: Icon,
    onClick = () => { alert("RoundedButton!") },
    size = "md",
    mainColor = "var(--cyan)"
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
                padding: `${scale}rem ${scale * 2}rem`,
                fontSize: `${scale * 4/5}rem`,
                "--main-color": mainColor
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