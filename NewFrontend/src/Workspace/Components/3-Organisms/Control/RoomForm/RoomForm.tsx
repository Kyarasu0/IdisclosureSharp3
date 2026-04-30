// ======================================================
// Components/3-Organisms/Control/RoomForm/RoomForm.tsx
// ======================================================

import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";

import styles from "./RoomForm.module.css";
import { UserRoundPen, UserRoundPlus, ArchiveRestore, ArrowRight, Key } from "lucide-react";

type Props = {
  mode: "create" | "join";
  setMode: (v: "create" | "join") => void;
  activeMode: "create" | "join";
  setActiveMode: (v: "create" | "join") => void;
  photonApiKey: string;
  setPhotonApiKey: (v: string) => void;
  roomName: string;
  setRoomName: (v: string) => void;
  onStart: () => void;
  getLocalStorage: <T>(key: string) => T;
  className?: string;
};

export function RoomForm({
  mode,
  setMode,
  activeMode,
  setActiveMode,
  photonApiKey,
  setPhotonApiKey,
  roomName,
  setRoomName,
  onStart,
  getLocalStorage,
  className,
}: Props) {
  return (
    <CyberFormCard className={`
      ${styles.cyberFormCard} 
      ${className}
      ${mode === "create" ? "" : styles.flipped}
    `}>
      {/* CREATE */}
      <CardFace
        mode={mode === "create" ? "create" : "join"}
        setMode={setMode}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        photonApiKey={photonApiKey}
        setPhotonApiKey={setPhotonApiKey}
        roomName={roomName}
        setRoomName={setRoomName}
        onStart={onStart}
        getLocalStorage={getLocalStorage}
        className={activeMode === "create" ? "" : styles.back}
      />
    </CyberFormCard>
  );
}

type FaceProps = {
  mode: "create" | "join";
  setMode: (v: "create" | "join") => void;
  activeMode: "create" | "join";
  setActiveMode: (v: "create" | "join") => void;
  photonApiKey: string;
  setPhotonApiKey: (v: string) => void;
  roomName: string;
  setRoomName: (v: string) => void;
  onStart: () => void;
  getLocalStorage: <T>(key: string) => T;
  className?: string;
};

type PhotonApiKey = {
  photonApiKey: string;
}

function CardFace({
  setMode,
  activeMode,
  setActiveMode,
  photonApiKey,
  setPhotonApiKey,
  roomName,
  setRoomName,
  onStart,
  getLocalStorage,
  className,
}: FaceProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {/* タイトル */}
      <PageTitle 
        Icon={activeMode === "create" ? UserRoundPen : UserRoundPlus} 
        mainTitle={activeMode === "create" ? "CREATE" : "JOIN"} 
        subTitle={activeMode === "create" ? "Create a room here." : "Join a room here."}
      />

      {/* tabs */}
      <div className={styles.tabs}>
        <button
          className={
            activeMode === "create" ? styles.activeBlue : styles.tabButton
          }
        onClick={() => {
          setMode("create");
          setTimeout(() => {
            setActiveMode("create");
          }, 90)
        }}
        >
          CREATE
        </button>

        <button
          className={
            activeMode === "join" ? styles.activePink : styles.tabButton
          }
          onClick={() => {
            setMode("join");
            setTimeout(() => {
              setActiveMode("join");
            }, 90)
          }}
        >
          JOIN
        </button>
      </div>

      {/* input */}
      <ValidatedInputField
        label="ROOM NAME"
        value={roomName}
        onChange={setRoomName}
        required={true}
        placeholder="ENTER ROOM NAME"
        icon={<ArchiveRestore size={18} />}
      />

      <ValidatedInputField
        label="PHOTON API KEY"
        value={photonApiKey}
        onChange={setPhotonApiKey}
        required={true}
        placeholder={"ENTER PHOTON API KEY"}
        icon={<Key size={18} />}
      />

      {/* button */}
      <SubmitButton 
        type="button"
        onClick={onStart}
        className={styles.roomFormSubmitButton}
      >
        Comfirm
        <ArrowRight />
      </SubmitButton>
    </div>
  );
}