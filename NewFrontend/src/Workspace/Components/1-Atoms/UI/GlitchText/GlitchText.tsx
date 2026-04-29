// =================================================
// Components/1-Atoms/UI/GlitchText/GlitchText.tsx
// =================================================

// デザインに関連する情報をインポート
import styles from "./GlitchText.module.css";

type Props = {
  content: string;
  className?: string;
};

export const GlitchText = ({ content, className = "" }: Props) => {

  return (
    <div className={`${styles.glitch} ${className}`}>
        <span className={styles.base}>
            <span className={styles.layer0}>{content}</span>
            <span className={styles.layer1}>{content}</span>
            <span className={styles.layer2}>{content}</span>
        </span>
    </div>
  );
};