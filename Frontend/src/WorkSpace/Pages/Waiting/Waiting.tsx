import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Users, Shield, Zap, Calendar, Power } from "lucide-react";
import { TimeDial } from "../../Components/Misc/TimeDial/TimeDial";
import styles from "./Waiting.module.css";
import { usePhoton } from "../../Contexts/PhotonContext";

/**
 * Photon の型定義は global な `Photon` を参照します。
 * index.html に <script src="/photon.js"></script> で読み込む前提です。
 */
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
  const { client } = usePhoton(); // Context から取得
  const location = useLocation();
  const roomName = location.state?.roomName || "MyRoom"; // ルーム名（Join している前提）
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(10);

  // 時計更新
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 参加者一覧の更新
  useEffect(() => {
    if (!client) return;

    const interval = setInterval(() => {
      const room = client.myRoom();
      if (!room) return;

      // ルームに入っていれば参加者を取得
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
        <div className={styles.panelAccent} />
        <div className={styles.scanline} />
        <div className={styles.contentWrapper}>
          {/* 左側 UI */}
          <div className={styles.leftCol}>
            <div className={styles.leftColHeader}>
              <h1 className={styles.headerTitle}>SYSTEM_STANDBY</h1>
              <div className={styles.roomIdTag}>
                ENCRYPTED_NODE: {roomName}
              </div>
            </div>

            <div className={styles.linkedUsers}>
              <Users size={14} />
              <span>LINKED_USERS: {String(participants.length).padStart(2, "0")} / 08</span>
            </div>

            {/* 参加者グリッド */}
            <div className={styles.participantGrid}>
              {displayParticipants.map((p) => {
                const isEmpty = !p.name;
                return (
                  <div
                    key={p.actorNr}
                    className={`${styles.userCard} ${p.isLocal ? styles.userCardIsMe : ""} ${
                      isEmpty ? styles.emptySlot : ""
                    }`}
                  >
                    <div className={styles.avatarBox}>
                      {isEmpty ? "+" : p.isMasterClient ? <Shield size={18} /> : <Zap size={18} />}
                    </div>
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
                            {p.isMasterClient ? "MASTER_NODE" : "GUEST_LINK"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右側 UI */}
          <div className={styles.rightCol}>
            <div className={styles.timeText}>
              <div className={styles.dateDisplay}>
                <Calendar size={12} />
                {time.toLocaleDateString("ja-JP").replace(/\//g, ".")}
              </div>
              <div className={styles.clock}>
                {time.toLocaleTimeString("ja-JP", { hour12: false })}
              </div>
            </div>

            <TimeDial value={duration} onChange={setDuration} disabled={!isMaster} />

            <div style={{ flex: 1 }} />

            <button className={styles.startBtn} disabled={!isMaster}>
              Execute Mission
              <Power size={18} style={{ marginLeft: "10px", verticalAlign: "middle" }} />
            </button>

            <div className={styles.secureNotice}>Secure connection established</div>
          </div>
        </div>
      </div>
    </div>
  );
}
