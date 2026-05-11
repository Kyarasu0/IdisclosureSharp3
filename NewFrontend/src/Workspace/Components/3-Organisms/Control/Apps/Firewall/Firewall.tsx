// ============================================================================
// Firewall.tsx
// シンプル構成版
// - 状態管理を最小化
// - alert は panel に集約
// - slot を小コンポーネント化
// - JSX の ternary を削減
// ============================================================================

import { useEffect, useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Activity,
  X,
  Server,
  Lock,
  AlertTriangle,
  Plus
} from 'lucide-react';

import styles from './Firewall.module.css';

// =======================================================
// IPv4 バリデーション(IPv4かを確認してOKかどうかを判別する)
// =======================================================
const isValidIP = (ip: string) => {
    // "."で分割する
    const parts = ip.split('.');
    // 4つの部分があるかを確認
    if (parts.length !== 4) return false;
    // それぞれの桁の形式確認
    return parts.every((part) => {
        // 数字かどうか
        const num = Number(part);
        // 整数かつ0~255に収まっているか
        return (
            Number.isInteger(num) &&
            num >= 0 &&
            num <= 255 &&
            part === String(num)
        );
    });
};

// =========================
// Blocked Slot Component
// =========================
type IPSlotProps = {
  ip?: string;
  onRemove: (ip: string) => void;
};

function IPSlot({ ip, onRemove }: IPSlotProps) {

  // 空スロット
  if (!ip) {
    return (
      <div className={`${styles.ipSlot} ${styles.empty}`}>
        <span className={styles.emptyText}>[ EMPTY_SLOT ]</span>
      </div>
    );
  }

  // ブロック済みスロット
  return (
    <div className={`${styles.ipSlot} ${styles.blocked}`}>

      {/* 左ライン */}
      <div className={styles.blockedLine}></div>

      {/* 情報 */}
      <div className={styles.blockedInfo}>
        <span className={styles.blockedLabel}>
          BLOCKED_NODE
        </span>

        <span className={styles.blockedIP}>
          {ip}
        </span>
      </div>

      {/* 削除ボタン */}
      <button
        className={styles.removeBtn}
        onClick={() => onRemove(ip)}
      >
        <X size={18} />
      </button>

    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export const Firewall = () => {

  // ==========================================================================
  // 定数
  // ==========================================================================
  const MAX_IPS = 3;

  // ==========================================================================
  // State
  // ==========================================================================

  const [inputIP, setInputIP] = useState('');

  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);

  const [threatCount, setThreatCount] = useState(0);

  const [alertMode, setAlertMode] = useState(false);

  // ==========================================================================
  // 疑似攻撃シミュレーション
  // ==========================================================================
  useEffect(() => {

    const interval = setInterval(() => {

      // Block中IPが存在し
      // 25%で攻撃発生
      const shouldAttack =
        blockedIPs.length > 0 &&
        Math.random() < 0.25;

      if (!shouldAttack) return;

      // Alert開始
      setAlertMode(true);

      // Threat加算
      setThreatCount((prev) => prev + 1);

      // 2秒後に解除
      setTimeout(() => {
        setAlertMode(false);
      }, 2000);

    }, 2500);

    return () => clearInterval(interval);

  }, [blockedIPs]);

  // ==========================================================================
  // IP追加
  // ==========================================================================
  const handleAddIP = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const cleanIP = inputIP.trim();

    if (!isValidIP(cleanIP)) return;

    if (blockedIPs.includes(cleanIP)) return;

    if (blockedIPs.length >= MAX_IPS) return;

    setBlockedIPs((prev) => [...prev, cleanIP]);

    setInputIP('');
  };

  // ==========================================================================
  // IP削除
  // ==========================================================================
  const handleRemoveIP = (targetIP: string) => {

    setBlockedIPs((prev) =>
      prev.filter((ip) => ip !== targetIP)
    );
  };

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <div className={styles.container}>

      {/* 背景グリッド */}
      <div className={styles.grid}></div>

      {/* メインパネル */}
      <div
        className={`
          ${styles.panel}
          ${alertMode ? styles.alertMode : ''}
        `}
      >

        {/* コーナー装飾 */}
        <div className={`${styles.corner} ${styles.tl}`}></div>
        <div className={`${styles.corner} ${styles.tr}`}></div>
        <div className={`${styles.corner} ${styles.bl}`}></div>
        <div className={`${styles.corner} ${styles.br}`}></div>

        {/* 中身 */}
        <div className={styles.content}>

          {/* ================================================================ */}
          {/* Header */}
          {/* ================================================================ */}
          <div className={styles.header}>

            <div className={styles.headerLeft}>
              <Lock size={16} className={styles.icon} />

              <span className={styles.title}>
                FIREWALL_NEXUS_v7.2
              </span>
            </div>

            <div className={styles.headerRight}>

              <div className={styles.headerItem}>
                <span className={styles.headerLabel}>
                  STATUS:
                </span>

                <span className={styles.status}>
                  {alertMode
                    ? 'BREACH_ATTEMPT'
                    : 'SECURE'}
                </span>
              </div>

              <div className={styles.headerItem}>
                <span className={styles.headerLabel}>
                  UPTIME:
                </span>

                <span>99.99%</span>
              </div>

            </div>

          </div>

          {/* ================================================================ */}
          {/* Main */}
          {/* ================================================================ */}
          <div className={styles.main}>

            {/* ============================================================ */}
            {/* Left Visualizer */}
            {/* ============================================================ */}
            <div className={styles.visualizer}>

              {/* 上 */}
              <div className={styles.visualTop}>

                <Activity
                  size={22}
                  className={styles.icon}
                />

                <span className={styles.sectionLabel}>
                  NETWORK_CORE_VISUALIZER
                </span>

              </div>

              {/* 中央Shield */}
              <div className={styles.shieldArea}>

                <div className={`${styles.ring} ${styles.ringOuter}`}></div>

                <div className={`${styles.ring} ${styles.ringInner}`}></div>

                <div className={styles.shieldCore}>

                  {alertMode ? (
                    <ShieldAlert size={84} strokeWidth={1.5} />
                  ) : (
                    <Shield size={84} strokeWidth={1.2} />
                  )}

                </div>

              </div>

              {/* 下Stats */}
              <div className={styles.stats}>

                <div className={styles.statBox}>

                  <span className={styles.sectionLabel}>
                    BLOCKED_NODES
                  </span>

                  <span className={styles.statNumber}>
                    {blockedIPs.length}/{MAX_IPS}
                  </span>

                </div>

                <div className={styles.statBox}>

                  <span className={styles.sectionLabel}>
                    THREATS_PREVENTED
                  </span>

                  <span className={styles.statNumber}>
                    {threatCount}
                  </span>

                </div>

              </div>

            </div>

            {/* ============================================================ */}
            {/* Right Controls */}
            {/* ============================================================ */}
            <div className={styles.controls}>

              {/* Header */}
              <div className={styles.controlsHeader}>

                <Server size={16} />

                <span className={styles.controlsTitle}>
                  THREAT_ISOLATION
                </span>

              </div>

              {/* Form */}
              <form
                className={styles.form}
                onSubmit={handleAddIP}
              >

                <span className={styles.sectionLabel}>
                  TARGET IPv4 ADDRESS
                </span>

                <div className={styles.inputRow}>

                  <input
                    type="text"
                    value={inputIP}
                    placeholder="192.168.1.100"
                    onChange={(e) =>
                      setInputIP(e.target.value)
                    }
                    className={styles.input}
                    disabled={
                      blockedIPs.length >= MAX_IPS
                    }
                  />

                  <button
                    type="submit"
                    className={styles.addBtn}
                    disabled={
                      blockedIPs.length >= MAX_IPS
                    }
                  >
                    <Plus size={18} />
                  </button>

                </div>

                {/* 警告 */}
                {blockedIPs.length >= MAX_IPS && (
                  <div className={styles.warning}>

                    <AlertTriangle size={12} />

                    <span>
                      MAXIMUM BLOCK CAPACITY REACHED
                    </span>

                  </div>
                )}

              </form>

              {/* IP一覧 */}
              <div className={styles.list}>

                <span className={styles.sectionLabel}>
                  ACTIVE_BLOCK_RULES
                </span>

                {[0, 1, 2].map((index) => (
                  <IPSlot
                    key={index}
                    ip={blockedIPs[index]}
                    onRemove={handleRemoveIP}
                  />
                ))}

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className={styles.footer}></div>

        </div>

      </div>

    </div>
  );
}