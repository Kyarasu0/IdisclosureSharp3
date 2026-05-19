// ============================================================================
// Firewall.tsx
// シンプル構成版
// - 状態管理を最小化
// - alert は panel に集約
// - slot を小コンポーネント化
// - JSX の ternary を削減
// ============================================================================

import { useEffect, useState } from 'react';

// 他のコンポーネントをインポート
import { ValidatedInputField } from "../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";

// 自作関数のインポート
import { getCustomProperties } from '../../../Functions/3-Photon/getCustomProperties';

// デザインに関するファイルをインポート
import {
  Shield,
  ShieldAlert,
  X,
  Crosshair
} from 'lucide-react';
import styles from './Firewall.module.css';
import { setCustomProperties } from '../../../Functions/3-Photon/setCustomProperties';

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
  mainColor?: string;
  onRemove: (ip: string) => void;
};

function IPSlot({ ip, mainColor, onRemove }: IPSlotProps) {

  // 空スロット
  if (!ip) {
    return (
      <div 
        className={`${styles.ipSlot} ${styles.empty}`}
        style={{ 
          border: `1px solid ${mainColor}`, 
          color: mainColor,
          backgroundColor: `${mainColor}_opWeak`,
        }}
      >
        <span className={styles.emptyText}>[ EMPTY_SLOT ]</span>
      </div>
    );
  }

  // ブロック済みスロット
  return (
    <div className={styles.ipWrapper}>
      <div className={`${styles.ipSlot} ${styles.blocked}`}>

        {/* 左ライン */}
        <div className={styles.blockedLine}></div>

        {/* 情報 */}
        <div className={styles.blockedInfo}>
          <span className={styles.blockedLabel}>
            BLOCKED IP
          </span>

          <span className={styles.blockedIP}>
            {ip}
          </span>
        </div>
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

type FirewallProps = {
  mainColor: string;
  currentDevice: "PC" | "Server";
}

type DeviceInfo = {
  batteryNow: number;
  blockedIpList: string[];
  terminalLog?: string[];
  isPhishingNow?: boolean;
};

// ============================================================================
// Main Component
// ============================================================================
export const Firewall = ({
  mainColor,
  currentDevice
}: FirewallProps) => {
  const MAX_IPS = JSON.parse(getCustomProperties("playerList") || '[]').length;

  const [inputIP, setInputIP] = useState('');
  const [threatCount, setThreatCount] = useState(0);
  const [alertMode, setAlertMode] = useState(false);

  const internalUserId = String(localStorage.getItem("internalUserId"));
  const playerInfo = JSON.parse(getCustomProperties(internalUserId) || '{}');
  const [pcInfo, setPcInfo] = useState<DeviceInfo>({
    batteryNow: 100,
    blockedIpList: [],
  });
  const [serverInfo, setServerInfo] = useState<DeviceInfo>({
    batteryNow: 100,
    blockedIpList: [],
  });

  // 表示したとき
  useEffect(() => {

    // 最新情報の読み出し
    const pcData = JSON.parse(getCustomProperties(playerInfo.pcIp) || '{}');
    const serverData = JSON.parse(getCustomProperties(playerInfo.serverIp) || '{}');

    // 情報のセット
    setPcInfo({
      batteryNow: pcData.batteryNow ?? 100,
      blockedIpList: pcData.blockedIpList ?? [],
      terminalLog: pcData.terminalLog ?? [],
    });
    setServerInfo({
      batteryNow: serverData.batteryNow ?? 100,
      blockedIpList: serverData.blockedIpList ?? [],
      terminalLog: serverData.terminalLog ?? [],
      isPhishingNow: serverData.isPhishingNow ?? false,
    });

  }, [currentDevice]);

  const currentInfo = currentDevice === "PC" ? pcInfo : serverInfo;

  // // ==========================================================================
  // // 疑似攻撃シミュレーション
  // // ==========================================================================
  // useEffect(() => {

  //   const interval = setInterval(() => {

  //     // Block中IPが存在し
  //     // 25%で攻撃発生
  //     const shouldAttack =
  //       blockedIPs.length > 0 &&
  //       Math.random() < 0.25;

  //     if (!shouldAttack) return;

  //     // Alert開始
  //     setAlertMode(true);

  //     // Threat加算
  //     setThreatCount((prev) => prev + 1);

  //     // 2秒後に解除
  //     setTimeout(() => {
  //       setAlertMode(false);
  //     }, 2000);

  //   }, 2500);

  //   return () => clearInterval(interval);

  // }, [blockedIPs]);

  // ===============
  // IPの追加/削除
  // ===============
  // IPの追加
  const handleAddIP = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const cleanIP = inputIP.trim();

    if (!isValidIP(cleanIP)) return;
    if (currentInfo.blockedIpList.includes(cleanIP)) return;
    if (currentInfo.blockedIpList.length >= MAX_IPS) return;

    const updatedInfo = {
      ...currentInfo,
      blockedIpList: [
        ...currentInfo.blockedIpList,
        cleanIP
      ]
    };

    if (currentDevice === "PC") {
      setPcInfo(updatedInfo);
      setCustomProperties(
        playerInfo.pcIp,
        JSON.stringify(updatedInfo)
      );
    } else {
      setServerInfo(updatedInfo);
      setCustomProperties(
        playerInfo.serverIp,
        JSON.stringify(updatedInfo)
      );
    }

    setInputIP('');
  };
  
  // IP削除
  const handleRemoveIP = (targetIP: string) => {

    const updatedInfo = {
      ...currentInfo,
      blockedIpList: currentInfo.blockedIpList.filter(
        ip => ip !== targetIP
      )
    };

    if (currentDevice === "PC") {
      setPcInfo(updatedInfo);
      setCustomProperties(
        playerInfo.pcIp,
        JSON.stringify(updatedInfo)
      );
    } else {
      setServerInfo(updatedInfo);
      setCustomProperties(
        playerInfo.serverIp,
        JSON.stringify(updatedInfo)
      );
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <div className={styles.firewallContainer}>

      {/* ============================================================ */}
      {/* FrontLayer */}
      {/* ============================================================ */}
      <div className={styles.frontLayer}>

        {/* Form */}
        <form
          className={styles.form}
          onSubmit={handleAddIP}
        >
          <ValidatedInputField
            label="TARGET IPv4 ADDRESS"
            value={inputIP}
            onChange={setInputIP}
            required={true}
            placeholder="ENTER TARGET IPv4 ADDRESS "
            icon={<Crosshair size={18} />}
            className={styles.firewallInput}
            mainColor={mainColor}
          />
        </form>

        {/* IP一覧 */}
        <div className={styles.list}>

          {Array.from({ length: MAX_IPS }).map((_, index) => (
            <IPSlot
              key={index}
              ip={currentInfo.blockedIpList[index]}
              mainColor={mainColor}
              onRemove={handleRemoveIP}
            />
          ))}

        </div>

        {/* 下統計情報 */}
        <div className={styles.stats}>

          <div 
            className={styles.statBox}
            style={{ 
              border: `1px solid ${mainColor}` ,
              color: mainColor,
              textShadow: `0 0 10px ${mainColor}`
            }}  
          >
            <span className={styles.sectionLabel}>
              BLOCKED_NODES
            </span>
            <span className={styles.statNumber}>
              {currentInfo.blockedIpList.length}/{MAX_IPS}
            </span>
          </div>

          <div 
            className={styles.statBox}
            style={{ 
              border: `1px solid ${mainColor}` ,
              color: mainColor,
              textShadow: `0 0 10px ${mainColor}`
            }}  
          >
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
      {/* BackLayer */}
      {/* ============================================================ */}
      <div className={styles.backLayer}>

        {/* 中央Shield */}
        <div className={styles.shieldArea}>

          {/* リング群 */}
          <div className={`${styles.ring} ${styles.ringOuter}`}></div>
          <div className={`${styles.ring} ${styles.ringInner}`}></div>

          {/* シールド */}
          <div className={styles.shieldCore}>

            {alertMode ? (
              <ShieldAlert size={84} strokeWidth={1.5} />
            ) : (
              <Shield size={84} strokeWidth={1.2} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}