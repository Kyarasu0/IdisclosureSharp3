import styles from "./CyberDial.module.css";
import { Plus, Minus } from "lucide-react";

type Props = {
  value: number;
  onChange: (v: number) => void;

  min: number;
  max: number;
  step?: number;

  label?: string;
  unit?: string;

  disabled?: boolean;

  className?: string;
};

export const CyberDial = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit,
  disabled = false,
  className,
}: Props) => {

  // ===============================
  // 🎯 円の設定（見た目）
  // ===============================

  const radius = 55;
  const stroke = 6;

  const r = radius - stroke * 2;
  const circumference = 2 * Math.PI * r;

  // ===============================
  // 🔢 値の正規化（0〜1）
  // ===============================

  const range = max - min;
  const progress = (value - min) / range;

  const offset = circumference * (1 - progress);

  // ===============================
  // 🔘 操作
  // ===============================

  const dec = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const inc = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  // ===============================

  return (
    <div className={`${styles.container} ${className}`}>

      <div className={styles.row}>

        {!disabled && (
          <button className={styles.button} onClick={dec}>
            <Minus size={16} />
          </button>
        )}

        {/* ダイヤル */}
        <div
          className={styles.circle}
          style={{ width: radius * 2, height: radius * 2 }}
        >
          <svg className={styles.circleSvg} width={radius * 2} height={radius * 2}>

            {/* 背景 */}
            <circle
              className={styles.bg}
              r={r}
              cx={radius}
              cy={radius}
              strokeWidth={stroke}
              fill="transparent"
            />

            {/* 進捗 */}
            <circle
              className={styles.progress}
              r={r}
              cx={radius}
              cy={radius}
              strokeWidth={stroke}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          {/* 中央表示 */}
          <div className={styles.center}>
            <div className={styles.value}>{value}</div>

            {/* unitがある時だけ表示 */}
            {unit && <div className={styles.unit}>{unit}</div>}
          </div>
        </div>

        {!disabled && (
          <button className={styles.button} onClick={inc}>
            <Plus size={16} />
          </button>
        )}

      </div>

      {/* labelがある時だけ表示 */}
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};