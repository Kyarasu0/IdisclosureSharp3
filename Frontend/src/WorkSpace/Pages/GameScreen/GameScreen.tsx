import { Terminal, Shield, Database } from "lucide-react";
import { GlassWindow } from "../../Components/Cards/GlassWindow/GlassWindow";
import styles from "./GameScreen.module.css";

export function GameScreen() {
  return (
    <div className={styles.app}>
      <div className={styles.grid}>

        {/* Window 1 */}
        <GlassWindow
          icon={Terminal}
          title="System_Log"
          subTitle="Live Monitor"
        >
          <div className={styles.logArea}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={styles.logLine}>
                [INFO] Node_{i.toString().padStart(2, "0")} synchronized successfully.
              </div>
            ))}
          </div>
        </GlassWindow>

        {/* Window 2 */}
        <GlassWindow
          icon={Shield}
          title="Security_Status"
          subTitle="Firewall Active"
        >
          <div className={styles.statusBox}>
            <div className={styles.statusItem}>
              <span>Intrusion Attempts</span>
              <span className={styles.alert}>12</span>
            </div>
            <div className={styles.statusItem}>
              <span>Encryption</span>
              <span className={styles.ok}>AES-256</span>
            </div>
            <div className={styles.statusItem}>
              <span>System Integrity</span>
              <span className={styles.ok}>98%</span>
            </div>
          </div>
        </GlassWindow>

        {/* Window 3 */}
        <GlassWindow
          icon={Database}
          title="Data_Storage"
          subTitle="Shard Vault"
        >
          <div className={styles.dataBox}>
            <div className={styles.dataNumber}>12,540 BSH</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        </GlassWindow>

      </div>
    </div>
  );
};
