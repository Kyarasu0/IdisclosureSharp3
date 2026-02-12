import { useEffect, useState } from "react";
import styles from './UserHud.module.css';
import { Activity, Terminal, Shield, Gem, Cake } from 'lucide-react';
import { GlitchText } from '../../Texts/GlitchText/GlitchText';

type UserData = {
  userId: string;
  secretId: string;
  score: number;
  birthDate: string;
};

type Props = {
  userData: UserData;
};

export const UserHud = ({ userData }: Props) => {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const measurePing = async () => {
      try {
        const start = performance.now();
        await fetch("/ping.txt", { cache: "no-store" });
        const ms = performance.now() - start;
        setLatency(Math.round(ms));
      } catch {
        setLatency(null);
      }
    };

    measurePing();
    const interval = setInterval(measurePing, 5000);
    return () => clearInterval(interval);
  }, []);

  // 0〜300msを100%にマッピング
  const getWidth = () => {
    if (latency === null) return 0;
    const clamped = Math.min(latency, 300);
    return 100 - (clamped / 300) * 100;
  };

  const getColor = () => {
    if (latency === null) return "#334155";
    if (latency < 80) return "#22d3ee";     // 良好
    if (latency < 180) return "#facc15";    // 注意
    return "#ef4444";                       // 危険
  };

  const getStatusText = () => {
    if (latency === null) return "SYNCING...";
    if (latency < 80) return "STABLE";
    if (latency < 180) return "UNSTABLE";
    return "CRITICAL";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {/* Header */}
        <div className={styles.headerTag}>
          <Activity size={12} className={styles.pulseIcon} />
          <span>USER_STATUS_MONITOR</span>
        </div>

        <div className={styles.content}>
          
          {/* Identity */}
          <div className={styles.identitySection}>
            <div className={styles.iconBox}>
              <Terminal size={24} />
            </div>

            <div>
              <div className={styles.identityLabel}>User ID</div>
              <GlitchText
                text={userData.userId}
                className={styles.identityValue}
              />
            </div>
          </div>

          {/* Status Details */}
          <div className={styles.statusList}>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Cake size={14} />
                BIRTH_DATE
              </span>
              <span className={styles.dateValue}>
                {userData.birthDate}
              </span>
            </div>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Shield size={14} />
                SECRET_ID
              </span>
              <span className={styles.secretValue}>
                {userData.secretId}
              </span>
            </div>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Gem size={14} />
                BLUE_SHARD
              </span>
              <span className={styles.scoreValue}>
                {userData.score.toLocaleString()}
              </span>
            </div>

          </div>

          {/* 🔥 Network Footer */}
          <div className={styles.footer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${getWidth()}%`,
                  background: getColor(),
                }}
              />
            </div>

            <div className={styles.footerMeta}>
              <span>Network: {getStatusText()}</span>
              <span>{latency !== null ? `${latency}ms` : "..."}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
