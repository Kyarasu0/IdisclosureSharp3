import React, { useState, useEffect } from "react";
import styles from "./TimerDisplay.module.css";

interface TimerDisplayProps {
  label?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  label = "MISSION_DURATION"
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  return (
    <div
      className={styles.ctpContainer}
    >
      <div className={styles.ctpMainPanel}>

        {/* 四隅装飾 */}
        <div className={`${styles.ctpCornerDecor} ${styles.ctpTl}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpTr}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpBl}`} />
        <div className={`${styles.ctpCornerDecor} ${styles.ctpBr}`} />

        {/* 時計エリア */}
        <div className={styles.ctpClockArea}>
          <div className={styles.ctpSystemTag}>{label}</div>

          <div className={styles.ctpDigitalDisplay}>
            <span className={styles.ctpTimeDigit}>{hours}</span>
            <span className={styles.ctpTimeSeparator}>:</span>
            <span className={styles.ctpTimeDigit}>{minutes}</span>
            <span className={styles.ctpTimeSeparatorSmall}>:</span>
            <span className={styles.ctpSecondsDigit}>{seconds}</span>
          </div>

          <div className={styles.ctpDataLog}>
            LATENCY: 12ms / STATUS: STABLE
          </div>
        </div>
      </div>

      {/* 走査線 */}
      <div className={styles.ctpScanlineOverlay} />
    </div>
  );
};
