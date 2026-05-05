// ==========================================
// Components/5-Pages/5-Waiting/Waiting.tsx
// ==========================================

// 基本的な関数をインポート
import { useEffect, useState } from "react";

// 他のコンポーネントをインポート
import { Lobby } from "../../4-Layouts/Lobby/Lobby";
import { WaitingForm } from "../../3-Organisms/Control/WaitingForm/WaitingForm";

import { useAppearance } from "../../../../Core/Contexts/AppearanceContext";

// デザインに関するファイルをインポート
import styles from "./Waiting.module.css";

// ================================
// 型（Registryと一致させる）
// ================================
type Participant = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

// ================================
// Props（Registryから注入）
// ================================
type Props = {
  isNavigationBlocked: boolean;
  // 前ページに遷移
  onReturnClick: () => void;
  // ページガード
  onGuard: () => void;
  // 次ページに遷移
  onStartGame: (
    participants: Participant[],
    getLocalStorage: <T>(key: string) => T,
    eventCode: number
  ) => void;
  getStartGame: (
    participants: Participant[],
    getLocalStorage: <T>(key: string) => T,
    eventCode: number
  ) => void;

  // ローカルストレージから情報を取得
  getLocalStorage: <T>(key: string) => T;
  // プロパティから情報を取得/保存
  getProperties: (key: string) => string;
  setProperties: (key: string, value: string) => void;
  // Photonから参加プレイヤーの情報を取得
  subscribePhotonPlayers: (
    setParticipants: (players: Participant[]) => void
  ) => () => void;
  // データの送受信
  sendData: <T>(eventCode: number, data: T, options?: any) => void;
  receiveData: <T>(
    eventCode: number,
    onReceive: (data: T, actorNr: number) => void
  ) => () => void;
};

export const Waiting = ({
  isNavigationBlocked,
  // 前ページに遷移
  onReturnClick,
  // ページガード
  onGuard,
  // 次ページに遷移
  onStartGame,
  getStartGame,

  // ローカルストレージから情報を取得
  getLocalStorage,
  // プロパティから情報を取得/保存
  getProperties,
  setProperties,
  // データの送受信
  sendData,
  receiveData,
  // Photonから参加プレイヤーの情報を取得
  subscribePhotonPlayers,
}: Props) => {
  const appearance = useAppearance();
  // ================================
  // 参加者状態
  // ================================
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [duration, setDuration] = useState(5);

  // ================================
  // ページガード
  // ================================
  useEffect(() => {
    if (!isNavigationBlocked) return;
    onGuard?.();
  }, [isNavigationBlocked, onGuard]);

  // ================================
  // 初期取得 + Photonイベント購読
  // ================================
  useEffect(() => {
    const unsubscribe = subscribePhotonPlayers(setParticipants);

    return () => {
      unsubscribe?.();
    };
  }, []);

  // ================================
  // 残り時間を送信
  // ================================
  const handleChangeDuration = (value: number) => {
    setDuration(value);
    // Propertiesにも保存
    setProperties("duration", String(value));
    // 全員に変更を通知
    sendData(appearance.eventMap.EVENT_DURATION, { duration: value }, {
      receivers: 1, // 全員
      cache: 4,     // AddToRoomCache
    });
  };

  // ================================
  // 残り時間を受取
  // ================================
  useEffect(() => {
    // 初期値
    const saved = getProperties("duration");
    if (saved) setDuration(Number(saved));

    // ① duration購読
    const unsubscribe1 = receiveData<{ duration: number }>(
      appearance.eventMap.EVENT_DURATION,
      (data) => {
        setDuration(data.duration);
      }
    );

    // ② start購読（これが重要）
    const unsubscribe2 = receiveData<{ nextActorNr: number }>(
      appearance.eventMap.EVENT_START,
      () => {
        getStartGame(
          participants,
          getLocalStorage,
          appearance.eventMap.EVENT_START
        );
      }
    );

    // cleanup
    return () => {
      unsubscribe1?.();
      unsubscribe2?.();
    };
  }, [participants]);

  return (
    <Lobby onReturnClick={onReturnClick}>
      <WaitingForm
        participants={participants}
        getLocalStorage={getLocalStorage}
        getProperties={getProperties}
        setProperties={setProperties}
        onStartGame={() => onStartGame(participants, getLocalStorage, appearance.eventMap.EVENT_START)}
        duration={duration}
        onChangeDuration={handleChangeDuration}
        className={styles.waitingForm}
      />
    </Lobby>
  );
};