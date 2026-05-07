
// 基本的な関数をインポート
import { useState } from "react";

// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { GlassWindow } from "../../2-Molecules/Windows/GlassWindow/GlassWindow";
import { ApplicationIcon } from "../../1-Atoms/Control/ApplicationIcon/ApplicationIcon";
import { SlantedFrame } from "../../1-Atoms/UI/SlantedFrame/SlantedFrame";
import { DurationDisplay } from "../../1-Atoms/UI/DurationDisplay/DurationDisplay";
import { CyberList } from "../../2-Molecules/CyberList/CyberList";
import { ProgressBar } from "../../1-Atoms/UI/ProgressBar/ProgressBar";

// デザインに関するファイルをインポート
import styles from "./PCDesktop.module.css";
import { Terminal, Router, UserRound, Globe, BatteryCharging, Wifi } from "lucide-react";

export const PCDesktop = () => {
    const [activeWifi, setActiveWifi] = useState("WiFi_1");
    const ruleItems = [
        {
            id: "WiFi_1",
            label: "WiFi_1",
            valid: activeWifi === "WiFi_1",
            onClick: () => { setActiveWifi("WiFi_1"); }
        },
        {
            id: "WiFi_2",
            label: "WiFi_2",
            valid: activeWifi === "WiFi_2",
            onClick: () => { setActiveWifi("WiFi_2"); }
        },
        {
            id: "WiFi_3",
            label: "WiFi_3",
            valid: activeWifi === "WiFi_3",
            onClick: () => { setActiveWifi("WiFi_3"); }
        },
        {
            id: "WiFi_4",
            label: "WiFi_4",
            valid: activeWifi === "WiFi_4",
            onClick: () => { setActiveWifi("WiFi_4"); }
        },
    ];
    return(
        <div className={styles.pcDesktopContainer}>
            {/*==========  LEFT ========== */}
            <div className={styles.left}>

                {/* LEFT_1: Logo */}
                <div className={styles.row}>
                    <Logo />
                </div>

                {/* LEFT_2: プレイヤー情報 */}
                <div className={styles.row}>
                    <GlassWindow
                        icon={UserRound}
                        title="Kyarasu Device"
                    >
                        {/* Score表示 */}
                        <SlantedFrame
                            color="var(--cyan)"
                            backgroundColor="var(--cyan_opWeak)"
                            className={styles.ip}
                        >
                            <span>Blue Shard:</span>
                            <span>30</span>
                        </SlantedFrame>

                    </GlassWindow>
                </div>
            
                {/* LEFT_3: IPs */}
                <div className={styles.row}>
                    <GlassWindow
                        icon={Router}
                        title="DEVICE IP List"
                    >
                        {/* PC IP */}
                        <SlantedFrame
                            color="var(--green)"
                            backgroundColor="var(--green_opWeak)"
                            className={styles.ip}
                            classNameInner={styles.ipInner}
                        >
                            <span>PC IP:</span>
                            <span>123.123.123.123</span>
                        </SlantedFrame>

                        {/* Server IP */}
                        <SlantedFrame
                            color="var(--pink)"
                            backgroundColor="var(--pink_opWeak)"
                            className={styles.ip}
                            classNameInner={styles.ipInner}
                        >
                            <span>Server IP:</span>
                            <span>123.123.123.123</span>
                        </SlantedFrame>

                    </GlassWindow>
                </div>

                {/* LEFT_4: System Log */}
                <div className={`${styles.row} ${styles.lastRow}`}>
                    <GlassWindow
                        icon={Terminal}
                        title="System Log"
                        contentAlign="flex-start"
                        className={styles.systemLog}
                    >
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                        <span>[root] System Log</span>
                    </GlassWindow>
                </div>
            </div>


            {/*==========  CENTER ========== */}
            <div className={styles.center}>
                <div className={styles.row}>
                    <GlassWindow
                        icon={Globe}
                        title="Browser"
                    >
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                        <Logo />
                    </ GlassWindow>
                </div>
            </div>


            {/*========== RIGHT ========== */}
            <div className={styles.right}>
                {/* RIGHT_1: 残り時間の表示 */}
                <div className={styles.row}>
                    <DurationDisplay
                        duration={63}
                        className={styles.durationDisplay}
                    />
                </div>

                {/* RIGHT_2: Battery */}
                <div className={styles.row}>
                    <GlassWindow
                        icon={BatteryCharging}
                        title="DEVICE Battery List"
                    >
                        {/* PC Battery */}
                        <SlantedFrame
                            color="var(--green)"
                            backgroundColor="var(--green_opWeak)"
                            className={styles.battery}
                            classNameInner={styles.batteryInner}
                        >
                            <div className={styles.batteryTitle}>
                                <span>PC Battery: </span><span>80%</span>
                            </div>
                            <ProgressBar
                                progress={80}
                                color="linear-gradient(90deg, var(--cyan), var(--green))"
                            />
                        </SlantedFrame>

                        {/* Server Battery */}
                        <SlantedFrame
                            color="var(--pink)"
                            backgroundColor="var(--pink_opWeak)"
                            className={styles.battery}
                            classNameInner={styles.batteryInner}
                        >
                            <div className={styles.batteryTitle}>
                                <span>Server Battery: </span><span>80%</span>
                            </div>
                            <ProgressBar
                                progress={80}
                                color="linear-gradient(90deg, var(--cyan), var(--pink))"
                            />
                        </SlantedFrame>

                    </GlassWindow>
                </div>

                {/* RIGHT_3: WiFi List */}
                <div className={`${styles.row} ${styles.lastRow}`}>
                    <GlassWindow
                        icon={Wifi}
                        title="WiFi"
                    >
                        <CyberList items={ruleItems} className={styles.cyberList}/>

                    </GlassWindow>
                </div>
            </div>
        </div>
    );
}