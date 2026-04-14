/* =========================================================================
    Compenents/1-Atoms/UI/GlitchText/GlitchText.module.css
========================================================================= */

// デザインに関連する情報をインポート
import styles from "./GlitchText.module.css";
import { PALETTE } from "./../../../../Theme/Palettes/MajorCyberPalette";

type Props = {
  text: string;
  className?: string;
};

export const GlitchText = ({ text, className = "" }: Props) => {
  return (
    <div className={`${styles.glitch} ${className}`}>
        <span 
            className={styles.base}
            style={{ color: PALETTE.cyan }}
        >{text}</span>
        <span 
            className={styles.layer1}
            style={{ color: PALETTE.pink }}
        >{text}</span>
        <span 
            className={styles.layer2}
            style={{ color: PALETTE.green }}
        >{text}</span>
    </div>
  );
};