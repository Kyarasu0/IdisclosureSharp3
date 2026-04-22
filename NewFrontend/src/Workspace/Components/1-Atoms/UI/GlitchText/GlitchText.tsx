// =================================================
// Components/1-Atoms/UI/GlitchText/GlitchText.tsx
// =================================================

// デザインに関連する情報をインポート
import styles from "./GlitchText.module.css";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

type Props = {
  content: string;
  className?: string;
};

export const GlitchText = ({ content, className = "" }: Props) => {
  const { palette, font } = useAppearance();

  return (
    <div className={`${styles.glitch} ${className}`}>
        <span 
            className={styles.base}
            style={{ 
                color: palette.cyan,
                fontFamily: font.secondary,
            }}
        >
            {content}
            <span 
                className={styles.layer1}
                style={{ 
                    color: "white",
                    fontFamily: font.secondary,
                }}
            >{content}</span>
            <span 
                className={styles.layer2}
                style={{ 
                    color: palette.pink,
                    fontFamily: font.secondary,
                }}
            >{content}</span>
        </span>
    </div>
  );
};