import styles from './TimeDial.module.css';
import { Plus, Minus } from "lucide-react";

export const TimeDial = ({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) => {
  const radius = 55;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - ((value - 5) / 10) * circumference;

  return (
    <div className={styles.dialSection}>
      {/* 横並びラッパー */}
      <div className={styles.dialRow}>
        
        {/* マイナスボタン */}
        {!disabled && (
          <button
            className={styles.dialButton}
            onClick={() => value > 5 && onChange(value - 1)}
          >
            <Minus size={16} />
          </button>
        )}


        {/* 円形ダイヤル */}
        <div
          className={styles.dialCircleWrapper}
          style={{ width: radius * 2, height: radius * 2 }}
        >
          <svg
            height={radius * 2}
            width={radius * 2}
            className={styles.dialSvg}
          >
            <circle
              className={styles.dialBg}
              strokeWidth={stroke}
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className={styles.dialProgress}
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset: offset }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          <div className={styles.dialCenterText}>
            <div className={styles.dialValue}>{value}</div>
            <div className={styles.dialUnit}>MINS</div>
          </div>
        </div>

        {/* プラスボタン */}
        {!disabled && (
          <button
            className={styles.dialButton}
            onClick={() => value < 15 && onChange(value + 1)}
          >
            <Plus size={16} />
          </button>
        )}

      </div>

      {/* ラベル */}
      <div className={styles.dialLabel}>MISSION DURATION</div>
    </div>
  );
};
