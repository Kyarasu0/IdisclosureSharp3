
// 基本的な関数をインポート
import { useState, useEffect } from "react";

import { createToolWeb } from "../../../Functions/5-Daemons/createToolWeb";
import { snsLeak } from "../../../Functions/5-Daemons/snsLeak";

// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { GlassWindow } from "../../2-Molecules/Windows/GlassWindow/GlassWindow";
import { ApplicationIcon } from "../../1-Atoms/Control/ApplicationIcon/ApplicationIcon";
import { SlantedFrame } from "../../1-Atoms/UI/SlantedFrame/SlantedFrame";
import { DurationDisplay } from "../../1-Atoms/UI/DurationDisplay/DurationDisplay";
import { CyberList } from "../../2-Molecules/CyberList/CyberList";
import { ProgressBar } from "../../1-Atoms/UI/ProgressBar/ProgressBar";
import { SOF } from "../../3-Organisms/UI/SOF/SOF";

// ページ用のアウトラインをインポート
import { SharpOneAppOutline } from "../../../../Core/Outlines/DesktopOutlines/SharpOneAppOutline";
import { AppsRegistry } from "../../../../Core/Registries/DesktopRegistries/AppsRegistry";
import type { AppKey } from "../../../../Core/Registries/DesktopRegistries/AppsRegistry";

import { useAppearance } from "../../../../Core/Contexts/AppearanceContext";

// デザインに関するファイルをインポート
import styles from "./PCDesktop.module.css";
import { Terminal, Router, UserRound, Globe, BatteryCharging, Wifi, AppWindow } from "lucide-react";

type WindowState =
  | "closed"
  | "opening"
  | "opened"
  | "closing";

  type Participant = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

type SOFState = {
    visible: boolean;
    result: "success" | "failed";
    title?: string;
};

export type Props = {
  // =========================
  // State Access Layer
  // =========================
  getLocalStorage: (key: string) => Record<string, string>;
  // 情報の保存
  getCustomProperties: (key: string) => string;
  // 情報の取得
  setCustomProperties: ( key: string, value: string ) => void;

  // =========================
  // Photon Event Layer
  // =========================

  sendData: <T>(
    eventCode: number,
    data: T,
    options?: any
  ) => void;

  receiveData: <T>(
    eventCode: number,
    cb: (data: T, actorNr: number) => void
  ) => () => void;

  // =========================
  // Player Sync Layer
  // =========================

  subscribePhotonPlayers: (
    cb: (players: {
      actorNr: number;
      name: string;
      isLocal: boolean;
      isMasterClient: boolean;
    }[]) => void
  ) => () => void;
};

export const PCDesktop = ({
    getLocalStorage,
    getCustomProperties,
    setCustomProperties,
    sendData,
    receiveData,
    subscribePhotonPlayers,
}: Props) => {
    /* ==================================
        Waitingで保存したデータの読み出し
  　================================== */
    const internalUserId = String(localStorage.getItem("internalUserId"));
    
    /* =========================
        UI State
  　========================= */
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [duration, setDuration] = useState<number>(Number(getCustomProperties("duration") || 5) * 60);

    const appearance = useAppearance();
    const appOutline = SharpOneAppOutline;

    // プレイヤー情報の取得
    const [playerInfo, setPlayerInfo] = useState(JSON.parse(getCustomProperties(internalUserId)));
    // PCのIPとその情報を取得
    const pcIp = playerInfo.pcIp || "123.123.123.123";
    const [pcIpInfo, setPcIpInfo] = useState(JSON.parse(getCustomProperties(pcIp)));
    // ServerのIPとその情報を取得
    const serverIp = playerInfo.serverIp || "123.123.123.123";
    const [serverIpInfo, setServerIpInfo] = useState(JSON.parse(getCustomProperties(serverIp)));
    // WiFiの初期化
    const [activeWifi, setActiveWifi] = useState("WiFi_1");
    playerInfo.wifi = activeWifi;
    setCustomProperties(internalUserId, JSON.stringify(playerInfo));
    // アクティブWebの設定
    const [activeWebList, setActiveWebList] = useState(JSON.parse(getCustomProperties("activeWebList") || "[]"));
    // デバイスの設定
    const [currentDevice, setCurrentDevice] = useState<"PC" | "Server">("PC");
    // アプリの設定
    const [currentApp, setCurrentApp] = useState<AppKey>("Browser");
    const [sofState, setSofState] = useState<SOFState>({
        visible: false,
        result: "success",
    });
    // スコアの設定
    const [score, setScore] = useState(playerInfo.score);
    // システムログの表示
    const [systemLog, setSystemLog] = useState(playerInfo.systemLog || ["Not found..."]);
    // SNSの段階と内容保持
    const [snsPosts, setSnsPosts] = useState(() => {
        return JSON.parse(getCustomProperties("snsPosts") || "[]");
    });
    const [executedSNSSteps, setExecutedSNSSteps] = useState<number[]>([]);

    // Windowの状態遷移の管理
    const [mfwState, setMfwState] = useState<WindowState>("opening");
    const [aswState, setAswState] = useState<WindowState>("opening");

    const CurrentAppComponent = AppsRegistry[currentApp];

    /* =========================================
     初期：Photon接続
    ========================================= */
    useEffect(() => {
        const unsubscribe = subscribePhotonPlayers(setParticipants);
        return () => unsubscribe?.();
    }, []);

    /* =========================================
     初期：保存値ロード
    ========================================= */
    useEffect(() => {
        const saved = getCustomProperties("duration");
        if (saved) setDuration(Number(saved));
    }, []);

    /* =========================================
     daemon設定
    ========================================= */
    /* =========================================
     🔥 自律分散型タイマー & SNS自動リークシミュレーション設定
    ========================================= */
    useEffect(() => {
        // 全体の制限時間(秒)を取得
        const totalDuration = Number(getCustomProperties("duration") || 5) * 60;
        // initGameでマスターが刻んだゲーム開始時間(ミリ秒)を取得
        const startTime = Number(getCustomProperties("startTime") || Date.now());
        // 6等分の間隔を計算
        const leakInterval = Math.floor(totalDuration / 6);

        const interval = setInterval(() => {
            const now = Date.now();
            // 開始からの経過時間(秒)
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            // 残り時間を逆算
            const remaining = totalDuration - elapsedSeconds;

            if (remaining <= 0) {
                setDuration(0);
                clearInterval(interval);
                console.log("[GAME OVER] Time up.");
                return;
            }

            // ─── 1. 残り時間の画面反映 ───
            setDuration(remaining);

            // ─── 2. 等分タイミングでの自動リーク判定 ───
            if (elapsedSeconds > 0 && elapsedSeconds % leakInterval === 0) {
                const currentStep = Math.floor(elapsedSeconds / leakInterval);

                // まだ未実行のステップであれば実行
                if (currentStep <= 6 && !executedSNSSteps.includes(currentStep)) {
                    setExecutedSNSSteps(prev => [...prev, currentStep]);

                    // ルーム内の全プレイヤーに対してリークを実行
                    const players: string[] = JSON.parse(getCustomProperties("playerList") || "[]");
                    players.forEach((pId) => {
                        // インポートしている「snsLeak」を呼び出す
                        snsLeak(pId, currentStep, setCustomProperties);
                    });

                    // 部屋の全員（自分含む）にSNSとWebが更新されたことをシグナル通知
                    sendData(appearance.eventMap.EVENT_ACTIVE_WEB_CHANGED, null, { receivers: 1 });
                }
            }

            // ─── 3. 確率でのToolWeb立ち上げ ───
            createToolWeb(appearance.eventMap.EVENT_ACTIVE_WEB_CHANGED, 0.01);

        }, 1000);

        return () => clearInterval(interval);
    }, [executedSNSSteps]); // 実行済みフラグが更新されたら最新のクロージャ環境を維持

    /* =========================================
     🔵 同期イベントシグナル受信レイヤー
    ========================================= */
    useEffect(() => {
        const unsub = receiveData<any>(
            appearance.eventMap.EVENT_ACTIVE_WEB_CHANGED,
            () => {
                // 誰かの環境でTool生成、もしくはリークが起きたらプロパティからデータを一斉再取得してStateに結合
                setActiveWebList(JSON.parse(getCustomProperties("activeWebList") || "[]"));
                
                // ★ SNSの投稿一覧をプロパティから再取得して同期！
                setSnsPosts(JSON.parse(getCustomProperties("snsPosts") || "[]"));

                // 個人ログやステータスの同期
                const latestPlayerInfo = JSON.parse(getCustomProperties(internalUserId) || "{}");
                if (latestPlayerInfo.systemLog) setSystemLog(latestPlayerInfo.systemLog);
                if (latestPlayerInfo.score !== undefined) setScore(latestPlayerInfo.score);
                setPlayerInfo(latestPlayerInfo);
            }
        );

        return () => unsub?.();
    }, []);
    /* =========================================
     WiFiリスト生成
    ========================================= */
    const wifis = appearance.wifiSet.map(wifi => ({
        id: wifi,
        label: wifi,
        valid: activeWifi === wifi,
        onClick: () => { 
            setActiveWifi(wifi);
            // 最新版を再取得
            setPlayerInfo(JSON.parse(getCustomProperties(internalUserId)));
            // 書き換え
            playerInfo.wifi = activeWifi;
            // 保存
            setCustomProperties(internalUserId, JSON.stringify(playerInfo));
        },
    }))

    /* =========================================
    SOF生成
    ========================================= */
    const showSOF = (
        result: "success" | "failed",
        title = "SYSTEM ACCESS"
    ) => {

        setSofState({
            visible: true,
            result,
            title,
        });

        // 数秒後に消す
        setTimeout(() => {
            setSofState(prev => ({
                ...prev,
                visible: false,
            }));
        }, 9000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setMfwState("opened");
            setAswState("opened");
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    /* =========================================
     アプリ切替
    ========================================= */
    const changeApp = (nextApp: AppKey) => {
        setMfwState("closing");

        setTimeout(() => {

            setCurrentApp(nextApp);

            setMfwState("opening");

            setTimeout(() => {
                setMfwState("opened");
            }, 700);

        }, 400);
    };

    /* =========================================
     デバイス切替
    ========================================= */
    const changeDevice = (nextDevice: "PC" | "Server") => {
        setMfwState("closing");
        setAswState("closing");

        setTimeout(() => {

            setCurrentDevice(
                nextDevice === "PC"
                    ? "Server"
                    : "PC"
            );

            setCurrentApp("Browser");

            setAswState("opening");

            setTimeout(() => {
                setAswState("opened");
                setMfwState("opening");
                setTimeout(() => {
                    setMfwState("opened");
                }, 700);
            }, 700);

        }, 400);
    }

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
                        title={`${playerInfo.userId} Device`}
                    >
                        {/* Score表示 */}
                        <SlantedFrame
                            color="var(--cyan)"
                            backgroundColor="var(--cyan_opWeak)"
                            className={styles.ip}
                            classNameInner={styles.ipInner}
                        >
                            <span>{appearance.scoreName}:</span>
                            <span>{score}</span>
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
                            <span>{playerInfo.pcIp}</span>
                        </SlantedFrame>

                        {/* Server IP */}
                        <SlantedFrame
                            color="var(--pink)"
                            backgroundColor="var(--pink_opWeak)"
                            className={styles.ip}
                            classNameInner={styles.ipInner}
                        >
                            <span>Server IP:</span>
                            <span>{playerInfo.serverIp}</span>
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
                        {systemLog.map((line: string, index: number) => (
                            <span key={index}>{line}</span>
                        ))}
                    </GlassWindow>
                </div>
            </div>


            {/*==========  CENTER ========== */}
            <div className={styles.center}>
                <div className={`${styles.row} ${styles.centerRow}`}>
                    <div className={styles.MFWWrapper}>
                        <GlassWindow
                            icon={SharpOneAppOutline.find(app => app.appName === currentApp)?.icon ?? Globe}
                            title={`${currentDevice} ${currentApp}`}
                            mainColor={currentDevice === "PC" ? "var(--cyan)" : "var(--pink)"}
                            subColor={currentDevice === "PC" ? "var(--pink)" : "var(--cyan)"}
                            /* MultiFunctionWindow */
                            className={styles.MFW}
                            state={mfwState}
                        >
                            {/* 通常アプリ */}
                            <CurrentAppComponent 
                                // tools={currentApp === "Browser" ? [{toolName: "SNSServer", toolWebIp: "124.124.124.124"}] : []}
                                currentDevice={currentDevice}
                                mainColor={currentDevice === "PC" ? "var(--cyan)" : "var(--pink)"}
                                subColor={currentDevice === "PC" ? "var(--pink)" : "var(--cyan)"}
                                userId={playerInfo.userId}
                                showSOF={showSOF}
                                activeWebList={activeWebList}
                                snsPosts={snsPosts}
                            />

                            {/* Overlay */}
                            {sofState.visible && (
                                <div className={styles.overlayLayer}>
                                    <SOF
                                        result={sofState.result}
                                        title={sofState.title}
                                    />
                                </div>
                            )}
                        </ GlassWindow>
                    </div>
                    
                    <div className={styles.ASWWrapper}>
                        <GlassWindow
                            icon={AppWindow}
                            title="App"
                            mainColor={currentDevice === "PC" ? "var(--cyan)" : "var(--pink)"}
                            subColor={currentDevice === "PC" ? "var(--pink)" : "var(--cyan)"}
                            /* ApplicationSelectionWindow */
                            className={styles.ASW}
                            state={aswState}
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

                                    const onClick =
                                        index === 0
                                            ? () => {
                                                changeDevice(currentDevice);
                                            }
                                            : () => {
                                                changeApp(app.appName as AppKey);
                                            };

                                    return (
                                        <ApplicationIcon 
                                            key={app.appName}
                                            icon={<Icon size={28} />}
                                            label={app.appName}
                                            color={color}
                                            onClick={onClick}
                                            variant="cut"
                                        />
                                    );

                                }

                                return null;
                            })}
                        </ GlassWindow>
                    </div>
                </div>
            </div>


            {/*========== RIGHT ========== */}
            <div className={styles.right}>
                {/* RIGHT_1: 残り時間の表示 */}
                <div className={styles.row}>
                    <DurationDisplay
                        duration={duration}
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
                                <span>PC Battery: </span><span>{`${pcIpInfo.batteryNow}%`}</span>
                            </div>
                            <ProgressBar
                                progress={pcIpInfo.batteryNow}
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
                                <span>Server Battery: </span><span>{`${serverIpInfo.batteryNow}%`}</span>
                            </div>
                            <ProgressBar
                                progress={serverIpInfo.batteryNow}
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