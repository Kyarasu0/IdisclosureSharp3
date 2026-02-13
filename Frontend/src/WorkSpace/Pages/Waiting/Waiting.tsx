import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Users, Shield, Zap, Calendar, Power } from "lucide-react";
import { TimeDial } from "../../Components/Misc/TimeDial/TimeDial";
import styles from "./Waiting.module.css";
import { photonService } from "../../Functions/PhotonControllers/PhotonService";

// 参加者の型定義
interface Participant {
  name: string;
  isMaster: boolean;
  isMe: boolean;
  actorNr: number;
}

export function Waiting() {
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(10);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // ReactのStrict Mode（開発環境）でuseEffectが2回実行されて二重接続するのを防ぐ
  const hasJoined = useRef(false);
  const location = useLocation();
  // CreateJoin から渡された名前を取得。なければフォールバック。
  const roomName = location.state?.roomName || "MyRoom"; 

  // 1. システム時刻の更新（時計用）
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 入室処理
  useEffect(() => {
    if (hasJoined.current) return;
    const init = async () => {
      // 既に Joined(8) の状態なら入室処理をスキップ
      if (photonService.isReady) {
        hasJoined.current = true;
        return;
      }
      
      hasJoined.current = true;
      try {
        await photonService.connectAndJoinRoom(roomName, 8);
      } catch (err) {
        console.error("入室失敗:", err);
        hasJoined.current = false;
      }
    };
    init();
  }, [roomName]);

  // 参加者情報の定期更新
  useEffect(() => {
    const interval = setInterval(() => {
      // photonService.room が存在すればリストを取得するように判定を緩める
      if (photonService.room) {
        const list = photonService.getParticipants();
        
        // デバッグ用: リストの中身をコンソールに出す
        if (list.length > 0 && participants.length === 0) {
          console.log("👥 Participants detected:", list);
        }
        
        setParticipants(list);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [participants.length]); // 人数が変わったときも再チェック

  const isMaster = participants.find(p => p.isMe)?.isMaster ?? false;

  // 表示用のスロット作成 (key のために actorNr を保持)
  const displayParticipants = [...participants];
  while (displayParticipants.length < 8) {
    displayParticipants.push({ 
      name: "", 
      isMaster: false, 
      isMe: false, 
      actorNr: -1 - displayParticipants.length 
    });
  }

  return (
    <div className={styles.waitingContainer}>
      <div className={styles.glassPanel}>
        <div className={styles.panelAccent} />
        <div className={styles.scanline} />

        <div className={styles.contentWrapper}>
          {/* 左側: ステータスセクション */}
          <div className={styles.leftCol}>
            <div className={styles.leftColHeader}>
              <h1 className={styles.headerTitle}>SYSTEM_STANDBY</h1>
              <div className={styles.roomIdTag}>
                {/* 接続完了したらルーム名、接続中は待機中を表示 */}
                ENCRYPTED_NODE: {photonService.room ? photonService.room.name : roomName}
              </div>
            </div>

            <div className={styles.linkedUsers}>
              <Users size={14} />
              {/* 🔴 ここで participants.length を使うことで、
              01 / 08 のように現在の人数が正しく表示されます */}
              <span>LINKED_USERS: {String(participants.length).padStart(2, '0')} / 08</span>
            </div>

            {/* 参加者グリッド */}
            <div className={styles.participantGrid}>
              {displayParticipants.map((p) => { // i ではなく p を使う
                const isEmpty = !p.name;
                return (
                  <div
                    key={p.actorNr} // 🔴 インデックス(i)ではなく固有の actorNr を使う
                    className={`${styles.userCard} ${
                      p.isMe ? styles.userCardIsMe : ""
                    } ${isEmpty ? styles.emptySlot : ""}`}
                  >
                    <div className={styles.avatarBox}>
                      {isEmpty ? "+" : p.isMaster ? <Shield size={18} /> : <Zap size={18} />}
                    </div>

                    <div className={styles.participantInfo}>
                      {isEmpty ? (
                        <div className={styles.pendingText}>PENDING...</div>
                      ) : (
                        <>
                          <div className={styles.participantName}>
                            {p.name}
                            {p.isMe && <span className={styles.meLabel}>(YOU)</span>}
                          </div>
                          <div
                            className={styles.participantRole}
                            style={{ color: p.isMaster ? "var(--c-cyan)" : "#64748b" }}
                          >
                            {p.isMaster ? "MASTER_NODE" : "GUEST_LINK"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右側: コントロールセクション */}
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

            {/* ホスト以外は操作不能にする */}
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