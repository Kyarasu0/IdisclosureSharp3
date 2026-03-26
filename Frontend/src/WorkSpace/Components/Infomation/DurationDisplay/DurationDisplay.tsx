import React, { useState, useEffect } from "react";
import styles from "./DurationDisplay.module.css";

interface DurationDisplayProps {
  label?: string;
  startTime?: Date;      // ミッション開始時刻
  duration?: number;     // 秒単位（例: 600 = 10分）
}

export const DurationDisplay: React.FC<DurationDisplayProps> = ({
  label = "MISSION_DURATION",
  startTime,
  duration = 600,
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===============================
  // ⏱ 残り時間計算
  // ===============================

  let remainingSeconds = duration;

  if (startTime) {
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    remainingSeconds = duration - elapsed;
  }

  if (remainingSeconds < 0) remainingSeconds = 0;
  const isDanger = remainingSeconds <= 60;

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  // ===============================

  return (
    <div className={`${styles.ctpContainer} ${isDanger ? styles.danger : ""}`}>
      <div className={styles.ctpMainPanel}>

        {/* 四隅装飾 */}
        <div className={`${styles.ctpCornerDecor} ${styles.ctpTl}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpTr}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpBl}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpBr}`} />

        {/* 時計エリア */}
        <div className={styles.ctpClockArea}>
          <div className={styles.ctpSystemTag}>{label}</div>

          <div className={`${styles.ctpDigitalDisplay} ${isDanger ? styles.danger : ""}`}>
            <span className={styles.ctpTimeDigit}>{minutes}</span>
            <span className={styles.ctpTimeSeparator}>:</span>
            <span className={styles.ctpSecondsDigit}>{seconds}</span>
          </div>

          <div className={styles.ctpDataLog}>
            MISSION TIMER ACTIVE
          </div>
        </div>
      </div>

      {/* 走査線 */}
      <div className={styles.ctpScanlineOverlay} />
    </div>
  );
};
