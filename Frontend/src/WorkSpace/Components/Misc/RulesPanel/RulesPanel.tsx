import { Terminal, AlertTriangle } from "lucide-react";
import styles from "./RulesPanel.module.css";

type Validation = {
  id: string;
  label: string;
  valid: boolean;
  cost?: number; // 新しく追加
};

export const RulesPanel = ({ validations }: { validations: Validation[] }) => {
  const totalCost = validations.reduce((sum, v) => sum + (v.cost ?? 0), 0);
  return (
    <div className={styles.panel}>
      {/* 装飾的なヘッダー */}
      <div className={styles.header}>
        <h2 className={styles.protocol}>
          <Terminal size={14} />
          BLUE_SHARD_CALCULATOR
        </h2>

        <h1 className={styles.title}>
          Secret ID{" "}
          <span className={styles.titleAccent}>
            SETTINGS
          </span>
        </h1>
      </div>

      {/* ルールリスト */}
      <div className={styles.ruleList}>
        <div className={styles.alert}>
          <span>Total Cost: {totalCost}<br />BlueShard = 100000 / Total Cost</span>
        </div>

        {validations.map((rule) => (
          <div
            key={rule.id}
            className={`${styles.ruleItem} ${
              rule.valid ? styles.ruleValid : styles.ruleInvalid
            }`}
          >
            <span className={styles.ruleLabel}>{rule.label}</span>

            {/* ✔の代わりにコスト表示 */}
            {rule.valid ? (
              <span className={styles.costText}>
                {rule.cost ?? 0} Cost
              </span>
            ) : (
              <div className={styles.dot} />
            )}
          </div>
        ))}
      </div>

      {/* 装飾的なフッターテキスト */}
      <div className={styles.footer}>
        <p>SECURE CONNECTION ESTABLISHED</p>
        <p>ENCRYPTION: AES-256-GCM</p>
        <p>NODE: TOKYO-03</p>
      </div>

      {/* 背景テクスチャ */}
      <div className={styles.textureOverlay} />
    </div>
  );
};
