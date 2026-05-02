import { useEffect, useState } from "react";
import styles from "./DurationDisplay.module.css";

type Props = {
  label?: string;
  startTime?: Date;
  duration?: number;
  className?: string;
};

export const DurationDisplay = ({
  label = "MISSION DURATION",
  startTime,
  duration = 600,
  className,
}: Props) => {

  // ======================
  // 現在時刻（1秒ごと更新）
  // ======================
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // ==========================
  // 残り時間計算(超シンプル化)
  // ==========================

  // startTime がない場合は単純に duration を表示
  const elapsed = startTime
    ? Math.floor((now.getTime() - startTime.getTime()) / 1000)
    : 0;

  let remain = duration - elapsed;

  if (remain < 0) remain = 0;

  // 危険状態（残り60秒）
  const danger = remain <= 60;

  // 表示用フォーマット
  const min = String(Math.floor(remain / 60)).padStart(2, "0");
  const sec = String(remain % 60).padStart(2, "0");

  // ===============================

  return (
    <div className={`${styles.container} ${danger ? styles.danger : ""} ${className}`}>
        <div className={styles.panel}>

            {/* 四隅装飾 */}
            <div className={`${styles.corner} ${styles.tl}`} />
            <div className={`${styles.corner} ${styles.tr}`} />
            <div className={`${styles.corner} ${styles.bl}`} />
            <div className={`${styles.corner} ${styles.br}`} />

            {/* 時計 */}
            <div className={styles.clock}>
            <div className={styles.label}>{label}</div>

            <div className={`${styles.time} ${danger ? styles.danger : ""}`}>
                <span className={styles.min}>{min}</span>
                <span className={styles.colon}>:</span>
                <span className={styles.sec}>{sec}</span>
            </div>

            <div className={styles.label}>
                MISSION TIMER ACTIVE
            </div>
            </div>
        </div>

        {/* 走査線
        <div className={styles.scan} /> */}
    </div>
  );
};