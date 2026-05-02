// ============================================================
// Components/3-Organisms/Control/WaitingForm/WaitingForm.tsx
// ============================================================

// 基本的な関数をインポート
import { useEffect, useState } from "react"; 

// 他のコンポーネントをインポート
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";
import { DurationDisplay } from "../../../1-Atoms/UI/DurationDisplay/DurationDisplay";
import { CyberDial } from "../../../2-Molecules/CyberDial/CyberDial"
import { CyberGridList } from "../../../2-Molecules/CyberGridList/CyberGridList";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";

// デザインに関するファイルをインポート
import styles from "./WaitingForm.module.css";
import { ArrowRight, Loader } from "lucide-react";

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
  // ローカルストレージから情報を取得
  getLocalStorage: <T>(key: string) => T;
  // プロパティから情報を取得/保存
  subscribeProperties: <T>( 
    key: string, setValue: (value: T) => void, parser: (raw: unknown) => T
  ) => () => void;
  setProperties: (key: string, value: string) => void;
  // 次ページに遷移
  onStartGame: () => void;
  className?: string;
};

type PhotonSettings = {
  photonApiKey: string;
  roomName: string;
};

export const WaitingForm = ({
  participants,
  // ローカルストレージから情報を取得
  getLocalStorage,
  // プロパティから情報を取得/保存
  subscribeProperties,
  setProperties,
  // 次ページに遷移
  onStartGame,
  className,
}: Props) => {
    // ================================
    // LocalStorageからroomName取得
    // ================================
    const roomName = getLocalStorage<PhotonSettings>("photonSettings").roomName ?? "UNKNOWN";
    const [duration, setDuration] = useState(5);

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

    useEffect(() => {
      const unsubscribe = subscribeProperties<number>("duration", setDuration, (v) => Number(v),);
      return () => unsubscribe();
    }, []);

    return(
        <CyberFormCard className={`${styles.cyberFormCard} ${className}`}>

          {/* タイトル */}
          <PageTitle
            Icon={Loader}
            mainTitle={"WAITING"}
            subTitle={`ROOM: ${roomName} \n PLAYERS: ${participants.length} / 8`}
          />

          <div className={styles.main}>
            {/* 左側 */}
            <div className={styles.left}>
              {/* 参加者リスト */}
              <CyberGridList participants={participants} className={styles.cyberGridList}/>
            </div>

            {/* 右側 */}
            <div className={styles.right}>
              {/* 残り時間の表示 */}
              <DurationDisplay
                duration={duration * 60}
                className={styles.durationDisplay}
              />

              {/* 残り時間設定 */}
              <CyberDial
                value={duration}
                onChange={setDuration}
                onChangeProperties={isMaster ? setProperties : null}
                min={5}
                max={15}
                label="MISSION DURATION"
                unit="MINS"
                disabled={!isMaster}
                className={styles.cyberDial}
              />

              <SubmitButton 
                type="submit"
                className={styles.submitButton}
                isLoading={!isMaster}
                onClick={onStartGame}
              >
                  Start
                  <ArrowRight />
              </SubmitButton>
            </div>
          </div>
        </CyberFormCard>
    );
}