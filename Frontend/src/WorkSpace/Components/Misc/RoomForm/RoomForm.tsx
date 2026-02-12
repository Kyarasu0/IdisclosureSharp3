import styles from './RoomForm.module.css';
import { Wifi, RotateCw, ArrowRight } from 'lucide-react';
import { GlitchText } from '../../Texts/GlitchText/GlitchText';

type Props = {
  activeTab: 'create' | 'join';
  setActiveTab: (tab: 'create' | 'join') => void;
  roomName: string;
  setRoomName: (v: string) => void;
  handleAction: () => void;
  isLoading: boolean;
  userData: { score: number };
};

export const RoomForm = ({
  activeTab,
  setActiveTab,
  roomName,
  setRoomName,
  handleAction,
  isLoading,
  userData
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.perspective}>
        <div
          className={`${styles.flipCard} ${
            activeTab === 'join' ? styles.flipped : ''
          }`}
        >
          {/* CREATE */}
          <div className={`${styles.face} ${styles.front}`}>
            <CardContent
              mode="create"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              roomName={roomName}
              setRoomName={setRoomName}
              handleAction={handleAction}
              isLoading={isLoading}
              cost={Math.floor(userData.score * 0.01)}
            />
          </div>

          {/* JOIN */}
          <div className={`${styles.face} ${styles.back}`}>
            <CardContent
              mode="join"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              roomName={roomName}
              setRoomName={setRoomName}
              handleAction={handleAction}
              isLoading={isLoading}
              cost={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  mode: 'create' | 'join';
  activeTab: 'create' | 'join';
  setActiveTab: (tab: 'create' | 'join') => void;
  roomName: string;
  setRoomName: (v: string) => void;
  handleAction: () => void;
  isLoading: boolean;
  cost: number;
};

const CardContent = ({
  mode,
  activeTab,
  setActiveTab,
  roomName,
  setRoomName,
  handleAction,
  isLoading,
}: CardProps) => {
  return (
    <div className={styles.card}>
      
      {/* ===== タブ（カード上部に統合） ===== */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('create')}
          className={`${styles.tabButton} ${
            activeTab === 'create' ? styles.tabActiveCreate : ''
          }`}
        >
          CREATE ROOM
        </button>

        <button
          onClick={() => setActiveTab('join')}
          className={`${styles.tabButton} ${
            activeTab === 'join' ? styles.tabActiveJoin : ''
          }`}
        >
          JOIN ROOM
        </button>
      </div>

      {/* ===== タイトル ===== */}
      <h2 className={styles.title}>
        <GlitchText text={mode === 'create' ? "CREATE_ROOM" : "JOIN_ROOM"} />
      </h2>

      {/* ===== 入力 ===== */}
      <div className={styles.inputArea}>
        <div className={styles.icon}>
          {mode === 'create' ? <Wifi size={18} /> : <Wifi size={18} />}
        </div>

        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder={
            mode === 'create'
              ? "Ex: Room1"
              : "Ex: Room1"
          }
          className={` ${mode === 'create' ? styles.inputBlue : styles.inputRed} `}
        />
      </div>

      {/* ===== アクションボタン ===== */}
      <button
        onClick={handleAction}
        disabled={!roomName || isLoading}
        className={`${styles.actionButton} ${
          mode === 'create' ? styles.createTheme : styles.joinTheme
        }`}
      >
        {isLoading ? (
          <>
            PROCESSING <RotateCw className={styles.spin} size={16} />
          </>
        ) : (
          <>
            START
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className={styles.notice}>
        CONNECT TO A ROOM TO PLAY IDISCLOSURE#3
      </div>
    </div>
  );
};
