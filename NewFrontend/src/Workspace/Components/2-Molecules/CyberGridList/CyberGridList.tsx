import styles from "./CyberGridList.module.css";
import { User, Crown } from "lucide-react";

/**
 * 👥 参加者リスト表示コンポーネント
 *
 * 親から participants を受け取り表示するだけ
 * （Photonなどのロジックは持たない）
 */
type Participant = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

type Props = {
  participants: Participant[];
  max?: number; // 最大人数（デフォルト8）
  className?: string;
};

export const CyberGridList = ({
  participants,
  max = 8,
  className,
}: Props) => {

  // ===============================
  // 🧩 空スロットを埋める
  // ===============================
  const list = [...participants];

  while (list.length < max) {
    list.push({
      actorNr: -list.length,
      name: "",
      isLocal: false,
      isMasterClient: false,
    });
  }

  // ===============================

  return (
    <div className={`${styles.grid} ${className}`}>

      {list.map((p) => {
        const isEmpty = !p.name;

        return (
          <div
            key={p.actorNr}
            className={`
              ${styles.card}
              ${p.isLocal ? styles.me : ""}
            `}
          >

            {/* アイコン */}
            <div className={styles.avatar}>
              {isEmpty ? (
                "+"
              ) : p.isMasterClient ? (
                <Crown size={18} />
              ) : (
                <User size={18} />
              )}
            </div>

            {/* 情報 */}
            <div className={styles.info}>
              {isEmpty ? (
                <div className={styles.pending}>PENDING...</div>
              ) : (
                <>
                  <div className={styles.name}>
                    {p.name}
                    {p.isLocal && <span className={styles.you}>(YOU)</span>}
                  </div>

                  <div
                    className={styles.role}
                    style={{
                      color: p.isMasterClient
                        ? "var(--c-cyan)"
                        : "#64748b",
                    }}
                  >
                    {p.isMasterClient
                      ? "MASTER_PLAYER"
                      : "GUEST_PLAYER"}
                  </div>
                </>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};