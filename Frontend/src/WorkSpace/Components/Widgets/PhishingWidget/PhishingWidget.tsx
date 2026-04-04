import { useState, useEffect } from "react";
import {
  Server,
  Power,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { CyberWindow } from "./../../Cards/CyberWindow/CyberWindow";
import styles from "./PhishingWidget.module.css";

const TARGET_SITES = [
  { id: "sns", name: "Connect-X", security: "Low" },
  { id: "bank", name: "Swift Bank", security: "High" },
  { id: "mail", name: "SkyMail", security: "Medium" },
];

export const PhishingWidget = () => {
  const [bootState, setBootState] = useState(0);
  const [activeSite, setActiveSite] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [alertActive, setAlertActive] = useState(false);

  // Boot
  useEffect(() => {
    const t1 = setTimeout(() => setBootState(1), 300);
    const t2 = setTimeout(() => setBootState(2), 700);
    const t3 = setTimeout(() => setBootState(3), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 起動
  const startHosting = (id: string) => {
    setActiveSite(id);
    setLogs([]);
    generateLogs();
  };

  // 停止
  const stopHosting = () => {
    setAlertActive(true);
    setTimeout(() => {
      setActiveSite(null);
      setLogs([]);
      setAlertActive(false);
    }, 500);
  };

  // ログ生成（ループ）
  const generateLogs = () => {
    const baseLogs = [
      "Cloning target DOM...",
      "Injecting credential listener...",
      "Spoofing SSL certificate...",
      "Starting proxy server...",
      "Waiting for victim connection...",
    ];

    baseLogs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
      }, i * 600);
    });

    // ループログ
    setInterval(() => {
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Incoming traffic...`,
      ]);
    }, 2000);
  };

  const current = TARGET_SITES.find(s => s.id === activeSite);

  return (
    <CyberWindow bootState={bootState} alertActive={alertActive}>
      <div className={styles.wrapper}>

        {/* ===== 状態①: 選択 ===== */}
        {!activeSite && (
          <div className={styles.grid}>
            {TARGET_SITES.map(site => (
              <button
                key={site.id}
                onClick={() => startHosting(site.id)}
                className={styles.card}
              >
                <Globe size={18} />
                <div>
                  <div className={styles.title}>{site.name}</div>
                  <div className={styles.meta}>
                    SECURITY: {site.security}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ===== 状態②: ホスティング中 ===== */}
        {activeSite && current && (
          <div className={styles.hosting}>

            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <Server size={18} />
                <span>{current.name} SPOOF ACTIVE</span>
              </div>

              <button onClick={stopHosting} className={styles.power}>
                <Power size={18} />
              </button>
            </div>

            {/* Logs */}
            <div className={styles.logBox}>
              {logs.map((log, i) => (
                <div key={i} className={styles.log}>
                  {log}
                </div>
              ))}
            </div>

            {/* Status */}
            <div className={styles.status}>
              <ShieldAlert size={16} />
              <span>PHISHING SERVER RUNNING</span>
            </div>
          </div>
        )}

      </div>
    </CyberWindow>
  );
};