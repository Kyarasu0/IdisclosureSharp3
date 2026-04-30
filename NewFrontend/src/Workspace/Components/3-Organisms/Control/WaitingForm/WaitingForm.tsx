// ============================================================
// Components/3-Organisms/Control/WaitingForm/WaitingForm.tsx
// ============================================================

// 他のコンポーネントをインポート
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";

// デザインに関するファイルをインポート
import styles from "./WaitingForm.module.css";
import { Users, User, Crown, Loader } from "lucide-react";

// ================================
// 型
// ================================
type Participant = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

// ================================
// Props
// ================================
type Props = {
  participants: Participant[];
  getLocalStorage: <T>(key: string) => T;
  onStartGame: () => void;
  className?: string;
};

type PhotonSettings = {
  photonApiKey: string;
  roomName: string;
};

export const WaitingForm = ({
  participants,
  getLocalStorage,
  onStartGame,
  className,
}: Props) => {
    // ================================
    // LocalStorageからroomName取得
    // ================================
    const roomName = getLocalStorage<PhotonSettings>("photonSettings").roomName ?? "UNKNOWN";

    // ================================
    // 自分がマスターか判定
    // ================================
    const isMaster = participants.find((p) => p.isLocal)?.isMasterClient ?? false;

    // ================================
    // 空スロット補完
    // ================================
    const displayParticipants = [...participants];
    while (displayParticipants.length < 8) {
        displayParticipants.push({
            actorNr: -displayParticipants.length,
            name: "",
            isLocal: false,
            isMasterClient: false,
        });
    }

    return(
        <CyberFormCard className={`${styles.cyberFormCard} ${className}`}>

            {/* タイトル */}
            <PageTitle
              Icon={Loader}
              mainTitle={"WAITING"}
              subTitle={`ROOM: ${roomName} \n PLAYERS: ${participants.length} / 8`}
            />

        </CyberFormCard>
    );
}