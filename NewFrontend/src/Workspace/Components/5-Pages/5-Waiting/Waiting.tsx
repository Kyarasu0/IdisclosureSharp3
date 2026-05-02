// ==========================================
// Components/5-Pages/5-Waiting/Waiting.tsx
// ==========================================

// 基本的な関数をインポート
import { useEffect, useState } from "react";

// 他のコンポーネントをインポート
import { Lobby } from "../../4-Layouts/Lobby/Lobby";
import { WaitingForm } from "../../3-Organisms/Control/WaitingForm/WaitingForm";

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
  onStartGame: () => void;

  // ローカルストレージから情報を取得
  getLocalStorage: <T>(key: string) => T;
  // プロパティから情報を取得/保存
  subscribeProperties: <T>( 
    key: string, setValue: (value: T) => void, parser: (raw: unknown) => T
  ) => () => void;
  setProperties: (key: string) => void;
  // Photonから参加プレイヤーの情報を取得
  subscribePhotonPlayers: (
    setParticipants: (players: Participant[]) => void
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

  // ローカルストレージから情報を取得
  getLocalStorage,
  // プロパティから情報を取得/保存
  subscribeProperties,
  setProperties,
  // Photonから参加プレイヤーの情報を取得
  subscribePhotonPlayers,
}: Props) => {
  // ================================
  // 参加者状態
  // ================================
  const [participants, setParticipants] = useState<Participant[]>([]);

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

  return (
    <Lobby onReturnClick={onReturnClick}>
      <WaitingForm
        participants={participants}
        getLocalStorage={getLocalStorage}
        subscribeProperties={subscribeProperties}
        setProperties={setProperties}
        onStartGame={onStartGame}
        className={styles.waitingForm}
      />
    </Lobby>
  );
}