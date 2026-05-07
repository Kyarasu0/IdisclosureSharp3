// ==================================================================
// Components/2-Molecules/CyberList/CyberList.tsx
// ==================================================================

import styles from "./CyberList.module.css";

// ==================================================
// 1件分の型
// ==================================================
type RuleItem = {
  id: string;              // key用
  label: string;           // 表示文字
  valid: boolean;          // 成功 / 失敗
  value?: string | number; // 右側表示（任意）
  onClick?: (id: string) => void;
};

// ==================================================
// Props
// ==================================================
type Props = {
  items: RuleItem[];
  mode?: "list" | "button";
  // 空でも使えるように任意
  className?: string;
};

// ==================================================
// CyberList
// ==================================================
export function CyberList({
  items,
  mode = "list",
  className = "",
}: Props) {
  return (
    <ul className={`${styles.list} ${className}`}>
      {/* 配列を自動でリスト化 */}
      {items.map((item) => {
        // 描画タグ切り替え
        const Component = mode === "button" ? "button" : "li";

        return (
          <Component
            key={item.id}
            className={item.valid ? styles.ok : styles.ng}
            onClick={() => {
              item.onClick?.(item.id);
            }}
          >
            {/* 左文字 */}
            <span className={styles.label}>
              {item.label}
            </span>

            {/* 右側表示（あれば出す） */}
            {item.value !== undefined && (
              <span className={styles.value}>
                + {item.value}
              </span>
            )}
          </Component>
        )
      })}
    </ul>
  );
}