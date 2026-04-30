// ==========================================
// Components/5-Pages/5-Waiting/Waiting.tsx
// ==========================================

// import { useEffect, useState } from "react";
// import styles from "./Waiting.module.css";

// type Player = {
//   actorNr: number;
//   name: string;
//   isLocal: boolean;
//   isMasterClient: boolean;
// };

// type Props = {
//   onGuard: () => void;
//   getPhotonPlayers: () => Player[];
//   onStartGame: () => void;
// };

// export function Waiting({
//   onGuard,
//   getPhotonPlayers,
//   onStartGame
// }: Props) {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [duration, setDuration] = useState(10);

//   useEffect(() => {
//     onGuard();

//     const timer = setInterval(() => {
//       setPlayers(getPhotonPlayers());
//     }, 500);

//     return () => clearInterval(timer);
//   }, []);

//   const me = players.find((p) => p.isLocal);
//   const isMaster = me?.isMasterClient ?? false;

//   const slots = [...players];

//   while (slots.length < 8) {
//     slots.push({
//       actorNr: -slots.length,
//       name: "",
//       isLocal: false,
//       isMasterClient: false
//     });
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.panel}>

//         {/* 左側 */}
//         <div className={styles.left}>

//           <h1 className={styles.title}>
//             WAITING FOR PLAYERS...
//           </h1>

//           <div className={styles.count}>
//             PLAYERS {players.length} / 8
//           </div>

//           <div className={styles.grid}>
//             {slots.map((player) => {
//               const empty = !player.name;

//               return (
//                 <div
//                   key={player.actorNr}
//                   className={`${styles.card}
//                   ${player.isLocal ? styles.me : ""}
//                   ${empty ? styles.empty : ""}`}
//                 >
//                   {empty ? (
//                     <span>PENDING...</span>
//                   ) : (
//                     <>
//                       <strong>{player.name}</strong>

//                       <small>
//                         {player.isMasterClient
//                           ? "MASTER"
//                           : "GUEST"}
//                       </small>
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* 右側 */}
//         <div className={styles.right}>

//           <div className={styles.time}>
//             {duration}:00
//           </div>

//           {/* 仮Timer */}
//           <input
//             type="range"
//             min="5"
//             max="30"
//             value={duration}
//             disabled={!isMaster}
//             onChange={(e) =>
//               setDuration(Number(e.target.value))
//             }
//           />

//           <button
//             className={styles.start}
//             disabled={!isMaster}
//             onClick={onStartGame}
//           >
//             START
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }

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
  isNavigationBlocked?: boolean;
  onGuard: () => void;
  onReturnClick: () => void;
  getLocalStorage: <T>(key: string) => T;
  getPhotonPlayers: () => Participant[];
  onStartGame: () => void;
};

export const Waiting = ({
  isNavigationBlocked = false,
  onGuard,
  onReturnClick,
  getLocalStorage,
  getPhotonPlayers,
  onStartGame,
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
  // 参加者更新（500msポーリング）
  // ================================
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(getPhotonPlayers());
    }, 500);

    return () => clearInterval(interval);
  }, [getPhotonPlayers]);

  return (
    <Lobby onReturnClick={onReturnClick}>
      <WaitingForm
        participants={participants}
        getLocalStorage={getLocalStorage}
        onStartGame={onStartGame}
        className={styles.waitingForm}
      />
    </Lobby>
  );
}