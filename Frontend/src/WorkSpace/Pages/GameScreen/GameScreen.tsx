import { Terminal, Database, Wifi, BatteryMedium, Server, Stone, Monitor, HardDrive, BrickWallFire } from "lucide-react";
import { GlassWindow } from "../../Components/Cards/GlassWindow/GlassWindow";
import { ProgressBar } from "../../Components/Infomation/ProgressBar/ProgressBar";
import { CurrencyDisplay } from "../../Components/Infomation/CurrencyDisplay/CurrencyDisplay";

import { BrowserWidget } from "../../Components/Widgets/BrowserWidget/BrowserWidget";
import FirewallWidget from "../../Components/Widgets/FirewallWidget/FirewallWidget";
import { TerminalWidget } from "../../Components/Widgets/TerminalWidget/TerminalWidget";
import { PhishingWidget } from "../../Components/Widgets/PhishingWidget/PhishingWidget";

import { AppIcon } from "../../Components/Misc/AppIcon/AppIcon";
import styles from "./GameScreen.module.css";
import { useEffect, useState } from "react";
import { DurationDisplay } from '../../Components/Infomation/DurationDisplay/DurationDisplay';
import { Logo } from '../../Components/Infomation/Logo/Logo';

export function GameScreen() {
  type AppType =
  | "browser"
  | "firewall"
  | "terminal"
  | "server"
  | "phishing";

  const [timeLeft, setTimeLeft] = useState(100000);
  const [selectedWifi, setSelectedWifi] = useState<string>("BASE_STATION_09");
  const [activeApp, setActiveApp] = useState<AppType>("browser");

  const renderApp = () => {
  switch (activeApp) {
    case "browser":
      return <BrowserWidget />;
    case "firewall":
      return <FirewallWidget />;
    case "terminal":
      return <TerminalWidget />;
    case "phishing":
      return <PhishingWidget />;
    default:
      return null;
  }
};

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

    const saved = localStorage.getItem("selectedWifi");
    if (saved) {
      setSelectedWifi(saved);
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.grid}>

        {/* ========== LEFT ========== */}
        <div className={styles.column}>
          {/* 0. LOGO */}
          <div className={styles.logo}>
            <Logo />
          </div>

          {/* 1. Player Information */}
          <GlassWindow icon={Database} title="Player Information">
            <CurrencyDisplay
              amount={"Kyarasu's PC"}
              label="This Device is..."
              icon={<Monitor size={18} />}
              color={"#7ed957"}
            />
            <CurrencyDisplay
              amount={"4120"}
              label="BlueShard"
              icon={<Stone size={18} />}
              color={"#35CBDB"}
            />
          </GlassWindow>

          {/* 2. IP List */}
          <GlassWindow icon={Server} title="IP List">
            <CurrencyDisplay
              amount={"123.123.123.123"}
              label="PC IP"
              icon={<Monitor size={18} />}
              color={"#7ed957"}
            />
            <CurrencyDisplay
              amount={"123.123.123.123"}
              label="Server IP"
              icon={<HardDrive size={18} />}
              color={"#ff66c4"}
            />
          </GlassWindow>

          {/* 3. LOG */}
          <GlassWindow icon={Terminal} title="System Log">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>[INFO] Node_{i}</div>
            ))}
          </GlassWindow>
        </div>

        {/* ========== CENTER ========== */}
        <div className={styles.centerColumn}>

          <div className={styles.centerInner}>

            {/* ===== Browser ===== */}
            <div className={styles.mainArea}>
              {renderApp()}
            </div>

            {/* ===== Applications ===== */}
            <div className={styles.subArea}>
              <GlassWindow icon={Monitor} title="Apps">

                <div className={styles.appGridVertical}>

                  <AppIcon
                    icon={<BrickWallFire size={20} />}
                    label="Firewall"
                    color="#7ed957"
                    onClick={() => setActiveApp("firewall")}
                    isActive={activeApp === "firewall"}
                  />

                  <AppIcon
                    icon={<Server size={20} />}
                    label="Server"
                    color="#ff66c4"
                    onClick={() => setActiveApp("phishing")}
                    isActive={activeApp === "phishing"}
                  />

                  <AppIcon
                    icon={<Terminal size={20} />}
                    label="Terminal"
                    color="#35CBDB"
                    onClick={() => setActiveApp("terminal")}
                    isActive={activeApp === "terminal"}
                  />

                  <AppIcon
                    icon={<Monitor size={20} />}
                    label="Browser"
                    color="#22d3ee"
                    onClick={() => setActiveApp("browser")}
                    isActive={activeApp === "browser"}
                  />

                </div>

              </GlassWindow>
            </div>

          </div>

        </div>

        {/* ========== RIGHT ========== */}
        <div className={styles.column}>

          {/* 1. 残り時間*/}
          <div className={styles.timerBox}>
            <DurationDisplay duration={timeLeft} />
          </div>

          {/* 2. BATTERY */}
          <GlassWindow icon={BatteryMedium} title="Battery">
            <div className={styles.Battery}>
              This represents your PC's battery.<br/>If it runs out completely, it's game over.
              <ProgressBar
                value={82}
                icon={<BatteryMedium size={35} />}
              />
            </div>
          </GlassWindow>

          {/* 3. WIFI */}
          <GlassWindow icon={Wifi} title="WiFi">
            <div className={styles.activeBox}>
              <div className={styles.activeLabel}>ACTIVE</div>
              <div className={styles.activeName}>{selectedWifi}</div>
            </div>

            <div>
              {[
                { id: "SECURE_ALPHA" },
                { id: "FREE_AIR_PUBLIC" },
                { id: "UNKNOWN_HOST_X" },
                { id: "GUEST_GATEWAY" },
                { id: "NULL_POINTER" },
              ].map((w, i) => (
                <div
                  key={i}
                  className={`${styles.wifiRow} ${
                    selectedWifi === w.id ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setSelectedWifi(w.id);
                    localStorage.setItem("selectedWifi", w.id);
                  }}
                >
                  <div className={styles.left}>
                    <Wifi size={12} className={styles.wifiIcon} />
                    <span className={styles.wifiName}>{w.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassWindow>

        </div>

      </div>
    </div>
  );
}