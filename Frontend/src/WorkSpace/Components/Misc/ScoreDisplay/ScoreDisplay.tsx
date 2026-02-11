import styles from "./ScoreDisplay.module.css";
import { Gem } from "lucide-react";

// ==========================================
// コンポーネント: スコア (同期率) 表示
// ==========================================
export const ScoreDisplay = ({
  score,
  text,
}: {
  score: number;
  text: string;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <Gem size={13} /> {text}
      </div>

      <div className={styles.numberWrapper}>
        <div className={styles.number}>
          {score.toString().padStart(4, "0")}
        </div>

        {/* グリッチレイヤー */}
        <div className={styles.glitch}>
          {score.toString().padStart(4, "0")}
        </div>
      </div>
    </div>
  );
};
