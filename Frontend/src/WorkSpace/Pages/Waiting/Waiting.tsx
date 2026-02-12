import { useEffect, useState } from "react";
import { Users, Shield, Zap, Calendar, Power } from "lucide-react";
import { TimeDial } from "../../Components/Misc/TimeDial/TimeDial";
import styles from "./Waiting.module.css";
import { photonService } from "../../Functions/PhotonControllers/PhotonService";

interface Participant {
  name: string;
  isMaster: boolean;
  isMe: boolean;
}

export function Waiting() {
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(10);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // 時刻更新
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 参加者情報の定期更新
  useEffect(() => {
    const interval = setInterval(() => {
      const current = photonService.getParticipants();
      setParticipants(current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 自分がホストかどうか
  const isMaster = participants.find(p => p.isMe)?.isMaster ?? false;

  // 最大 8 人まで空きスロットを追加
  const displayParticipants = [...participants];
  while (displayParticipants.length < 8) {
    displayParticipants.push({ name: "", isMaster: false, isMe: false });
  }

  return (
    <div className={styles.waitingContainer}>
      <div className={styles.glassPanel}>
        <div className={styles.panelAccent} />
        <div className={styles.scanline} />

        <div className={styles.contentWrapper}>
          {/* 左側: ステータス */}
          <div className={styles.leftCol}>
            <div className={styles.leftColHeader}>
              <h1 className={styles.headerTitle}>SYSTEM_STANDBY</h1>
              <div className={styles.roomIdTag}>
                ENCRYPTED_NODE: {photonService.currentRoom?.name || "N/A"}
              </div>
            </div>

            <div className={styles.linkedUsers}>
              <Users size={14} />
              <span>LINKED_USERS: {participants.length} / 08</span>
            </div>

            <div className={styles.participantGrid}>
              {displayParticipants.map((p, i) => (
                <div
                  key={i}
                  className={`${styles.userCard} ${
                    p.isMe ? styles.userCardIsMe : ""
                  } ${!p.name ? styles.emptySlot : ""}`}
                >
                  <div className={styles.avatarBox}>
                    {!p.name ? "+" : p.isMaster ? <Shield size={18} /> : <Zap size={18} />}
                  </div>
                  <div className={styles.participantInfo}>
                    {!p.name ? (
                      <div className={styles.pendingText}>PENDING...</div>
                    ) : (
                      <>
                        <div className={styles.participantName}>{p.name}</div>
                        <div
                          className={styles.participantRole}
                          style={{
                            color: p.isMaster ? "var(--c-cyan)" : "#64748b",
                          }}
                        >
                          {p.isMaster ? "HOST" : "GUEST"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右側: コントロール */}
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
              <Power
                size={18}
                style={{ marginLeft: "10px", verticalAlign: "middle" }}
              />
            </button>

            <div className={styles.secureNotice}>Secure connection established</div>
          </div>
        </div>
      </div>
    </div>
  );
}
