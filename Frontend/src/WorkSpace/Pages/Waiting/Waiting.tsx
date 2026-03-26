import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Users, User, Crown } from "lucide-react";
import { TimeDial } from "../../Components/Misc/TimeDial/TimeDial";
import styles from "./Waiting.module.css";
import { usePhoton } from "../../Contexts/PhotonContext";
import { GlitchText } from '../../Components/Texts/GlitchText/GlitchText';
import { DurationDisplay } from '../../Components/Infomation/DurationDisplay/DurationDisplay';
import { SubmitButton } from '../../Components/Buttons/SubmitButton/SubmitButton';
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Photon: any;
  }
}

interface Participant {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
}

export function Waiting() {
  const navigate = useNavigate();
  // Photonを取得
  const { client } = usePhoton();
  // Room名の受取
  const location = useLocation();
  const roomName = location.state?.roomName || "MyRoom";
  
  // ルームにいる参加者一覧の取得
  const [participants, setParticipants] = useState<Participant[]>([]);
  // 現在時刻の取得
  // const [time, setTime] = useState(new Date());
  // ゲームの制限時間設定
  const [duration, setDuration] = useState(10);

  // 時計更新
  // useEffect(() => {
  //   const interval = setInterval(() => setTime(new Date()), 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // 参加者一覧の更新
  useEffect(() => {
    if (!client) return;

    const interval = setInterval(() => {
      // ルーム情報を取得
      const room = client.myRoom();
      if (!room) return;

      // 参加者情報を取得(500msに一回更新)
      const actors = client.myRoomActorsArray() || [];
      const list = actors.map((actor: any) => ({
        actorNr: actor.actorNr,
        name: actor.name || `Player${actor.actorNr}`,
        isLocal: actor.isLocal,
        isMasterClient: actor.actorNr === 1,
      }));
      setParticipants(list);
    }, 500);

    return () => clearInterval(interval);
  }, [client]);

  // マスタープレイヤーの情報を取得
  const isMaster = participants.find((p) => p.isLocal)?.isMasterClient ?? false;

  // 空スロットを埋める
  const displayParticipants = [...participants];
  while (displayParticipants.length < 8) {
    displayParticipants.push({
      actorNr: -displayParticipants.length,
      name: "",
      isLocal: false,
      isMasterClient: false,
    });
  }

  return (
    <div className={styles.waitingContainer}>
      <div className={styles.glassPanel}>

        {/* パネル上部のアクセントライン */}
        <div className={styles.panelAccent} />
        <div className={styles.scanline} />

        <div className={styles.contentWrapper}>
          {/* ========== 左側 UI ========== */}
          <div className={styles.leftCol}>
            {/* ヘッダー(タイトル + ルーム名) */}
            <div className={styles.leftColHeader}>
              <h1 className={styles.headerTitle}><GlitchText text="WAITING FOR PLAYERS..." /></h1>
              <div className={styles.roomIdTag}>
                RoomName: {roomName}
              </div>
            </div>

            {/* 接続数表示 */}
            <div className={styles.linkedUsers}>
              <Users size={14} />
              <span>LINKED_PLAYERS: {String(participants.length).padStart(2, "0")} / 08</span>
            </div>

            {/* 参加者グリッド */}
            <div className={styles.participantGrid}>
              {displayParticipants.map((p) => {
                const isEmpty = !p.name;
                return (
                  // カード設定(自分 or 空き or その他)
                  <div
                    key={p.actorNr}
                    className={`${styles.userCard} ${p.isLocal ? styles.userCardIsMe : ""} ${ isEmpty ? styles.emptySlot : "" }`}
                  >
                    {/* カードアイコン */}
                    <div className={styles.avatarBox}>
                      {isEmpty ? "+" : p.isMasterClient ? <Crown size={18} /> : <User size={18} />}
                    </div>
                    {/* カード内容(空き or その他) */}
                    <div className={styles.participantInfo}>
                      {isEmpty ? (
                        <div className={styles.pendingText}>PENDING...</div>
                      ) : (
                        <>
                          <div className={styles.participantName}>
                            {p.name}
                            {p.isLocal && <span className={styles.meLabel}>(YOU)</span>}
                          </div>
                          <div
                            className={styles.participantRole}
                            style={{ color: p.isMasterClient ? "var(--c-cyan)" : "#64748b" }}
                          >
                            {p.isMasterClient ? "MASTER_PLAYER" : "GUEST_PLAYER"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/*  ========== 右側 UI ========== */}
          <div className={styles.rightCol}>
            <div className={styles.timeText}>
              <DurationDisplay duration={duration * 60} />
            </div>

            <TimeDial value={duration} onChange={setDuration} disabled={!isMaster} />

            <SubmitButton
              type="button"
              isLoading={false} // 今はローディングは使わない場合
              onClick={() => {
                navigate("/game-screen"); // 次の画面へ
              }}
            >
            &nbsp;START
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
}
