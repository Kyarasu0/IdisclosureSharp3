// ===================================================
// Components/1-Atoms/UI/ProgressBar/ProgressBar.tsx
// ===================================================

// デザインに関連する情報をインポート
import styles from "./ProgressBar.module.css";

type Props = {
  progress: number; // 0〜100
  color?: string;
  backgroundColor?: string;
};

export function ProgressBar({
  progress,
  color = "linear-gradient(90deg, var(--cyan), var(--pink))",
  backgroundColor = "var(--darkGray)",
}: Props) {
  return (
    <div className={styles.progress} style={{ background: backgroundColor }}>
      <div
        className={styles.bar}
        style={{
          width: `${progress}%`,
          background: color,
        }}
      />
    </div>
  );
}