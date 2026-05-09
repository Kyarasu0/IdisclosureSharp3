
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

// ページ用のアウトラインをインポート
import { SharpOneAppOutline } from "../../../../Core/Outlines/AppOutlines/SharpOneAppOutline";

import { useAppearance } from "../../../../Core/Contexts/AppearanceContext";

// デザインに関するファイルをインポート
import styles from "./PCDesktop.module.css";
import { Terminal, Router, UserRound, Globe, BatteryCharging, Wifi, AppWindow } from "lucide-react";

export const PCDesktop = () => {
    const appearance = useAppearance();
    const appOutline = SharpOneAppOutline;

    const [activeWifi, setActiveWifi] = useState("WiFi_1");
    const [currentDevice, setCurrentDevice] = useState("PC");

    const wifis = appearance.wifiSet.map(wifi => ({
        id: wifi,
        label: wifi,
        valid: activeWifi === wifi,
        onClick: () => { setActiveWifi(wifi); },
    }))
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
                            classNameInner={styles.ipInner}
                        >
                            <span>{appearance.scoreName}:</span>
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
                <div className={`${styles.row} ${styles.centerRow}`}>
                    <GlassWindow
                        icon={Globe}
                        title="Browser"
                        mainColor="var(--cyan)"
                        subColor="var(--pink)"
                        /* MultiFunctionWindow */
                        className={styles.MFW}
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

                    <GlassWindow
                        icon={AppWindow}
                        title="App"
                        mainColor="var(--cyan)"
                        subColor="var(--pink)"
                        /* ApplicationSelectionWindow */
                        className={styles.ASW}
                    >
                        {appOutline
                        .filter(app => app.isVisible.includes(currentDevice))
                        .map((app, index) => {
                            const Icon = app.icon;

                            if (app.isVisible.includes(currentDevice)) {

                                const color =
                                    index === 0
                                        ? currentDevice === "PC"
                                            ? "var(--pink)"
                                            : "var(--cyan)"
                                        : currentDevice === "PC"
                                            ? "var(--cyan)"
                                            : "var(--pink)";

                                return (
                                    <ApplicationIcon 
                                        key={app.appName}
                                        icon={<Icon size={28} />}
                                        label={app.appName}
                                        color={color}
                                        variant="cut"
                                    />
                                );

                            }

                            return null;
                        })}
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
                        <CyberList items={wifis} className={styles.cyberList} mode={"button"}/>

                    </GlassWindow>
                </div>
            </div>
        </div>
    );
}