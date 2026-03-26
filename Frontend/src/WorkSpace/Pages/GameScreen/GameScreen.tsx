import { Terminal, Database, Wifi, BatteryMedium, Server } from "lucide-react";
import { GlassWindow } from "../../Components/Cards/GlassWindow/GlassWindow";
import styles from "./GameScreen.module.css";
import { useEffect, useState } from "react";
import { DurationDisplay } from '../../Components/Infomation/DurationDisplay/DurationDisplay';
import { Logo } from '../../Components/Infomation/Logo/Logo';

export function GameScreen() {
  const [timeLeft, setTimeLeft] = useState(70); // 10分

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.app}>
      <div className={styles.grid}>

        {/* ========== LEFT ========== */}
        <div className={styles.column}>
          {/* 0. LOGO */}
          <div className={styles.logo}>
            <Logo />
          </div>

          {/* 1. STATUS */}
          <GlassWindow icon={Database} title="Wallet" subTitle="Balance">
            <div>
              <div style={{ fontSize: 22, color: "#22d3ee" }}>4,120 BS</div>
              <div style={{ fontSize: 12 }}>Tier: Gold</div>
            </div>
          </GlassWindow>

          {/* 2. NETWORK */}
          <GlassWindow icon={Server} title="Nodes" subTitle="Connections">
            <div>
              <div style={{ fontSize: 22, color: "#22d3ee" }}>127.0.0.1</div>
              <div style={{ fontSize: 22, color: "#22d3ee" }}>203.0.113.194</div>
            </div>
          </GlassWindow>

          {/* 3. LOG */}
          <GlassWindow icon={Terminal} title="System_Log" subTitle="Live">
            <div className={styles.scroll}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i}>[INFO] Node_{i}</div>
              ))}
            </div>
          </GlassWindow>
        </div>

        {/* ========== CENTER ========== */}
        <div className={styles.column}>
          <GlassWindow icon={Terminal} title="Browser" subTitle="Access Panel">
            <div>
              <input
                style={{
                  width: "100%",
                  background: "black",
                  color: "#22d3ee",
                  border: "1px solid #22d3ee",
                }}
                defaultValue="https://target.local"
              />

              <div style={{ marginTop: 20, textAlign: "center" }}>
                AUTH REQUIRED
              </div>
            </div>
          </GlassWindow>
        </div>

        {/* ========== RIGHT ========== */}
        <div className={styles.column}>

          {/* 1. 残り時間*/}
          <div className={styles.timerBox}>
            <DurationDisplay duration={timeLeft} />
          </div>

          {/* 2. BATTERY */}
          <GlassWindow icon={BatteryMedium} title="Energy" subTitle="Core">
            <div>82%</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </GlassWindow>

          {/* 3. WIFI */}
          <GlassWindow icon={Wifi} title="Network" subTitle="Scanner">
            {["SECURE_ALPHA", "FREE_WIFI", "NODE_X"].map((w, i) => (
              <div key={i} className={styles.wifiItem}>
                <span>{w}</span>
                <span>•••</span>
              </div>
            ))}
          </GlassWindow>

        </div>

      </div>
    </div>
  );
}